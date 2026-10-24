import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  PembayaranInvoice,
  PembayaranInvoicePayload,
  UpdatePembayaranInvoicePayload,
} from "../types/pembayaranInvoice.types";

const URL = "/pembayaran-invoice";
const KEY = ["pembayaran-invoice"];

export function usePembayaranInvoiceList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<PembayaranInvoice[]>(URL),
  });
}

export function usePembayaranInvoiceDetail(
  id: number,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => api<PembayaranInvoice>(`${URL}/${id}`),
    enabled: enabled && id > 0,
  });
}

export function useCreatePembayaranInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PembayaranInvoicePayload) =>
      api<PembayaranInvoice>(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdatePembayaranInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_pembayaran,
      ...payload
    }: UpdatePembayaranInvoicePayload & { id_pembayaran: number }) =>
      api<PembayaranInvoice>(`${URL}/${id_pembayaran}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeletePembayaranInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id_pembayaran: number) =>
      api(`${URL}/${id_pembayaran}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
