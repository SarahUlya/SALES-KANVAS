import { useState, type SubmitEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGudangList } from "@/master/gudang/hooks/useGudang";
import { useProducts } from "@/master/product/hooks/useProduct";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, type FieldErrors } from "@/lib/form";
import { toDateInput } from "@/lib/format";
import {
  useBatchProdukOptions,
  useCreateProdukOut,
  useRencanaKanvasOptions,
  useUpdateProdukOut,
} from "../hooks/useProdukOut";
import type {
  DetailProdukOutPayload,
  ProdukOut,
  ProdukOutPayload,
} from "../types/produkOut.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produkOut: ProdukOut | null;
};

type DetailRow = {
  key: number;
  id_produk: string;
  id_batch: string;
  qty: string;
};

const today = () => new Date().toLocaleDateString("en-CA");
const newDetailRow = (): DetailRow => ({
  key: Date.now() + Math.random(),
  id_produk: "",
  id_batch: "",
  qty: "1",
});

const toDetailRows = (produkOut: ProdukOut | null): DetailRow[] =>
  produkOut?.detailProdukOut.length
    ? produkOut.detailProdukOut.map((detail) => ({
        key: detail.id_detail_out,
        id_produk: String(detail.id_produk),
        id_batch: String(detail.id_batch),
        qty: String(detail.qty),
      }))
    : [newDetailRow()];

export function ProdukOutForm({ open, onOpenChange, produkOut }: Props) {
  const create = useCreateProdukOut();
  const update = useUpdateProdukOut();
  const { data: plans, isLoading: plansLoading, isError: plansError } =
    useRencanaKanvasOptions();
  const { data: gudangs = [], isLoading: gudangLoading, isError: gudangError } =
    useGudangList();
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts();
  const {
    data: batches = [],
    isLoading: batchesLoading,
    isError: batchesError,
  } = useBatchProdukOptions();
  const [details, setDetails] = useState<DetailRow[]>(() => toDetailRows(produkOut));
  const [errors, setErrors] = useState<FieldErrors>({});
  const optionsLoading =
    plansLoading || gudangLoading || productsLoading || batchesLoading;
  const optionsError = plansError || gudangError || productsError || batchesError;
  const savePending = create.isPending || update.isPending;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setErrors({});
    onOpenChange(isOpen);
  };

  const updateDetail = (
    key: number,
    field: "id_produk" | "id_batch" | "qty",
    value: string,
  ) => {
    setDetails((current) =>
      current.map((detail) => {
        if (detail.key !== key) return detail;
        if (field === "id_produk") {
          return { ...detail, id_produk: value, id_batch: "" };
        }
        return { ...detail, [field]: value };
      }),
    );
  };

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setErrors({});

    const detailProdukOut: DetailProdukOutPayload[] = details.map((detail) => ({
      id_produk: Number(detail.id_produk),
      id_batch: Number(detail.id_batch),
      qty: Number(detail.qty),
    }));
    if (
      detailProdukOut.some(
        ({ id_produk, id_batch, qty }) =>
          !Number.isInteger(id_produk) ||
          id_produk <= 0 ||
          !Number.isInteger(id_batch) ||
          id_batch <= 0 ||
          !Number.isInteger(qty) ||
          qty <= 0,
      )
    ) {
      toast.error("Pilih produk, batch yang sesuai, dan qty bilangan bulat positif.");
      return;
    }
    if (
      detailProdukOut.some(
        (detail) =>
          !batches.some(
            (batch) =>
              batch.id_batch === detail.id_batch &&
              batch.id_produk === detail.id_produk,
          ),
      )
    ) {
      toast.error("Batch harus sesuai dengan produk yang dipilih.");
      return;
    }

    const payload: ProdukOutPayload = {
      id_rencana: Number(formData.get("id_rencana")),
      id_gudang: Number(formData.get("id_gudang")),
      tanggal: String(formData.get("tanggal") ?? ""),
      ...(String(formData.get("status") ?? "").trim()
        ? { status: String(formData.get("status")).trim() }
        : {}),
      detailProdukOut,
    };
    if (
      !Number.isInteger(payload.id_rencana) ||
      payload.id_rencana <= 0 ||
      !Number.isInteger(payload.id_gudang) ||
      payload.id_gudang <= 0 ||
      !payload.tanggal
    ) {
      toast.error("Lengkapi rencana, gudang, dan tanggal dengan benar.");
      return;
    }

    const onSuccess = () => {
      toast.success(
        produkOut ? "Produk keluar diperbarui" : "Produk keluar berhasil dibuat",
      );
      handleOpenChange(false);
    };
    const onError = (error: Error) => {
      setErrors(fieldErrors(error));
      toast.error(errorMessage(error));
    };

    if (produkOut) {
      update.mutate(
        { id_produk_out: produkOut.id_produk_out, ...payload },
        { onSuccess, onError },
      );
    } else {
      create.mutate(payload, { onSuccess, onError });
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={produkOut ? "Ubah Produk Keluar" : "Tambah Produk Keluar"}
      className="sm:max-w-3xl"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField label="Rencana Kanvas" htmlFor="id_rencana" required error={errors.id_rencana}>
          <SelectInput
            id="id_rencana"
            name="id_rencana"
            required
            disabled={optionsLoading || optionsError}
            placeholder={plansLoading ? "Memuat rencana…" : plansError ? "Gagal memuat rencana" : "Pilih rencana…"}
            options={(plans?.items ?? []).map((plan) => ({
              value: String(plan.id_rencana),
              label: `#${plan.id_rencana} — ${toDateInput(plan.tanggal)} (${plan.status})`,
            }))}
            defaultValue={produkOut?.id_rencana.toString()}
            aria-invalid={!!errors.id_rencana}
          />
        </FormField>

        <FormField label="Gudang" htmlFor="id_gudang" required error={errors.id_gudang}>
          <SelectInput
            id="id_gudang"
            name="id_gudang"
            required
            disabled={optionsLoading || optionsError}
            placeholder={gudangLoading ? "Memuat gudang…" : gudangError ? "Gagal memuat gudang" : "Pilih gudang…"}
            options={gudangs.map((gudang) => ({
              value: String(gudang.id_gudang),
              label: gudang.nama_gudang,
            }))}
            defaultValue={produkOut?.id_gudang.toString()}
            aria-invalid={!!errors.id_gudang}
          />
        </FormField>

        <FormField label="Tanggal" htmlFor="tanggal" required error={errors.tanggal}>
          <Input
            id="tanggal"
            name="tanggal"
            type="date"
            required
            defaultValue={toDateInput(produkOut?.tanggal) || today()}
            aria-invalid={!!errors.tanggal}
          />
        </FormField>

        <FormField label="Status" htmlFor="status" error={errors.status}>
          <Input
            id="status"
            name="status"
            maxLength={20}
            defaultValue={produkOut?.status ?? "DRAFT"}
            aria-invalid={!!errors.status}
          />
        </FormField>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-medium">Detail Produk</legend>
          {details.map((detail, index) => {
            const matchingBatches = batches.filter(
              (batch) => String(batch.id_produk) === detail.id_produk,
            );
            return (
              <div
                key={detail.key}
                className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_1fr_7rem_auto] sm:items-end"
              >
                <FormField label={`Produk ${index + 1}`} htmlFor={`id_produk-${detail.key}`} required>
                  <SelectInput
                    id={`id_produk-${detail.key}`}
                    value={detail.id_produk}
                    onValueChange={(value) => updateDetail(detail.key, "id_produk", value)}
                    required
                    disabled={optionsLoading || optionsError}
                    placeholder="Pilih produk…"
                    options={products.map((product) => ({
                      value: String(product.id_produk),
                      label: product.nama_produk,
                    }))}
                  />
                </FormField>
                <FormField label="Batch" htmlFor={`id_batch-${detail.key}`} required>
                  <SelectInput
                    id={`id_batch-${detail.key}`}
                    value={detail.id_batch}
                    onValueChange={(value) => updateDetail(detail.key, "id_batch", value)}
                    required
                    disabled={!detail.id_produk || batchesLoading || batchesError}
                    placeholder={
                      batchesError
                        ? "Gagal memuat batch"
                        : !detail.id_produk
                          ? "Pilih produk dahulu"
                          : "Pilih batch…"
                    }
                    options={matchingBatches.map((batch) => ({
                      value: String(batch.id_batch),
                      label: `${batch.kode_batch ?? `Batch ${batch.id_batch}`} — stok ${batch.stok}`,
                    }))}
                  />
                </FormField>
                <FormField label="Qty" htmlFor={`qty-${detail.key}`} required>
                  <Input
                    id={`qty-${detail.key}`}
                    type="number"
                    min={1}
                    step={1}
                    required
                    value={detail.qty}
                    onChange={(event) => updateDetail(detail.key, "qty", event.target.value)}
                  />
                </FormField>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Hapus detail produk ${index + 1}`}
                  disabled={details.length === 1}
                  onClick={() =>
                    setDetails((current) => current.filter((row) => row.key !== detail.key))
                  }
                >
                  <Trash2 />
                </Button>
              </div>
            );
          })}
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={() => setDetails((current) => [...current, newDetailRow()])}
          >
            <Plus /> Tambah Produk
          </Button>
        </fieldset>

        {optionsError && (
          <p className="text-sm text-destructive">
            Gagal memuat rencana, gudang, produk, atau batch. Periksa izin akses dan coba muat ulang.
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" disabled={savePending || optionsLoading || optionsError}>
            {savePending ? "Menyimpan…" : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
