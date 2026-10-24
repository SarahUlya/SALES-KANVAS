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
import { formatRupiah } from "@/lib/format";
import {
  useDeleteProdukHarga,
  useProdukHargaList,
} from "../hooks/useProdukHarga";
import type { ProdukHarga } from "../types/produkHarga.types";
import { ProdukHargaForm } from "./produk-harga-form";

export function ProdukHargaPage() {
  const { data = [], isLoading, isError } = useProdukHargaList();
  const remove = useDeleteProdukHarga();
  const canWrite = usePermission()("produk-harga:write");

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProdukHarga | null>(null);
  const [deleting, setDeleting] = useState<ProdukHarga | null>(null);

  const openForm = (row: ProdukHarga | null) => {
    setEditing(row);
    setFormOpen(true);
  };

  const columns: ColumnDef<ProdukHarga>[] = [
    {
      accessorKey: "produk.nama_produk",
      header: "Produk",
      cell: ({ row }) => row.original.produk?.nama_produk ?? "-",
    },
    {
      accessorKey: "tipeHarga.nama_tipe",
      header: "Tipe Harga",
      cell: ({ row }) => row.original.tipeHarga?.nama_tipe ?? "-",
    },
    {
      accessorKey: "harga",
      header: "Harga",
      cell: ({ row }) => formatRupiah(row.original.harga),
    },
    ...(canWrite
      ? [
          {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
              <RowActions
                onEdit={() => openForm(row.original)}
                onDelete={() => setDeleting(row.original)}
              />
            ),
          } satisfies ColumnDef<ProdukHarga>,
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
              placeholder="Cari produk atau tipe harga…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {canWrite && (
              <Button className="ml-auto" onClick={() => openForm(null)}>
                <Plus /> Tambah
              </Button>
            )}
          </>
        }
      />

      <ProdukHargaForm
        key={editing?.id_produk_harga ?? "new"}
        open={formOpen}
        onOpenChange={setFormOpen}
        produkHarga={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Hapus harga produk?"
        description={`${deleting?.produk?.nama_produk ?? "Harga produk ini"} — ${deleting?.tipeHarga?.nama_tipe ?? ""} akan dihapus.`}
        isPending={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id_produk_harga, {
            onSuccess: () => {
              toast.success("Harga produk dihapus");
              setDeleting(null);
            },
            onError: (error) => toast.error(errorMessage(error)),
          })
        }
      />
    </>
  );
}
