import type { Invoice as InvoiceRef } from "@/invoice/types/invoice.types";
import type { Outlet as OutletRef } from "@/master/outlet/types/outlet.types";

export type Outlet = OutletRef;
export type Invoice = Pick<
  InvoiceRef,
  "id_invoice" | "id_outlet" | "id_rencana" | "tanggal" | "total" | "status"
>;

export type KartuPiutangPayload = {
  id_outlet: number;
  id_invoice: number;
  tanggal: string;
  debit: number;
  kredit: number;
  keterangan?: string | null;
};

export type UpdateKartuPiutangPayload = Partial<KartuPiutangPayload>;

export type KartuPiutang = {
  id_piutang: number;
  id_outlet: number;
  id_invoice: number;
  tanggal: string;
  debit: string | number;
  kredit: string | number;
  keterangan: string | null;
  outlet: Outlet | null;
  invoice: Invoice | null;
};
