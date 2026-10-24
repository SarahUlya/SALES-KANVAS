import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { RowActions } from "@/components/shared/row-actions";
import { SearchInput } from "@/components/shared/search-input";
import { usePermission } from "@/auth/hooks/usePermission";
import { errorMessage } from "@/lib/errors";
import {
  useMarketAreas,
  useDeleteMarketArea,
} from "../hooks/useMarketArea";import type { MarketArea } from "../types/marketArea.types";
import { MarketAreaForm } from "./market-area-form";

export function MarketAreaPage() {
  const { data = [], isLoading, isError } = useMarketAreas();
  const remove = useDeleteMarketArea();
  const canWrite = usePermission()("market-area:write");

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MarketArea | null>(null);
  const [deleting, setDeleting] = useState<MarketArea | null>(null);

  const openForm = (row: MarketArea | null) => {
    setEditing(row);
    setFormOpen(true);
  };

  const columns: ColumnDef<MarketArea>[] = [
    { accessorKey: "nama_wilayah", header: "Area" },

    ...(canWrite
      ? [
          {
            id: "actions",
            cell: ({ row }) => (
              <RowActions
                onEdit={() => openForm(row.original)}
                onDelete={() => setDeleting(row.original)}
              />
            ),
          } satisfies ColumnDef<MarketArea>,
        ]
      : []),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        globalFilter={search}
        toolbar={
          <>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {canWrite && (
              <Button className="ml-auto" onClick={() => openForm(null)}>
                <Plus /> Tambah
              </Button>
            )}
          </>
        }
      />

      <MarketAreaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        marketArea={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Hapus market area?"
        description={`"${deleting?.nama_wilayah}" akan dihapus. Market area yang sudah dipakai plan tidak bisa dihapus.`}
        isPending={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id_wilayah, {
            onSuccess: () => {
              toast.success("Market area dihapus");
              setDeleting(null);
            },
            onError: (error) => toast.error(errorMessage(error)),
          })
        }
      />
    </>
  );
}
