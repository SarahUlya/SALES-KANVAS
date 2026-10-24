import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SelectInput } from "@/components/shared/select-input";
import { usePermission } from "@/auth/hooks/usePermission";
import { formatDate } from "@/lib/format";
import { errorMessage } from "@/lib/errors";
import { usePlan, useUpdatePlanStatus } from "../hooks/usePlan";
import { PLAN_STATUSES, type Plan, type PlanStatus } from "../types/plan.types";
import { PlanStatusBadge, STATUS_LABEL } from "./plan-status-badge";

export function PlanDetailPage() {
  const planId = Number(useParams().id);
  const { data: plan, isLoading, isError } = usePlan(planId);
  const canWrite = usePermission()("plan:write");

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Memuat…</p>;
  if (isError || !plan)
    return (
      <p className="text-sm text-muted-foreground">Plan tidak ditemukan.</p>
    );

  const editable = canWrite && plan.status !== "BATAL";
  const orderedOutlets = [...(plan.detailRencana ?? [])].sort(
    (a, b) => a.urutan - b.urutan,
  );

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <Link
            to="/plan"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Daftar plan
          </Link>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              Sales Kanvas Plan #{plan.id_rencana}
            </h2>
            <PlanStatusBadge status={plan.status} />
          </div>
        </div>
        {editable && (
          <div className="flex flex-wrap items-center gap-2">
            <StatusControl plan={plan} />
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link to={`/plan/${plan.id_rencana}/edit`} />}
            >
              <Pencil /> Edit Plan
            </Button>
          </div>
        )}
      </div>

      <dl className="grid gap-4 rounded-lg border p-4 text-sm sm:grid-cols-3">
        <Info label="ID Rencana">{plan.id_rencana}</Info>
        <Info label="Tanggal Rencana">{formatDate(plan.tanggal)}</Info>
        <Info label="Status">
          <PlanStatusBadge status={plan.status} />
        </Info>
        <Info label="Karyawan">{plan.karyawan?.nama ?? "-"}</Info>
        <Info label="Wilayah">
          {plan.wilayahKanvas?.nama_wilayah ?? "-"}
        </Info>
        <Info label="Kendaraan">
          {plan.kendaraan?.nomor_plat ?? "-"}
        </Info>
      </dl>

      <ItemsTable
        title="Rencana Outlet"
        head={["Urutan", "Nama Outlet", "Alamat", "No. Telepon"]}
      >
        {orderedOutlets.map((detail) => (
          <TableRow key={detail.id_detail_rencana}>
            <TableCell className="tabular-nums">{detail.urutan}</TableCell>
            <TableCell className="font-medium">
              {detail.outlet?.nama_outlet ?? "-"}
            </TableCell>
            <TableCell>{detail.outlet?.alamat || "-"}</TableCell>
            <TableCell>{detail.outlet?.no_hp || "-"}</TableCell>
          </TableRow>
        ))}
      </ItemsTable>
    </div>
  );
}

function Info({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

function ItemsTable({
  title,
  head,
  children,
}: {
  title: string;
  head: string[];
  children: ReactNode[];
}) {
  return (
    <section className="grid gap-2">
      <h3 className="font-medium">{title}</h3>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {head.map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {children.length ? (
              children
            ) : (
              <TableRow>
                <TableCell
                  colSpan={head.length}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

// REVISI hanya terjadi lewat tombol Revisi, bukan dipilih manual.
const SELECTABLE = PLAN_STATUSES.filter((s) => s !== "REVISI");

function StatusControl({ plan }: { plan: Plan }) {
  const update = useUpdatePlanStatus();
  const [next, setNext] = useState<PlanStatus | "">("");

  return (
    <>
      <SelectInput
        aria-label="Ubah status"
        className="w-40"
        placeholder="Ubah status…"
        // Kosong lagi setelah dialog ditutup, jadi selalu tampil placeholder.
        value={next}
        onValueChange={(v) => setNext(v as PlanStatus | "")}
        options={SELECTABLE.filter((s) => s !== plan.status).map((s) => ({
          value: s,
          label: STATUS_LABEL[s],
        }))}
      />

      <ConfirmDialog
        open={!!next}
        onOpenChange={(o) => !o && setNext("")}
        title={`Ubah status ke ${next ? STATUS_LABEL[next] : ""}?`}
        description={
          next === "BATAL"
            ? "Plan yang dibatalkan tidak bisa diubah statusnya atau direvisi lagi."
            : `Status rencana #${plan.id_rencana} akan diubah dari ${STATUS_LABEL[plan.status]}.`
        }
        confirmLabel="Ubah Status"
        destructive={next === "BATAL"}
        isPending={update.isPending}
        onConfirm={() =>
          next &&
          update.mutate(
            { id_rencana: plan.id_rencana, status: next },
            {
              onSuccess: () => {
                toast.success(`Status diubah ke ${STATUS_LABEL[next]}`);
                setNext("");
              },
              onError: (err) => toast.error(errorMessage(err)),
            },
          )
        }
      />
    </>
  );
}
