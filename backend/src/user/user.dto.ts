import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createUserSchema = z
  .object({
    username: z.string().trim().min(1).max(50),
    password: z
      .string()
      .min(8)
      .refine(
        (password) => Buffer.byteLength(password, 'utf8') <= 72,
        'Password tidak boleh lebih dari 72 byte',
      ),
    role_id: z.number().int().positive(),
  })
  .strict();

const updateUsernameSchema = z
  .object({
    username: z.string().trim().min(1).max(50),
  })
  .strict();

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8)
      .refine(
        (password) => Buffer.byteLength(password, 'utf8') <= 72,
        'Password tidak boleh lebih dari 72 byte',
      ),
  })
  .strict();

const updateUserRoleSchema = z
  .object({
    role_id: z.number().int().positive(),
  })
  .strict();

export class CreateUserDto extends createZodDto(createUserSchema) {}

export class UpdateUsernameDto extends createZodDto(updateUsernameSchema) {}

export class ResetUserPasswordDto extends createZodDto(resetPasswordSchema) {}

export class UpdateUserRoleDto extends createZodDto(updateUserRoleSchema) {}
