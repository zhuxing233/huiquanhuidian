import requset from '/@/utils/request';

/**
 * 规则管理api接口集合
 * @method rulePage 所有规则列表
 * @method ruleList 本单位规则列表
 * @method ruleSave 新增/修改规则
 * @method ruleDelete 删除
 */
export default function () {
	return {
		rulePage: (params: object) => {
			return requset.postJson('/rule/page', params);
		},
		ruleSave: (params: object) => {
			return requset.postJson('/rule/save', params);
		},
		ruleList: (params: object) => {
			return requset.get('/rule/list', params);
		},
		ruleDelete: (params: object) => {
			return requset.postJson('/rule/delete', params);
		},
	};
}
