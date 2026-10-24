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
import { useDeleteInvoice, useInvoiceList } from "../hooks/useInvoice";
import type { Invoice } from "../types/invoice.types";
import { InvoiceDetail } from "./invoice-detail";
import { InvoiceForm } from "./invoice-form";

const invoiceMoney = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 2,
});

function money(value: number | string | null | undefined) {
  if (value == null || value === "" || !Number.isFinite(Number(value))) {
    return "-";
  }
  return invoiceMoney.format(Number(value));
}

export function InvoicePage() {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useInvoiceList();
  const remove = useDeleteInvoice();
  const canWrite = usePermission()("invoice:write");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState<Invoice | null>(null);

  const columns: ColumnDef<Invoice>[] = [
    { accessorKey: "id_invoice", header: "ID Invoice" },
    {
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: ({ row }) => formatDate(row.original.tanggal),
    },
    {
      accessorKey: "outlet.nama_outlet",
      header: "Outlet",
      cell: ({ row }) => row.original.outlet?.nama_outlet ?? "-",
    },
    { accessorKey: "id_rencana", header: "ID Rencana Kanvas" },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => money(row.original.total),
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
          <h1 className="text-2xl font-semibold">Invoice Penjualan</h1>
          <p className="text-sm text-muted-foreground">
            Daftar invoice penjualan ke outlet.
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
              <Plus /> Tambah Invoice
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
            placeholder="Cari invoice atau outlet…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
      />

      <InvoiceForm
        key={`${editing?.id_invoice ?? "new"}-${formOpen}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        invoice={editing}
      />
      <InvoiceDetail
        invoice={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Hapus invoice?"
        description={`Invoice #${deleting?.id_invoice ?? ""} akan dihapus.`}
        isPending={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id_invoice, {
            onSuccess: () => {
              toast.success("Invoice dihapus");
              setDeleting(null);
            },
            onError: (error) => toast.error(errorMessage(error)),
          })
        }
      />
    </div>
  );
}
