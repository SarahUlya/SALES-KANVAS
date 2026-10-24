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
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('master/product')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @RequirePermission('produk:read')
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @RequirePermission('produk:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Post()
  @RequirePermission('produk:write')
  create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.productService.create(dto, user.id_user, ip);
  }

  @Patch(':id')
  @RequirePermission('produk:write')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
  ) {
    return this.productService.update(id, dto, user.id_user, ip);
  }

  @Delete(':id')
  @RequirePermission('produk:write')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
