
export type DetailKasbonProdukPayload = {
  id_produk: number;
  qty: number;
};

export type KasbonProdukPayload = {
  id_karyawan: number;
  tanggal: string;
  status: string;
  keterangan?: string;
  detailKasbonProduk: DetailKasbonProdukPayload[];
};

export type DetailKasbonProduk = {
  id_detail_kasbon: number;
  id_kasbon_produk: number;
  id_produk: number;
  qty: number;
  produk?: {
    id_produk: number;
    nama_produk?: string;
  };
};

export type KasbonProduk = {
  id_kasbon_produk: number;
  id_karyawan: number;
  tanggal: string;
  status: string;
  keterangan: string | null;
  detailKasbonProduk?: DetailKasbonProduk[];
  karyawan?: {
    id_karyawan: number;
    nama?: string;
  };
};
