/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `last_login_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `username` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `ms_employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ms_kanvas_kasbon_material_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ms_market_area` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ms_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ms_vehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ts_sales_kanvas_kasbon_material` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ts_sales_kanvas_personil` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ts_sales_kanvas_plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ts_sales_kanvas_plan_detail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "permission_role" DROP CONSTRAINT "permission_role_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "permission_role" DROP CONSTRAINT "permission_role_role_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_kasbon_material" DROP CONSTRAINT "ts_sales_kanvas_kasbon_material_kasbon_material_type_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_kasbon_material" DROP CONSTRAINT "ts_sales_kanvas_kasbon_material_sales_kanvas_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_personil" DROP CONSTRAINT "ts_sales_kanvas_personil_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_personil" DROP CONSTRAINT "ts_sales_kanvas_personil_sales_kanvas_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_plan" DROP CONSTRAINT "ts_sales_kanvas_plan_market_area_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_plan" DROP CONSTRAINT "ts_sales_kanvas_plan_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_plan_detail" DROP CONSTRAINT "ts_sales_kanvas_plan_detail_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ts_sales_kanvas_plan_detail" DROP CONSTRAINT "ts_sales_kanvas_plan_detail_sales_kanvas_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_role_id_fkey";

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
DROP COLUMN "created_at",
DROP COLUMN "id",
DROP COLUMN "is_active",
DROP COLUMN "last_login_at",
DROP COLUMN "name",
DROP COLUMN "refresh_token",
DROP COLUMN "role_id",
DROP COLUMN "updated_at",
ADD COLUMN     "id_user" SERIAL NOT NULL,
ADD COLUMN     "role" VARCHAR(20) NOT NULL,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id_user");

-- DropTable
DROP TABLE "ms_employee";

-- DropTable
DROP TABLE "ms_kanvas_kasbon_material_type";

-- DropTable
DROP TABLE "ms_market_area";

-- DropTable
DROP TABLE "ms_product";

-- DropTable
DROP TABLE "ms_vehicle";

-- DropTable
DROP TABLE "permission";

-- DropTable
DROP TABLE "permission_role";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "ts_sales_kanvas_kasbon_material";

-- DropTable
DROP TABLE "ts_sales_kanvas_personil";

-- DropTable
DROP TABLE "ts_sales_kanvas_plan";

-- DropTable
DROP TABLE "ts_sales_kanvas_plan_detail";

-- CreateTable
CREATE TABLE "karyawan" (
    "id_karyawan" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "no_hp" VARCHAR(20),
    "status" VARCHAR(20),

    CONSTRAINT "karyawan_pkey" PRIMARY KEY ("id_karyawan")
);

-- CreateTable
CREATE TABLE "wilayah_kanvas" (
    "id_wilayah" SERIAL NOT NULL,
    "nama_wilayah" VARCHAR(100) NOT NULL,
    "keterangan" VARCHAR(255),

    CONSTRAINT "wilayah_kanvas_pkey" PRIMARY KEY ("id_wilayah")
);

-- CreateTable
CREATE TABLE "kendaraan" (
    "id_kendaraan" SERIAL NOT NULL,
    "nomor_plat" VARCHAR(20) NOT NULL,
    "jenis" VARCHAR(50),
    "status" VARCHAR(20),

    CONSTRAINT "kendaraan_pkey" PRIMARY KEY ("id_kendaraan")
);

-- CreateTable
CREATE TABLE "outlet" (
    "id_outlet" SERIAL NOT NULL,
    "id_wilayah" INTEGER NOT NULL,
    "nama_outlet" VARCHAR(100) NOT NULL,
    "alamat" TEXT,
    "no_hp" VARCHAR(20),

    CONSTRAINT "outlet_pkey" PRIMARY KEY ("id_outlet")
);

-- CreateTable
CREATE TABLE "tipe_harga" (
    "id_tipe_harga" SERIAL NOT NULL,
    "nama_tipe" VARCHAR(50) NOT NULL,

    CONSTRAINT "tipe_harga_pkey" PRIMARY KEY ("id_tipe_harga")
);

-- CreateTable
CREATE TABLE "produk" (
    "id_produk" SERIAL NOT NULL,
    "nama_produk" VARCHAR(100) NOT NULL,
    "barcode" VARCHAR(50),
    "satuan" VARCHAR(20),
    "status" VARCHAR(20),

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id_produk")
);

-- CreateTable
CREATE TABLE "gudang" (
    "id_gudang" SERIAL NOT NULL,
    "nama_gudang" VARCHAR(100) NOT NULL,
    "lokasi" VARCHAR(255),

    CONSTRAINT "gudang_pkey" PRIMARY KEY ("id_gudang")
);

-- CreateTable
CREATE TABLE "rencana_kanvas" (
    "id_rencana" SERIAL NOT NULL,
    "id_karyawan" INTEGER NOT NULL,
    "id_kendaraan" INTEGER NOT NULL,
    "id_wilayah" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "rencana_kanvas_pkey" PRIMARY KEY ("id_rencana")
);

-- CreateTable
CREATE TABLE "detail_rencana_kanvas" (
    "id_detail_rencana" SERIAL NOT NULL,
    "id_rencana" INTEGER NOT NULL,
    "id_outlet" INTEGER NOT NULL,
    "urutan" INTEGER NOT NULL,

    CONSTRAINT "detail_rencana_kanvas_pkey" PRIMARY KEY ("id_detail_rencana")
);

-- CreateTable
CREATE TABLE "kasbon_produk" (
    "id_kasbon_produk" SERIAL NOT NULL,
    "id_karyawan" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "keterangan" VARCHAR(255),

    CONSTRAINT "kasbon_produk_pkey" PRIMARY KEY ("id_kasbon_produk")
);

-- CreateTable
CREATE TABLE "detail_kasbon_produk" (
    "id_detail_kasbon" SERIAL NOT NULL,
    "id_kasbon_produk" INTEGER NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "detail_kasbon_produk_pkey" PRIMARY KEY ("id_detail_kasbon")
);

-- CreateTable
CREATE TABLE "kasbon_operasional" (
    "id_kasbon_operasional" SERIAL NOT NULL,
    "id_karyawan" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "jumlah" DECIMAL(14,2) NOT NULL,
    "keterangan" VARCHAR(255),
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "kasbon_operasional_pkey" PRIMARY KEY ("id_kasbon_operasional")
);

-- CreateTable
CREATE TABLE "produk_out" (
    "id_produk_out" SERIAL NOT NULL,
    "id_rencana" INTEGER NOT NULL,
    "id_gudang" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "produk_out_pkey" PRIMARY KEY ("id_produk_out")
);

-- CreateTable
CREATE TABLE "detail_produk_out" (
    "id_detail_out" SERIAL NOT NULL,
    "id_produk_out" INTEGER NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "id_batch" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "detail_produk_out_pkey" PRIMARY KEY ("id_detail_out")
);

-- CreateTable
CREATE TABLE "produk_harga" (
    "id_produk_harga" SERIAL NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "id_tipe_harga" INTEGER NOT NULL,
    "harga" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "produk_harga_pkey" PRIMARY KEY ("id_produk_harga")
);

-- CreateTable
CREATE TABLE "produk_in" (
    "id_produk_in" SERIAL NOT NULL,
    "id_gudang" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "jenis_transaksi" VARCHAR(30) NOT NULL,
    "keterangan" VARCHAR(255),

    CONSTRAINT "produk_in_pkey" PRIMARY KEY ("id_produk_in")
);

-- CreateTable
CREATE TABLE "detail_produk_in" (
    "id_detail_in" SERIAL NOT NULL,
    "id_produk_in" INTEGER NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "id_batch" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "detail_produk_in_pkey" PRIMARY KEY ("id_detail_in")
);

-- CreateTable
CREATE TABLE "mutasi_batch" (
    "id_mutasi" SERIAL NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "id_gudang" INTEGER NOT NULL,
    "id_batch" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "stok_masuk" INTEGER NOT NULL,
    "stok_keluar" INTEGER NOT NULL,
    "keterangan" VARCHAR(255),

    CONSTRAINT "mutasi_batch_pkey" PRIMARY KEY ("id_mutasi")
);

-- CreateTable
CREATE TABLE "invoice_outlet" (
    "id_invoice" SERIAL NOT NULL,
    "id_outlet" INTEGER NOT NULL,
    "id_rencana" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "total" DECIMAL(14,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "invoice_outlet_pkey" PRIMARY KEY ("id_invoice")
);

-- CreateTable
CREATE TABLE "detail_invoice_outlet" (
    "id_detail_invoice" SERIAL NOT NULL,
    "id_invoice" INTEGER NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "id_batch" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "harga" DECIMAL(14,2) NOT NULL,
    "subtotal" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "detail_invoice_outlet_pkey" PRIMARY KEY ("id_detail_invoice")
);

-- CreateTable
CREATE TABLE "invoice_retur_produk" (
    "id_retur" SERIAL NOT NULL,
    "id_invoice" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "alasan" VARCHAR(255),
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "invoice_retur_produk_pkey" PRIMARY KEY ("id_retur")
);

-- CreateTable
CREATE TABLE "detail_invoice_retur_produk" (
    "id_detail_retur" SERIAL NOT NULL,
    "id_retur" INTEGER NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "id_batch" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "harga" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "detail_invoice_retur_produk_pkey" PRIMARY KEY ("id_detail_retur")
);

-- CreateTable
CREATE TABLE "kartu_piutang_outlet" (
    "id_piutang" SERIAL NOT NULL,
    "id_outlet" INTEGER NOT NULL,
    "id_invoice" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "debit" DECIMAL(14,2) NOT NULL,
    "kredit" DECIMAL(14,2) NOT NULL,
    "keterangan" VARCHAR(255),

    CONSTRAINT "kartu_piutang_outlet_pkey" PRIMARY KEY ("id_piutang")
);

-- CreateTable
CREATE TABLE "pembayaran_invoice" (
    "id_pembayaran" SERIAL NOT NULL,
    "id_invoice" INTEGER NOT NULL,
    "tanggal" DATE NOT NULL,
    "jumlah" DECIMAL(14,2) NOT NULL,
    "metode" VARCHAR(30) NOT NULL,

    CONSTRAINT "pembayaran_invoice_pkey" PRIMARY KEY ("id_pembayaran")
);

-- CreateTable
CREATE TABLE "batch_produk" (
    "id_batch" SERIAL NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "kode_batch" VARCHAR(50),
    "expired_date" DATE,
    "stok" INTEGER NOT NULL,

    CONSTRAINT "batch_produk_pkey" PRIMARY KEY ("id_batch")
);

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_id_user_key" ON "karyawan"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "kendaraan_nomor_plat_key" ON "kendaraan"("nomor_plat");

-- AddForeignKey
ALTER TABLE "karyawan" ADD CONSTRAINT "karyawan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outlet" ADD CONSTRAINT "outlet_id_wilayah_fkey" FOREIGN KEY ("id_wilayah") REFERENCES "wilayah_kanvas"("id_wilayah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rencana_kanvas" ADD CONSTRAINT "rencana_kanvas_id_karyawan_fkey" FOREIGN KEY ("id_karyawan") REFERENCES "karyawan"("id_karyawan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rencana_kanvas" ADD CONSTRAINT "rencana_kanvas_id_kendaraan_fkey" FOREIGN KEY ("id_kendaraan") REFERENCES "kendaraan"("id_kendaraan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rencana_kanvas" ADD CONSTRAINT "rencana_kanvas_id_wilayah_fkey" FOREIGN KEY ("id_wilayah") REFERENCES "wilayah_kanvas"("id_wilayah") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_rencana_kanvas" ADD CONSTRAINT "detail_rencana_kanvas_id_rencana_fkey" FOREIGN KEY ("id_rencana") REFERENCES "rencana_kanvas"("id_rencana") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_rencana_kanvas" ADD CONSTRAINT "detail_rencana_kanvas_id_outlet_fkey" FOREIGN KEY ("id_outlet") REFERENCES "outlet"("id_outlet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kasbon_produk" ADD CONSTRAINT "kasbon_produk_id_karyawan_fkey" FOREIGN KEY ("id_karyawan") REFERENCES "karyawan"("id_karyawan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_kasbon_produk" ADD CONSTRAINT "detail_kasbon_produk_id_kasbon_produk_fkey" FOREIGN KEY ("id_kasbon_produk") REFERENCES "kasbon_produk"("id_kasbon_produk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_kasbon_produk" ADD CONSTRAINT "detail_kasbon_produk_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id_produk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kasbon_operasional" ADD CONSTRAINT "kasbon_operasional_id_karyawan_fkey" FOREIGN KEY ("id_karyawan") REFERENCES "karyawan"("id_karyawan") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_out" ADD CONSTRAINT "produk_out_id_rencana_fkey" FOREIGN KEY ("id_rencana") REFERENCES "rencana_kanvas"("id_rencana") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_out" ADD CONSTRAINT "produk_out_id_gudang_fkey" FOREIGN KEY ("id_gudang") REFERENCES "gudang"("id_gudang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_produk_out" ADD CONSTRAINT "detail_produk_out_id_produk_out_fkey" FOREIGN KEY ("id_produk_out") REFERENCES "produk_out"("id_produk_out") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_produk_out" ADD CONSTRAINT "detail_produk_out_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id_produk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_produk_out" ADD CONSTRAINT "detail_produk_out_id_batch_fkey" FOREIGN KEY ("id_batch") REFERENCES "batch_produk"("id_batch") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_harga" ADD CONSTRAINT "produk_harga_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id_produk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_harga" ADD CONSTRAINT "produk_harga_id_tipe_harga_fkey" FOREIGN KEY ("id_tipe_harga") REFERENCES "tipe_harga"("id_tipe_harga") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produk_in" ADD CONSTRAINT "produk_in_id_gudang_fkey" FOREIGN KEY ("id_gudang") REFERENCES "gudang"("id_gudang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_produk_in" ADD CONSTRAINT "detail_produk_in_id_produk_in_fkey" FOREIGN KEY ("id_produk_in") REFERENCES "produk_in"("id_produk_in") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_produk_in" ADD CONSTRAINT "detail_produk_in_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id_produk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_produk_in" ADD CONSTRAINT "detail_produk_in_id_batch_fkey" FOREIGN KEY ("id_batch") REFERENCES "batch_produk"("id_batch") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutasi_batch" ADD CONSTRAINT "mutasi_batch_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id_produk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutasi_batch" ADD CONSTRAINT "mutasi_batch_id_gudang_fkey" FOREIGN KEY ("id_gudang") REFERENCES "gudang"("id_gudang") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mutasi_batch" ADD CONSTRAINT "mutasi_batch_id_batch_fkey" FOREIGN KEY ("id_batch") REFERENCES "batch_produk"("id_batch") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_outlet" ADD CONSTRAINT "invoice_outlet_id_outlet_fkey" FOREIGN KEY ("id_outlet") REFERENCES "outlet"("id_outlet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_outlet" ADD CONSTRAINT "invoice_outlet_id_rencana_fkey" FOREIGN KEY ("id_rencana") REFERENCES "rencana_kanvas"("id_rencana") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_invoice_outlet" ADD CONSTRAINT "detail_invoice_outlet_id_invoice_fkey" FOREIGN KEY ("id_invoice") REFERENCES "invoice_outlet"("id_invoice") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_invoice_outlet" ADD CONSTRAINT "detail_invoice_outlet_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id_produk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_invoice_outlet" ADD CONSTRAINT "detail_invoice_outlet_id_batch_fkey" FOREIGN KEY ("id_batch") REFERENCES "batch_produk"("id_batch") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_retur_produk" ADD CONSTRAINT "invoice_retur_produk_id_invoice_fkey" FOREIGN KEY ("id_invoice") REFERENCES "invoice_outlet"("id_invoice") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_invoice_retur_produk" ADD CONSTRAINT "detail_invoice_retur_produk_id_retur_fkey" FOREIGN KEY ("id_retur") REFERENCES "invoice_retur_produk"("id_retur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_invoice_retur_produk" ADD CONSTRAINT "detail_invoice_retur_produk_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id_produk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_invoice_retur_produk" ADD CONSTRAINT "detail_invoice_retur_produk_id_batch_fkey" FOREIGN KEY ("id_batch") REFERENCES "batch_produk"("id_batch") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kartu_piutang_outlet" ADD CONSTRAINT "kartu_piutang_outlet_id_outlet_fkey" FOREIGN KEY ("id_outlet") REFERENCES "outlet"("id_outlet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kartu_piutang_outlet" ADD CONSTRAINT "kartu_piutang_outlet_id_invoice_fkey" FOREIGN KEY ("id_invoice") REFERENCES "invoice_outlet"("id_invoice") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembayaran_invoice" ADD CONSTRAINT "pembayaran_invoice_id_invoice_fkey" FOREIGN KEY ("id_invoice") REFERENCES "invoice_outlet"("id_invoice") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_produk" ADD CONSTRAINT "batch_produk_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "produk"("id_produk") ON DELETE RESTRICT ON UPDATE CASCADE;
