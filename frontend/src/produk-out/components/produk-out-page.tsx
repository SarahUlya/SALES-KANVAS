import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { usePermission } from "@/auth/hooks/usePermission";
import { DataTable } from "@/components/shared/data-table";
import { RowActions } from "@/components/shared/row-actions";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { useProdukOutList } from "../hooks/useProdukOut";
import type { ProdukOut } from "../types/produkOut.types";
import { ProdukOutDetail } from "./produk-out-detail";
import { ProdukOutForm } from "./produk-out-form";

export function ProdukOutPage() {
  const { data = [], isLoading, isError } = useProdukOutList();
  const canWrite = usePermission()("produk-out:write");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<ProdukOut | null>(null);
  const [editing, setEditing] = useState<ProdukOut | null>(null);

  const columns: ColumnDef<ProdukOut>[] = [
    { accessorKey: "id_produk_out", header: "ID Produk Out" },
    {
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: ({ row }) => formatDate(row.original.tanggal),
    },
    { accessorKey: "id_rencana", header: "ID Rencana Kanvas" },
    {
      accessorKey: "gudang.nama_gudang",
      header: "Gudang",
      cell: ({ row }) => row.original.gudang?.nama_gudang ?? "-",
    },
    { accessorKey: "status", header: "Status" },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <RowActions
          onView={() => setSelected(row.original)}
          {...(canWrite && { onEdit: () => {
            setEditing(row.original);
            setFormOpen(true);
          } })}
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
              placeholder="Cari produk keluar…"
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

      <ProdukOutForm
        key={`${editing?.id_produk_out ?? "new"}-${formOpen}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        produkOut={editing}
      />
      <ProdukOutDetail
        produkOut={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  );
}
