import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TipeHarga, TipeHargaPayload } from "../types/tipeHarga.types";

const URL = "/master/tipe-harga";
const KEY = ["master", "tipe-harga"];

export function useTipeHargaList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<TipeHarga[]>(URL),
  });
}

export function useSaveTipeHarga() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_tipe_harga,
      ...payload
    }: TipeHargaPayload & { id_tipe_harga?: number }) =>
      api<TipeHarga>(
        id_tipe_harga ? `${URL}/${id_tipe_harga}` : URL,
        {
          method: id_tipe_harga ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteTipeHarga() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api(`${URL}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
