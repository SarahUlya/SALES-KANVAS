import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ChevronDown,
  Eye,
  KeyRound,
  Pencil,
  Plus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRoles } from "@/roles/hooks/useRoles";
import type { Role } from "@/roles/types/role.types";
import { errorMessage } from "@/lib/errors";
import { toast } from "sonner";
import { useUsers } from "../hooks/useUsers";
import type { ManagedUser } from "../types/user.types";
import { UserCreateForm } from "./user-create-form";
import { UserDetailDialog } from "./user-detail-dialog";
import { UserPasswordResetForm } from "./user-password-reset-form";
import { UserRoleForm } from "./user-role-form";
import { UserUsernameForm } from "./user-username-form";

export function UserManagementPage() {
  const usersQuery = useUsers();
  const rolesQuery = useRoles();
  const [createOpen, setCreateOpen] = useState(false);
  const [roleUser, setRoleUser] = useState<ManagedUser | null>(null);
  const [detailUser, setDetailUser] = useState<ManagedUser | null>(null);
  const [usernameUser, setUsernameUser] = useState<ManagedUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<ManagedUser | null>(null);

  const roles: Role[] = rolesQuery.data ?? [];
  const columns: ColumnDef<ManagedUser>[] = [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.username}</span>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          row.original.roleRelation?.name ??
          (typeof role === "string" ? role : role?.name) ??
          "-"
        );
      },
    },
    {
      id: "employee",
      header: "Karyawan",
      cell: ({ row }) => row.original.karyawan?.nama ?? "-",
    },
    {
      id: "employee-status",
      header: "Status Relasi Karyawan",
      cell: ({ row }) =>
        row.original.karyawan
          ? row.original.karyawan.status ?? "Terhubung"
          : "Tidak terhubung",
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDetailUser(row.original)}
          >
            <Eye /> Detail
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={`Aksi untuk ${row.original.username}`}
                >
                  Aksi <ChevronDown />
                </Button>
              }
            />
            <DropdownMenuContent
              align="end"
              side="bottom"
              className="w-48"
            >
              <DropdownMenuItem
                onClick={() => setUsernameUser(row.original)}
              >
                <Pencil /> Edit Username
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPasswordUser(row.original)}
              >
                <KeyRound /> Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={
                  rolesQuery.isLoading || rolesQuery.isError || !roles.length
                }
                onClick={() => setRoleUser(row.original)}
              >
                <Users /> Ubah Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const openCreate = () => {
    if (rolesQuery.isError) {
      toast.error(errorMessage(rolesQuery.error));
      return;
    }
    if (!roles.length) {
      toast.error("Tidak ada role yang tersedia");
      return;
    }
    setCreateOpen(true);
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Manajemen User</h2>
          <p className="text-sm text-muted-foreground">
            Kelola akun pengguna dan role yang ditetapkan.
          </p>
        </div>
        <Button
          onClick={openCreate}
          disabled={rolesQuery.isLoading || rolesQuery.isError || !roles.length}
        >
          <Plus /> Tambah Akun
        </Button>
      </div>

      {rolesQuery.isError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
          <p className="text-destructive">Gagal memuat daftar role.</p>
          <Button
            variant="outline"
            onClick={() => void rolesQuery.refetch()}
            disabled={rolesQuery.isFetching}
          >
            Coba lagi
          </Button>
        </div>
      )}
      {rolesQuery.isLoading && (
        <p className="text-sm text-muted-foreground">Memuat daftar role…</p>
      )}
      {!rolesQuery.isLoading && !rolesQuery.isError && !roles.length && (
        <p className="rounded-lg border p-3 text-sm text-muted-foreground">
          Belum ada role. Akun tidak dapat dibuat atau diubah rolenya.
        </p>
      )}
      {usersQuery.isError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
          <p className="text-destructive">Gagal memuat daftar akun.</p>
          <Button
            variant="outline"
            onClick={() => void usersQuery.refetch()}
            disabled={usersQuery.isFetching}
          >
            Coba lagi
          </Button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={usersQuery.data ?? []}
        isLoading={usersQuery.isLoading}
        isError={usersQuery.isError}
        toolbar={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            {usersQuery.data?.length ?? 0} akun
          </div>
        }
      />

      <UserCreateForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        roles={roles}
      />
      <UserRoleForm
        open={!!roleUser}
        onOpenChange={(open) => !open && setRoleUser(null)}
        user={roleUser}
        roles={roles}
      />
      <UserDetailDialog
        open={!!detailUser}
        onOpenChange={(open) => !open && setDetailUser(null)}
        user={detailUser}
      />
      <UserUsernameForm
        open={!!usernameUser}
        onOpenChange={(open) => !open && setUsernameUser(null)}
        user={usernameUser}
      />
      <UserPasswordResetForm
        open={!!passwordUser}
        onOpenChange={(open) => !open && setPasswordUser(null)}
        user={passwordUser}
      />
    </div>
  );
}
