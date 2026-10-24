import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/data-table";
import { SearchInput } from "@/components/shared/search-input";
import { usePermission } from "@/auth/hooks/usePermission";
import {
  useAvailableEmployeeUsers,
  useEmployees,
} from "../hooks/useEmployee";
import type { Employee } from "../types/employee.types";
import { EmployeeForm } from "./employee-form";
import { RowActions } from "@/components/shared/row-actions";

export function EmployeePage() {
  const { data = [], isLoading, isError } = useEmployees();
  const canWrite = usePermission()("employee:write");
  const usersQuery = useAvailableEmployeeUsers(canWrite);

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const openForm = (row: Employee | null) => {
    setEditing(row);
    setFormOpen(true);
  };

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "id_karyawan",
      header: "ID Karyawan",
    },
    {
      accessorKey: "nama",
      header: "Nama",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nama}</span>
      ),
    },
    {
      accessorKey: "no_hp",
      header: "Kontak",
      cell: ({ row }) => row.original.no_hp ?? "-",
    },
    {
      id: "user",
      header: "Akun User",
      cell: ({ row }) => row.original.user?.username ?? "Akun tidak ditemukan",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.status ?? "-"}</span>
      ),
    },
    {
      id: "user-relation",
      header: "Relasi Akun",
      cell: ({ row }) =>
        row.original.user ? "Terhubung" : "Akun tidak ditemukan",
    },
    ...(canWrite
      ? [
          {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
              <div className="flex justify-end">
                <RowActions onEdit={() => openForm(row.original)} />
              </div>
            ),
          } satisfies ColumnDef<Employee>,
        ]
      : []),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        globalFilter={search}
        toolbar={
          <>
            <SearchInput
              placeholder="Cari ID / nama / akun / kontak…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {canWrite && usersQuery.isError && (
              <p className="text-sm text-destructive">
                Gagal memuat akun User. Tambah Karyawan tidak tersedia.
              </p>
            )}
            {canWrite && (
              <Button
                className="ml-auto"
                onClick={() => openForm(null)}
                disabled={
                  usersQuery.isLoading ||
                  usersQuery.isError ||
                  !(usersQuery.data ?? []).length
                }
              >
                <Plus /> Tambah
              </Button>
            )}
          </>
        }
      />

      {canWrite &&
        !usersQuery.isLoading &&
        !usersQuery.isError &&
        !(usersQuery.data ?? []).length && (
          <p className="text-sm text-muted-foreground">
            Tidak ada akun User yang belum terhubung ke Karyawan.
          </p>
        )}

      <EmployeeForm
        key={editing?.id_karyawan ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        employee={editing}
        users={usersQuery.data ?? []}
        usersLoading={usersQuery.isLoading}
        usersError={usersQuery.isError}
        onRetryUsers={() => void usersQuery.refetch()}
      />
    </>
  );
}
