import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { usePermission } from "@/auth/hooks/usePermission";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { RowActions } from "@/components/shared/row-actions";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/errors";
import {
  useDeleteGudang,
  useGudangList,
} from "../hooks/useGudang";
import type { Gudang } from "../types/gudang.types";
import { GudangForm } from "./gudang-form";

export function GudangPage() {
  const { data = [], isLoading, isError } = useGudangList();
  const remove = useDeleteGudang();
  const canWrite = usePermission()("gudang:write");

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Gudang | null>(null);
  const [deleting, setDeleting] = useState<Gudang | null>(null);

  const openForm = (row: Gudang | null) => {
    setEditing(row);
    setFormOpen(true);
  };

  const columns: ColumnDef<Gudang>[] = [
    {
      accessorKey: "nama_gudang",
      header: "Nama Gudang",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nama_gudang}</span>
      ),
    },
    {
      accessorKey: "lokasi",
      header: "Lokasi",
      cell: ({ row }) => row.original.lokasi || "-",
    },
    ...(canWrite
      ? [
          {
            id: "actions",
            cell: ({ row }) => (
              <RowActions
                onEdit={() => openForm(row.original)}
                onDelete={() => setDeleting(row.original)}
              />
            ),
          } satisfies ColumnDef<Gudang>,
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
              placeholder="Cari gudang…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {canWrite && (
              <Button className="ml-auto" onClick={() => openForm(null)}>
                <Plus /> Tambah
              </Button>
            )}
          </>
        }
      />

      <GudangForm
        open={formOpen}
        onOpenChange={setFormOpen}
        gudang={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(isOpen) => !isOpen && setDeleting(null)}
        title="Hapus gudang?"
        description={`"${deleting?.nama_gudang}" akan dihapus.`}
        isPending={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id_gudang, {
            onSuccess: () => {
              toast.success("Gudang dihapus");
              setDeleting(null);
            },
            onError: (err) => toast.error(errorMessage(err)),
          })
        }
      />
    </>
  );
}
