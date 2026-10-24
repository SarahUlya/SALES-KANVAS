import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { usePermission } from "@/auth/hooks/usePermission";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { RowActions } from "@/components/shared/row-actions";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/errors";
import { formatDate } from "@/lib/format";
import {
  useDeleteRetur,
  useReturList,
} from "../hooks/useRetur";
import type { Retur } from "../types/retur.types";
import { ReturDetail } from "./retur-detail";
import { ReturForm } from "./retur-form";

export function ReturPage() {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useReturList();
  const remove = useDeleteRetur();
  const canWrite = usePermission()("retur:write");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Retur | null>(null);
  const [editing, setEditing] = useState<Retur | null>(null);
  const [deleting, setDeleting] = useState<Retur | null>(null);

  const columns: ColumnDef<Retur>[] = [
    { accessorKey: "id_retur", header: "ID Retur" },
    {
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: ({ row }) => formatDate(row.original.tanggal),
    },
    { accessorKey: "id_invoice", header: "ID Invoice" },
    {
      accessorKey: "alasan",
      header: "Alasan",
      cell: ({ row }) => row.original.alasan || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <RowActions
          onView={() => setSelected(row.original)}
          {...(canWrite
            ? {
                onEdit: () => {
                  setEditing(row.original);
                  setFormOpen(true);
                },
                onDelete: () => setDeleting(row.original),
              }
            : {})}
        />
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Retur Produk</h1>
          <p className="text-sm text-muted-foreground">
            Daftar retur produk dari invoice penjualan.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={isFetching ? "animate-spin" : ""} />
            Refresh
          </Button>
          {canWrite && (
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus /> Tambah Retur
            </Button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        globalFilter={search}
        toolbar={
          <SearchInput
            placeholder="Cari retur…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
      />

      <ReturForm
        key={`${editing?.id_retur ?? "new"}-${formOpen}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        retur={editing}
      />
      <ReturDetail
        retur={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Hapus retur?"
        description={`Retur #${deleting?.id_retur ?? ""} akan dihapus.`}
        isPending={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id_retur, {
            onSuccess: () => {
              toast.success("Retur berhasil dihapus");
              setDeleting(null);
            },
            onError: (error) => toast.error(errorMessage(error)),
          })
        }
      />
    </div>
  );
}
