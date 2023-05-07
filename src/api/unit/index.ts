import requset from '/@/utils/request';

/**
 * 单位管理api接口集合
 * @method unitPage 单位列表
 * @method unitSave 新增/修改单位
 * @method unitDelete 删除单位
 * @method unitLike 用户模糊匹配
 * @method exportModel 导出模板
 * @method importOrganization 导入
 *
 */
export default function () {
	return {
		unitPage: (params: object) => {
			return requset.postJson('/unit/page', params);
		},
		unitSave: (params: object) => {
			return requset.postJson('/unit/save', params);
		},
		unitDelete: (params: object) => {
			return requset.postForm('/unit/delete', params);
		},
		unitLike: (params: object) => {
			return requset.postForm('/unit/like', params);
		},
		exportModel: (params: object) => {
			return requset.getFile('/excel/exportModel', params, 'get');
		},
		importOrganization: (params: object) => {
			return requset.postJson('/excel/importOrganization', params);
		},
	};
}
