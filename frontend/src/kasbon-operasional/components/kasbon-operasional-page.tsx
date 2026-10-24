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
import { formatDate, formatRupiah } from "@/lib/format";
import {
  useDeleteKasbonOperasional,
  useKasbonOperasional,
} from "../hooks/useKasbonOperasional";
import type { KasbonOperasional } from "../types/kasbonOperasional.types";
import { KasbonOperasionalForm } from "./kasbon-operasional-form";

export function KasbonOperasionalPage() {
  const { data = [], isLoading, isError } = useKasbonOperasional();
  const remove = useDeleteKasbonOperasional();
  const canWrite = usePermission()("kasbon-operasional:write");

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<KasbonOperasional | null>(null);
  const [deleting, setDeleting] = useState<KasbonOperasional | null>(null);

  const openForm = (kasbon: KasbonOperasional | null) => {
    setEditing(kasbon);
    setFormOpen(true);
  };

  const columns: ColumnDef<KasbonOperasional>[] = [
    {
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: ({ row }) => formatDate(row.original.tanggal),
    },
    {
      accessorKey: "karyawan.nama",
      header: "Karyawan",
      cell: ({ row }) => row.original.karyawan?.nama ?? "-",
    },
    {
      accessorKey: "jumlah",
      header: "Jumlah",
      cell: ({ row }) => formatRupiah(row.original.jumlah),
    },
    {
      accessorKey: "keterangan",
      header: "Keterangan",
      cell: ({ row }) => row.original.keterangan || "-",
    },
    { accessorKey: "status", header: "Status" },
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
          } satisfies ColumnDef<KasbonOperasional>,
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
              placeholder="Cari kasbon operasional…"
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

      <KasbonOperasionalForm
        key={editing?.id_kasbon_operasional ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        kasbon={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(isOpen) => !isOpen && setDeleting(null)}
        title="Hapus kasbon operasional?"
        description={`Kasbon tanggal ${formatDate(deleting?.tanggal)} akan dihapus.`}
        isPending={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id_kasbon_operasional, {
            onSuccess: () => {
              toast.success("Kasbon operasional dihapus");
              setDeleting(null);
            },
            onError: (err) => toast.error(errorMessage(err)),
          })
        }
      />
    </>
  );
}
