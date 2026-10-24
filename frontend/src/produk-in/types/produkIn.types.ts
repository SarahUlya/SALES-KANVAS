import type { Gudang as MasterGudang } from "@/master/gudang/types/gudang.types";
import type { Product } from "@/master/product/types/product.types";

export type Gudang = MasterGudang;
export type Produk = Product;

export type Batch = {
  id_batch: number;
  id_produk: number;
  kode_batch: string | null;
  expired_date: string | null;
  stok: number;
  produk?: Produk;
};

export type DetailProdukInPayload = {
  id_produk: number;
  id_batch: number;
  qty: number;
};

export type DetailProdukIn = DetailProdukInPayload & {
  id_detail_in: number;
  id_produk_in: number;
  produk: Produk | null;
  batch: Batch | null;
};

export type ProdukInPayload = {
  id_gudang: number;
  tanggal: string;
  jenis_transaksi: string;
  keterangan?: string | null;
  detailProdukIn: DetailProdukInPayload[];
};

export type UpdateProdukInPayload = Partial<ProdukInPayload>;

export type ProdukIn = {
  id_produk_in: number;
  id_gudang: number;
  tanggal: string;
  jenis_transaksi: string;
  keterangan: string | null;
  gudang: Gudang | null;
  detailProdukIn: DetailProdukIn[];
};
