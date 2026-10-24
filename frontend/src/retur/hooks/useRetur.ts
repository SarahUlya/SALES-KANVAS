import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Retur,
  ReturPayload,
  UpdateReturPayload,
} from "../types/retur.types";

const URL = "/retur";
const KEY = ["retur"];

export function useReturList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<Retur[]>(URL),
  });
}

export function useReturDetail(id: number, enabled: boolean) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => api<Retur>(`${URL}/${id}`),
    enabled: enabled && id > 0,
  });
}

export function useCreateRetur() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReturPayload) =>
      api<Retur>(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateRetur() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_retur,
      ...payload
    }: UpdateReturPayload & { id_retur: number }) =>
      api<Retur>(`${URL}/${id_retur}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteRetur() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id_retur: number) =>
      api(`${URL}/${id_retur}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
