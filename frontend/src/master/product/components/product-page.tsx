import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { RowActions } from "@/components/shared/row-actions";
import { SearchInput } from "@/components/shared/search-input";
import { usePermission } from "@/auth/hooks/usePermission";
import { errorMessage } from "@/lib/errors";
import { useDeleteProduct, useProducts } from "../hooks/useProduct";
import type { Product } from "../types/product.types";
import { ProductForm } from "./product-form";

export function ProductPage() {
  const { data = [], isLoading, isError } = useProducts();
  const remove = useDeleteProduct();
  const canWrite = usePermission()("produk:write");

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const openForm = (row: Product | null) => {
    setEditing(row);
    setFormOpen(true);
  };


  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "id_produk",
      header: "ID",
    },
    {
      accessorKey: "nama_produk",
      header: "Nama Produk",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.nama_produk}
        </span>
      ),
    },
    {
      accessorKey: "barcode",
      header: "Barcode",
      cell: ({ row }) => row.original.barcode || "-",
    },
    {
      accessorKey: "satuan",
      header: "Satuan",
      cell: ({ row }) => row.original.satuan || "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.status || "-"}
        </Badge>
      ),
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
        } satisfies ColumnDef<Product>,
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
              placeholder="Cari kode / nama / barcode…"
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

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus produk?"
        description={`"${deleting?.nama_produk}" akan dihapus. Produk yang sudah dipakai plan tidak bisa dihapus — nonaktifkan lewat Ubah sebagai gantinya.`} isPending={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id_produk, {
            onSuccess: () => {
              toast.success("Produk dihapus");
              setDeleting(null);
            },
            onError: (err) => toast.error(errorMessage(err)),
          })
        }
      />
    </>
  );
}
