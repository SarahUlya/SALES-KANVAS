// export type TypePrice = "FIXED" | "PERSENTASE";


export type Product = {
  id_produk: number;
  nama_produk: string;
  barcode: string | null;
  satuan: string | null;
  status: string | null;
};

export type ProductPayload = {
  nama_produk: string;
  barcode?: string | null;
  satuan?: string | null;
  status?: string | null;
};
