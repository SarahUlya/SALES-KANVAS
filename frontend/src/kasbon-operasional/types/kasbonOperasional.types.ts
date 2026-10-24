export type KasbonOperasional = {
  id_kasbon_operasional: number;
  id_karyawan: number;
  tanggal: string;
  jumlah: string;
  keterangan: string | null;
  status: string;
  karyawan: {
    nama: string;
  };
};


export type KasbonOperasionalPayload = {
  id_karyawan: number;
  tanggal: string;
  jumlah: number;
  keterangan: string | null;
  status: string;
};

