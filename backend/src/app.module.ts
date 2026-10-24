import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PlanModule } from './plan/plan.module';
import { VehicleModule } from './master/vehicle/vehicle.module';
import { MarketAreaModule } from './master/market-area/market-area.module';
import { ProductModule } from './master/product/product.module';
import { EmployeeModule } from './master/employee/employee.module';
// import { KasbonMaterialTypeModule } from './master/kasbon-material-type/kasbon-material-type.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { OutletModule } from './master/outlet/outlet.module';
import { TipeHargaModule } from './master/tipe-harga/tipe-harga.module';
import { GudangModule } from './master/gudang/gudang.module';
import { ProdukOutModule } from './produk-out/produk-out.module';
import { BatchProdukModule } from './batch-produk/batch-produk.module';
import { MutasiBatchModule } from './mutasi-batch/mutasi-batch.module';
import { ProdukInModule } from './produk-in/produk-in.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ReturModule } from './retur/retur.module';
import { PembayaranInvoiceModule } from './pembayaran-invoice/pembayaran-invoice.module';
import { KartuPiutangModule } from './kartu-piutang/kartu-piutang.module';
import { KasbonModule } from './kasbon/kasbon.module';
import { ProdukHargaModule } from './produk-harga/produk-harga.module';
import { KasbonProdukModule } from './kasbon_produk/kasbon_produk.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PlanModule,
    VehicleModule,
    MarketAreaModule,
    ProductModule,
    EmployeeModule,
    OutletModule,
    TipeHargaModule,
    GudangModule,
    ProdukOutModule,
    BatchProdukModule,
    MutasiBatchModule,
    ProdukInModule,
    InvoiceModule,
    ReturModule,
    PembayaranInvoiceModule,
    KartuPiutangModule,
    KasbonModule,
    ProdukHargaModule,
    KasbonProdukModule,
    RoleModule,
    UserModule,
    // KasbonMaterialTypeModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: ResponseInterceptor }],
})
export class AppModule {}
