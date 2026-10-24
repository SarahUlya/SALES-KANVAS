import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/modal";
import { errorMessage } from "@/lib/errors";
import {
  useRole,
  useRolePermissions,
  useSaveRolePermissions,
} from "../hooks/useRoles";
import type { Role } from "../types/role.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
};

export function RolePermissionsForm({ open, onOpenChange, role }: Props) {
  const roleQuery = useRole(role?.id ?? 0, open && !!role);
  const permissionsQuery = useRolePermissions(open);
  const save = useSaveRolePermissions();
  const [selected, setSelected] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    if (open && roleQuery.data) {
      setSelected(new Set(roleQuery.data.permissions.map(({ id }) => id)));
    }
  }, [open, roleQuery.data]);

  const isLoading = roleQuery.isLoading || permissionsQuery.isLoading;
  const isError = roleQuery.isError || permissionsQuery.isError;

  const togglePermission = (id: number, checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const retry = () => {
    void roleQuery.refetch();
    void permissionsQuery.refetch();
  };

  const onSave = () => {
    if (!role) return;

    save.mutate(
      { id: role.id, permission_ids: [...selected] },
      {
        onSuccess: () => {
          toast.success("Permission role diperbarui");
          onOpenChange(false);
        },
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Atur Permission${role ? ` — ${role.name}` : ""}`}
      description="Pilih permission yang diberikan kepada role ini."
      className="sm:max-w-2xl"
    >
      <div className="grid gap-4">
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Memuat permission…
          </p>
        ) : isError ? (
          <div className="grid justify-items-center gap-3 py-6 text-sm">
            <p className="text-muted-foreground">
              Gagal memuat role atau daftar permission.
            </p>
            <Button variant="outline" onClick={retry}>
              Coba lagi
            </Button>
          </div>
        ) : permissionsQuery.data?.length ? (
          <div className="grid max-h-[50svh] gap-2 overflow-y-auto rounded-lg border p-3 sm:grid-cols-2">
            {permissionsQuery.data.map((permission) => (
              <label
                key={permission.id}
                className="flex cursor-pointer items-start gap-2 rounded-md p-2 text-sm hover:bg-muted"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 accent-primary"
                  checked={selected.has(permission.id)}
                  disabled={save.isPending}
                  onChange={(event) =>
                    togglePermission(permission.id, event.target.checked)
                  }
                />
                <span>{permission.name}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Belum ada permission tersedia.
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={
              isLoading ||
              isError ||
              !permissionsQuery.data?.length ||
              save.isPending
            }
            onClick={onSave}
          >
            {save.isPending ? "Menyimpan…" : "Simpan Permission"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
