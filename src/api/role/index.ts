import requset from '/@/utils/request';

/**
 * 角色管理api接口集合
 * @method pageRoles 角色列表
 * @method deleteRoles 删除角色
 * @method saveRole 新增/修改角色
 */
export default function () {
	return {
		pageRoles: (params: object) => {
			return requset.postJson('/role/pageRoles', params);
		},
		deleteRoles: (params: object) => {
			return requset.postJson('/role/deleteRoles', params);
		},
		saveRole: (params: object) => {
			return requset.postJson('/role/saveRole', params);
		},
	};
}
