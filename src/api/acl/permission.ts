import request from "@/utils/request";
import type { getRolePermissionListResponse } from "./models/permissionModel";

enum Api {
  getRolePermissionListUrl = "/admin/acl/permission/toAssign",
  assignRolePermissionUrl = "/admin/acl/permission/doAssign",
  getPermissionListUrl = "/admin/acl/permission",
}

/**
 * 获取角色的菜单权限列表
 * @param roleId 角色id
 * @returns getRolePermissionListResponse
 */
export const getRolePermissionListApi = (roleId: string) => {
  return request.get<any, getRolePermissionListResponse>(
    Api.getRolePermissionListUrl + `/${roleId}`
  );
};

/**
 * 给角色分配权限
 * @param roleId 角色id
 * @param permissionId 菜单权限id列表
 * @returns null
 */
export const assignRolePermissionApi = (
  roleId: string,
  permissionId: string[]
) => {
  return request.post<any, null>(
    Api.assignRolePermissionUrl,
    {},
    {
      params: {
        roleId,
        permissionId: permissionId + "",
      },
    }
  );
};

/**
 * 获取所有菜单
 * @returns getRolePermissionListResponse
 */
export const getPermissionListApi = () => {
  return request.get<any, getRolePermissionListResponse>(
    Api.getPermissionListUrl
  );
};
