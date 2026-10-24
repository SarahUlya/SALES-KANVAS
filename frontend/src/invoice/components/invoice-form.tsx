import { useState, type SubmitEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useBatchProdukList } from "@/batch-produk/hooks/useBatchProduk";
import { useOutlets } from "@/master/outlet/hooks/useOutlet";
import { useProducts } from "@/master/product/hooks/useProduct";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, type FieldErrors } from "@/lib/form";
import { formatDate, toDateInput } from "@/lib/format";
import {
  useCreateInvoice,
  useRencanaInvoiceOptions,
  useUpdateInvoice,
} from "../hooks/useInvoice";
import type {
  DetailInvoicePayload,
  Invoice,
  InvoicePayload,
} from "../types/invoice.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
};

type DetailRow = {
  key: number;
  id_produk: string;
  id_batch: string;
  qty: string;
  harga: string;
};

const today = () => new Date().toLocaleDateString("en-CA");
const invoiceMoney = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 2,
});
const newDetail = (): DetailRow => ({
  key: Date.now() + Math.random(),
  id_produk: "",
  id_batch: "",
  qty: "1",
  harga: "0",
});

function formatInputMoney(value: string | number) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? String(numeric) : "";
}

export function InvoiceForm({ open, onOpenChange, invoice }: Props) {
  const create = useCreateInvoice();
  const update = useUpdateInvoice();
  const { data: outlets = [], isLoading: outletsLoading, isError: outletsError } = useOutlets();
  const {
    data: plans,
    isLoading: plansLoading,
    isError: plansError,
  } = useRencanaInvoiceOptions();
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts();
  const {
    data: batches = [],
    isLoading: batchesLoading,
    isError: batchesError,
  } = useBatchProdukList();
  const [details, setDetails] = useState<DetailRow[]>(() =>
    invoice?.detailInvoice.length
      ? invoice.detailInvoice.map((detail) => ({
          key: detail.id_detail_invoice,
          id_produk: String(detail.id_produk),
          id_batch: String(detail.id_batch),
          qty: String(detail.qty),
          harga: formatInputMoney(detail.harga),
        }))
      : [newDetail()],
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const optionsLoading =
    outletsLoading || plansLoading || productsLoading || batchesLoading;
  const optionsError = outletsError || plansError || productsError || batchesError;
  const savePending = create.isPending || update.isPending;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setErrors({});
    onOpenChange(isOpen);
  };

  const updateDetail = (
    key: number,
    field: "id_produk" | "id_batch" | "qty" | "harga",
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

    const id_outlet = Number(formData.get("id_outlet"));
    const id_rencana = Number(formData.get("id_rencana"));
    const tanggal = String(formData.get("tanggal") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();
    if (!Number.isInteger(id_outlet) || id_outlet <= 0) {
      setErrors({ id_outlet: "Pilih outlet yang valid." });
      return;
    }
    if (!Number.isInteger(id_rencana) || id_rencana <= 0) {
      setErrors({ id_rencana: "Pilih rencana kanvas yang valid." });
      return;
    }
    if (!tanggal || !status) {
      toast.error("Tanggal dan status wajib diisi.");
      return;
    }

    const detailInvoice: DetailInvoicePayload[] = details.map((detail) => ({
      id_produk: Number(detail.id_produk),
      id_batch: Number(detail.id_batch),
      qty: Number(detail.qty),
      harga: Number(detail.harga),
    }));
    if (
      detailInvoice.some(
        ({ id_produk, id_batch, qty, harga }) =>
          !Number.isInteger(id_produk) ||
          id_produk <= 0 ||
          !Number.isInteger(id_batch) ||
          id_batch <= 0 ||
          !Number.isInteger(qty) ||
          qty <= 0 ||
          !Number.isFinite(harga) ||
          harga < 0,
      )
    ) {
      toast.error("Isi produk, batch, qty positif, dan harga nol atau lebih.");
      return;
    }
    if (
      detailInvoice.some(
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

    const payload: InvoicePayload = {
      id_outlet,
      id_rencana,
      tanggal,
      status,
      detailInvoice,
    };
    const onSuccess = () => {
      toast.success(invoice ? "Invoice diperbarui" : "Invoice berhasil dibuat");
      handleOpenChange(false);
    };
    const onError = (error: Error) => {
      setErrors(fieldErrors(error));
      toast.error(errorMessage(error));
    };

    if (invoice) {
      update.mutate(
        { id_invoice: invoice.id_invoice, ...payload },
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
      title={invoice ? "Ubah Invoice" : "Tambah Invoice"}
      className="sm:max-w-4xl"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField label="Outlet" htmlFor="id_outlet" required error={errors.id_outlet}>
          <SelectInput
            id="id_outlet"
            name="id_outlet"
            required
            disabled={optionsLoading || optionsError}
            placeholder={outletsLoading ? "Memuat outlet…" : outletsError ? "Gagal memuat outlet" : "Pilih outlet…"}
            options={outlets.map((outlet) => ({
              value: String(outlet.id_outlet),
              label: outlet.nama_outlet,
            }))}
            defaultValue={invoice?.id_outlet.toString()}
            aria-invalid={!!errors.id_outlet}
          />
        </FormField>

        <FormField label="Rencana Kanvas" htmlFor="id_rencana" required error={errors.id_rencana}>
          <SelectInput
            id="id_rencana"
            name="id_rencana"
            required
            disabled={optionsLoading || optionsError}
            placeholder={plansLoading ? "Memuat rencana…" : plansError ? "Gagal memuat rencana" : "Pilih rencana…"}
            options={(plans?.items ?? []).map((plan) => ({
              value: String(plan.id_rencana),
              label: `#${plan.id_rencana} — ${formatDate(plan.tanggal)} (${plan.status})`,
            }))}
            defaultValue={invoice?.id_rencana.toString()}
            aria-invalid={!!errors.id_rencana}
          />
        </FormField>

        <FormField label="Tanggal" htmlFor="tanggal" required error={errors.tanggal}>
          <Input
            id="tanggal"
            name="tanggal"
            type="date"
            required
            defaultValue={toDateInput(invoice?.tanggal) || today()}
            aria-invalid={!!errors.tanggal}
          />
        </FormField>

        <FormField label="Status" htmlFor="status" required error={errors.status}>
          <Input
            id="status"
            name="status"
            required
            maxLength={20}
            defaultValue={invoice?.status ?? "DRAFT"}
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
                className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_1fr_6rem_8rem_auto] sm:items-end"
              >
                <FormField label={`Produk ${index + 1}`} htmlFor={`produk-${detail.key}`} required>
                  <SelectInput
                    id={`produk-${detail.key}`}
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
                <FormField label="Batch" htmlFor={`batch-${detail.key}`} required>
                  <SelectInput
                    id={`batch-${detail.key}`}
                    value={detail.id_batch}
                    onValueChange={(value) => updateDetail(detail.key, "id_batch", value)}
                    required
                    disabled={!detail.id_produk || batchesLoading || batchesError}
                    placeholder={!detail.id_produk ? "Pilih produk dahulu" : "Pilih batch…"}
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
                    onChange={(inputEvent) => updateDetail(detail.key, "qty", inputEvent.target.value)}
                  />
                </FormField>
                <FormField label="Harga Satuan" htmlFor={`harga-${detail.key}`} required>
                  <Input
                    id={`harga-${detail.key}`}
                    type="number"
                    min={0}
                    step="any"
                    required
                    value={detail.harga}
                    onChange={(inputEvent) => updateDetail(detail.key, "harga", inputEvent.target.value)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {invoiceMoney.format(Number(detail.harga) || 0)}
                  </span>
                </FormField>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Hapus detail produk ${index + 1}`}
                  disabled={details.length === 1}
                  onClick={() =>
                    setDetails((current) =>
                      current.filter((row) => row.key !== detail.key),
                    )
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
            onClick={() => setDetails((current) => [...current, newDetail()])}
          >
            <Plus /> Tambah Produk
          </Button>
        </fieldset>

        {optionsError && (
          <p className="text-sm text-destructive">
            Gagal memuat pilihan outlet, rencana, produk, atau batch. Periksa akses lalu coba muat ulang.
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Total invoice dihitung oleh backend dari qty dan harga tiap detail.
        </p>

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
