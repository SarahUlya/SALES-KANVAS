import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { RowActions } from "@/components/shared/row-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { errorMessage } from "@/lib/errors";
import { useDeleteRole, useRoles } from "../hooks/useRoles";
import type { Role, RolePermission } from "../types/role.types";
import { RoleForm } from "./role-form";
import { RolePermissionsForm } from "./role-permissions-form";

type PermissionGroup = {
  resource: string;
  label: string;
  permissions: RolePermission[];
};

function isSuperAdmin(roleName: string) {
  const normalizedName = roleName.trim().toLowerCase();
  return normalizedName === "super admin" || normalizedName === "superadmin";
}

function groupPermissions(permissions: RolePermission[]): PermissionGroup[] {
  const groups = new Map<string, RolePermission[]>();

  for (const permission of permissions) {
    const [resource] = permission.name.split(":");
    const key = resource || permission.name;
    const group = groups.get(key) ?? [];
    group.push(permission);
    groups.set(key, group);
  }

  return [...groups.entries()]
    .map(([resource, items]) => ({
      resource,
      label: resource
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      permissions: items,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function PermissionBadges({
  permissions,
  compact = false,
}: {
  permissions: RolePermission[];
  compact?: boolean;
}) {
  const actions = [...new Set(
    permissions.map(({ name }) => name.split(":").slice(1).join(":") || "akses"),
  )];

  return (
    <div className="flex flex-wrap gap-1">
      {actions.map((action) => (
        <Badge
          key={action}
          variant={action === "read" ? "secondary" : "outline"}
          className={
            action === "write"
              ? "border-primary/20 bg-primary/5 text-primary"
              : undefined
          }
        >
          {compact
            ? action === "read"
              ? "Baca"
              : action === "write"
                ? "Ubah"
                : action
            : action}
        </Badge>
      ))}
    </div>
  );
}

export function RolesPage() {
  const rolesQuery = useRoles();
  const remove = useDeleteRole();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [permissionsRole, setPermissionsRole] = useState<Role | null>(null);
  const [permissionDetailsRole, setPermissionDetailsRole] =
    useState<Role | null>(null);
  const [deleting, setDeleting] = useState<Role | null>(null);

  const openForm = (role: Role | null) => {
    if (role && isSuperAdmin(role.name)) return;
    setEditing(role);
    setFormOpen(true);
  };

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      size: 220,
      header: "Nama Role",
      cell: ({ row }) => (
        <span className="block truncate font-medium" title={row.original.name}>
          {row.original.name}
        </span>
      ),
    },
    {
      id: "permissions",
      size: 520,
      header: "Permissions",
      cell: ({ row }) => {
        const role = row.original;
        if (isSuperAdmin(role.name)) {
          return (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="size-4" />
              Akses penuh sistem
            </span>
          );
        }

        const groups = groupPermissions(role.permissions);
        const visibleGroups = groups.slice(0, 3);

        if (!groups.length) {
          return <span className="text-sm text-muted-foreground">Belum ada permission</span>;
        }

        return (
          <div className="flex min-w-0 flex-wrap items-center gap-2 whitespace-normal">
            {visibleGroups.map((group) => (
              <div
                key={group.resource}
                className="inline-flex min-w-0 items-center gap-1.5 rounded-md border bg-background px-2 py-1"
              >
                <span className="max-w-32 truncate text-xs font-medium">
                  {group.label}
                </span>
                <PermissionBadges permissions={group.permissions} compact />
              </div>
            ))}
            {groups.length > visibleGroups.length && (
              <Button
                variant="link"
                size="sm"
                className="h-auto px-1 py-1 text-xs"
                onClick={() => setPermissionDetailsRole(role)}
              >
                +{groups.length - visibleGroups.length} modul
              </Button>
            )}
            {groups.length <= visibleGroups.length &&
              role.permissions.length > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto px-1 py-1 text-xs"
                  onClick={() => setPermissionDetailsRole(role)}
                >
                  Lihat semua
                </Button>
              )}
          </div>
        );
      },
    },
    {
      id: "actions",
      size: 200,
      header: "Aksi",
      cell: ({ row }) => {
        const role = row.original;
        if (isSuperAdmin(role.name)) return null;

        return (
          <div className="flex justify-end gap-1">
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => setPermissionsRole(role)}
            >
              Permission
            </Button>

            <RowActions
              onEdit={() => openForm(role)}
              onDelete={() => setDeleting(role)}
            />
          </div>
        );
      },
    },
  ];

  const confirmDelete = () => {
    if (!deleting || isSuperAdmin(deleting.name)) return;

    remove.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Role dihapus");
        setDeleting(null);
      },
      onError: (error) => toast.error(errorMessage(error)),
    });
  };

  return (
    <div className="grid min-w-0 gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Manajemen Role &amp; Permission
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola role dan permission yang diberikan kepada setiap role.
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => openForm(null)}>
          <Plus /> Tambah Role
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

      <DataTable
        columns={columns}
        data={rolesQuery.data ?? []}
        isLoading={rolesQuery.isLoading}
        isError={rolesQuery.isError}
        tableClassName="table-fixed"
        toolbar={
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4" />
              <span>
                {rolesQuery.data?.length ?? 0}{" "}
                {(rolesQuery.data?.length ?? 0) === 1 ? "role" : "role"}
              </span>
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Baca dan ubah ditampilkan per modul
            </p>
          </div>
        }
      />

      <Dialog
        open={!!permissionDetailsRole}
        onOpenChange={(open) => !open && setPermissionDetailsRole(null)}
      >
        <DialogContent className="max-h-[90svh] gap-5 overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Permission — {permissionDetailsRole?.name}
            </DialogTitle>
            <DialogDescription>
              {permissionDetailsRole
                ? (() => {
                    const groups = groupPermissions(
                      permissionDetailsRole.permissions,
                    );
                    return `${groups.length} modul · ${permissionDetailsRole.permissions.length} permission`;
                  })()
                : "Daftar permission berdasarkan modul."}
            </DialogDescription>
          </DialogHeader>
          {permissionDetailsRole &&
            (() => {
              const groups = groupPermissions(
                permissionDetailsRole.permissions,
              );
              return groups.length ? (
                <div className="grid max-h-[60svh] gap-3 overflow-y-auto sm:grid-cols-2">
                  {groups.map((group) => (
                    <section
                      key={group.resource}
                      className="min-w-0 rounded-lg border p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-medium">
                          {group.label}
                        </h3>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {group.permissions.length}{" "}
                          {group.permissions.length === 1
                            ? "permission"
                            : "permission"}
                        </span>
                      </div>
                      <div className="grid gap-2">
                        {group.permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex min-w-0 items-center justify-between gap-2 text-sm"
                          >
                            <span className="min-w-0 truncate text-muted-foreground">
                              {permission.name}
                            </span>
                            <PermissionBadges
                              permissions={[permission]}
                              compact
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Role ini belum memiliki permission.
                </p>
              );
            })()}
        </DialogContent>
      </Dialog>

      <RoleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        role={editing}
      />
      <RolePermissionsForm
        open={!!permissionsRole}
        onOpenChange={(open) => !open && setPermissionsRole(null)}
        role={permissionsRole}
      />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Hapus role?"
        description={`Role "${deleting?.name}" akan dihapus. Role yang masih digunakan user tidak dapat dihapus.`}
        isPending={remove.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
