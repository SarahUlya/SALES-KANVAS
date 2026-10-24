export type Gudang = {
  id_gudang: number;
  nama_gudang: string;
  lokasi: string | null;
};

export type GudangPayload = {
  nama_gudang: string;
  lokasi?: string | null;
};
