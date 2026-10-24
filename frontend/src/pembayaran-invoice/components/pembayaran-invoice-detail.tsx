import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/shared/modal";
import { formatDate } from "@/lib/format";
import type { PembayaranInvoice } from "../types/pembayaranInvoice.types";

type Props = {
  pembayaran: PembayaranInvoice | null;
  onOpenChange: (open: boolean) => void;
};

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

export function PembayaranInvoiceDetail({
  pembayaran,
  onOpenChange,
}: Props) {
  return (
    <Modal
      open={!!pembayaran}
      onOpenChange={onOpenChange}
      title={`Detail Pembayaran${pembayaran ? ` #${pembayaran.id_pembayaran}` : ""}`}
      className="sm:max-w-2xl"
    >
      {pembayaran && (
        <dl className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">ID Pembayaran</dt>
            <dd className="font-medium">{pembayaran.id_pembayaran}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">
              Tanggal Pembayaran
            </dt>
            <dd className="font-medium">{formatDate(pembayaran.tanggal)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">ID Invoice</dt>
            <dd className="font-medium">{pembayaran.id_invoice}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Tanggal Invoice</dt>
            <dd className="font-medium">
              {formatDate(pembayaran.invoice?.tanggal)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Total Invoice</dt>
            <dd className="font-medium">
              {formatMoney(pembayaran.invoice?.total)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Jumlah Pembayaran</dt>
            <dd className="font-medium">{formatMoney(pembayaran.jumlah)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">
              Metode Pembayaran
            </dt>
            <dd className="font-medium">{pembayaran.metode}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Status Invoice</dt>
            <dd>
              {pembayaran.invoice ? (
                <Badge variant="outline">{pembayaran.invoice.status}</Badge>
              ) : (
                "-"
              )}
            </dd>
          </div>
        </dl>
      )}
    </Modal>
  );
}
