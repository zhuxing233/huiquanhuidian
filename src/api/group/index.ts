import requset from '/@/utils/request';

/**
 * 部门管理api接口集合
 * @method groupPage 所有组列表
 * @method groupSave 新增/修改组
 * @method groupDelete 删除组
 * @method groupList 本单位组班级
 * @method gradeSave 新增/修改班级
 * @method gradeDelete 删除班级
 */
export default function () {
	return {
		groupPage: (params: object) => {
			return requset.postJson('/group/page', params);
		},
		groupSave: (params: object) => {
			return requset.postJson('/group/save', params);
		},
		groupDelete: (params: object) => {
			return requset.postForm('/group/delete', params);
		},
		groupList: (params: object) => {
			return requset.postForm('/group/listByUnitId', params);
		},
		gradeSave: (params: object) => {
			return requset.postJson('/grade/save', params);
		},
		gradeDelete: (params: object) => {
			return requset.postForm('/grade/delete', params);
		},
	};
}
