import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function RowActions({ onView, onEdit, onDelete }: Props) {
  return (
    <div className="flex justify-end gap-1">
      {onView && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Detail"
          onClick={onView}
        >
          <Eye />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="icon-sm" aria-label="Ubah" onClick={onEdit}>
          <Pencil />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="icon-sm" aria-label="Hapus" onClick={onDelete}>
          <Trash2 className="text-destructive" />
        </Button>
      )}
    </div>
  );
}
