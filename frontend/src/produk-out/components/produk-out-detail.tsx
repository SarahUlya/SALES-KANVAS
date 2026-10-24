import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Modal } from "@/components/shared/modal";
import { formatDate } from "@/lib/format";
import type { ProdukOut } from "../types/produkOut.types";

type Props = {
  produkOut: ProdukOut | null;
  onOpenChange: (open: boolean) => void;
};

export function ProdukOutDetail({ produkOut, onOpenChange }: Props) {
  return (
    <Modal
      open={!!produkOut}
      onOpenChange={onOpenChange}
      title={`Detail Produk Keluar${produkOut ? ` #${produkOut.id_produk_out}` : ""}`}
      className="sm:max-w-4xl"
    >
      {produkOut && (
        <div className="grid gap-5">
          <dl className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">ID Produk Out</dt>
              <dd className="font-medium">{produkOut.id_produk_out}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Tanggal</dt>
              <dd className="font-medium">{formatDate(produkOut.tanggal)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">ID Rencana Kanvas</dt>
              <dd className="font-medium">{produkOut.id_rencana}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Gudang</dt>
              <dd className="font-medium">
                {produkOut.gudang?.nama_gudang ?? "-"}
                {produkOut.gudang?.lokasi ? ` — ${produkOut.gudang.lokasi}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd>
                <Badge variant="outline">{produkOut.status}</Badge>
              </dd>
            </div>
          </dl>

          <section className="grid gap-2">
            <h3 className="font-medium">Detail Produk</h3>
            {!produkOut.detailProdukOut.length ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada detail produk keluar.
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Produk</TableHead>
                      <TableHead>ID Produk</TableHead>
                      <TableHead>Kode Batch</TableHead>
                      <TableHead>Tanggal Kedaluwarsa</TableHead>
                      <TableHead className="text-right">Qty Keluar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produkOut.detailProdukOut.map((detail) => (
                      <TableRow key={detail.id_detail_out}>
                        <TableCell>{detail.produk.nama_produk}</TableCell>
                        <TableCell>{detail.id_produk}</TableCell>
                        <TableCell>{detail.batch.kode_batch ?? "-"}</TableCell>
                        <TableCell>{formatDate(detail.batch.expired_date)}</TableCell>
                        <TableCell className="text-right">{detail.qty}</TableCell>
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
