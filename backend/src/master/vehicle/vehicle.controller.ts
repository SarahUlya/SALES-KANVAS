import {
  Body,
  Controller,
  Delete,
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
import { CreateVehicleDto, UpdateVehicleDto } from './vehicle.dto';
import { VehicleService } from './vehicle.service';

@Controller('master/vehicle')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  @RequirePermission('vehicle:read')
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  @RequirePermission('vehicle:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.findOne(id);
  }

  @Post()
  @RequirePermission('vehicle:write')
  create(
    @Body() dto: CreateVehicleDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.vehicleService.create(dto, user.id_user, ip);
  }

  @Patch(':id')
  @RequirePermission('vehicle:write')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehicleDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.vehicleService.update(id, dto, user.id_user, ip);
  }

  @Delete(':id')
  @RequirePermission('vehicle:write')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehicleService.remove(id);
  }
}
