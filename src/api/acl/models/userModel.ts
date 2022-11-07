export interface GetUserListParams {
  page: number;
  limit: number;
  username: string;
}
export interface SaveUserParams {
  username: string;
  password: string;
  nickName: string;
  // salt: "string";
  // token: "string";
}

export interface UserItem extends SaveUserParams {
  id: string;
  gmtCreate: string;
  gmtModified: string;
  roleName: string;
}

export type UserList = UserItem[];

export interface GetUserListResponse {
  total: number;
  items: UserList;
}

export interface RoleItem {
  id: string;
  // gmtCreate: string;
  // gmtModified: string;
  // deleted: false;
  roleName: string;
  // remark: string;
}

export type RoleList = RoleItem[];

export interface GetUserRoleListResponse {
  assignRoles: RoleList;
  allRolesList: RoleList;
}
