import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MarketArea, MarketAreaPayload } from "../types/marketArea.types";

const URL = "/master/market-area";
const KEY = ["master", "market-area"];

export function useMarketAreas() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<MarketArea[]>(URL),
  });
}

export function useSaveMarketArea() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id_wilayah, ...payload }: MarketAreaPayload & { id_wilayah?: number }) =>
      api<MarketArea>(id_wilayah ? `${URL}/${id_wilayah}` : URL, {
        method: id_wilayah ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteMarketArea() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api(`${URL}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}