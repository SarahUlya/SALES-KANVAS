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
  useDeletePembayaranInvoice,
  usePembayaranInvoiceList,
} from "../hooks/usePembayaranInvoice";
import type { PembayaranInvoice } from "../types/pembayaranInvoice.types";
import { PembayaranInvoiceDetail } from "./pembayaran-invoice-detail";
import { PembayaranInvoiceForm } from "./pembayaran-invoice-form";

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

export function PembayaranInvoicePage() {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = usePembayaranInvoiceList();
  const remove = useDeletePembayaranInvoice();
  const canWrite = usePermission()("pembayaran-invoice:write");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<PembayaranInvoice | null>(null);
  const [editing, setEditing] = useState<PembayaranInvoice | null>(null);
  const [deleting, setDeleting] = useState<PembayaranInvoice | null>(null);

  const columns: ColumnDef<PembayaranInvoice>[] = [
    { accessorKey: "id_pembayaran", header: "ID Pembayaran" },
    {
      accessorKey: "tanggal",
      header: "Tanggal Pembayaran",
      cell: ({ row }) => formatDate(row.original.tanggal),
    },
    { accessorKey: "id_invoice", header: "ID Invoice" },
    {
      id: "invoice_date",
      header: "Tanggal Invoice",
      cell: ({ row }) => formatDate(row.original.invoice?.tanggal),
    },
    {
      id: "invoice_total",
      header: "Total Invoice",
      cell: ({ row }) => formatMoney(row.original.invoice?.total),
    },
    {
      accessorKey: "jumlah",
      header: "Jumlah Pembayaran",
      cell: ({ row }) => formatMoney(row.original.jumlah),
    },
    { accessorKey: "metode", header: "Metode Pembayaran" },
    {
      id: "invoice_status",
      header: "Status Invoice",
      cell: ({ row }) =>
        row.original.invoice ? (
          <Badge variant="outline">{row.original.invoice.status}</Badge>
        ) : (
          "-"
        ),
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
          <h1 className="text-2xl font-semibold">Pembayaran Invoice</h1>
          <p className="text-sm text-muted-foreground">
            Riwayat pembayaran invoice penjualan.
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
              <Plus /> Tambah Pembayaran
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
            placeholder="Cari pembayaran atau invoice…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
      />

      <PembayaranInvoiceForm
        key={`${editing?.id_pembayaran ?? "new"}-${formOpen}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        pembayaran={editing}
      />
      <PembayaranInvoiceDetail
        pembayaran={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Hapus pembayaran invoice?"
        description={`Pembayaran #${deleting?.id_pembayaran ?? ""} akan dihapus.`}
        isPending={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id_pembayaran, {
            onSuccess: () => {
              toast.success("Pembayaran invoice berhasil dihapus");
              setDeleting(null);
            },
            onError: (error) => toast.error(errorMessage(error)),
          })
        }
      />
    </div>
  );
}
