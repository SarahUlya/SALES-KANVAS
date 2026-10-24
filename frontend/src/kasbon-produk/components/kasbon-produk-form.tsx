import { useState, type SubmitEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEmployees } from "@/master/employee/hooks/useEmployee";
import { useProducts } from "@/master/product/hooks/useProduct";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, num, text, type FieldErrors } from "@/lib/form";
import { useSaveKasbonProduk } from "../hooks/useKasbonProduk";
import type {
  DetailKasbonProdukPayload,
  KasbonProdukPayload,
} from "../types/kasbonProduk.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type DetailRow = {
  id: number;
  id_produk: string;
  qty: string;
};

const today = () => new Date().toLocaleDateString("en-CA");
const newDetail = (): DetailRow => ({
  id: Date.now() + Math.random(),
  id_produk: "",
  qty: "1",
});

export function KasbonProdukForm({ open, onOpenChange }: Props) {
  const create = useSaveKasbonProduk();
  const {
    data: employees = [],
    isLoading: employeesLoading,
    isError: employeesError,
  } = useEmployees();
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts();
  const [details, setDetails] = useState<DetailRow[]>([newDetail()]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const optionsLoading = employeesLoading || productsLoading;
  const optionsError = employeesError || productsError;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setErrors({});
      setDetails([newDetail()]);
    }
    onOpenChange(isOpen);
  };

  const updateDetail = (
    id: number,
    field: "id_produk" | "qty",
    value: string,
  ) => {
    setDetails((current) =>
      current.map((detail) =>
        detail.id === id ? { ...detail, [field]: value } : detail,
      ),
    );
  };

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setErrors({});

    const detailKasbonProduk: DetailKasbonProdukPayload[] = details.map(
      (detail) => ({
        id_produk: Number(detail.id_produk),
        qty: Number(detail.qty),
      }),
    );
    if (
      detailKasbonProduk.some(
        ({ id_produk, qty }) =>
          !Number.isInteger(id_produk) ||
          id_produk <= 0 ||
          !Number.isInteger(qty) ||
          qty <= 0,
      )
    ) {
      toast.error("Pilih produk dan masukkan kuantitas bilangan bulat positif.");
      return;
    }

    const payload: KasbonProdukPayload = {
      id_karyawan: num(fd, "id_karyawan"),
      tanggal: text(fd, "tanggal"),
      status: text(fd, "status"),
      ...(text(fd, "keterangan")
        ? { keterangan: text(fd, "keterangan") }
        : {}),
      detailKasbonProduk,
    };

    create.mutate(payload, {
      onSuccess: () => {
        toast.success("Kasbon produk berhasil dibuat");
        handleOpenChange(false);
      },
      onError: (err) => {
        setErrors(fieldErrors(err));
        toast.error(errorMessage(err));
      },
    });
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Tambah Kasbon Produk"
      className="sm:max-w-2xl"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
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
            disabled={optionsLoading || optionsError}
            placeholder={
              employeesError
                ? "Gagal memuat karyawan"
                : employeesLoading
                  ? "Memuat karyawan…"
                  : "Pilih karyawan…"
            }
            options={employees.map((employee) => ({
              value: String(employee.id_user),
              label: employee.nama,
            }))}
            aria-invalid={!!errors.id_karyawan}
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
            defaultValue={today()}
            aria-invalid={!!errors.tanggal}
          />
        </FormField>

        <FormField
          label="Status"
          htmlFor="status"
          required
          error={errors.status}
        >
          <Input
            id="status"
            name="status"
            required
            maxLength={20}
            aria-invalid={!!errors.status}
          />
        </FormField>

        <FormField
          label="Keterangan"
          htmlFor="keterangan"
          error={errors.keterangan}
        >
          <Input
            id="keterangan"
            name="keterangan"
            maxLength={255}
            aria-invalid={!!errors.keterangan}
          />
        </FormField>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-medium">Detail Produk</legend>
          {details.map((detail, index) => (
            <div
              key={detail.id}
              className="grid gap-2 rounded-md border p-3 sm:grid-cols-[1fr_8rem_auto] sm:items-end"
            >
              <FormField
                label={`Produk ${index + 1}`}
                htmlFor={`id_produk-${detail.id}`}
                required
              >
                <SelectInput
                  id={`id_produk-${detail.id}`}
                  value={detail.id_produk}
                  onValueChange={(value) =>
                    updateDetail(detail.id, "id_produk", value)
                  }
                  required
                  disabled={productsLoading || productsError}
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
                />
              </FormField>
              <FormField
                label="Qty"
                htmlFor={`qty-${detail.id}`}
                required
              >
                <Input
                  id={`qty-${detail.id}`}
                  type="number"
                  min={1}
                  step={1}
                  required
                  value={detail.qty}
                  onChange={(event) =>
                    updateDetail(detail.id, "qty", event.target.value)
                  }
                />
              </FormField>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Hapus produk ${index + 1}`}
                disabled={details.length === 1}
                onClick={() =>
                  setDetails((current) =>
                    current.filter((row) => row.id !== detail.id),
                  )
                }
              >
                <Trash2 />
              </Button>
            </div>
          ))}
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
            Gagal memuat pilihan karyawan atau produk. Coba muat ulang halaman.
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
          <Button
            type="submit"
            disabled={create.isPending || optionsLoading || optionsError}
          >
            {create.isPending ? "Menyimpan…" : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
