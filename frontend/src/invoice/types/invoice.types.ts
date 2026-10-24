import type { BatchProduk as BatchProdukType } from "@/batch-produk/types/batchProduk.types";
import type { Outlet as OutletType } from "@/master/outlet/types/outlet.types";
import type { Product as ProductType } from "@/master/product/types/product.types";

export type Outlet = OutletType;
export type Produk = ProductType;
export type Batch = BatchProdukType;

export type RencanaKanvas = {
  id_rencana: number;
  id_karyawan: number;
  id_kendaraan: number;
  id_wilayah: number;
  tanggal: string;
  status: string;
};

export type RencanaKanvasInvoice = RencanaKanvas;

export type DetailInvoicePayload = {
  id_produk: number;
  id_batch: number;
  qty: number;
  harga: number;
};

export type DetailInvoice = Omit<DetailInvoicePayload, "harga"> & {
  id_detail_invoice: number;
  id_invoice: number;
  harga: string | number;
  subtotal: string | number;
  produk: Produk | null;
  batch: Batch | null;
};

export type InvoicePayload = {
  id_outlet: number;
  id_rencana: number;
  tanggal: string;
  status: string;
  detailInvoice: DetailInvoicePayload[];
};

export type UpdateInvoicePayload = Partial<InvoicePayload>;

export type Invoice = {
  id_invoice: number;
  id_outlet: number;
  id_rencana: number;
  tanggal: string;
  total: string | number;
  status: string;
  outlet: Outlet | null;
  rencanaKanvas: RencanaKanvas | null;
  detailInvoice: DetailInvoice[];
};

export type RencanaKanvasOption = Pick<
  RencanaKanvasInvoice,
  "id_rencana" | "tanggal" | "status"
>;

export type RencanaKanvasList = {
  items: RencanaKanvasOption[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};
