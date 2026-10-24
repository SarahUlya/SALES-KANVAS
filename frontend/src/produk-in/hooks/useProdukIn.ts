import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Batch,
  ProdukIn,
  ProdukInPayload,
  UpdateProdukInPayload,
} from "../types/produkIn.types";

const URL = "/produk-in";
const KEY = ["produk-in"];

export function useProdukInList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<ProdukIn[]>(URL),
  });
}

export function useProdukInDetail(id: number, enabled: boolean) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => api<ProdukIn>(`${URL}/${id}`),
    enabled: enabled && id > 0,
  });
}

export function useBatchProdukInOptions() {
  return useQuery({
    queryKey: ["batch-produk", "produk-in-options"],
    queryFn: () => api<Batch[]>("/batch-produk"),
  });
}

export function useCreateProdukIn() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProdukInPayload) =>
      api<ProdukIn>(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateProdukIn() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_produk_in,
      ...payload
    }: UpdateProdukInPayload & { id_produk_in: number }) =>
      api<ProdukIn>(`${URL}/${id_produk_in}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteProdukIn() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id_produk_in: number) =>
      api(`${URL}/${id_produk_in}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
