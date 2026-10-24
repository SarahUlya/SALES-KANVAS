import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { usePermission } from "@/auth/hooks/usePermission";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { RowActions } from "@/components/shared/row-actions";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/errors";
import { useMarketAreas } from "@/master/market-area/hooks/useMarketArea";
import { useDeleteOutlet, useOutlets } from "../hooks/useOutlet";
import type { Outlet } from "../types/outlet.types";
import { OutletForm } from "./outlet-form";

export function OutletPage() {
  const { data = [], isLoading, isError } = useOutlets();
  const {
    data: marketAreas = [],
    isLoading: isMarketAreasLoading,
    isError: isMarketAreasError,
  } = useMarketAreas();
  const remove = useDeleteOutlet();
  const canWrite = usePermission()("outlet:write");

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Outlet | null>(null);
  const [deleting, setDeleting] = useState<Outlet | null>(null);

  const openForm = (row: Outlet | null) => {
    setEditing(row);
    setFormOpen(true);
  };
  const marketAreaNames = new Map(
    marketAreas.map((area) => [area.id_wilayah, area.nama_wilayah]),
  );

  const columns: ColumnDef<Outlet>[] = [
    {
      accessorKey: "nama_outlet",
      header: "Nama Outlet",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nama_outlet}</span>
      ),
    },
    {
      id: "wilayah",
      accessorFn: (row) =>
        marketAreaNames.get(row.id_wilayah) ?? `Wilayah #${row.id_wilayah}`,
      header: "Wilayah",
      cell: ({ row }) =>
        marketAreaNames.get(row.original.id_wilayah) ??
        `Wilayah #${row.original.id_wilayah}`,
    },
    {
      accessorKey: "alamat",
      header: "Alamat",
      cell: ({ row }) => row.original.alamat || "-",
    },
    {
      accessorKey: "no_hp",
      header: "No. HP",
      cell: ({ row }) => row.original.no_hp || "-",
    },
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
          } satisfies ColumnDef<Outlet>,
        ]
      : []),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading || isMarketAreasLoading}
        isError={isError || isMarketAreasError}
        globalFilter={search}
        toolbar={
          <>
            <SearchInput
              placeholder="Cari nama outlet, wilayah, alamat, atau no. HP…"
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

      <OutletForm
        open={formOpen}
        onOpenChange={setFormOpen}
        outlet={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(isOpen) => !isOpen && setDeleting(null)}
        title="Hapus outlet?"
        description={`"${deleting?.nama_outlet}" akan dihapus.`}
        isPending={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id_outlet, {
            onSuccess: () => {
              toast.success("Outlet dihapus");
              setDeleting(null);
            },
            onError: (err) => toast.error(errorMessage(err)),
          })
        }
      />
    </>
  );
}
