
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  KasbonOperasional,
  KasbonOperasionalPayload,
} from "../types/kasbonOperasional.types";

const URL = "/kasbon";
const KEY = ["kasbon"];

export function useKasbonOperasional() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<KasbonOperasional[]>(URL),
  });
}

export function useSaveKasbonOperasional() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: KasbonOperasionalPayload & { id?: number }) =>
      api<KasbonOperasional>(
        id ? `${URL}/${id}` : URL,
        {
          method: id ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
      ),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteKasbonOperasional() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api(`${URL}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
