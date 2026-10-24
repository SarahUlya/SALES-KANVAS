
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
import { OutletService } from './outlet.service';
import {
  CreateOutletDto,
  UpdateOutletDto,
} from './dto/create-outlet.dto';

@Controller('master/outlet')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OutletController {
  constructor(private readonly outletService: OutletService) {}

  @Get()
  @RequirePermission('outlet:read')
  findAll() {
    return this.outletService.findAll();
  }

  @Get(':id')
  @RequirePermission('outlet:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.outletService.findOne(id);
  }

  @Post()
  @RequirePermission('outlet:write')
  create(
    @Body() dto: CreateOutletDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.outletService.create(dto, user.id_user, ip);
  }

  @Patch(':id')
  @RequirePermission('outlet:write')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOutletDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.outletService.update(id, dto, user.id_user, ip);
  }

  @Delete(':id')
  @RequirePermission('outlet:write')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.outletService.remove(id);
  }
}
