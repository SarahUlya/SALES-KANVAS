
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  KasbonProduk,
  KasbonProdukPayload,
} from "../types/kasbonProduk.types";

const URL = "/kasbon-produk";
const KEY = ["kasbon-produk"];

export function useKasbonProduk() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<KasbonProduk[]>(URL),
  });
}

export function useKasbonProdukDetail(id: number, enabled: boolean) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => api<KasbonProduk>(`${URL}/${id}`),
    enabled: enabled && id > 0,
  });
}

export function useSaveKasbonProduk() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: KasbonProdukPayload & { id?: number }) =>
      api<KasbonProduk>(
        id ? `${URL}/${id}` : URL,
        {
          method: id ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteKasbonProduk() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api(`${URL}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
