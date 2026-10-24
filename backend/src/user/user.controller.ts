import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { PermissionsGuard } from '../common/guards/permission.guard';
import {
  CreateUserDto,
  ResetUserPasswordDto,
  UpdateUserRoleDto,
  UpdateUsernameDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('role:manage')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.userService.updateRole(id, dto);
  }

  @Patch(':id')
  updateUsername(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsernameDto,
  ) {
    return this.userService.updateUsername(id, dto);
  }

  @Patch(':id/reset-password')
  resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetUserPasswordDto,
  ) {
    return this.userService.resetPassword(id, dto);
  }
}
