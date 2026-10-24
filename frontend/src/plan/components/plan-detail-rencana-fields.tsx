import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/shared/select-input";
import type { Outlet } from "@/master/outlet/types/outlet.types";
import type { PlanOutletPayload } from "../types/plan.types";

type Props = {
  rows: PlanOutletPayload[];
  onChange: (rows: PlanOutletPayload[]) => void;
  outlets: Outlet[];
  disabled?: boolean;
};

export function PlanDetailRencanaFields({
  rows,
  onChange,
  outlets,
  disabled,
}: Props) {
  const options = outlets.map((outlet) => ({
    value: String(outlet.id_outlet),
    label: outlet.nama_outlet,
  }));

  return (
    <section className="grid gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Rencana Outlet</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() =>
            onChange([...rows, { id_outlet: 0, urutan: rows.length + 1 }])
          }
        >
          <Plus /> Tambah outlet
        </Button>
      </div>
      {!rows.length ? (
        <p className="text-sm text-muted-foreground">Belum ada outlet.</p>
      ) : (
        rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_6rem_auto] items-center gap-2"
          >
            <SelectInput
              aria-label={`Outlet urutan ${index + 1}`}
              placeholder="Pilih outlet…"
              required
              disabled={disabled}
              options={options}
              value={row.id_outlet ? String(row.id_outlet) : ""}
              onValueChange={(value) =>
                onChange(
                  rows.map((item, rowIndex) =>
                    rowIndex === index
                      ? { ...item, id_outlet: Number(value) || 0 }
                      : item,
                  ),
                )
              }
            />
            <Input
              aria-label="Urutan"
              type="number"
              min={1}
              step={1}
              required
              disabled={disabled}
              value={row.urutan || ""}
              onChange={(event) =>
                onChange(
                  rows.map((item, rowIndex) =>
                    rowIndex === index
                      ? { ...item, urutan: Number(event.target.value) || 0 }
                      : item,
                  ),
                )
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Hapus outlet"
              disabled={disabled}
              onClick={() => onChange(rows.filter((_, i) => i !== index))}
            >
              <X />
            </Button>
          </div>
        ))
      )}
    </section>
  );
}
