import { Modal } from "@/components/shared/modal";
import type { ManagedUser } from "../types/user.types";

type Props = {
  user: ManagedUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function Detail({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="grid gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

export function UserDetailDialog({ user, open, onOpenChange }: Props) {
  const role =
    user?.roleRelation?.name ??
    (typeof user?.role === "string" ? user.role : user?.role?.name) ??
    "-";
  const employee = user?.karyawan;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detail User"
      className="sm:max-w-xl"
    >
      {user && (
        <dl className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
          <Detail label="ID User" value={user.id_user} />
          <Detail label="Username" value={user.username} />
          <Detail label="Nama Role" value={role} />
          <Detail label="ID Role" value={user.roleRelation?.id ?? user.role_id ?? "-"} />
          <Detail
            label="Status Relasi Karyawan"
            value={employee ? "Terhubung" : "Tidak terhubung"}
          />
          <Detail label="ID Karyawan" value={employee?.id_karyawan ?? "-"} />
          <Detail label="Nama Karyawan" value={employee?.nama ?? "-"} />
          <Detail label="Nomor HP" value={employee?.no_hp || "-"} />
        </dl>
      )}
    </Modal>
  );
}
