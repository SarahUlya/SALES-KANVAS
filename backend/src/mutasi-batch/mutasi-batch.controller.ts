
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
import { MutasiBatchService } from './mutasi-batch.service';
import {
  CreateMutasiBatchDto,
} from './dto/create-mutasi-batch.dto';
import { UpdateMutasiBatchDto } from './dto/update-mutasi-batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('mutasi-batch')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MutasiBatchController {
  constructor(
    private readonly mutasiBatchService: MutasiBatchService,
  ) {}

  @Post()
  @RequirePermission('mutasi-batch:write')
  @ResponseMessage('Mutasi Batch created successfully')
  create(@Body() dto: CreateMutasiBatchDto) {
    return this.mutasiBatchService.create(dto);
  }

  @Get()
  @RequirePermission('mutasi-batch:read')
  @ResponseMessage('List Mutasi Batch')
  findAll() {
    return this.mutasiBatchService.findAll();
  }

  @Get(':id')
  @RequirePermission('mutasi-batch:read')
  @ResponseMessage('Detail Mutasi Batch')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mutasiBatchService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission('mutasi-batch:write')
  @ResponseMessage('Mutasi Batch updated successfully')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMutasiBatchDto,
  ) {
    return this.mutasiBatchService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermission('mutasi-batch:write')
  @ResponseMessage('Mutasi Batch deleted successfully')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mutasiBatchService.remove(id);
  }
}
