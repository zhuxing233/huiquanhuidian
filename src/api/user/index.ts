import requset from '/@/utils/request';

/**
 * 角色管理api接口集合
 * @method userPage 用户列表
 * @method userDelete 删除用户
 * @method userSave 新增/修改用户
 * @method userLike 用户模糊匹配
 * @method setRole 更改用户角色
 */
export default function () {
	return {
		userPage: (params: object) => {
			return requset.postJson('/user/page', params);
		},
		userDelete: (params: object) => {
			return requset.postJson('/user/delete', params);
		},
		userSave: (params: object) => {
			return requset.postJson('/user/save', params);
		},
		userLike: (params: object) => {
			return requset.postForm('/user/like', params);
		},
		setRole: (params: object) => {
			return requset.postJson('/user/setRole', params);
		},
	};
}
