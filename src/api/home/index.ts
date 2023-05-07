import requset from '/@/utils/request';

/**
 * 首页
 * @method graphRanking 首页echarts
 */
export default function () {
	return {
		graphRanking: (params: object) => {
			return requset.get('/graphRanking', params);
		},
	};
}
