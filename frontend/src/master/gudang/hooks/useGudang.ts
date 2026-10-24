import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Gudang, GudangPayload } from "../types/gudang.types";

const URL = "/master/gudang";
const KEY = ["master", "gudang"];

export function useGudangList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<Gudang[]>(URL),
  });
}

export function useSaveGudang() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id_gudang, ...payload }: GudangPayload & { id_gudang?: number }) =>
      api<Gudang>(id_gudang ? `${URL}/${id_gudang}` : URL, {
        method: id_gudang ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteGudang() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api(`${URL}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
