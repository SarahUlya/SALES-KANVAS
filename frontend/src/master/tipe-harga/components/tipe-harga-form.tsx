import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, text, type FieldErrors } from "@/lib/form";
import { useSaveTipeHarga } from "../hooks/useTipeHarga";
import type { TipeHarga } from "../types/tipeHarga.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipeHarga: TipeHarga | null;
};

export function TipeHargaForm({ open, onOpenChange, tipeHarga }: Props) {
  const save = useSaveTipeHarga();
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
        id_tipe_harga: tipeHarga?.id_tipe_harga,
        nama_tipe: text(fd, "nama_tipe"),
      },
      {
        onSuccess: () => {
          toast.success(
            tipeHarga ? "Tipe harga diperbarui" : "Tipe harga ditambahkan",
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
      title={tipeHarga ? "Ubah Tipe Harga" : "Tambah Tipe Harga"}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField
          label="Nama Tipe"
          htmlFor="nama_tipe"
          required
          error={errors.nama_tipe}
        >
          <Input
            id="nama_tipe"
            name="nama_tipe"
            required
            autoFocus
            defaultValue={tipeHarga?.nama_tipe ?? ""}
            aria-invalid={!!errors.nama_tipe}
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
