import type { Product } from "@/master/product/types/product.types";

export type BatchProduk = {
  id_batch: number;
  id_produk: number;
  kode_batch: string | null;
  expired_date: string | null;
  stok: number;
  produk: Product;
};

export type BatchProdukPayload = {
  id_produk: number;
  kode_batch?: string | null;
  expired_date?: string | null;
  stok: number;
};

export type UpdateBatchProdukPayload = Partial<BatchProdukPayload>;
