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
import { useOutlets } from "@/master/outlet/hooks/useOutlet";
import {
  useCreateKartuPiutang,
  useUpdateKartuPiutang,
} from "../hooks/useKartuPiutang";
import type {
  KartuPiutang,
  KartuPiutangPayload,
} from "../types/kartuPiutang.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  piutang: KartuPiutang | null;
};

const today = () => new Date().toLocaleDateString("en-CA");

export function KartuPiutangForm({ open, onOpenChange, piutang }: Props) {
  const create = useCreateKartuPiutang();
  const update = useUpdateKartuPiutang();
  const {
    data: outlets = [],
    isLoading: outletsLoading,
    isError: outletsError,
  } = useOutlets();
  const {
    data: invoices = [],
    isLoading: invoicesLoading,
    isError: invoicesError,
  } = useInvoiceList();
  const [errors, setErrors] = useState<FieldErrors>({});
  const optionsLoading = outletsLoading || invoicesLoading;
  const optionsError = outletsError || invoicesError;
  const saving = create.isPending || update.isPending;

  function closeForm(isOpen: boolean) {
    if (!isOpen) setErrors({});
    onOpenChange(isOpen);
  }

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setErrors({});
    const payload: KartuPiutangPayload = {
      id_outlet: Number(formData.get("id_outlet")),
      id_invoice: Number(formData.get("id_invoice")),
      tanggal: String(formData.get("tanggal") ?? "").trim(),
      debit: Number(formData.get("debit")),
      kredit: Number(formData.get("kredit")),
      keterangan: String(formData.get("keterangan") ?? "").trim() || null,
    };

    if (
      !Number.isInteger(payload.id_outlet) ||
      payload.id_outlet <= 0 ||
      !outlets.some((outlet) => outlet.id_outlet === payload.id_outlet)
    ) {
      setErrors({ id_outlet: "Pilih outlet yang valid." });
      return;
    }
    if (
      !Number.isInteger(payload.id_invoice) ||
      payload.id_invoice <= 0 ||
      !invoices.some((invoice) => invoice.id_invoice === payload.id_invoice)
    ) {
      setErrors({ id_invoice: "Pilih invoice yang valid." });
      return;
    }
    if (!payload.tanggal) {
      setErrors({ tanggal: "Tanggal wajib diisi." });
      return;
    }
    if (
      !Number.isFinite(payload.debit) ||
      payload.debit < 0 ||
      !Number.isFinite(payload.kredit) ||
      payload.kredit < 0
    ) {
      toast.error("Debit dan kredit harus berupa angka nol atau lebih.");
      return;
    }
    if (payload.keterangan && payload.keterangan.length > 255) {
      setErrors({ keterangan: "Keterangan maksimal 255 karakter." });
      return;
    }

    const onSuccess = () => {
      toast.success(
        piutang
          ? "Kartu piutang berhasil diperbarui"
          : "Kartu piutang berhasil dibuat",
      );
      closeForm(false);
    };
    const onError = (error: Error) => {
      setErrors(fieldErrors(error));
      toast.error(errorMessage(error));
    };

    if (piutang) {
      update.mutate(
        { id_piutang: piutang.id_piutang, ...payload },
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
      title={piutang ? "Ubah Kartu Piutang" : "Tambah Kartu Piutang"}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField
          label="Outlet"
          htmlFor="id_outlet"
          required
          error={errors.id_outlet}
        >
          <SelectInput
            id="id_outlet"
            name="id_outlet"
            required
            defaultValue={piutang?.id_outlet.toString()}
            disabled={optionsLoading || optionsError}
            placeholder={
              outletsLoading
                ? "Memuat outlet…"
                : outletsError
                  ? "Gagal memuat outlet"
                  : "Pilih outlet…"
            }
            options={outlets.map((outlet) => ({
              value: String(outlet.id_outlet),
              label: outlet.nama_outlet,
            }))}
            aria-invalid={!!errors.id_outlet}
          />
        </FormField>

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
            defaultValue={piutang?.id_invoice.toString()}
            disabled={optionsLoading || optionsError}
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
            defaultValue={toDateInput(piutang?.tanggal) || today()}
            aria-invalid={!!errors.tanggal}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Debit"
            htmlFor="debit"
            required
            error={errors.debit}
          >
            <Input
              id="debit"
              name="debit"
              type="number"
              min={0}
              step="any"
              required
              defaultValue={piutang?.debit ?? 0}
              aria-invalid={!!errors.debit}
            />
          </FormField>
          <FormField
            label="Kredit"
            htmlFor="kredit"
            required
            error={errors.kredit}
          >
            <Input
              id="kredit"
              name="kredit"
              type="number"
              min={0}
              step="any"
              required
              defaultValue={piutang?.kredit ?? 0}
              aria-invalid={!!errors.kredit}
            />
          </FormField>
        </div>

        <FormField
          label="Keterangan"
          htmlFor="keterangan"
          error={errors.keterangan}
        >
          <Input
            id="keterangan"
            name="keterangan"
            maxLength={255}
            defaultValue={piutang?.keterangan ?? ""}
            aria-invalid={!!errors.keterangan}
          />
        </FormField>

        {optionsError && (
          <p className="text-sm text-destructive">
            Gagal memuat pilihan outlet atau invoice. Periksa akses lalu coba
            lagi.
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Debit dan kredit dicatat terpisah; saldo akhir tidak dihitung pada
          form ini.
        </p>

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
