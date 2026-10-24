
import { useQueryClient } from "@tanstack/react-query";
import { ME_KEY } from "./useAuth";
import type { User } from "../types/auth.types";

export function usePermission() {
  const qc = useQueryClient();

  return (required: string): boolean => {
    const user = qc.getQueryData<User | null>(ME_KEY);

    if (!user) return false;

    const roleName = user.role?.name.trim().toLowerCase();
    if (roleName === "super admin" || roleName === "superadmin") return true;

    const permissions = user.permissions;
    if (permissions.includes("*") || permissions.includes(required)) {
      return true;
    }

    const [resource, action] = required.split(":");
    if (permissions.includes(`${resource}:*`)) return true;
    if (action && permissions.includes(`${resource}:${action}:*`)) {
      return true;
    }

    return false;
  };
}
