import request from "@/utils/request";
import type {
  GetRoleListParams,
  GetRoleListResponse,
} from "./models/roleModel";

enum Api {
  getRoleListUrl = "/admin/acl/role",
  saveRoleUrl = "/admin/acl/role/save",
}

// 获取角色列表
export const getRoleListApi = ({
  page,
  limit,
  roleName,
}: GetRoleListParams) => {
  return request.get<any, GetRoleListResponse>(
    Api.getRoleListUrl + `/${page}/${limit}`,
    {
      params: {
        roleName,
      },
    }
  );
};

// 角色名称
export const saveRoleApi = (roleName: string) => {
  return request.post<any, null>(Api.saveRoleUrl, { roleName });
};
