import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/shared/modal";
import { formatDate } from "@/lib/format";
import type { KartuPiutang } from "../types/kartuPiutang.types";

type Props = {
  piutang: KartuPiutang | null;
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

export function KartuPiutangDetail({ piutang, onOpenChange }: Props) {
  return (
    <Modal
      open={!!piutang}
      onOpenChange={onOpenChange}
      title={`Detail Piutang${piutang ? ` #${piutang.id_piutang}` : ""}`}
      className="sm:max-w-2xl"
    >
      {piutang && (
        <dl className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">ID Piutang</dt>
            <dd className="font-medium">{piutang.id_piutang}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Tanggal Piutang</dt>
            <dd className="font-medium">{formatDate(piutang.tanggal)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Outlet</dt>
            <dd className="font-medium">
              {piutang.outlet?.nama_outlet ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Alamat Outlet</dt>
            <dd className="font-medium">{piutang.outlet?.alamat || "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">No. Telepon</dt>
            <dd className="font-medium">{piutang.outlet?.no_hp || "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">ID Invoice</dt>
            <dd className="font-medium">{piutang.id_invoice}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Tanggal Invoice</dt>
            <dd className="font-medium">
              {formatDate(piutang.invoice?.tanggal)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Status Invoice</dt>
            <dd>
              {piutang.invoice ? (
                <Badge variant="outline">{piutang.invoice.status}</Badge>
              ) : (
                "-"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Total Invoice</dt>
            <dd className="font-medium">
              {formatMoney(piutang.invoice?.total)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Debit</dt>
            <dd className="font-medium">{formatMoney(piutang.debit)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Kredit</dt>
            <dd className="font-medium">{formatMoney(piutang.kredit)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted-foreground">Keterangan</dt>
            <dd className="font-medium">{piutang.keterangan || "-"}</dd>
          </div>
        </dl>
      )}
    </Modal>
  );
}
