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
import { useBatchProdukInOptions, useCreateProdukIn, useUpdateProdukIn } from "../hooks/useProdukIn";
import type { DetailProdukInPayload, ProdukIn, ProdukInPayload } from "../types/produkIn.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produkIn: ProdukIn | null;
};

type DetailRow = {
  key: number;
  id_produk: string;
  id_batch: string;
  qty: string;
};

const today = () => new Date().toLocaleDateString("en-CA");
const newDetail = (): DetailRow => ({
  key: Date.now() + Math.random(),
  id_produk: "",
  id_batch: "",
  qty: "1",
});

export function ProdukInForm({ open, onOpenChange, produkIn }: Props) {
  const create = useCreateProdukIn();
  const update = useUpdateProdukIn();
  const { data: gudangs = [], isLoading: gudangLoading, isError: gudangError } = useGudangList();
  const { data: products = [], isLoading: productsLoading, isError: productsError } = useProducts();
  const { data: batches = [], isLoading: batchesLoading, isError: batchesError } = useBatchProdukInOptions();
  const [details, setDetails] = useState<DetailRow[]>(() =>
    produkIn?.detailProdukIn.length
      ? produkIn.detailProdukIn.map((detail) => ({
          key: detail.id_detail_in,
          id_produk: String(detail.id_produk),
          id_batch: String(detail.id_batch),
          qty: String(detail.qty),
        }))
      : [newDetail()],
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const optionsLoading = gudangLoading || productsLoading || batchesLoading;
  const optionsError = gudangError || productsError || batchesError;
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

    const detailProdukIn: DetailProdukInPayload[] = details.map((detail) => ({
      id_produk: Number(detail.id_produk),
      id_batch: Number(detail.id_batch),
      qty: Number(detail.qty),
    }));
    if (
      detailProdukIn.some(
        ({ id_produk, id_batch, qty }) =>
          !Number.isInteger(id_produk) ||
          id_produk <= 0 ||
          !Number.isInteger(id_batch) ||
          id_batch <= 0 ||
          !Number.isInteger(qty) ||
          qty <= 0,
      )
    ) {
      toast.error("Pilih produk dan batch, lalu isi qty bilangan bulat positif.");
      return;
    }
    if (
      detailProdukIn.some(
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

    const id_gudang = Number(formData.get("id_gudang"));
    const tanggal = String(formData.get("tanggal") ?? "").trim();
    const jenis_transaksi = String(formData.get("jenis_transaksi") ?? "").trim();
    const keteranganValue = String(formData.get("keterangan") ?? "").trim();
    if (!Number.isInteger(id_gudang) || id_gudang <= 0) {
      setErrors({ id_gudang: "Pilih gudang yang valid." });
      return;
    }
    if (!tanggal || !jenis_transaksi) {
      toast.error("Tanggal dan jenis transaksi wajib diisi.");
      return;
    }
    if (jenis_transaksi.length > 30) {
      setErrors({ jenis_transaksi: "Jenis transaksi maksimal 30 karakter." });
      return;
    }
    if (keteranganValue.length > 255) {
      setErrors({ keterangan: "Keterangan maksimal 255 karakter." });
      return;
    }

    const payload: ProdukInPayload = {
      id_gudang,
      tanggal,
      jenis_transaksi,
      ...(keteranganValue ? { keterangan: keteranganValue } : {}),
      detailProdukIn,
    };
    const onSuccess = () => {
      toast.success(produkIn ? "Produk masuk diperbarui" : "Produk masuk berhasil dibuat");
      handleOpenChange(false);
    };
    const onError = (error: Error) => {
      setErrors(fieldErrors(error));
      toast.error(errorMessage(error));
    };

    if (produkIn) {
      update.mutate(
        { id_produk_in: produkIn.id_produk_in, ...payload },
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
      title={produkIn ? "Ubah Produk Masuk" : "Tambah Produk Masuk"}
      className="sm:max-w-3xl"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
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
            defaultValue={produkIn?.id_gudang.toString()}
            aria-invalid={!!errors.id_gudang}
          />
        </FormField>

        <FormField label="Tanggal" htmlFor="tanggal" required error={errors.tanggal}>
          <Input
            id="tanggal"
            name="tanggal"
            type="date"
            required
            defaultValue={toDateInput(produkIn?.tanggal) || today()}
            aria-invalid={!!errors.tanggal}
          />
        </FormField>

        <FormField
          label="Jenis Transaksi"
          htmlFor="jenis_transaksi"
          required
          error={errors.jenis_transaksi}
        >
          <Input
            id="jenis_transaksi"
            name="jenis_transaksi"
            required
            maxLength={30}
            defaultValue={produkIn?.jenis_transaksi ?? ""}
            aria-invalid={!!errors.jenis_transaksi}
          />
        </FormField>

        <FormField label="Keterangan" htmlFor="keterangan" error={errors.keterangan}>
          <Input
            id="keterangan"
            name="keterangan"
            maxLength={255}
            defaultValue={produkIn?.keterangan ?? ""}
            aria-invalid={!!errors.keterangan}
          />
        </FormField>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-medium">Detail Barang</legend>
          {details.map((detail, index) => {
            const matchingBatches = batches.filter(
              (batch) => String(batch.id_produk) === detail.id_produk,
            );
            return (
              <div
                key={detail.key}
                className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_1fr_7rem_auto] sm:items-end"
              >
                <FormField label={`Produk ${index + 1}`} htmlFor={`produk-${detail.key}`} required>
                  <SelectInput
                    id={`produk-${detail.key}`}
                    value={detail.id_produk}
                    onValueChange={(value) => updateDetail(detail.key, "id_produk", value)}
                    required
                    disabled={optionsLoading || optionsError}
                    placeholder={productsLoading ? "Memuat produk…" : "Pilih produk…"}
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
                    placeholder={!detail.id_produk ? "Pilih produk dahulu" : batchesError ? "Gagal memuat batch" : "Pilih batch…"}
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
                  aria-label={`Hapus detail barang ${index + 1}`}
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
            onClick={() => setDetails((current) => [...current, newDetail()])}
          >
            <Plus /> Tambah Barang
          </Button>
        </fieldset>

        {optionsError && (
          <p className="text-sm text-destructive">
            Gagal memuat pilihan gudang, produk, atau batch. Coba muat ulang halaman.
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
