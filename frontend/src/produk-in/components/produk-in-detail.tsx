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
import type { ProdukIn } from "../types/produkIn.types";

type Props = {
  produkIn: ProdukIn | null;
  onOpenChange: (open: boolean) => void;
};

export function ProdukInDetail({ produkIn, onOpenChange }: Props) {
  return (
    <Modal
      open={!!produkIn}
      onOpenChange={onOpenChange}
      title={`Detail Produk Masuk${produkIn ? ` #${produkIn.id_produk_in}` : ""}`}
      className="sm:max-w-5xl"
    >
      {produkIn && (
        <div className="grid gap-5">
          <dl className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">ID Produk In</dt>
              <dd className="font-medium">{produkIn.id_produk_in}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Tanggal</dt>
              <dd className="font-medium">{formatDate(produkIn.tanggal)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Gudang</dt>
              <dd className="font-medium">
                {produkIn.gudang?.nama_gudang ?? "-"}
                {produkIn.gudang?.lokasi ? ` — ${produkIn.gudang.lokasi}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Jenis Transaksi</dt>
              <dd className="font-medium">{produkIn.jenis_transaksi}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Keterangan</dt>
              <dd className="font-medium">{produkIn.keterangan || "-"}</dd>
            </div>
          </dl>

          <section className="grid gap-2">
            <h3 className="font-medium">Detail Barang</h3>
            {!produkIn.detailProdukIn?.length ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada detail barang.
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
                      <TableHead>Tanggal Kedaluwarsa</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produkIn.detailProdukIn.map((detail) => (
                      <TableRow key={detail.id_detail_in}>
                        <TableCell>{detail.id_produk}</TableCell>
                        <TableCell>{detail.produk?.nama_produk ?? "-"}</TableCell>
                        <TableCell>{detail.id_batch}</TableCell>
                        <TableCell>{detail.batch?.kode_batch ?? "-"}</TableCell>
                        <TableCell>
                          {formatDate(detail.batch?.expired_date)}
                        </TableCell>
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
