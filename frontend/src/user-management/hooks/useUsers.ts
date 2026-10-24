import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  CreateUserPayload,
  ManagedUser,
  ResetUserPasswordPayload,
  UpdateUsernamePayload,
} from "../types/user.types";

const URL = "/users";
const KEY = ["users"];

export function useUsers() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<ManagedUser[]>(URL),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    gcTime: 0,
    mutationFn: (payload: CreateUserPayload) =>
      api<ManagedUser>(URL, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useChangeUserRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id_user, role_id }: { id_user: number; role_id: number }) =>
      api<ManagedUser>(`${URL}/${id_user}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role_id }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateUsername() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_user,
      username,
    }: UpdateUsernamePayload & { id_user: number }) =>
      api<ManagedUser>(`${URL}/${id_user}`, {
        method: "PATCH",
        body: JSON.stringify({ username }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useResetUserPassword() {
  const qc = useQueryClient();

  return useMutation({
    gcTime: 0,
    mutationFn: ({
      id_user,
      password,
    }: ResetUserPasswordPayload & { id_user: number }) =>
      api<ManagedUser>(`${URL}/${id_user}/reset-password`, {
        method: "PATCH",
        body: JSON.stringify({ password }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
