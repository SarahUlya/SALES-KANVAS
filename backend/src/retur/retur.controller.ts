
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';

import { ReturService } from './retur.service';
import {
  CreateReturDto,
  UpdateReturDto,
} from './dto/create-retur.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('retur')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReturController {
  constructor(private readonly returService: ReturService) {}

  @Post()
  @RequirePermission('retur:write')
  @ResponseMessage('Retur created successfully')
  create(@Body() dto: CreateReturDto) {
    return this.returService.create(dto);
  }

  @Get()
  @RequirePermission('retur:read')
  @ResponseMessage('List Retur')
  findAll() {
    return this.returService.findAll();
  }

  @Get(':id')
  @RequirePermission('retur:read')
  @ResponseMessage('Detail Retur')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.returService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('retur:write')
  @ResponseMessage('Retur updated successfully')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReturDto,
  ) {
    return this.returService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('retur:write')
  @ResponseMessage('Retur deleted successfully')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.returService.remove(id);
  }
}
