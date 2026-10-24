import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useInvoiceList } from "@/invoice/hooks/useInvoice";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, type FieldErrors } from "@/lib/form";
import { formatDate, toDateInput } from "@/lib/format";
import {
  useCreatePembayaranInvoice,
  useUpdatePembayaranInvoice,
} from "../hooks/usePembayaranInvoice";
import type {
  PembayaranInvoice,
  PembayaranInvoicePayload,
} from "../types/pembayaranInvoice.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pembayaran: PembayaranInvoice | null;
};

const today = () => new Date().toLocaleDateString("en-CA");

export function PembayaranInvoiceForm({
  open,
  onOpenChange,
  pembayaran,
}: Props) {
  const create = useCreatePembayaranInvoice();
  const update = useUpdatePembayaranInvoice();
  const {
    data: invoices = [],
    isLoading: invoicesLoading,
    isError: invoicesError,
  } = useInvoiceList();
  const [errors, setErrors] = useState<FieldErrors>({});
  const saving = create.isPending || update.isPending;

  function closeForm(isOpen: boolean) {
    if (!isOpen) setErrors({});
    onOpenChange(isOpen);
  }

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setErrors({});
    const payload: PembayaranInvoicePayload = {
      id_invoice: Number(formData.get("id_invoice")),
      tanggal: String(formData.get("tanggal") ?? "").trim(),
      jumlah: Number(formData.get("jumlah")),
      metode: String(formData.get("metode") ?? "").trim(),
    };

    if (
      !Number.isInteger(payload.id_invoice) ||
      payload.id_invoice <= 0 ||
      !invoices.some((invoice) => invoice.id_invoice === payload.id_invoice)
    ) {
      setErrors({ id_invoice: "Pilih invoice yang valid." });
      return;
    }
    if (!payload.tanggal) {
      setErrors({ tanggal: "Tanggal pembayaran wajib diisi." });
      return;
    }
    if (!Number.isFinite(payload.jumlah) || payload.jumlah <= 0) {
      setErrors({ jumlah: "Jumlah pembayaran harus lebih besar dari nol." });
      return;
    }
    if (!payload.metode || payload.metode.length > 30) {
      setErrors({ metode: "Metode wajib diisi (maksimal 30 karakter)." });
      return;
    }

    const onSuccess = () => {
      toast.success(
        pembayaran
          ? "Pembayaran invoice berhasil diperbarui"
          : "Pembayaran invoice berhasil dibuat",
      );
      closeForm(false);
    };
    const onError = (error: Error) => {
      setErrors(fieldErrors(error));
      toast.error(errorMessage(error));
    };

    if (pembayaran) {
      update.mutate(
        { id_pembayaran: pembayaran.id_pembayaran, ...payload },
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
      title={pembayaran ? "Ubah Pembayaran Invoice" : "Tambah Pembayaran Invoice"}
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
            required
            defaultValue={pembayaran?.id_invoice.toString()}
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
            aria-invalid={!!errors.id_invoice}
          />
        </FormField>

        <FormField
          label="Tanggal Pembayaran"
          htmlFor="tanggal"
          required
          error={errors.tanggal}
        >
          <Input
            id="tanggal"
            name="tanggal"
            type="date"
            required
            defaultValue={toDateInput(pembayaran?.tanggal) || today()}
            aria-invalid={!!errors.tanggal}
          />
        </FormField>

        <FormField
          label="Jumlah Pembayaran"
          htmlFor="jumlah"
          required
          error={errors.jumlah}
        >
          <Input
            id="jumlah"
            name="jumlah"
            type="number"
            min={0.01}
            step="any"
            required
            defaultValue={pembayaran?.jumlah ?? ""}
            aria-invalid={!!errors.jumlah}
          />
        </FormField>

        <FormField
          label="Metode Pembayaran"
          htmlFor="metode"
          required
          error={errors.metode}
          hint="Maksimal 30 karakter."
        >
          <Input
            id="metode"
            name="metode"
            required
            maxLength={30}
            defaultValue={pembayaran?.metode ?? ""}
            aria-invalid={!!errors.metode}
          />
        </FormField>

        {invoicesError && (
          <p className="text-sm text-destructive">
            Gagal memuat pilihan invoice. Periksa akses lalu coba lagi.
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
          <Button
            type="submit"
            disabled={saving || invoicesLoading || invoicesError}
          >
            {saving ? "Menyimpan…" : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
