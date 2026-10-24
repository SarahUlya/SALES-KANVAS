
export type User = {
  id_user: number;
  username: string;
  role: { id: number; name: string } | null;
  permissions: string[];
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};
