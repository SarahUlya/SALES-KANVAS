
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Employee,
  EmployeePayload,
  EmployeeUser,
} from "../types/employee.types";

const URL = "/master/employee";
const KEY = ["master", "employee"];
const AVAILABLE_USERS_KEY = ["master", "employee", "available-users"];

export function useEmployees() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<Employee[]>(URL),
  });
}

export function useAvailableEmployeeUsers(enabled = true) {
  return useQuery({
    queryKey: AVAILABLE_USERS_KEY,
    queryFn: () => api<EmployeeUser[]>(`${URL}/available-users`),
    enabled,
  });
}

export function useSaveEmployee() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: EmployeePayload & { id?: number }) =>
      api<Employee>(id ? `${URL}/${id}` : URL, {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(
          id
            ? {
                nama: payload.nama,
                no_hp: payload.no_hp,
                status: payload.status,
              }
            : payload,
        ),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: AVAILABLE_USERS_KEY });
    },
  });
}
