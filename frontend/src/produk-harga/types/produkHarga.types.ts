import type { Product } from "@/master/product/types/product.types";
import type { TipeHarga } from "@/master/tipe-harga/types/tipeHarga.types";

export type ProdukHarga = {
  id_produk_harga: number;
  id_produk: number;
  id_tipe_harga: number;
  harga: string;
  produk: Product;
  tipeHarga: TipeHarga;
};

export type ProdukHargaPayload = {
  id_produk: number;
  id_tipe_harga: number;
  harga: number;
};

export type UpdateProdukHargaPayload = Partial<ProdukHargaPayload>;
