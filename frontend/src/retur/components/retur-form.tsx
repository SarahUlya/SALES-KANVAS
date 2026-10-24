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
import { errorMessage } from "@/lib/errors";
import { fieldErrors, type FieldErrors } from "@/lib/form";
import { formatDate, toDateInput } from "@/lib/format";
import { useInvoiceList } from "@/invoice/hooks/useInvoice";
import type { Invoice as InvoiceWithDetails } from "@/invoice/types/invoice.types";
import { useProducts } from "@/master/product/hooks/useProduct";
import {
  useCreateRetur,
  useUpdateRetur,
} from "../hooks/useRetur";
import type {
  DetailReturPayload,
  Retur,
  ReturPayload,
} from "../types/retur.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retur: Retur | null;
};

type DetailRow = {
  key: number;
  id_produk: string;
  id_batch: string;
  qty: string;
  harga: string;
};

const today = () => new Date().toLocaleDateString("en-CA");
const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 2,
});

function emptyDetail(): DetailRow {
  return {
    key: Date.now() + Math.random(),
    id_produk: "",
    id_batch: "",
    qty: "1",
    harga: "",
  };
}

function detailsFromRetur(retur: Retur | null): DetailRow[] {
  return retur?.detailRetur.length
    ? retur.detailRetur.map((detail) => ({
        key: detail.id_detail_retur,
        id_produk: String(detail.id_produk),
        id_batch: String(detail.id_batch),
        qty: String(detail.qty),
        harga: String(detail.harga),
      }))
    : [emptyDetail()];
}

function invoiceLine(
  invoice: InvoiceWithDetails | undefined,
  id_produk: number,
  id_batch: number,
) {
  return invoice?.detailInvoice.find(
    (line) => line.id_produk === id_produk && line.id_batch === id_batch,
  );
}

export function ReturForm({ open, onOpenChange, retur }: Props) {
  const create = useCreateRetur();
  const update = useUpdateRetur();
  const {
    data: invoices = [],
    isLoading: invoicesLoading,
    isError: invoicesError,
  } = useInvoiceList();
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
  const [invoiceId, setInvoiceId] = useState(
    retur ? String(retur.id_invoice) : "",
  );
  const [details, setDetails] = useState(() => detailsFromRetur(retur));
  const [errors, setErrors] = useState<FieldErrors>({});
  const selectedInvoice = invoices.find(
    (invoice) => String(invoice.id_invoice) === invoiceId,
  );
  const optionsLoading = invoicesLoading || productsLoading || batchesLoading;
  const optionsError = invoicesError || productsError || batchesError;
  const saving = create.isPending || update.isPending;

  const closeForm = (isOpen: boolean) => {
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
          return { ...detail, id_produk: value, id_batch: "", harga: "" };
        }
        if (field === "id_batch") {
          const line = invoiceLine(
            selectedInvoice,
            Number(detail.id_produk),
            Number(value),
          );
          return {
            ...detail,
            id_batch: value,
            harga: line ? String(line.harga) : "",
          };
        }
        return { ...detail, [field]: value };
      }),
    );
  };

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setErrors({});
    const id_invoice = Number(invoiceId);
    const tanggal = String(formData.get("tanggal") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();
    const alasan = String(formData.get("alasan") ?? "").trim();

    if (!Number.isInteger(id_invoice) || id_invoice <= 0) {
      setErrors({ id_invoice: "Pilih invoice yang valid." });
      return;
    }
    if (!tanggal || !status) {
      toast.error("Tanggal dan status wajib diisi.");
      return;
    }

    const detailRetur: DetailReturPayload[] = details.map((detail) => ({
      id_produk: Number(detail.id_produk),
      id_batch: Number(detail.id_batch),
      qty: Number(detail.qty),
      harga: Number(detail.harga),
    }));
    if (details.some((detail) => detail.harga.trim() === "")) {
      toast.error("Harga tiap produk retur wajib diisi.");
      return;
    }
    if (
      detailRetur.some(
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
      toast.error("Pastikan produk, batch, qty, dan harga retur valid.");
      return;
    }
    if (
      detailRetur.some(
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

    const payload: ReturPayload = {
      id_invoice,
      tanggal,
      alasan: alasan || null,
      status,
      detailRetur,
    };
    const onSuccess = () => {
      toast.success(retur ? "Retur berhasil diperbarui" : "Retur berhasil dibuat");
      closeForm(false);
    };
    const onError = (error: Error) => {
      setErrors(fieldErrors(error));
      toast.error(errorMessage(error));
    };

    if (retur) {
      update.mutate(
        { id_retur: retur.id_retur, ...payload },
        { onSuccess, onError },
      );
    } else {
      create.mutate(payload, { onSuccess, onError });
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={closeForm}
      title={retur ? "Ubah Retur Produk" : "Tambah Retur Produk"}
      className="sm:max-w-4xl"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField
          label="Invoice"
          htmlFor="id_invoice"
          required
          error={errors.id_invoice}
        >
          <SelectInput
            id="id_invoice"
            name="id_invoice"
            value={invoiceId}
            required
            disabled={invoicesLoading || invoicesError}
            placeholder={
              invoicesLoading
                ? "Memuat invoice…"
                : invoicesError
                  ? "Gagal memuat invoice"
                  : "Pilih invoice…"
            }
            options={invoices.map((invoice) => ({
              value: String(invoice.id_invoice),
              label: `#${invoice.id_invoice} — ${formatDate(invoice.tanggal)} (${invoice.status})`,
            }))}
            onValueChange={(value) => {
              setInvoiceId(value);
              setDetails([emptyDetail()]);
            }}
            aria-invalid={!!errors.id_invoice}
          />
        </FormField>

        <FormField label="Tanggal Retur" htmlFor="tanggal" required error={errors.tanggal}>
          <Input
            id="tanggal"
            name="tanggal"
            type="date"
            required
            defaultValue={toDateInput(retur?.tanggal) || today()}
            aria-invalid={!!errors.tanggal}
          />
        </FormField>

        <FormField label="Status" htmlFor="status" required error={errors.status}>
          <Input
            id="status"
            name="status"
            required
            maxLength={20}
            defaultValue={retur?.status ?? "DRAFT"}
            aria-invalid={!!errors.status}
          />
        </FormField>

        <FormField label="Alasan Retur" htmlFor="alasan" error={errors.alasan}>
          <Input
            id="alasan"
            name="alasan"
            maxLength={255}
            defaultValue={retur?.alasan ?? ""}
            aria-invalid={!!errors.alasan}
          />
        </FormField>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-medium">Detail Produk</legend>
          {details.map((detail, index) => {
            const selectedLine = invoiceLine(
              selectedInvoice,
              Number(detail.id_produk),
              Number(detail.id_batch),
            );
            const price = detail.harga
              ? Number(detail.harga)
              : selectedLine
                ? Number(selectedLine.harga)
                : NaN;

            return (
              <div
                key={detail.key}
                className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_1fr_6rem_8rem_auto] sm:items-end"
              >
                <FormField
                  label={`Produk ${index + 1}`}
                  htmlFor={`produk-${detail.key}`}
                  required
                >
                  <SelectInput
                    id={`produk-${detail.key}`}
                    value={detail.id_produk}
                    onValueChange={(value) =>
                      updateDetail(detail.key, "id_produk", value)
                    }
                    required
                    disabled={productsLoading || productsError}
                    placeholder={
                      productsLoading
                        ? "Memuat produk…"
                        : productsError
                          ? "Gagal memuat produk"
                          : "Pilih produk…"
                    }
                    options={products.map((product) => ({
                      value: String(product.id_produk),
                      label: product.nama_produk,
                    }))}
                  />
                </FormField>
                <FormField
                  label="Batch"
                  htmlFor={`batch-${detail.key}`}
                  required
                >
                  <SelectInput
                    id={`batch-${detail.key}`}
                    value={detail.id_batch}
                    onValueChange={(value) =>
                      updateDetail(detail.key, "id_batch", value)
                    }
                    required
                    disabled={!detail.id_produk || batchesLoading || batchesError}
                    placeholder={
                      batchesLoading
                        ? "Memuat batch…"
                        : batchesError
                          ? "Gagal memuat batch"
                          : !detail.id_produk
                            ? "Pilih produk dahulu"
                            : "Pilih batch…"
                    }
                    options={batches
                      .filter(
                        (batch) =>
                          String(batch.id_produk) === detail.id_produk,
                      )
                      .map((batch) => ({
                        value: String(batch.id_batch),
                        label:
                          batch.kode_batch ?? `Batch #${batch.id_batch}`,
                    }))}
                  />
                </FormField>
                <FormField
                  label="Qty Retur"
                  htmlFor={`qty-${detail.key}`}
                  required
                >
                  <Input
                    id={`qty-${detail.key}`}
                    type="number"
                    min={1}
                    step={1}
                    required
                    value={detail.qty}
                    onChange={(inputEvent) =>
                      updateDetail(
                        detail.key,
                        "qty",
                        inputEvent.target.value,
                      )
                    }
                  />
                </FormField>
                <FormField label="Harga" htmlFor={`harga-${detail.key}`} required>
                  <Input
                    id={`harga-${detail.key}`}
                    type="number"
                    min={0}
                    step="any"
                    required
                    value={detail.harga}
                    onChange={(inputEvent) =>
                      updateDetail(
                        detail.key,
                        "harga",
                        inputEvent.target.value,
                      )
                    }
                    aria-label={`Harga produk retur ${index + 1}`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {Number.isFinite(price) ? rupiah.format(price) : "-"}
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
            disabled={optionsLoading || optionsError}
            onClick={() => setDetails((current) => [...current, emptyDetail()])}
          >
            <Plus /> Tambah Produk
          </Button>
        </fieldset>

        {optionsError && (
          <p className="text-sm text-destructive">
            Gagal memuat pilihan invoice, produk, atau batch. Periksa akses lalu coba lagi.
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => closeForm(false)}
          >
            Batal
          </Button>
          <Button type="submit" disabled={saving || optionsLoading || optionsError}>
            {saving ? "Menyimpan…" : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
