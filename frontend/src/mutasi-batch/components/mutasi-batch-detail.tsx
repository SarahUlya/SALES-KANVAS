import { Modal } from "@/components/shared/modal";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { MutasiBatch } from "../types/mutasiBatch.types";

type Props = {
  mutasi: MutasiBatch | null;
  onOpenChange: (open: boolean) => void;
};

export function MutasiBatchDetail({ mutasi, onOpenChange }: Props) {
  return (
    <Modal
      open={!!mutasi}
      onOpenChange={onOpenChange}
      title={`Detail Mutasi${mutasi ? ` #${mutasi.id_mutasi}` : ""}`}
      className="sm:max-w-2xl"
    >
      {mutasi && (
        <dl className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">ID Mutasi</dt>
            <dd className="font-medium">{mutasi.id_mutasi}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Tanggal</dt>
            <dd className="font-medium">{formatDate(mutasi.tanggal)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Produk</dt>
            <dd className="font-medium">
              {mutasi.produk?.nama_produk ?? "-"} (ID {mutasi.id_produk})
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Barcode</dt>
            <dd className="font-medium">{mutasi.produk?.barcode ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Batch</dt>
            <dd className="font-medium">
              {mutasi.batch?.kode_batch ?? "-"} (ID {mutasi.id_batch})
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">
              Tanggal Kedaluwarsa
            </dt>
            <dd className="font-medium">
              {formatDate(mutasi.batch?.expired_date)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Gudang</dt>
            <dd className="font-medium">
              {mutasi.gudang?.nama_gudang ?? "-"}
              {mutasi.gudang?.lokasi ? ` — ${mutasi.gudang.lokasi}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Stok Batch</dt>
            <dd className="font-medium">
              {mutasi.batch?.stok ?? "-"} {mutasi.produk?.satuan ?? ""}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Stok Masuk</dt>
            <dd>
              <Badge variant="secondary">
                +{mutasi.stok_masuk} {mutasi.produk?.satuan ?? ""}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Stok Keluar</dt>
            <dd>
              <Badge variant="outline">
                -{mutasi.stok_keluar} {mutasi.produk?.satuan ?? ""}
              </Badge>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted-foreground">Keterangan</dt>
            <dd className="font-medium">{mutasi.keterangan || "-"}</dd>
          </div>
        </dl>
      )}
    </Modal>
  );
}
