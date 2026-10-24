import { useEffect, useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";
import { Modal } from "@/components/shared/modal";
import { errorMessage } from "@/lib/errors";
import { useUpdateUsername } from "../hooks/useUsers";
import type { ManagedUser } from "../types/user.types";

type Props = {
  user: ManagedUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserUsernameForm({ user, open, onOpenChange }: Props) {
  const update = useUpdateUsername();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && user) setUsername(user.username);
    if (!open) {
      setUsername("");
      setError("");
      update.reset();
    }
  }, [open, user]);

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextUsername = username.trim();

    if (!nextUsername || nextUsername.length > 50) {
      setError("Username wajib diisi dan maksimal 50 karakter.");
      return;
    }
    if (!user) return;

    setError("");
    update.mutate(
      { id_user: user.id_user, username: nextUsername },
      {
        onSuccess: () => {
          toast.success("Username berhasil diperbarui");
          onOpenChange(false);
        },
        onError: (cause) => toast.error(errorMessage(cause)),
      },
    );
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Username"
      description={user ? `Perbarui username untuk User #${user.id_user}.` : undefined}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField
          label="Username"
          htmlFor="edit-username"
          required
          error={error}
        >
          <Input
            id="edit-username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="off"
            required
            maxLength={50}
            autoFocus
            aria-invalid={!!error}
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
          <Button type="submit" disabled={!user || update.isPending}>
            {update.isPending ? "Menyimpan…" : "Simpan Username"}
          </Button>
        </DialogFooter>
      </form>
    </Modal>
  );
}
