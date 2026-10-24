import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const roleName = z.string().trim().min(1);

export const CreateRoleSchema = z
  .object({
    name: roleName,
  })
  .strict();

export class CreateRoleDto extends createZodDto(CreateRoleSchema) {}

export const UpdateRoleSchema = z
  .object({
    name: roleName,
  })
  .strict();

export class UpdateRoleDto extends createZodDto(UpdateRoleSchema) {}

export const UpdateRolePermissionsSchema = z
  .object({
    permission_ids: z
      .array(z.number().int().positive())
      .refine(
        (ids) => new Set(ids).size === ids.length,
        'permission_ids tidak boleh berisi ID duplikat',
      ),
  })
  .strict();

export class UpdateRolePermissionsDto extends createZodDto(
  UpdateRolePermissionsSchema,
) {}
