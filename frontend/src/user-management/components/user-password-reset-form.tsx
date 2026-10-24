import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/errors";
import { useResetUserPassword } from "../hooks/useUsers";
import type { ManagedUser } from "../types/user.types";

type Props = {
  user: ManagedUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserPasswordResetForm({ user, open, onOpenChange }: Props) {
  const resetPassword = useResetUserPassword();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const clearSensitiveState = () => {
    setPassword("");
    setConfirmation("");
    setError("");
    setConfirmOpen(false);
    resetPassword.reset();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) clearSensitiveState();
    onOpenChange(nextOpen);
  };

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password baru harus minimal 8 karakter.");
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      setError("Password baru tidak boleh lebih dari 72 byte.");
      return;
    }
    if (password !== confirmation) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (!user) return;

    setConfirmOpen(true);
  }

  const confirmReset = () => {
    if (
      !user ||
      password.length < 8 ||
      new TextEncoder().encode(password).length > 72 ||
      password !== confirmation
    )
      return;

    resetPassword.mutate(
      { id_user: user.id_user, password },
      {
        onSuccess: () => {
          toast.success(`Password User ${user.username} berhasil direset`);
          clearSensitiveState();
          onOpenChange(false);
        },
        onError: (cause) => {
          toast.error(errorMessage(cause));
          setConfirmOpen(false);
        },
      },
    );
  };
  const passwordError = error.includes("Konfirmasi") ? undefined : error;

  return (
    <>
      <Modal
        open={open}
        onOpenChange={handleOpenChange}
        title="Reset Password"
        description={
          user
            ? `Tetapkan password baru untuk User "${user.username}". Password lama tidak diminta.`
            : undefined
        }
      >
        <form onSubmit={onSubmit} className="grid gap-4">
          <FormField
            label="Password baru"
            htmlFor="new-user-password"
            required
            error={passwordError}
          >
            <Input
              id="new-user-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
              autoFocus
              aria-invalid={!!passwordError}
            />
          </FormField>
          <FormField
            label="Konfirmasi password"
            htmlFor="confirm-user-password"
            required
            error={error && error.includes("Konfirmasi") ? error : undefined}
          >
            <Input
              id="confirm-user-password"
              type="password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              minLength={8}
              required
              aria-invalid={error.includes("Konfirmasi")}
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={!user || resetPassword.isPending}>
              Lanjutkan
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Konfirmasi reset password?"
        description={`Password akun "${user?.username}" akan diganti dengan password baru yang dimasukkan.`}
        confirmLabel="Reset Password"
        destructive={false}
        isPending={resetPassword.isPending}
        onConfirm={confirmReset}
      />
    </>
  );
}
