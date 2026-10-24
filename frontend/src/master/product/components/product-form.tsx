
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, text, type FieldErrors } from "@/lib/form";
import { useSaveProduct } from "../hooks/useProduct";
import type { Product } from "../types/product.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
};

const STATUS_OPTIONS = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

export function ProductForm({ open, onOpenChange, product }: Props) {
  const save = useSaveProduct();
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleOpenChange = (o: boolean) => {
    if (!o) setErrors({});
    onOpenChange(o);
  };

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    setErrors({});

    save.mutate(
      {
        id: product?.id_produk,
        nama_produk: text(fd, "nama_produk"),
        barcode: text(fd, "barcode") || null,
        satuan: text(fd, "satuan") || null,
        status: text(fd, "status"),
      },
      {
        onSuccess: () => {
          toast.success(
            product ? "Produk diperbarui" : "Produk ditambahkan",
          );
          handleOpenChange(false);
        },
        onError: (err) => {
          setErrors(fieldErrors(err));
          toast.error(errorMessage(err));
        },
      },
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={product ? "Ubah Produk" : "Tambah Produk"}
      className="sm:max-w-xl"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField
          label="Nama Produk"
          htmlFor="nama_produk"
          required
          error={errors.nama_produk}
        >
          <Input
            id="nama_produk"
            name="nama_produk"
            required
            autoFocus
            defaultValue={product?.nama_produk ?? ""}
            aria-invalid={!!errors.nama_produk}
          />
        </FormField>

        <FormField
          label="Barcode"
          htmlFor="barcode"
          error={errors.barcode}
        >
          <Input
            id="barcode"
            name="barcode"
            defaultValue={product?.barcode ?? ""}
            aria-invalid={!!errors.barcode}
          />
        </FormField>

        <FormField
          label="Satuan"
          htmlFor="satuan"
          error={errors.satuan}
        >
          <Input
            id="satuan"
            name="satuan"
            placeholder="Contoh: pcs, pak"
            defaultValue={product?.satuan ?? ""}
            aria-invalid={!!errors.satuan}
          />
        </FormField>

        <FormField
          label="Status"
          htmlFor="status"
          required
          error={errors.status}
        >
          <SelectInput
            id="status"
            name="status"
            required
            options={STATUS_OPTIONS}
            defaultValue={product?.status ?? "aktif"}
          />
        </FormField>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Batal
          </Button>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Menyimpan…" : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
