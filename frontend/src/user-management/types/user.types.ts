export type ManagedUser = {
  id_user: number;
  username: string;
  role: string | { name: string } | null;
  role_id: number | null;
  roleRelation?: {
    id: number;
    name: string;
  } | null;
  karyawan?: {
    id_karyawan: number;
    nama: string;
    no_hp: string | null;
    status: string | null;
  } | null;
};

export type CreateUserPayload = {
  username: string;
  password: string;
  role_id: number;
};

export type UpdateUsernamePayload = {
  username: string;
};

export type ResetUserPasswordPayload = {
  password: string;
};
