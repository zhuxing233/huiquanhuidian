<template>
	<div class="home-container layout-pd">
		<div style="display: flex">
			<div class="unitInput" v-if="userInfos.roles.includes('admin')">
				<el-form-item label="单位名称" prop="unitId">
					<el-select
						v-model="state.unitId"
						class="w100"
						filterable
						remote
						reserve-keyword
						placeholder="请输入序号或者单位名称"
						@change="changeUnit"
						:remote-method="remoteMethod"
						:loading="state.loading"
					>
						<el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
					</el-select>
				</el-form-item>
			</div>
			<div class="radio">
				<el-radio-group v-model="state.radio" size="large" @change="change">
					<el-radio-button label="C">本周</el-radio-button>
					<el-radio-button label="D">本月</el-radio-button>
					<el-radio-button label="A">本学期</el-radio-button>
				</el-radio-group>
			</div>
		</div>
		<el-row :gutter="15" class="home-card-two mb15">
			<el-col :xs="24" :sm="14" :md="14" :lg="16" :xl="16">
				<div class="home-card-item">
					<div style="height: 100%" ref="homeBarRef1"></div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8" class="home-media">
				<div class="home-card-item">
					<div style="height: 100%" ref="homePieRef1"></div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-two mb15">
			<el-col :xs="24" :sm="14" :md="14" :lg="16" :xl="16">
				<div class="home-card-item">
					<div style="height: 100%" ref="homeBarRef2"></div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8" class="home-media">
				<div class="home-card-item">
					<div style="height: 100%" ref="homePieRef2"></div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-three">
			<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="home-media">
				<div class="home-card-item">
					<div style="height: 100%" ref="homeLineRef"></div>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="home">
import { reactive, onMounted, ref, watch, nextTick, onActivated, markRaw } from 'vue';
import homeApi from '/@/api/home';
import unitApi from '/@/api/unit';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useUserInfo } from '/@/stores/userInfo';
import { ElMessage } from 'element-plus';
// 定义变量内容
const homeLineRef = ref();
const homePieRef1 = ref();
const homePieRef2 = ref();
const homeBarRef1 = ref();
const homeBarRef2 = ref();
const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
const state = reactive({
	global: {
		homeChartOne: null,
		homeChartTwo: null,
		homeCharThree: null,
		homeCharFour: null,
		homeCharFive: null,
		dispose: [null, '', undefined],
	} as any,
	homeOne: [
		{
			num1: '125,12',
			num2: '-12.32',
			num3: '订单统计信息',
			num4: 'fa fa-meetup',
			color1: '#FF6462',
			color2: '--next-color-primary-lighter',
			color3: '--el-color-primary',
		},
		{
			num1: '653,33',
			num2: '+42.32',
			num3: '月度计划信息',
			num4: 'iconfont icon-ditu',
			color1: '#6690F9',
			color2: '--next-color-success-lighter',
			color3: '--el-color-success',
		},
		{
			num1: '125,65',
			num2: '+17.32',
			num3: '年度计划信息',
			num4: 'iconfont icon-zaosheng',
			color1: '#6690F9',
			color2: '--next-color-warning-lighter',
			color3: '--el-color-warning',
		},
		{
			num1: '520,43',
			num2: '-10.01',
			num3: '访问统计信息',
			num4: 'fa fa-github-alt',
			color1: '#FF6462',
			color2: '--next-color-danger-lighter',
			color3: '--el-color-danger',
		},
	],
	homeThree: [
		{
			icon: 'iconfont icon-yangan',
			label: '浅粉红',
			value: '2.1%OBS/M',
			iconColor: '#F72B3F',
		},
		{
			icon: 'iconfont icon-wendu',
			label: '深红(猩红)',
			value: '30℃',
			iconColor: '#91BFF8',
		},
		{
			icon: 'iconfont icon-shidu',
			label: '淡紫红',
			value: '57%RH',
			iconColor: '#88D565',
		},
		{
			icon: 'iconfont icon-shidu',
			label: '弱紫罗兰红',
			value: '107w',
			iconColor: '#88D565',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '中紫罗兰红',
			value: '57DB',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '紫罗兰',
			value: '57PV',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '暗紫罗兰',
			value: '517Cpd',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '幽灵白',
			value: '12kg',
			iconColor: '#FBD4A0',
		},
		{
			icon: 'iconfont icon-zaosheng',
			label: '海军蓝',
			value: '64fm',
			iconColor: '#FBD4A0',
		},
	],
	myCharts: [] as EmptyArrayType,
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
	radio: 'C',
	graphArr: [],
	unitId: '',
	loading: false,
	options: [],
});

// 柱状图1
const initBarChart1 = (v) => {
	if (!state.global.dispose.some((b: any) => b === state.global.homeCharFour)) state.global.homeCharFour.dispose();
	state.global.homeCharFour = markRaw(echarts.init(homeBarRef1.value, state.charts.theme));
	const option = {
		title: {
			text: '部门工作展示',
			left: 'center',
			top: 'top',
		},
		xAxis: {
			type: 'category',
			data: v.map((e) => e.name),
		},
		yAxis: {
			type: 'value',
		},
		tooltip: {},
		series: [
			{
				data: v.map((e) => e.number),
				type: 'bar',
				showBackground: true,
				backgroundStyle: {
					color: 'rgba(180, 180, 180, 0.2)',
				},
			},
		],
	};

	state.global.homeCharFour.setOption(option);
	state.myCharts.push(state.global.homeCharFour);
};
// 柱状图2
const initBarChart2 = (v) => {
	if (!state.global.dispose.some((b: any) => b === state.global.homeCharFive)) state.global.homeCharFive.dispose();
	state.global.homeCharFive = markRaw(echarts.init(homeBarRef2.value, state.charts.theme));
	let arr = [];
	v.groupScore.forEach((e) => {
		e.gradeScore.forEach((ee) => {
			arr.push([ee.gradeName, ...ee.postScores]);
		});
	});

	const option = {
		title: {
			text: '班级工作展示',
			left: 'center',
			top: 'top',
		},
		legend: {
			top: '10%',
		},
		tooltip: {},
		dataset: {
			source: [['product'].concat(v.postName), ...arr],
		},

		xAxis: {
			type: 'category',
			axisLabel: {
				interval: 0,
				rotate: 90,
			},
		},
		yAxis: {},
		// Declare several bar series, each will be mapped
		// to a column of dataset.source by default.
		series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
	};
	state.global.homeCharFive.setOption(option);
	state.myCharts.push(state.global.homeCharFive);
};
// 饼图1
const initPieChart1 = (v) => {
	if (!state.global.dispose.some((b: any) => b === state.global.homeChartTwo)) state.global.homeChartTwo.dispose();
	state.global.homeChartTwo = markRaw(echarts.init(homePieRef1.value, state.charts.theme));
	const colorList = ['#51A3FC', '#36C78B', '#FEC279', '#968AF5', '#E790E8'];
	const option = {
		title: {
			text: '园所工作动态',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
		},
		legend: {
			type: 'scroll',
			left: 'left',
			top: '10%',
		},
		series: [
			{
				name: '任务处理次数',
				type: 'pie',
				radius: '50%',
				data: v.map((e) => {
					return {
						value: e.number,
						name: e.name,
						label: {
							show: e.number > 0,
						},
						labelLine: {
							show: e.number > 0,
						},
					};
				}),
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	};
	state.global.homeChartTwo.setOption(option);
	state.myCharts.push(state.global.homeChartTwo);
};
// 饼图2
const initPieChart2 = (v) => {
	if (!state.global.dispose.some((b: any) => b === state.global.homeCharThree)) state.global.homeCharThree.dispose();
	state.global.homeCharThree = markRaw(echarts.init(homePieRef2.value, state.charts.theme));
	const colorList = ['#51A3FC', '#36C78B', '#FEC279', '#968AF5', '#E790E8'];
	const option = {
		title: {
			text: '规则处理情况',
			left: 'center',
		},
		tooltip: {
			trigger: 'item',
		},
		legend: {
			type: 'scroll',
			left: 'left',
			top: '10%',
		},
		series: [
			{
				name: '规则触发次数',
				type: 'pie',
				radius: '50%',
				data: v.map((e) => {
					return {
						value: e.number,
						name: e.name,
						label: {
							show: e.number > 0,
						},
						labelLine: {
							show: e.number > 0,
						},
					};
				}),
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)',
					},
				},
			},
		],
	};
	console.log(option);

	state.global.homeCharThree.setOption(option);
	state.myCharts.push(state.global.homeCharThree);
};
// 折线图
const initLineChart = (v) => {
	if (!state.global.dispose.some((b: any) => b === state.global.homeChartOne)) state.global.homeChartOne.dispose();
	state.global.homeChartOne = markRaw(echarts.init(homeLineRef.value, state.charts.theme));
	let data = [];
	v.forEach((e) => {
		data.push([e.date, e.number]);
	});
	const option = {
		title: {
			text: '活跃分数',
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
		},
		grid: {
			left: '5%',
			right: '15%',
			bottom: '10%',
		},
		xAxis: {
			data: data,
		},
		yAxis: {},
		toolbox: {
			// right: 10,
			// feature: {
			// 	dataZoom: {
			// 		yAxisIndex: 'none',
			// 	},
			// 	restore: {},
			// 	saveAsImage: {},
			// },
		},
		dataZoom: [
			{
				startValue: data[0][0],
			},
			{
				type: 'inside',
			},
		],
		visualMap: {
			top: 10,
			right: 10,
			pieces: [
				{
					gt: 0,
					lte: 10,
					color: '#93CE07',
				},
				{
					gt: 10,
					lte: 20,
					color: '#FBDB0F',
				},
				{
					gt: 20,
					lte: 30,
					color: '#FC7D02',
				},
				{
					gt: 30,
					lte: 40,
					color: '#FD0100',
				},
				{
					gt: 40,
					lte: 50,
					color: '#AA069F',
				},
				{
					gt: 50,
					color: '#AC3B2A',
				},
			],
			outOfRange: {
				color: '#999',
			},
		},
		series: {
			name: '活跃分数',
			type: 'line',
			data: data.map(function (item) {
				return item[1];
			}),
			markLine: {
				silent: true,
				lineStyle: {
					color: '#333',
				},
				data: [
					{
						yAxis: 10,
					},
					{
						yAxis: 20,
					},
					{
						yAxis: 30,
					},
					{
						yAxis: 40,
					},
					{
						yAxis: 50,
					},
				],
			},
		},
	};

	state.global.homeChartOne.setOption(option);
	state.myCharts.push(state.global.homeChartOne);
};
// 批量设置 echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		for (let i = 0; i < state.myCharts.length; i++) {
			setTimeout(() => {
				state.myCharts[i].resize();
			}, i * 1000);
		}
	});
};
// 批量设置 echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};
const graphRanking = () => {
	if (userInfos.value.unitId == '0' && !state.unitId) {
		ElMessage.error('请选择需要查看的单位');
		return;
	}
	let params = {
		queryDate: state.radio,
		unitId: userInfos.value.unitId == '0' ? state.unitId : userInfos.value.unitId,
		// unitId: '214',
	};

	Promise.all([
		homeApi().graphRanking({ ...params, queryType: 'B' }),
		homeApi().graphRanking({ ...params, queryType: 'A' }),
		homeApi().graphRanking({ ...params, queryType: 'C' }),
		homeApi().graphRanking({ ...params, queryType: 'D' }),
		homeApi().graphRanking({ ...params, queryType: 'E' }),
	]).then((res) => {
		initBarChart1(res[0]);
		initBarChart2(res[1]);
		initPieChart1(res[2]);
		initPieChart2(res[3]);
		initLineChart(res[4]);
	});
};
const change = (v) => {
	graphRanking();
};
const changeUnit = (v) => {
	if (v) {
		graphRanking();
	}
};
const remoteMethod = (query: string) => {
	unitApi()
		.unitLike({ params: query })
		.then((res: any) => {
			state.options = res.map((e) => {
				return {
					label: e.unitName,
					value: e.unitId,
				};
			});
		});
};
// 页面加载时
onMounted(() => {
	initEchartsResize();
	graphRanking();
});
// 由于页面缓存原因，keep-alive
onActivated(() => {
	initEchartsResizeFun();
});
// 监听 pinia 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
watch(
	() => isTagsViewCurrenFull.value,
	() => {
		initEchartsResizeFun();
	}
);
// 监听 pinia 中是否开启深色主题
watch(
	() => themeConfig.value.isIsDark,
	(isIsDark) => {
		nextTick(() => {
			state.charts.theme = isIsDark ? 'dark' : '';
			state.charts.bgColor = isIsDark ? 'transparent' : '';
			state.charts.color = isIsDark ? '#dadada' : '#303133';
			// setTimeout(() => {
			// 	initLineChart();
			// }, 500);
			// setTimeout(() => {
			// 	initPieChart1();
			// 	initPieChart2();
			// }, 700);
			// setTimeout(() => {
			// 	initBarChart1();
			// 	initBarChart2();
			// }, 1000);
		});
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>

<style scoped lang="scss">
$homeNavLengh: 8;
.home-container {
	overflow: hidden;
	.home-card-one,
	.home-card-two,
	.home-card-three {
		.home-card-item {
			width: 100%;
			height: 130px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);
			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}
			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;
				i {
					color: var(--el-text-color-placeholder);
				}
			}
			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
		}
	}
	.home-card-one {
		@for $i from 0 through 3 {
			.home-one-animation#{$i} {
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/4) + s;
			}
		}
	}
	.home-card-two,
	.home-card-three {
		.home-card-item {
			height: 400px;
			width: 100%;
			overflow: hidden;
			.home-monitor {
				height: 100%;
				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;
					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;
						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}
					@for $i from 0 through $homeNavLengh {
						.home-animation#{$i} {
							opacity: 0;
							animation-name: error-num;
							animation-duration: 0.5s;
							animation-fill-mode: forwards;
							animation-delay: calc($i/10) + s;
						}
					}
				}
			}
		}
	}
}
.radio {
	padding-bottom: 10px;
	text-align: right;
	margin-left: auto;
}
</style>
