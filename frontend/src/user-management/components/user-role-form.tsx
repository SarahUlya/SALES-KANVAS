import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import type { Role } from "@/roles/types/role.types";
import { errorMessage } from "@/lib/errors";
import { useChangeUserRole } from "../hooks/useUsers";
import type { ManagedUser } from "../types/user.types";

type Props = {
  user: ManagedUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
};

export function UserRoleForm({ user, open, onOpenChange, roles }: Props) {
  const changeRole = useChangeUserRole();
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (open && user)
      setRoleId(user.role_id == null ? "" : String(user.role_id));
    if (!open) setRoleId("");
  }, [open, user]);

  const save = () => {
    if (!user || !roleId) return;

    changeRole.mutate(
      { id_user: user.id_user, role_id: Number(roleId) },
      {
        onSuccess: () => {
          toast.success(`Role untuk ${user.username} berhasil diubah`);
          onOpenChange(false);
        },
        onError: (error) => toast.error(errorMessage(error)),
      },
    );
  };

  const selectedRole = roles.find((role) => String(role.id) === roleId);
  const unchanged =
    !!user &&
    user.role_id != null &&
    roleId === String(user.role_id);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Ubah Role Akun"
      description={
        user
          ? `Role akun "${user.username}" akan diubah${selectedRole ? ` menjadi ${selectedRole.name}` : ""}. Pastikan pilihan ini benar sebelum menyimpan.`
          : undefined
      }
    >
      <div className="grid gap-4">
        <SelectInput
          aria-label="Role baru"
          required
          options={roles.map((role) => ({
            value: String(role.id),
            label: role.name,
          }))}
          value={roleId}
          onValueChange={setRoleId}
        />
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
              !user ||
              !roleId ||
              unchanged ||
              !roles.length ||
              changeRole.isPending
            }
            onClick={save}
          >
            {changeRole.isPending ? "Menyimpan…" : "Konfirmasi & Simpan"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
