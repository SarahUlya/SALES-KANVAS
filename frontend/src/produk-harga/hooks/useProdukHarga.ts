import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  ProdukHarga,
  ProdukHargaPayload,
  UpdateProdukHargaPayload,
} from "../types/produkHarga.types";

const URL = "/produk-harga";
const KEY = ["produk-harga"];

export function useProdukHargaList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<ProdukHarga[]>(URL),
  });
}

export function useCreateProdukHarga() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProdukHargaPayload) =>
      api<ProdukHarga>(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateProdukHarga() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_produk_harga,
      ...payload
    }: UpdateProdukHargaPayload & { id_produk_harga: number }) =>
      api<ProdukHarga>(`${URL}/${id_produk_harga}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteProdukHarga() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id_produk_harga: number) =>
      api(`${URL}/${id_produk_harga}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
