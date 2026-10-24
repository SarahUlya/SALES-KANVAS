import { useState, type SubmitEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/form-field";
import { SelectInput } from "@/components/shared/select-input";
import { Input } from "@/components/ui/input";
import { useEmployees } from "@/master/employee/hooks/useEmployee";
import { useMarketAreas } from "@/master/market-area/hooks/useMarketArea";
import { useOutlets } from "@/master/outlet/hooks/useOutlet";
import { useVehicles } from "@/master/vehicle/hooks/useVehicle";
import { errorMessage } from "@/lib/errors";
import { toDateInput } from "@/lib/format";
import { fieldErrors, num, text, type FieldErrors } from "@/lib/form";
import { useCreatePlan, usePlan, useRevisePlan } from "../hooks/usePlan";
import {
  PLAN_STATUSES,
  type Plan,
  type PlanOutletPayload,
  type PlanPayload,
} from "../types/plan.types";
import { PlanDetailRencanaFields } from "./plan-detail-rencana-fields";

export function PlanFormPage() {
  const planId = Number(useParams().id ?? 0);
  const { data: plan, isLoading, isError } = usePlan(planId);

  if (planId) {
    if (isLoading) return <p className="text-sm text-muted-foreground">Memuat…</p>;
    if (isError || !plan) return <p className="text-sm text-muted-foreground">Plan tidak ditemukan.</p>;
    if (plan.status === "BATAL") {
      return <p className="text-sm text-muted-foreground">Plan yang sudah dibatalkan tidak dapat direvisi.</p>;
    }
  }
  return <PlanForm key={planId} plan={plan ?? null} />;
}

const today = () => new Date().toLocaleDateString("en-CA");

function PlanForm({ plan }: { plan: Plan | null }) {
  const navigate = useNavigate();
  const create = useCreatePlan();
  const revise = useRevisePlan();
  const save = plan ? revise : create;

  const {
    data: marketAreas = [],
    isLoading: loadingAreas,
    isError: areasError,
  } = useMarketAreas();
  const {
    data: vehicles = [],
    isLoading: loadingVehicles,
    isError: vehiclesError,
  } = useVehicles();
  const {
    data: employees = [],
    isLoading: loadingEmployees,
    isError: employeesError,
  } = useEmployees();
  const {
    data: outlets = [],
    isLoading: loadingOutlets,
    isError: outletsError,
  } = useOutlets();

  const [errors, setErrors] = useState<FieldErrors>({});
  const [detailRencana, setDetailRencana] = useState<PlanOutletPayload[]>(
    plan?.detailRencana.map(({ id_outlet, urutan }) => ({
      id_outlet,
      urutan,
    })) ?? [],
  );
  const loadingOptions =
    loadingAreas || loadingVehicles || loadingEmployees || loadingOutlets;
  const optionsError =
    areasError || vehiclesError || employeesError || outletsError;

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setErrors({});
    const status = PLAN_STATUSES.find(
      (candidate) => candidate === text(fd, "status"),
    );

    if (
      detailRencana.some(
        ({ id_outlet, urutan }) =>
          !Number.isInteger(id_outlet) ||
          id_outlet < 1 ||
          !Number.isInteger(urutan) ||
          urutan < 1,
      )
    ) {
      toast.error("Pilih outlet dan urutan yang valid untuk setiap detail rencana.");
      return;
    }

    const payload: PlanPayload = {
      id_karyawan: num(fd, "id_karyawan"),
      id_kendaraan: num(fd, "id_kendaraan"),
      id_wilayah: num(fd, "id_wilayah"),
      tanggal: text(fd, "tanggal"),
      detailRencana: detailRencana.map(({ id_outlet, urutan }) => ({
        id_outlet,
        urutan,
      })),
      ...(plan && status ? { status } : {}),
    };

    const onSuccess = (saved: Plan) => {
      toast.success(plan ? "Revisi plan berhasil disimpan" : "Plan berhasil dibuat");
      navigate(`/plan/${saved.id_rencana}`, { replace: true });
    };
    const onError = (err: Error) => {
      setErrors(fieldErrors(err));
      toast.error(errorMessage(err));
    };

    if (plan)
      revise.mutate(
        { id_rencana: plan.id_rencana, ...payload },
        { onSuccess, onError },
      );
    else create.mutate(payload, { onSuccess, onError });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto grid max-w-4xl gap-6">
      <div>
        <h2 className="text-xl font-semibold">
          {plan
            ? `Edit Sales Kanvas Plan #${plan.id_rencana}`
            : "Buat Sales Kanvas Plan"}
        </h2>
      </div>

      <section className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
        <FormField
          label="Karyawan"
          htmlFor="id_karyawan"
          required
          error={errors.id_karyawan}
        >
          <SelectInput
            id="id_karyawan"
            name="id_karyawan"
            required
            disabled={loadingOptions || optionsError}
            placeholder="Pilih karyawan…"
            options={employees.map((employee) => ({
              value: String(employee.id_karyawan),
              label: employee.nama,
            }))}
            defaultValue={plan?.id_karyawan.toString()}
            aria-invalid={!!errors.id_karyawan}
          />
        </FormField>

        <FormField
          label="Kendaraan"
          htmlFor="id_kendaraan"
          required
          error={errors.id_kendaraan}
        >
          <SelectInput
            id="id_kendaraan"
            name="id_kendaraan"
            required
            disabled={loadingOptions || optionsError}
            placeholder="Pilih kendaraan…"
            options={vehicles.map((vehicle) => ({
              value: String(vehicle.id_kendaraan),
              label: `${vehicle.nomor_plat}${vehicle.jenis ? ` — ${vehicle.jenis}` : ""}`,
            }))}
            defaultValue={(
              plan?.id_kendaraan
            )?.toString()}
            aria-invalid={!!errors.id_kendaraan}
          />
        </FormField>

        <FormField
          label="Wilayah"
          htmlFor="id_wilayah"
          required
          error={errors.id_wilayah}
        >
          <SelectInput
            id="id_wilayah"
            name="id_wilayah"
            required
            disabled={loadingOptions || optionsError}
            placeholder="Pilih wilayah…"
            options={marketAreas.map((area) => ({
              value: String(area.id_wilayah),
              label: area.nama_wilayah,
            }))}
            defaultValue={(
              plan?.id_wilayah
            )?.toString()}
            aria-invalid={!!errors.id_wilayah}
          />
        </FormField>

        <FormField
          label="Tanggal"
          htmlFor="tanggal"
          required
          error={errors.tanggal}
        >
          <Input
            id="tanggal"
            name="tanggal"
            type="date"
            required
            defaultValue={toDateInput(plan?.tanggal) || today()}
            aria-invalid={!!errors.tanggal}
          />
        </FormField>

        {plan && (
          <FormField
            label="Status"
            htmlFor="status"
            error={errors.status}
          >
            <SelectInput
              id="status"
              name="status"
              options={PLAN_STATUSES.map((status) => ({
                value: status,
                label: status,
              }))}
              defaultValue={plan.status}
              aria-invalid={!!errors.status}
            />
          </FormField>
        )}
      </section>

      <PlanDetailRencanaFields
        rows={detailRencana}
        onChange={setDetailRencana}
        outlets={outlets}
        disabled={loadingOptions || optionsError}
      />
      {optionsError && (
        <p className="-mt-4 text-sm text-destructive">
          Gagal memuat pilihan karyawan, kendaraan, wilayah, atau outlet. Coba
          muat ulang halaman.
        </p>
      )}
      {errors.detailRencana && (
        <p className="-mt-4 text-sm text-destructive">{errors.detailRencana}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          nativeButton={false}
          render={
            <Link to={plan ? `/plan/${plan.id_rencana}` : "/plan"} />
          }
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={save.isPending || loadingOptions || optionsError}
        >
          {save.isPending ? "Menyimpan…" : plan ? "Simpan Revisi" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
