import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  KartuPiutang,
  KartuPiutangPayload,
  UpdateKartuPiutangPayload,
} from "../types/kartuPiutang.types";

const URL = "/kartu-piutang";
const KEY = ["kartu-piutang"];

export function useKartuPiutangList() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<KartuPiutang[]>(URL),
  });
}

export function useKartuPiutangDetail(id: number, enabled: boolean) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => api<KartuPiutang>(`${URL}/${id}`),
    enabled: enabled && id > 0,
  });
}

export function useCreateKartuPiutang() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: KartuPiutangPayload) =>
      api<KartuPiutang>(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateKartuPiutang() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_piutang,
      ...payload
    }: UpdateKartuPiutangPayload & { id_piutang: number }) =>
      api<KartuPiutang>(`${URL}/${id_piutang}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteKartuPiutang() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id_piutang: number) =>
      api(`${URL}/${id_piutang}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
