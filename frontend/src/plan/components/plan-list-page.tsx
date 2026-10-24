import type { SubmitEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type {
  ColumnDef,
  PaginationState,
  Updater,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { FormField } from "@/components/shared/form-field";
import { RowActions } from "@/components/shared/row-actions";
import { SearchInput } from "@/components/shared/search-input";
import { SelectInput } from "@/components/shared/select-input";
import { usePermission } from "@/auth/hooks/usePermission";
import { useMarketAreas } from "@/master/market-area/hooks/useMarketArea";
import { formatDate } from "@/lib/format";
import { usePlans } from "../hooks/usePlan";
import {
  PLAN_STATUSES,
  type Plan,
  type PlanListQuery,
} from "../types/plan.types";
import { PlanStatusBadge, STATUS_LABEL } from "./plan-status-badge";

const ALL = { value: "", label: "Semua" };

export function PlanListPage() {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();
  const canWrite = usePermission()("plan:write");
  const { data: marketAreas = [] } = useMarketAreas();
  const requestedStatus = sp.get("status");
  const status = PLAN_STATUSES.find((item) => item === requestedStatus);

  const query: PlanListQuery = {
    page: Number(sp.get("page") ?? 1),
    limit: Number(sp.get("limit") ?? 10),
    search: sp.get("search") ?? undefined,
    status,
    id_wilayah: sp.get("id_wilayah")
      ? Number(sp.get("id_wilayah"))
      : undefined,
    tanggalStart: sp.get("start") ?? undefined,
    tanggalEnd: sp.get("end") ?? undefined,
  };
  const { data, isLoading, isError } = usePlans(query);

  const update = (patch: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(sp);
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "") next.delete(k);
      else next.set(k, String(v));
    }
    setSp(next);
  };

  const pagination: PaginationState = {
    pageIndex: query.page - 1,
    pageSize: query.limit,
  };
  const onPaginationChange = (u: Updater<PaginationState>) => {
    const next = typeof u === "function" ? u(pagination) : u;
    update({ page: next.pageIndex + 1, limit: next.pageSize });
  };

  function onFilter(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    update({
      search: get("search"),
      status: get("status"),
      id_wilayah: get("id_wilayah"),
      start: get("start"),
      end: get("end"),
      page: undefined,
    });
  }

  const columns: ColumnDef<Plan>[] = [
    {
      accessorKey: "id_rencana",
      header: "ID Rencana",
    },
    {
      accessorKey: "tanggal",
      header: "Tanggal Rencana",
      cell: ({ row }) => formatDate(row.original.tanggal),
    },
    {
      accessorKey: "karyawan.nama",
      header: "Karyawan",
      cell: ({ row }) => row.original.karyawan?.nama ?? "-",
    },
    {
      accessorKey: "wilayahKanvas.nama_wilayah",
      header: "Wilayah",
      cell: ({ row }) => row.original.wilayahKanvas?.nama_wilayah ?? "-",
    },
    {
      accessorKey: "kendaraan.nomor_plat",
      header: "Kendaraan",
      cell: ({ row }) => row.original.kendaraan?.nomor_plat ?? "-",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <PlanStatusBadge status={row.original.status} />,
    },
    {
      id: "jumlah_outlet",
      header: "Jumlah Outlet",
      cell: ({ row }) => row.original.detailRencana?.length ?? 0,
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <RowActions
          onView={() => navigate(`/plan/${row.original.id_rencana}`)}
          {...(canWrite && row.original.status !== "BATAL"
            ? {
                onEdit: () =>
                  navigate(`/plan/${row.original.id_rencana}/edit`),
              }
            : {})}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      isLoading={isLoading}
      isError={isError}
      server={{
        pagination,
        onPaginationChange,
        rowCount: data?.meta.total ?? 0,
      }}
      toolbar={
        // key: isi form ikut URL (mis. setelah Reset)
        <form
          key={sp.toString()}
          onSubmit={onFilter}
          className="flex w-full flex-wrap items-end gap-2"
        >
          <FormField label="Pencarian Rencana" htmlFor="search">
            <SearchInput
              id="search"
              name="search"
              placeholder="Karyawan, wilayah, kendaraan…"
              defaultValue={query.search}
            />
          </FormField>
          <FormField label="Status" htmlFor="status">
            <SelectInput
              id="status"
              name="status"
              className="w-36"
              placeholder="Semua"
              options={[
                ALL,
                ...PLAN_STATUSES.map((s) => ({
                  value: s,
                  label: STATUS_LABEL[s],
                })),
              ]}
              defaultValue={query.status}
            />
          </FormField>
          <FormField label="Wilayah" htmlFor="id_wilayah">
            <SelectInput
              id="id_wilayah"
              name="id_wilayah"
              className="w-44"
              placeholder="Semua"
              options={[
                ALL,
                ...marketAreas.map((area) => ({
                  value: String(area.id_wilayah),
                  label: area.nama_wilayah,
                })),
              ]}
              defaultValue={query.id_wilayah?.toString()}
            />
          </FormField>
          <FormField label="Tanggal dari" htmlFor="start">
            <Input
              id="start"
              name="start"
              type="date"
              defaultValue={query.tanggalStart}
            />
          </FormField>
          <FormField label="s/d" htmlFor="end">
            <Input
              id="end"
              name="end"
              type="date"
              defaultValue={query.tanggalEnd}
            />
          </FormField>
          <Button type="submit" variant="secondary">
            Terapkan
          </Button>
          <Button type="button" variant="ghost" onClick={() => setSp({})}>
            Reset
          </Button>
          {canWrite && (
            <Button
              type="button"
              className="ml-auto"
              onClick={() => navigate("/plan/new")}
            >
              <Plus /> Buat Plan
            </Button>
          )}
        </form>
      }
    />
  );
}
