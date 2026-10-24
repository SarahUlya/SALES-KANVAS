import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, RefreshCw } from "lucide-react";
import { usePermission } from "@/auth/hooks/usePermission";
import { DataTable } from "@/components/shared/data-table";
import { RowActions } from "@/components/shared/row-actions";
import { SearchInput } from "@/components/shared/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { useBatchProdukList } from "../hooks/useBatchProduk";
import type { BatchProduk } from "../types/batchProduk.types";
import { BatchProdukForm } from "./batch-produk-form";

type ExpiryState = "expired" | "near" | "normal";

function expiryState(value: string | null): ExpiryState {
  if (!value) return "normal";
  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) return "normal";

  const expirationDay = Date.UTC(year, month - 1, day);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const remainingDays = Math.floor((expirationDay - today) / 86_400_000);

  if (remainingDays < 0) return "expired";
  if (remainingDays <= 30) return "near";
  return "normal";
}

export function BatchProdukPage() {
  const { data = [], isLoading, isError, refetch, isFetching } = useBatchProdukList();
  const canWrite = usePermission()("batch-produk:write");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BatchProduk | null>(null);

  const columns: ColumnDef<BatchProduk>[] = [
    { accessorKey: "id_batch", header: "ID Batch" },
    {
      accessorKey: "produk.nama_produk",
      header: "Nama Produk",
      cell: ({ row }) => row.original.produk?.nama_produk ?? "-",
    },
    { accessorKey: "id_produk", header: "ID Produk" },
    {
      accessorKey: "kode_batch",
      header: "Kode Batch",
      cell: ({ row }) => row.original.kode_batch || "-",
    },
    {
      accessorKey: "expired_date",
      header: "Tanggal Kedaluwarsa",
      cell: ({ row }) => {
        const state = expiryState(row.original.expired_date);
        return (
          <div className="flex items-center gap-2">
            <span>{formatDate(row.original.expired_date)}</span>
            {state === "expired" && (
              <Badge variant="destructive">Kedaluwarsa</Badge>
            )}
            {state === "near" && (
              <Badge variant="secondary">Segera kedaluwarsa</Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "stok",
      header: "Stok",
      cell: ({ row }) => (
        <span className="tabular-nums">
          {row.original.stok} {row.original.produk?.satuan ?? ""}
        </span>
      ),
    },
    ...(canWrite
      ? [
          {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
              <RowActions onEdit={() => {
                setEditing(row.original);
                setFormOpen(true);
              }} />
            ),
          } satisfies ColumnDef<BatchProduk>,
        ]
      : []),
  ];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Batch Produk / Stok</h1>
          <p className="text-sm text-muted-foreground">
            Stok aktual per produk dan batch.
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
              <Plus /> Tambah Batch
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
            placeholder="Cari produk atau kode batch…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
      />

      <BatchProdukForm
        key={`${editing?.id_batch ?? "new"}-${formOpen}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        batch={editing}
      />
    </div>
  );
}
