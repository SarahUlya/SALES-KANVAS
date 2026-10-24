import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/master/product/hooks/useProduct";
import { useTipeHargaList } from "@/master/tipe-harga/hooks/useTipeHarga";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, type FieldErrors } from "@/lib/form";
import {
  useCreateProdukHarga,
  useUpdateProdukHarga,
} from "../hooks/useProdukHarga";
import type { ProdukHarga } from "../types/produkHarga.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produkHarga: ProdukHarga | null;
};

export function ProdukHargaForm({
  open,
  onOpenChange,
  produkHarga,
}: Props) {
  const create = useCreateProdukHarga();
  const update = useUpdateProdukHarga();
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts();
  const {
    data: tipeHargas = [],
    isLoading: tipeHargasLoading,
    isError: tipeHargasError,
  } = useTipeHargaList();
  const [errors, setErrors] = useState<FieldErrors>({});
  const optionsLoading = productsLoading || tipeHargasLoading;
  const optionsError = productsError || tipeHargasError;
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
    const id_tipe_harga = Number(formData.get("id_tipe_harga"));
    const hargaValue = String(formData.get("harga") ?? "").trim();
    const harga = Number(hargaValue);

    if (!Number.isInteger(id_produk) || id_produk <= 0) {
      setErrors({ id_produk: "Pilih produk yang valid." });
      return;
    }
    if (!Number.isInteger(id_tipe_harga) || id_tipe_harga <= 0) {
      setErrors({ id_tipe_harga: "Pilih tipe harga yang valid." });
      return;
    }
    if (hargaValue === "" || !Number.isFinite(harga) || harga < 0) {
      setErrors({ harga: "Harga harus berupa angka nol atau lebih." });
      return;
    }

    const payload = { id_produk, id_tipe_harga, harga };
    const onSuccess = () => {
      toast.success(
        produkHarga ? "Harga produk diperbarui" : "Harga produk ditambahkan",
      );
      handleOpenChange(false);
    };
    const onError = (error: Error) => {
      setErrors(fieldErrors(error));
      toast.error(errorMessage(error));
    };

    if (produkHarga) {
      update.mutate(
        { id_produk_harga: produkHarga.id_produk_harga, ...payload },
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
      title={produkHarga ? "Ubah Produk Harga" : "Tambah Produk Harga"}
      className="sm:max-w-xl"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField
          label="Produk"
          htmlFor="id_produk"
          required
          error={errors.id_produk}
        >
          <SelectInput
            id="id_produk"
            name="id_produk"
            required
            disabled={optionsLoading || optionsError}
            placeholder={
              productsError
                ? "Gagal memuat produk"
                : productsLoading
                  ? "Memuat produk…"
                  : "Pilih produk…"
            }
            options={products.map((product) => ({
              value: String(product.id_produk),
              label: product.nama_produk,
            }))}
            defaultValue={produkHarga?.id_produk.toString()}
            aria-invalid={!!errors.id_produk}
          />
        </FormField>

        <FormField
          label="Tipe Harga"
          htmlFor="id_tipe_harga"
          required
          error={errors.id_tipe_harga}
        >
          <SelectInput
            id="id_tipe_harga"
            name="id_tipe_harga"
            required
            disabled={optionsLoading || optionsError}
            placeholder={
              tipeHargasError
                ? "Gagal memuat tipe harga"
                : tipeHargasLoading
                  ? "Memuat tipe harga…"
                  : "Pilih tipe harga…"
            }
            options={tipeHargas.map((tipeHarga) => ({
              value: String(tipeHarga.id_tipe_harga),
              label: tipeHarga.nama_tipe,
            }))}
            defaultValue={produkHarga?.id_tipe_harga.toString()}
            aria-invalid={!!errors.id_tipe_harga}
          />
        </FormField>

        <FormField
          label="Harga"
          htmlFor="harga"
          required
          error={errors.harga}
        >
          <Input
            id="harga"
            name="harga"
            type="number"
            min="0"
            step="any"
            required
            defaultValue={produkHarga?.harga ?? ""}
            aria-invalid={!!errors.harga}
          />
        </FormField>

        {optionsError && (
          <p className="text-sm text-destructive">
            Gagal memuat pilihan produk atau tipe harga. Coba muat ulang halaman.
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
          <Button type="submit" disabled={isPending || optionsLoading || optionsError}>
            {isPending ? "Menyimpan…" : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
