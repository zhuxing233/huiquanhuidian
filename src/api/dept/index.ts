import requset from '/@/utils/request';

/**
 * 部门管理api接口集合
 * @method deptPage 所有部门列表
 * @method deptList 本单位部门列表
 * @method deptSave 新增/修改部门
 * @method postSave 新增/修改岗位
 * @method deptDelete 删除部门
 * @method postDelete 删除岗位
 */
export default function () {
	return {
		deptPage: (params: object) => {
			return requset.postJson('/dept/page', params);
		},
		deptSave: (params: object) => {
			return requset.postJson('/dept/save', params);
		},
		deptDelete: (params: object) => {
			return requset.postForm('/dept/delete', params);
		},
		deptList: (params: object) => {
			return requset.postForm('/dept/list', params);
		},
		postSave: (params: object) => {
			return requset.postJson('/post/save', params);
		},
		postDelete: (params: object) => {
			return requset.postForm('/post/delete', params);
		},
	};
}
