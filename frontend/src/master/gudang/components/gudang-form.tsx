import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, text, type FieldErrors } from "@/lib/form";
import { useSaveGudang } from "../hooks/useGudang";
import type { Gudang } from "../types/gudang.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gudang: Gudang | null;
};

export function GudangForm({ open, onOpenChange, gudang }: Props) {
  const save = useSaveGudang();
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
        id_gudang: gudang?.id_gudang,
        nama_gudang: text(fd, "nama_gudang"),
        lokasi: text(fd, "lokasi") || null,
      },
      {
        onSuccess: () => {
          toast.success(gudang ? "Gudang diperbarui" : "Gudang ditambahkan");
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
      title={gudang ? "Ubah Gudang" : "Tambah Gudang"}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField
          label="Nama Gudang"
          htmlFor="nama_gudang"
          required
          error={errors.nama_gudang}
        >
          <Input
            id="nama_gudang"
            name="nama_gudang"
            required
            autoFocus
            defaultValue={gudang?.nama_gudang ?? ""}
            aria-invalid={!!errors.nama_gudang}
          />
        </FormField>

        <FormField label="Lokasi" htmlFor="lokasi" error={errors.lokasi}>
          <Input
            id="lokasi"
            name="lokasi"
            defaultValue={gudang?.lokasi ?? ""}
            aria-invalid={!!errors.lokasi}
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
