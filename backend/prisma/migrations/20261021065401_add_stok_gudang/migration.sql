-- CreateTable
CREATE TABLE "stok_gudang" (
    "id_stok_gudang" SERIAL NOT NULL,
    "id_batch" INTEGER NOT NULL,
    "id_gudang" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "stok_gudang_pkey" PRIMARY KEY ("id_stok_gudang")
);

-- CreateIndex
CREATE UNIQUE INDEX "stok_gudang_id_batch_id_gudang_key" ON "stok_gudang"("id_batch", "id_gudang");

-- AddForeignKey
ALTER TABLE "stok_gudang" ADD CONSTRAINT "stok_gudang_id_batch_fkey" FOREIGN KEY ("id_batch") REFERENCES "batch_produk"("id_batch") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stok_gudang" ADD CONSTRAINT "stok_gudang_id_gudang_fkey" FOREIGN KEY ("id_gudang") REFERENCES "gudang"("id_gudang") ON DELETE RESTRICT ON UPDATE CASCADE;
