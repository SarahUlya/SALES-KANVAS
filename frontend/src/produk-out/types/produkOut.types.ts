import type { Gudang } from "@/master/gudang/types/gudang.types";
import type { Product } from "@/master/product/types/product.types";

export type RencanaKanvasProdukOut = {
  id_rencana: number;
  id_karyawan: number;
  id_kendaraan: number;
  id_wilayah: number;
  tanggal: string;
  status: string;
};

export type BatchProdukOut = {
  id_batch: number;
  id_produk: number;
  kode_batch: string | null;
  expired_date: string | null;
  stok: number;
  produk?: Product;
};

export type DetailProdukOutPayload = {
  id_produk: number;
  id_batch: number;
  qty: number;
};

export type DetailProdukOut = DetailProdukOutPayload & {
  id_detail_out: number;
  id_produk_out: number;
  produk: Product;
  batch: BatchProdukOut;
};

export type ProdukOutPayload = {
  id_rencana: number;
  id_gudang: number;
  tanggal: string;
  status?: string;
  detailProdukOut: DetailProdukOutPayload[];
};

export type UpdateProdukOutPayload = Partial<ProdukOutPayload>;

export type ProdukOut = {
  id_produk_out: number;
  id_rencana: number;
  id_gudang: number;
  tanggal: string;
  status: string;
  rencanaKanvas: RencanaKanvasProdukOut;
  gudang: Gudang;
  detailProdukOut: DetailProdukOut[];
};

export type RencanaKanvasOption = Pick<
  RencanaKanvasProdukOut,
  "id_rencana" | "tanggal" | "status"
>;

export type RencanaKanvasList = {
  items: RencanaKanvasOption[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};
