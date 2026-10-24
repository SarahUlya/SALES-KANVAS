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
import { formatDate } from "@/lib/format";
import {
  useDeleteProdukIn,
  useProdukInList,
} from "../hooks/useProdukIn";
import type { ProdukIn } from "../types/produkIn.types";
import { ProdukInDetail } from "./produk-in-detail";
import { ProdukInForm } from "./produk-in-form";

export function ProdukInPage() {
  const { data = [], isLoading, isError } = useProdukInList();
  const remove = useDeleteProdukIn();
  const canWrite = usePermission()("produk-in:write");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<ProdukIn | null>(null);
  const [editing, setEditing] = useState<ProdukIn | null>(null);
  const [deleting, setDeleting] = useState<ProdukIn | null>(null);

  const columns: ColumnDef<ProdukIn>[] = [
    { accessorKey: "id_produk_in", header: "ID Produk In" },
    {
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: ({ row }) => formatDate(row.original.tanggal),
    },
    {
      accessorKey: "gudang.nama_gudang",
      header: "Gudang",
      cell: ({ row }) => row.original.gudang?.nama_gudang ?? "-",
    },
    { accessorKey: "jenis_transaksi", header: "Jenis Transaksi" },
    {
      accessorKey: "keterangan",
      header: "Keterangan",
      cell: ({ row }) => row.original.keterangan || "-",
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
              placeholder="Cari produk masuk…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {canWrite && (
              <Button
                className="ml-auto"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus /> Tambah
              </Button>
            )}
          </>
        }
      />

      <ProdukInForm
        key={`${editing?.id_produk_in ?? "new"}-${formOpen}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        produkIn={editing}
      />
      <ProdukInDetail
        produkIn={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Hapus Produk Masuk?"
        description={`Transaksi Produk In #${deleting?.id_produk_in ?? ""} akan dihapus.`}
        isPending={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id_produk_in, {
            onSuccess: () => {
              toast.success("Produk masuk dihapus");
              setDeleting(null);
            },
            onError: (error) => toast.error(errorMessage(error)),
          })
        }
      />
    </>
  );
}
