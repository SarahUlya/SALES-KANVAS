import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  BatchProduk,
  BatchProdukPayload,
  UpdateBatchProdukPayload,
} from "../types/batchProduk.types";

const URL = "/batch-produk";
const KEY = ["batch-produk"];

export function useBatchProdukList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<BatchProduk[]>(URL),
  });
}

export function useCreateBatchProduk() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: BatchProdukPayload) =>
      api<BatchProduk>(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateBatchProduk() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_batch,
      ...payload
    }: UpdateBatchProdukPayload & { id_batch: number }) =>
      api<BatchProduk>(`${URL}/${id_batch}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
