import {
  Body,
  Controller,
  Get,
  Ip,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';
import { EmployeeService } from './employee.service';

@Controller('master/employee')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @RequirePermission('employee:read')
  findAll() {
    return this.employeeService.findAll();
  }

  @Get('available-users')
  @RequirePermission('employee:write')
  findAvailableUsers() {
    return this.employeeService.findAvailableUsers();
  }

  @Get(':id')
  @RequirePermission('employee:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Post()
  @RequirePermission('employee:write')
  create(
    @Body() dto: CreateEmployeeDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.employeeService.create(dto, user.id_user, ip);
  }

  @Patch(':id')
  @RequirePermission('employee:write')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.employeeService.update(id, dto, user.id_user, ip);
  }
}
