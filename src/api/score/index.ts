import requset from '/@/utils/request';

/**
 * 单位管理api接口集合
 * @method pageTerm 导出列表
 * @method exportTerm 下载
 *
 */
export default function () {
	return {
		pageTerm: (params: object) => {
			return requset.postJson('/excel/pageTerm', params);
		},
		exportTerm: (params: object) => {
			return requset.getFile('/excel/exportTerm', params, 'post');
		},
	};
}
