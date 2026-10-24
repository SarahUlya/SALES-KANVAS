import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { useProducts } from "@/master/product/hooks/useProduct";
import { useKasbonProdukDetail } from "../hooks/useKasbonProduk";
import type { KasbonProduk } from "../types/kasbonProduk.types";
import { Modal } from "@/components/shared/modal";

type Props = {
  kasbon: KasbonProduk | null;
  onOpenChange: (open: boolean) => void;
};

export function KasbonProdukDetailModal({ kasbon, onOpenChange }: Props) {
  const hasListDetails = kasbon?.detailKasbonProduk !== undefined;
  const detailQuery = useKasbonProdukDetail(
    kasbon?.id_kasbon_produk ?? 0,
    !!kasbon && !hasListDetails,
  );
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts();
  const transaction = hasListDetails ? kasbon : detailQuery.data ?? kasbon;
  const details = transaction?.detailKasbonProduk;
  const productNames = new Map(
    products.map((product) => [product.id_produk, product.nama_produk]),
  );
  const needsProductLookup =
    details?.some((detail) => !detail.produk?.nama_produk) ?? false;

  return (
    <Modal
      open={!!kasbon}
      onOpenChange={onOpenChange}
      title={`Detail Kasbon Produk${kasbon ? ` #${kasbon.id_kasbon_produk}` : ""}`}
      className="sm:max-w-2xl"
    >
      {transaction && (
        <div className="grid gap-5">
          <dl className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">ID Kasbon Produk</dt>
              <dd className="font-medium">{transaction.id_kasbon_produk}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Karyawan</dt>
              <dd className="font-medium">
                {transaction.karyawan?.nama ?? "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Tanggal</dt>
              <dd className="font-medium">{formatDate(transaction.tanggal)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd>
                <Badge variant="outline">{transaction.status}</Badge>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Keterangan</dt>
              <dd className="font-medium">{transaction.keterangan || "-"}</dd>
            </div>
          </dl>

          <section className="grid gap-2">
            <h3 className="font-medium">Rincian Produk</h3>
            {detailQuery.isLoading && !hasListDetails ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Memuat rincian produk…
              </p>
            ) : detailQuery.isError && !hasListDetails ? (
              <div className="grid justify-items-center gap-2 py-6 text-center">
                <p className="text-sm text-destructive">
                  Gagal memuat rincian produk.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void detailQuery.refetch()}
                >
                  Coba lagi
                </Button>
              </div>
            ) : !details?.length ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada rincian produk.
              </p>
            ) : (
              <>
                {needsProductLookup && productsLoading && (
                  <p className="text-sm text-muted-foreground">
                    Memuat nama produk…
                  </p>
                )}
                {needsProductLookup && productsError && (
                  <p className="text-sm text-destructive">
                    Nama produk tidak dapat dimuat. ID produk tetap ditampilkan.
                  </p>
                )}
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead>ID Produk</TableHead>
                        <TableHead className="text-right">Kuantitas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {details.map((detail) => (
                        <TableRow key={detail.id_detail_kasbon}>
                          <TableCell>
                            {detail.produk?.nama_produk ??
                              productNames.get(detail.id_produk) ??
                              `ID ${detail.id_produk}`}
                          </TableCell>
                          <TableCell>{detail.id_produk}</TableCell>
                          <TableCell className="text-right">
                            {detail.qty}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </Modal>
  );
}
