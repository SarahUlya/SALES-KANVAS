import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/shared/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { Retur } from "../types/retur.types";

type Props = {
  retur: Retur | null;
  onOpenChange: (open: boolean) => void;
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 2,
});

function formatMoney(value: string | number | null | undefined) {
  return value == null || value === "" || !Number.isFinite(Number(value))
    ? "-"
    : rupiah.format(Number(value));
}

export function ReturDetail({ retur, onOpenChange }: Props) {
  return (
    <Modal
      open={!!retur}
      onOpenChange={onOpenChange}
      title={`Detail Retur${retur ? ` #${retur.id_retur}` : ""}`}
      className="sm:max-w-5xl"
    >
      {retur && (
        <div className="grid gap-5">
          <dl className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">ID Retur</dt>
              <dd className="font-medium">{retur.id_retur}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Tanggal</dt>
              <dd className="font-medium">{formatDate(retur.tanggal)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">ID Invoice</dt>
              <dd className="font-medium">{retur.id_invoice}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status Retur</dt>
              <dd>
                <Badge variant="outline">{retur.status}</Badge>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Alasan Retur</dt>
              <dd className="font-medium">{retur.alasan || "-"}</dd>
            </div>
            {retur.invoice && (
              <>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Tanggal Invoice
                  </dt>
                  <dd className="font-medium">
                    {formatDate(retur.invoice.tanggal)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Status Invoice
                  </dt>
                  <dd>
                    <Badge variant="outline">{retur.invoice.status}</Badge>
                  </dd>
                </div>
              </>
            )}
          </dl>

          <section className="grid gap-2">
            <h3 className="font-medium">Detail Produk Retur</h3>
            {!retur.detailRetur?.length ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada detail produk pada retur ini.
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Produk</TableHead>
                      <TableHead>Nama Produk</TableHead>
                      <TableHead>ID Batch</TableHead>
                      <TableHead>Kode Batch</TableHead>
                      <TableHead className="text-right">Qty Retur</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead>Satuan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {retur.detailRetur.map((detail) => (
                      <TableRow key={detail.id_detail_retur}>
                        <TableCell>{detail.id_produk}</TableCell>
                        <TableCell>{detail.produk?.nama_produk ?? "-"}</TableCell>
                        <TableCell>{detail.id_batch}</TableCell>
                        <TableCell>{detail.batch?.kode_batch ?? "-"}</TableCell>
                        <TableCell className="text-right">{detail.qty}</TableCell>
                        <TableCell className="text-right">
                          {formatMoney(detail.harga)}
                        </TableCell>
                        <TableCell>{detail.produk?.satuan ?? "-"}</TableCell>
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
