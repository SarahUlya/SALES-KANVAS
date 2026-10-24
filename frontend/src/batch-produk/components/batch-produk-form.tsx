import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/master/product/hooks/useProduct";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, type FieldErrors } from "@/lib/form";
import { toDateInput } from "@/lib/format";
import {
  useCreateBatchProduk,
  useUpdateBatchProduk,
} from "../hooks/useBatchProduk";
import type { BatchProduk, BatchProdukPayload } from "../types/batchProduk.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: BatchProduk | null;
};

export function BatchProdukForm({ open, onOpenChange, batch }: Props) {
  const create = useCreateBatchProduk();
  const update = useUpdateBatchProduk();
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts();
  const [errors, setErrors] = useState<FieldErrors>({});
  const isPending = create.isPending || update.isPending;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setErrors({});
    onOpenChange(isOpen);
  };

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setErrors({});

    const id_produk = Number(formData.get("id_produk"));
    const stokValue = String(formData.get("stok") ?? "").trim();
    const stok = Number(stokValue);
    if (!Number.isInteger(id_produk) || id_produk <= 0) {
      setErrors({ id_produk: "Pilih produk yang valid." });
      return;
    }
    if (stokValue === "" || !Number.isInteger(stok) || stok < 0) {
      setErrors({ stok: "Stok harus berupa bilangan bulat nol atau lebih." });
      return;
    }

    const kodeBatchValue = String(formData.get("kode_batch") ?? "").trim();
    const expiredDateValue = String(formData.get("expired_date") ?? "").trim();
    const payload: BatchProdukPayload = {
      id_produk,
      kode_batch: kodeBatchValue || null,
      expired_date: expiredDateValue || null,
      stok,
    };

    const onSuccess = () => {
      toast.success(batch ? "Batch produk diperbarui" : "Batch produk ditambahkan");
      handleOpenChange(false);
    };
    const onError = (error: Error) => {
      setErrors(fieldErrors(error));
      toast.error(errorMessage(error));
    };

    if (batch) {
      update.mutate({ id_batch: batch.id_batch, ...payload }, { onSuccess, onError });
    } else {
      create.mutate(payload, { onSuccess, onError });
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={batch ? "Ubah Batch Produk" : "Tambah Batch Produk"}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField label="Produk" htmlFor="id_produk" required error={errors.id_produk}>
          <SelectInput
            id="id_produk"
            name="id_produk"
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
            defaultValue={batch?.id_produk.toString()}
            aria-invalid={!!errors.id_produk}
          />
        </FormField>

        <FormField label="Kode Batch" htmlFor="kode_batch" error={errors.kode_batch}>
          <Input
            id="kode_batch"
            name="kode_batch"
            maxLength={50}
            defaultValue={batch?.kode_batch ?? ""}
            aria-invalid={!!errors.kode_batch}
          />
        </FormField>

        <FormField
          label="Tanggal Kedaluwarsa"
          htmlFor="expired_date"
          error={errors.expired_date}
        >
          <Input
            id="expired_date"
            name="expired_date"
            type="date"
            defaultValue={toDateInput(batch?.expired_date)}
            aria-invalid={!!errors.expired_date}
          />
        </FormField>

        <FormField label="Stok" htmlFor="stok" required error={errors.stok}>
          <Input
            id="stok"
            name="stok"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={batch?.stok ?? 0}
            aria-invalid={!!errors.stok}
          />
        </FormField>

        {productsError && (
          <p className="text-sm text-destructive">
            Gagal memuat daftar produk. Coba muat ulang halaman.
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isPending || productsLoading || productsError}>
            {isPending ? "Menyimpan…" : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
