import type { Gudang } from "@/master/gudang/types/gudang.types";
import type { Product } from "@/master/product/types/product.types";

export type Batch = {
  id_batch: number;
  id_produk: number;
  kode_batch: string | null;
  expired_date: string | null;
  stok: number;
};

export type MutasiBatch = {
  id_mutasi: number;
  id_produk: number;
  id_gudang: number;
  id_batch: number;
  tanggal: string;
  stok_masuk: number;
  stok_keluar: number;
  keterangan: string | null;
  produk: Product | null;
  gudang: Gudang | null;
  batch: Batch | null;
};
