import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  BatchProdukOut,
  ProdukOut,
  ProdukOutPayload,
  RencanaKanvasList,
  UpdateProdukOutPayload,
} from "../types/produkOut.types";

const URL = "/produk-out";
const KEY = ["produk-out"];

export function useProdukOutList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<ProdukOut[]>(URL),
  });
}

export function useProdukOutDetail(id: number, enabled: boolean) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => api<ProdukOut>(`${URL}/${id}`),
    enabled: enabled && id > 0,
  });
}

export function useRencanaKanvasOptions() {
  return useQuery({
    queryKey: ["plan", "produk-out-options"],
    queryFn: () =>
      api<RencanaKanvasList>("/plan?page=1&limit=100&sortOrder=desc"),
  });
}

export function useBatchProdukOptions() {
  return useQuery({
    queryKey: ["batch-produk", "produk-out-options"],
    queryFn: () => api<BatchProdukOut[]>("/batch-produk"),
  });
}

export function useCreateProdukOut() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProdukOutPayload) =>
      api<ProdukOut>(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateProdukOut() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_produk_out,
      ...payload
    }: UpdateProdukOutPayload & { id_produk_out: number }) =>
      api<ProdukOut>(`${URL}/${id_produk_out}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
