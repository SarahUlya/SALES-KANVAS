import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEmployees } from "@/master/employee/hooks/useEmployee";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, num, text, type FieldErrors } from "@/lib/form";
import { toDateInput } from "@/lib/format";
import { useSaveKasbonOperasional } from "../hooks/useKasbonOperasional";
import type { KasbonOperasional } from "../types/kasbonOperasional.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kasbon: KasbonOperasional | null;
};

const today = () => new Date().toLocaleDateString("en-CA");

export function KasbonOperasionalForm({
  open,
  onOpenChange,
  kasbon,
}: Props) {
  const save = useSaveKasbonOperasional();
  const {
    data: employees = [],
    isLoading: employeesLoading,
    isError: employeesError,
  } = useEmployees();
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setErrors({});
    onOpenChange(isOpen);
  };

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setErrors({});

    save.mutate(
      {
        ...(kasbon ? { id: kasbon.id_kasbon_operasional } : {}),
        id_karyawan: num(fd, "id_karyawan"),
        tanggal: text(fd, "tanggal"),
        jumlah: num(fd, "jumlah"),
        keterangan: text(fd, "keterangan") || null,
        status: text(fd, "status"),
      },
      {
        onSuccess: () => {
          toast.success(
            kasbon
              ? "Kasbon operasional diperbarui"
              : "Kasbon operasional ditambahkan",
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
      title={kasbon ? "Ubah Kasbon Operasional" : "Tambah Kasbon Operasional"}
      className="sm:max-w-xl"
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
            disabled={employeesLoading || employeesError}
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
            defaultValue={kasbon?.id_karyawan.toString()}
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
            defaultValue={toDateInput(kasbon?.tanggal) || today()}
            aria-invalid={!!errors.tanggal}
          />
        </FormField>

        <FormField
          label="Jumlah"
          htmlFor="jumlah"
          required
          error={errors.jumlah}
        >
          <Input
            id="jumlah"
            name="jumlah"
            type="number"
            min="0.01"
            step="0.01"
            required
            defaultValue={kasbon?.jumlah ?? ""}
            aria-invalid={!!errors.jumlah}
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
            defaultValue={kasbon?.keterangan ?? ""}
            aria-invalid={!!errors.keterangan}
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
            defaultValue={kasbon?.status ?? ""}
            aria-invalid={!!errors.status}
          />
        </FormField>

        {employeesError && (
          <p className="text-sm text-destructive">
            Gagal memuat daftar karyawan. Coba muat ulang halaman.
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
            disabled={save.isPending || employeesLoading || employeesError}
          >
            {save.isPending ? "Menyimpan…" : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
