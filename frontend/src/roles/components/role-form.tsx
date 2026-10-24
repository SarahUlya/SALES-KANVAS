import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, text, type FieldErrors } from "@/lib/form";
import { useSaveRole } from "../hooks/useRoles";
import type { Role } from "../types/role.types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
};

export function RoleForm({ open, onOpenChange, role }: Props) {
  const save = useSaveRole();
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setErrors({});
    onOpenChange(nextOpen);
  };

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const form = new FormData(event.currentTarget);
    save.mutate(
      { id: role?.id, name: text(form, "name") },
      {
        onSuccess: () => {
          toast.success(role ? "Nama role diperbarui" : "Role ditambahkan");
          handleOpenChange(false);
        },
        onError: (error) => {
          setErrors(fieldErrors(error));
          toast.error(errorMessage(error));
        },
      },
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title={role ? "Ubah Nama Role" : "Tambah Role"}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField label="Nama role" htmlFor="role-name" required error={errors.name}>
          <Input
            id="role-name"
            name="name"
            required
            autoFocus
            defaultValue={role?.name ?? ""}
            aria-invalid={!!errors.name}
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
