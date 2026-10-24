import { useEffect, useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import type { Role } from "@/roles/types/role.types";
import { useCreateUser } from "../hooks/useUsers";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, text, type FieldErrors } from "@/lib/form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
};

export function UserCreateForm({ open, onOpenChange, roles }: Props) {
  const create = useCreateUser();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (!open) {
      setErrors({});
      setRoleId("");
    }
  }, [open]);

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const formElement = event.currentTarget;
    const username = text(form, "username");
    const password = text(form, "password");
    setErrors({});

    if (!roleId) {
      setErrors({ role_id: "Pilih role." });
      return;
    }

    create.mutate(
      { username, password, role_id: Number(roleId) },
      {
        onSuccess: () => {
          toast.success("Akun berhasil ditambahkan");
          formElement.reset();
          create.reset();
          onOpenChange(false);
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
      onOpenChange={onOpenChange}
      title="Tambah Akun"
      description="Buat akun baru dan tentukan role-nya."
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField
          label="Username"
          htmlFor="user-username"
          required
          error={errors.username}
        >
          <Input
            id="user-username"
            name="username"
            autoComplete="off"
            required
            autoFocus
            aria-invalid={!!errors.username}
          />
        </FormField>
        <FormField
          label="Password"
          htmlFor="user-password"
          required
          error={errors.password}
        >
          <Input
            id="user-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={!!errors.password}
          />
        </FormField>
        <FormField
          label="Role"
          htmlFor="user-role"
          required
          error={errors.role_id}
        >
          <SelectInput
            id="user-role"
            required
            options={roles.map((role) => ({
              value: String(role.id),
              label: role.name,
            }))}
            value={roleId}
            onValueChange={setRoleId}
            aria-invalid={!!errors.role_id}
          />
        </FormField>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button type="submit" disabled={create.isPending || !roles.length}>
            {create.isPending ? "Menyimpan…" : "Simpan Akun"}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
