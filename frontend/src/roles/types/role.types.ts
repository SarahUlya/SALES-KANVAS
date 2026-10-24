export type RolePermission = {
  id: number;
  name: string;
};

export type Role = {
  id: number;
  name: string;
  permissions: RolePermission[];
};

export type RolePayload = {
  name: string;
};
