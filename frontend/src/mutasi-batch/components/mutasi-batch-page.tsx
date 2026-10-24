import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { RowActions } from "@/components/shared/row-actions";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { useMutasiBatch } from "../hooks/useMutasiBatch";
import type { MutasiBatch } from "../types/mutasiBatch.types";
import { MutasiBatchDetail } from "./mutasi-batch-detail";

export function MutasiBatchPage() {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMutasiBatch();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MutasiBatch | null>(null);

  const columns: ColumnDef<MutasiBatch>[] = [
    { accessorKey: "id_mutasi", header: "ID Mutasi" },
    {
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: ({ row }) => formatDate(row.original.tanggal),
    },
    {
      accessorKey: "produk.nama_produk",
      header: "Nama Produk",
      cell: ({ row }) => row.original.produk?.nama_produk ?? "-",
    },
    {
      accessorKey: "batch.kode_batch",
      header: "Kode Batch",
      cell: ({ row }) => row.original.batch?.kode_batch ?? "-",
    },
    {
      accessorKey: "gudang.nama_gudang",
      header: "Gudang",
      cell: ({ row }) => row.original.gudang?.nama_gudang ?? "-",
    },
    {
      accessorKey: "stok_masuk",
      header: "Stok Masuk",
      cell: ({ row }) => (
        <Badge variant="secondary">
          +{row.original.stok_masuk} {row.original.produk?.satuan ?? ""}
        </Badge>
      ),
    },
    {
      accessorKey: "stok_keluar",
      header: "Stok Keluar",
      cell: ({ row }) => (
        <Badge variant="outline">
          -{row.original.stok_keluar} {row.original.produk?.satuan ?? ""}
        </Badge>
      ),
    },
    {
      id: "satuan",
      header: "Satuan",
      cell: ({ row }) => row.original.produk?.satuan ?? "-",
    },
    {
      accessorKey: "keterangan",
      header: "Keterangan",
      cell: ({ row }) => row.original.keterangan || "-",
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <RowActions onView={() => setSelected(row.original)} />
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Mutasi Batch</h1>
          <p className="text-sm text-muted-foreground">
            Riwayat pergerakan stok produk.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={isFetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        globalFilter={search}
        toolbar={
          <SearchInput
            placeholder="Cari mutasi, produk, batch, atau gudang…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
      />

      <MutasiBatchDetail
        mutasi={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  );
}
