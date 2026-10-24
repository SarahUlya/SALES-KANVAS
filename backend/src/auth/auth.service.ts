
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { StringValue } from "ms";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { AUTH } from "./auth.constants";
import { AuthenticatedUser } from "../common/interfaces/authenticated-user.interface";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly userWithPermissions = {
    roleRelation: {
      include: {
        permissionRoles: {
          include: {
            permission: true,
          },
        },
      },
    },
  } as const;

  private toAuthenticatedUser(
    user: User & {
      roleRelation: {
        id: number;
        name: string;
        permissionRoles: {
          permission: { name: string };
        }[];
      } | null;
    },
  ): AuthenticatedUser {
    return {
      id_user: user.id_user,
      username: user.username,
      role: user.roleRelation
        ? {
            id: user.roleRelation.id,
            name: user.roleRelation.name,
          }
        : null,
      permissions:
        user.roleRelation?.permissionRoles.map(
          (item) => item.permission.name,
        ) ?? [],
    };
  }

  async login(dto: LoginDto) {
    const username = dto.username?.trim();
    const password = dto.password;

    if (!username || !password) {
      throw new UnauthorizedException(AUTH.INVALID_CREDENTIALS);
    }

    const user = await this.prisma.user.findUnique({
      where: { username },
      include: this.userWithPermissions,
    });

    if (!user) {
      throw new UnauthorizedException(AUTH.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH.INVALID_CREDENTIALS);
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    return {
      user: this.toAuthenticatedUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    let payload: { sub: number };

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException(AUTH.INVALID_REFRESH_TOKEN);
    }

    const user = await this.prisma.user.findUnique({
      where: { id_user: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException(AUTH.INVALID_REFRESH_TOKEN);
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);

    return { accessToken, refreshToken };
  }

  async logout(_userId: number): Promise<void> {
    // Belum dapat mencabut refresh token secara individual karena
    // schema User belum menyediakan penyimpanan sesi/token.
  }

  async validateUser(userId: number): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id_user: userId },
      include: this.userWithPermissions,
    });

    if (!user) {
      throw new UnauthorizedException(AUTH.USER_NOT_FOUND);
    }

    return this.toAuthenticatedUser(user);
  }

  private generateAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      { sub: user.id_user, username: user.username },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as StringValue,
      },
    );
  }

  private generateRefreshToken(user: User): Promise<string> {
    return this.jwtService.signAsync(
      { sub: user.id_user },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? "30d") as StringValue,
      },
    );
  }
}
