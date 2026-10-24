import {
  Body,
  Controller,
  Delete,
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
  CreateRoleDto,
  UpdateRoleDto,
  UpdateRolePermissionsDto,
} from './role.dto';
import { RoleService } from './role.service';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('role:manage')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get('permissions')
  findAllPermissions() {
    return this.roleService.findAllPermissions();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, dto);
  }

  @Patch(':id/permissions')
  updatePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRolePermissionsDto,
  ) {
    return this.roleService.updatePermissions(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
