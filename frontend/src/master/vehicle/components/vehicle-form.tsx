
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, text, type FieldErrors } from "@/lib/form";
import { useSaveVehicle } from "../hooks/useVehicle";
import type { Vehicle } from "../types/vehicle.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
};

const VEHICLE_TYPES = ["Truk", "Pick Up", "Box", "Bus", "Mobil"];

export function VehicleForm({ open, onOpenChange, vehicle }: Props) {
  const save = useSaveVehicle();
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
        id: vehicle?.id_kendaraan,
        nomor_plat: text(fd, "nomor_plat").toUpperCase(),
        jenis: text(fd, "jenis") || null,
        status: text(fd, "status") || null,
      },
      {
        onSuccess: () => {
          toast.success(
            vehicle ? "Kendaraan diperbarui" : "Kendaraan ditambahkan",
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
      title={vehicle ? "Ubah Kendaraan" : "Tambah Kendaraan"}
    >
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Nomor Polisi"
          htmlFor="nomor_plat"
          required
          error={errors.nomor_plat}
        >
          <Input
            id="nomor_plat"
            name="nomor_plat"
            required
            autoFocus
            placeholder="K 1234 AB"
            className="uppercase"
            defaultValue={vehicle?.nomor_plat ?? ""}
            aria-invalid={!!errors.nomor_plat}
          />
        </FormField>

        <FormField
          label="Jenis Kendaraan"
          htmlFor="jenis"
          error={errors.jenis}
        >
          <Input
            id="jenis"
            name="jenis"
            list="vehicle-types"
            defaultValue={vehicle?.jenis ?? ""}
            aria-invalid={!!errors.jenis}
          />
          <datalist id="vehicle-types">
            {VEHICLE_TYPES.map((type) => (
              <option key={type} value={type} />
            ))}
          </datalist>
        </FormField>

        <FormField label="Status" htmlFor="status" error={errors.status}>
          <Input
            id="status"
            name="status"
            placeholder="Aktif / Tidak aktif"
            defaultValue={vehicle?.status ?? ""}
            aria-invalid={!!errors.status}
          />
        </FormField>

        <DialogFooter className="sm:col-span-2">
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
