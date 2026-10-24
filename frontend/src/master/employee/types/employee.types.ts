
export type Employee = {
  id_karyawan: number;
  id_user: number;
  nama: string;
  no_hp: string | null;
  status: string | null;
  user?: {
    username: string;
  };
};

export type EmployeeUser = {
  id_user: number;
  username: string;
};

export type EmployeePayload = {
  id_user?: number;
  nama: string;
  no_hp?: string | null;
  status?: string | null;
};
