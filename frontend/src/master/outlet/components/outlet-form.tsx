import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { useMarketAreas } from "@/master/market-area/hooks/useMarketArea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import { Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, num, text, type FieldErrors } from "@/lib/form";
import { useSaveOutlet } from "../hooks/useOutlet";
import type { Outlet } from "../types/outlet.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  outlet: Outlet | null;
};

export function OutletForm({ open, onOpenChange, outlet }: Props) {
  const save = useSaveOutlet();
  const {
    data: marketAreas = [],
    isLoading: isMarketAreasLoading,
    isError: isMarketAreasError,
  } = useMarketAreas();
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
        id_outlet: outlet?.id_outlet,
        id_wilayah: num(fd, "id_wilayah"),
        nama_outlet: text(fd, "nama_outlet"),
        alamat: text(fd, "alamat"),
        no_hp: text(fd, "no_hp") || null,
      },
      {
        onSuccess: () => {
          toast.success(outlet ? "Outlet diperbarui" : "Outlet ditambahkan");
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
      title={outlet ? "Ubah Outlet" : "Tambah Outlet"}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField
          label="Wilayah"
          htmlFor="id_wilayah"
          required
          error={
            errors.id_wilayah ??
            (isMarketAreasError ? "Gagal memuat daftar wilayah." : undefined)
          }
        >
          <SelectInput
            id="id_wilayah"
            name="id_wilayah"
            required
            disabled={isMarketAreasLoading || isMarketAreasError}
            placeholder={isMarketAreasLoading ? "Memuat wilayah…" : "Pilih wilayah"}
            options={marketAreas.map((area) => ({
              value: String(area.id_wilayah),
              label: area.nama_wilayah,
            }))}
            defaultValue={
              outlet?.id_wilayah ? String(outlet.id_wilayah) : undefined
            }
            aria-invalid={!!errors.id_wilayah || isMarketAreasError}
          />
        </FormField>

        <FormField
          label="Nama Outlet"
          htmlFor="nama_outlet"
          required
          error={errors.nama_outlet}
        >
          <Input
            id="nama_outlet"
            name="nama_outlet"
            required
            autoFocus
            defaultValue={outlet?.nama_outlet ?? ""}
            aria-invalid={!!errors.nama_outlet}
          />
        </FormField>

        <FormField label="Alamat" htmlFor="alamat" required error={errors.alamat}>
          <Input
            id="alamat"
            name="alamat"
            required
            defaultValue={outlet?.alamat ?? ""}
            aria-invalid={!!errors.alamat}
          />
        </FormField>

        <FormField label="No. HP" htmlFor="no_hp" error={errors.no_hp}>
          <Input
            id="no_hp"
            name="no_hp"
            type="tel"
            defaultValue={outlet?.no_hp ?? ""}
            aria-invalid={!!errors.no_hp}
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
          <Button
            type="submit"
            disabled={save.isPending || isMarketAreasLoading || isMarketAreasError}
          >
            {save.isPending ? "Menyimpan…" : "Simpan"}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
