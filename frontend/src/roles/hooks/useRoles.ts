import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Role, RolePayload, RolePermission } from "../types/role.types";

const URL = "/roles";
const KEY = ["roles"];

export function useRoles() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<Role[]>(URL),
  });
}

export function useRole(id: number, enabled: boolean) {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: () => api<Role>(`${URL}/${id}`),
    enabled,
  });
}

export function useRolePermissions(enabled: boolean) {
  return useQuery({
    queryKey: [...KEY, "permissions"],
    queryFn: () => api<RolePermission[]>(`${URL}/permissions`),
    enabled,
  });
}

export function useSaveRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: RolePayload & { id?: number }) =>
      api<Role>(id ? `${URL}/${id}` : URL, {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useSaveRolePermissions() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      permission_ids,
    }: {
      id: number;
      permission_ids: number[];
    }) =>
      api<Role>(`${URL}/${id}/permissions`, {
        method: "PATCH",
        body: JSON.stringify({ permission_ids }),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: [...KEY, variables.id] });
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api<void>(`${URL}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
