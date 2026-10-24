import type { Employee } from "@/master/employee/types/employee.types";
import type { MarketArea } from "@/master/market-area/types/marketArea.types";
import type { Outlet } from "@/master/outlet/types/outlet.types";
import type { Vehicle } from "@/master/vehicle/types/vehicle.types";

export const PLAN_STATUSES = [
  "DRAFT",
  "DISETUJUI",
  "BATAL",
  "REVISI",
  "LOADING",
  "KOMPLIT",
] as const;
export type PlanStatus = (typeof PLAN_STATUSES)[number];

export type PlanOutletPayload = {
  id_outlet: number;
  urutan: number;
};

export type PlanOutlet = PlanOutletPayload & {
  id_detail_rencana: number;
  outlet: Outlet | null;
};

export type Plan = {
  id_rencana: number;
  id_karyawan: number;
  id_kendaraan: number;
  id_wilayah: number;
  tanggal: string;
  status: PlanStatus;
  karyawan: Employee | null;
  kendaraan: Vehicle | null;
  wilayahKanvas: MarketArea | null;
  detailRencana: PlanOutlet[];
};

export type PlanPayload = {
  id_karyawan: number;
  id_kendaraan: number;
  id_wilayah: number;
  tanggal: string;
  status?: PlanStatus;
  detailRencana: PlanOutletPayload[];
};

export type PlanListQuery = {
  page: number;
  limit: number;
  search?: string;
  sortOrder?: "asc" | "desc";
  status?: PlanStatus;
  tanggalStart?: string;
  tanggalEnd?: string;
  id_wilayah?: number;
};

export type PlanList = {
  items: Plan[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};
