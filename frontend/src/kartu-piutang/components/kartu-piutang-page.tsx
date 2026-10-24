import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus, RefreshCw } from "lucide-react";
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
  useDeleteKartuPiutang,
  useKartuPiutangList,
} from "../hooks/useKartuPiutang";
import type { KartuPiutang } from "../types/kartuPiutang.types";
import { KartuPiutangDetail } from "./kartu-piutang-detail";
import { KartuPiutangForm } from "./kartu-piutang-form";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 2,
});

function formatMoney(value: number | string | null | undefined) {
  return value == null || value === "" || !Number.isFinite(Number(value))
    ? "-"
    : rupiah.format(Number(value));
}

export function KartuPiutangPage() {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useKartuPiutangList();
  const remove = useDeleteKartuPiutang();
  const canWrite = usePermission()("kartu-piutang:write");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<KartuPiutang | null>(null);
  const [editing, setEditing] = useState<KartuPiutang | null>(null);
  const [deleting, setDeleting] = useState<KartuPiutang | null>(null);

  const columns: ColumnDef<KartuPiutang>[] = [
    { accessorKey: "id_piutang", header: "ID Piutang" },
    {
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: ({ row }) => formatDate(row.original.tanggal),
    },
    {
      accessorKey: "outlet.nama_outlet",
      header: "Nama Outlet",
      cell: ({ row }) => row.original.outlet?.nama_outlet ?? "-",
    },
    { accessorKey: "id_invoice", header: "ID Invoice" },
    {
      id: "invoice_total",
      header: "Total Invoice",
      cell: ({ row }) => formatMoney(row.original.invoice?.total),
    },
    {
      accessorKey: "debit",
      header: "Debit",
      cell: ({ row }) => formatMoney(row.original.debit),
    },
    {
      accessorKey: "kredit",
      header: "Kredit",
      cell: ({ row }) => formatMoney(row.original.kredit),
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
          <h1 className="text-2xl font-semibold">Kartu Piutang Outlet</h1>
          <p className="text-sm text-muted-foreground">
            Catatan debit dan kredit piutang per outlet dan invoice.
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
              <Plus /> Tambah Piutang
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
            placeholder="Cari piutang, outlet, atau invoice…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
      />

      <KartuPiutangForm
        key={`${editing?.id_piutang ?? "new"}-${formOpen}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        piutang={editing}
      />
      <KartuPiutangDetail
        piutang={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Hapus kartu piutang?"
        description={`Kartu piutang #${deleting?.id_piutang ?? ""} akan dihapus.`}
        isPending={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id_piutang, {
            onSuccess: () => {
              toast.success("Kartu piutang berhasil dihapus");
              setDeleting(null);
            },
            onError: (error) => toast.error(errorMessage(error)),
          })
        }
      />
    </div>
  );
}
