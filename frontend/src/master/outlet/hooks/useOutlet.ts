import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Outlet, OutletPayload } from "../types/outlet.types";

const URL = "/master/outlet";
const KEY = ["master", "outlet"];

export function useOutlets() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<Outlet[]>(URL),
  });
}

export function useSaveOutlet() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id_outlet, ...payload }: OutletPayload & { id_outlet?: number }) =>
      api<Outlet>(id_outlet ? `${URL}/${id_outlet}` : URL, {
        method: id_outlet ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteOutlet() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api(`${URL}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
