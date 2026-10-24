

export interface AuthenticatedUser {
  id_user: number;
  username: string;
  role: {
    id: number;
    name: string;
  } | null;
  permissions: string[];
}

