import requset from '/@/utils/request';

/**
 * 单位管理api接口集合
 * @method upload 上传单文件
 * @method uploadList 上传多文件
 * @method listByDict 请求字典
 */
export default function () {
	return {
		upload: (params: object) => {
			return requset.postFile('/file/upload', params);
		},
		uploadList: (params: object) => {
			return requset.postFile('/file/uploadList', params);
		},
		listByDict: (params: object) => {
			return requset.postJson('/dict/listByDict', params);
		},
	};
}
