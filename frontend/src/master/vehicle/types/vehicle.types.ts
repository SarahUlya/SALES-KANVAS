export type Vehicle = {
  id_kendaraan: number;
  nomor_plat: string;
  jenis: string | null;
  status: string | null;
};

export type VehiclePayload = {
  nomor_plat: string;
  jenis?: string | null;
  status?: string | null;
};