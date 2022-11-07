export interface PermissionItem {
  id: string;
  pid: string; // 父级分类id
  name: string;
  code: string;
  type: number;
  level: number;
  children: PermissionList;
  select: boolean;
}

export type PermissionList = PermissionItem[];

export interface getRolePermissionListResponse {
  children: PermissionList;
}
