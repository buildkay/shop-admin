import request from "@/utils/request";
import type {
  GetUserListResponse,
  GetUserListParams,
  SaveUserParams,
  GetUserRoleListResponse,
} from "./models/userModel";

enum Api {
  getUserListUrl = "/admin/acl/user",
  saveUserUrl = "/admin/acl/user/save",
  assignUserRoleUrl = "/admin/acl/user/doAssign",
  getUserRoleList = "/admin/acl/user/toAssign",
}

// 获取用户列表
export const getUserListApi = ({
  page,
  limit,
  username,
}: GetUserListParams) => {
  return request.get<any, GetUserListResponse>(
    Api.getUserListUrl + `/${page}/${limit}`,
    {
      params: {
        username,
      },
    }
  );
};

// 根据用户id获取角色列表
export const getUserRoleListApi = (userId: string) => {
  return request.get<any, GetUserRoleListResponse>(
    Api.getUserRoleList + `/${userId}`
  );
};

// 添加用户
export const saveUserApi = (data: SaveUserParams) => {
  return request.post<any, null>(Api.saveUserUrl, data);
};

//  给用户分配角色
export const assignUserRoleApi = (userId: string, roleId: string[]) => {
  return request.post<any, null>(
    Api.assignUserRoleUrl,
    {},
    {
      params: {
        userId,
        roleId: roleId + "",
      },
    }
  );
};
