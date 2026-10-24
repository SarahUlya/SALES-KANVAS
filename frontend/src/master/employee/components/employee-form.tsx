
import { useEffect, useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { SelectInput } from "@/components/shared/select-input";
import { errorMessage } from "@/lib/errors";
import { fieldErrors, text, type FieldErrors } from "@/lib/form";
import { useSaveEmployee } from "../hooks/useEmployee";
import type { Employee, EmployeeUser } from "../types/employee.types";
import { AlertCircle } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  users: EmployeeUser[];
  usersLoading: boolean;
  usersError: boolean;
  onRetryUsers: () => void;
};

const STATUS_OPTIONS = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

export function EmployeeForm({
  open,
  onOpenChange,
  employee,
  users,
  usersLoading,
  usersError,
  onRetryUsers,
}: Props) {
  const save = useSaveEmployee();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    if (open) {
      setErrors({});
      setSelectedUserId("");
    }
  }, [open]);

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setErrors({});
      setSelectedUserId("");
    }
    onOpenChange(o);
  };

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    setErrors({});

    if (!employee && !selectedUserId) {
      setErrors({ id_user: "Pilih akun User." });
      return;
    }

    save.mutate(
      {
        ...(employee ? {} : { id_user: Number(selectedUserId) }),
        id: employee?.id_karyawan,
        nama: text(fd, "nama"),
        no_hp: text(fd, "no_hp") || null,
        status: text(fd, "status"),
      },
      {
        onSuccess: () => {
          toast.success(
            employee ? "Karyawan diperbarui" : "Karyawan ditambahkan",
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
      title={employee ? "Ubah Karyawan" : "Tambah Karyawan"}
      className="sm:max-w-xl"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        {!employee && (
          <FormField
            label="Akun User"
            htmlFor="id_user"
            required
            error={errors.id_user}
          >
            <SelectInput
              id="id_user"
              name="id_user"
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              required
              disabled={usersLoading || usersError}
              placeholder={
                usersLoading
                  ? "Memuat akun…"
                  : usersError
                    ? "Gagal memuat akun"
                    : "Pilih akun User…"
              }
              options={users.map((user) => ({
                value: String(user.id_user),
                label: user.username,
              }))}
              aria-invalid={!!errors.id_user}
            />
            {usersError && (
              <div className="flex items-center justify-between gap-2 text-xs text-destructive">
                <span className="flex items-center gap-1">
                  <AlertCircle className="size-3" /> Gagal memuat akun User.
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRetryUsers}
                >
                  Coba lagi
                </Button>
              </div>
            )}
          </FormField>
        )}

        <FormField
          label="Nama"
          htmlFor="nama"
          required
          error={errors.nama}
        >
          <Input
            id="nama"
            name="nama"
            required
            autoFocus
            defaultValue={employee?.nama ?? ""}
            aria-invalid={!!errors.nama}
          />
        </FormField>

        <FormField label="No. HP" htmlFor="no_hp" error={errors.no_hp}>
          <Input
            id="no_hp"
            name="no_hp"
            type="tel"
            defaultValue={employee?.no_hp ?? ""}
            aria-invalid={!!errors.no_hp}
          />
        </FormField>

        <FormField
          label="Status"
          htmlFor="status"
          required
          error={errors.status}
        >
          <SelectInput
            id="status"
            name="status"
            required
            options={STATUS_OPTIONS}
            defaultValue={employee?.status ?? "aktif"}
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
