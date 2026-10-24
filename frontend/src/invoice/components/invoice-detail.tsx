import { Modal } from "@/components/shared/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { Invoice } from "../types/invoice.types";

type Props = {
  invoice: Invoice | null;
  onOpenChange: (open: boolean) => void;
};

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

export function InvoiceDetail({ invoice, onOpenChange }: Props) {
  return (
    <Modal
      open={!!invoice}
      onOpenChange={onOpenChange}
      title={`Detail Invoice${invoice ? ` #${invoice.id_invoice}` : ""}`}
      className="sm:max-w-5xl"
    >
      {invoice && (
        <div className="grid gap-5">
          <dl className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">ID Invoice</dt>
              <dd className="font-medium">{invoice.id_invoice}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Tanggal</dt>
              <dd className="font-medium">{formatDate(invoice.tanggal)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Outlet</dt>
              <dd className="font-medium">
                {invoice.outlet?.nama_outlet ?? "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Alamat Outlet</dt>
              <dd className="font-medium">{invoice.outlet?.alamat || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">No. HP Outlet</dt>
              <dd className="font-medium">{invoice.outlet?.no_hp || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                ID Rencana Kanvas
              </dt>
              <dd className="font-medium">{invoice.id_rencana}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd>
                <Badge variant="outline">{invoice.status}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Total Invoice</dt>
              <dd className="font-semibold">{money(invoice.total)}</dd>
            </div>
          </dl>

          <section className="grid gap-2">
            <h3 className="font-medium">Detail Produk</h3>
            {!invoice.detailInvoice?.length ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada detail produk pada invoice ini.
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Produk</TableHead>
                      <TableHead>Nama Produk</TableHead>
                      <TableHead>Kode Batch</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Harga Satuan</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.detailInvoice.map((detail) => (
                      <TableRow key={detail.id_detail_invoice}>
                        <TableCell>{detail.id_produk}</TableCell>
                        <TableCell>{detail.produk?.nama_produk ?? "-"}</TableCell>
                        <TableCell>{detail.batch?.kode_batch ?? "-"}</TableCell>
                        <TableCell className="text-right">{detail.qty}</TableCell>
                        <TableCell className="text-right">
                          {money(detail.harga)}
                        </TableCell>
                        <TableCell className="text-right">
                          {money(detail.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>
        </div>
      )}
    </Modal>
  );
}
