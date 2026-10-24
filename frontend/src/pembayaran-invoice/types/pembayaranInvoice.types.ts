import type { Invoice as InvoiceRef } from "@/invoice/types/invoice.types";

export type Invoice = Pick<
  InvoiceRef,
  "id_invoice" | "id_outlet" | "id_rencana" | "tanggal" | "total" | "status"
>;

export type PembayaranInvoicePayload = {
  id_invoice: number;
  tanggal: string;
  jumlah: number;
  metode: string;
};

export type UpdatePembayaranInvoicePayload =
  Partial<PembayaranInvoicePayload>;

export type PembayaranInvoice = {
  id_pembayaran: number;
  id_invoice: number;
  tanggal: string;
  jumlah: string | number;
  metode: string;
  invoice: Invoice | null;
};
