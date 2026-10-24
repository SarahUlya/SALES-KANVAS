import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Plan,
  PlanList,
  PlanListQuery,
  PlanPayload,
  PlanStatus,
} from "../types/plan.types";

const URL = "/plan";
const KEY = ["plan"];

export function usePlans(query: PlanListQuery) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== "") params.set(k, String(v));
  }
  return useQuery({
    queryKey: [...KEY, "list", query],
    queryFn: () => api<PlanList>(`${URL}?${params}`),
    placeholderData: keepPreviousData,
  });
}

export function usePlan(id: number) {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: () => api<Plan>(`${URL}/${id}`),
    enabled: id > 0,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlanPayload) =>
      api<Plan>(URL, { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRevisePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id_rencana,
      ...payload
    }: PlanPayload & { id_rencana: number }) =>
      api<Plan>(`${URL}/${id_rencana}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdatePlanStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id_rencana,
      status,
    }: {
      id_rencana: number;
      status: PlanStatus;
    }) =>
      api<Plan>(`${URL}/${id_rencana}/update-status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
