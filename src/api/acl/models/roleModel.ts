import type { RoleList } from "./userModel";

export interface GetRoleListParams {
  page: number;
  limit: number;
  roleName: string;
}

export interface GetRoleListResponse {
  total: number;
  items: RoleList;
}
