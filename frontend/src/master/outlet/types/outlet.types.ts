export type Outlet = {
  id_outlet: number;
  id_wilayah: number;
  nama_outlet: string;
  alamat: string;
  no_hp: string | null;
};

export type OutletPayload = {
  id_wilayah: number;
  nama_outlet: string;
  alamat: string;
  no_hp?: string | null;
};
