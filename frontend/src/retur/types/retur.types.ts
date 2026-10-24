import type { BatchProduk as BatchProdukType } from "@/batch-produk/types/batchProduk.types";
import type { Invoice as InvoiceType } from "@/invoice/types/invoice.types";
import type { Product as ProductType } from "@/master/product/types/product.types";

export type Invoice = Pick<
  InvoiceType,
  "id_invoice" | "id_outlet" | "id_rencana" | "tanggal" | "total" | "status"
>;
export type Produk = ProductType;
export type Batch = Pick<
  BatchProdukType,
  "id_batch" | "id_produk" | "kode_batch" | "expired_date" | "stok"
>;

export type DetailReturPayload = {
  id_produk: number;
  id_batch: number;
  qty: number;
  harga: number;
};

export type DetailRetur = Omit<DetailReturPayload, "harga"> & {
  id_detail_retur: number;
  id_retur: number;
  harga: string | number;
  produk: Produk | null;
  batch: Batch | null;
};

export type ReturPayload = {
  id_invoice: number;
  tanggal: string;
  alasan?: string | null;
  status: string;
  detailRetur: DetailReturPayload[];
};

export type UpdateReturPayload = Partial<ReturPayload>;

export type Retur = {
  id_retur: number;
  id_invoice: number;
  tanggal: string;
  alasan: string | null;
  status: string;
  invoice: Invoice | null;
  detailRetur: DetailRetur[];
};
