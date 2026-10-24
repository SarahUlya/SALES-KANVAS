import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Invoice,
  InvoicePayload,
  RencanaKanvasList,
  UpdateInvoicePayload,
} from "../types/invoice.types";

const URL = "/invoice";
const KEY = ["invoice"];

export function useInvoiceList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<Invoice[]>(URL),
  });
}

export function useInvoiceDetail(id: number, enabled: boolean) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => api<Invoice>(`${URL}/${id}`),
    enabled: enabled && id > 0,
  });
}

export function useRencanaInvoiceOptions() {
  return useQuery({
    queryKey: ["plan", "invoice-options"],
    queryFn: () =>
      api<RencanaKanvasList>("/plan?page=1&limit=100&sortOrder=desc"),
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: InvoicePayload) =>
      api<Invoice>(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateInvoice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_invoice,
      ...payload
    }: UpdateInvoicePayload & { id_invoice: number }) =>
      api<Invoice>(`${URL}/${id_invoice}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteInvoice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id_invoice: number) =>
      api(`${URL}/${id_invoice}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
