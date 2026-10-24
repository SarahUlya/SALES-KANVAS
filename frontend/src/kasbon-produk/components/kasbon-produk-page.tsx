import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { usePermission } from "@/auth/hooks/usePermission";
import { DataTable } from "@/components/shared/data-table";
import { RowActions } from "@/components/shared/row-actions";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { useKasbonProduk } from "../hooks/useKasbonProduk";
import type { KasbonProduk } from "../types/kasbonProduk.types";
import { KasbonProdukForm } from "./kasbon-produk-form";
import { KasbonProdukDetailModal } from "./kasbon-produk-detail-modal";

export function KasbonProdukPage() {
  const { data = [], isLoading, isError } = useKasbonProduk();
  const canWrite = usePermission()("kasbon-produk:write");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<KasbonProduk | null>(null);

  const columns: ColumnDef<KasbonProduk>[] = [
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
      id: "produk",
      header: "Produk",
      cell: ({ row }) =>
        row.original.detailKasbonProduk
          ?.map(
            (detail) => `ID ${detail.id_produk} (${detail.qty})`,
          )
          .join(", ") ?? "-",
    },
    {
      accessorKey: "keterangan",
      header: "Keterangan",
      cell: ({ row }) => row.original.keterangan || "-",
    },
    { accessorKey: "status", header: "Status" },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <RowActions onView={() => setSelected(row.original)} />
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
              placeholder="Cari kasbon produk…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {canWrite && (
              <Button className="ml-auto" onClick={() => setFormOpen(true)}>
                <Plus /> Tambah
              </Button>
            )}
          </>
        }
      />

      <KasbonProdukForm
        key={formOpen ? "open" : "closed"}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
      <KasbonProdukDetailModal
        kasbon={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  );
}
