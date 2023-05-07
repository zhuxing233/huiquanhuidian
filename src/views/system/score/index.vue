<template>
	<div class="system-Unit-container layout-padding">
		<div class="system-Unit-padding layout-padding-auto layout-padding-view">
			<div class="system-user-search mb15">
				<el-input
					v-if="userInfos.roles.includes('admin')"
					v-model="state.tableData.param.params.like_unitName"
					clearable
					size="default"
					placeholder="请输入单位名称"
					style="max-width: 180px"
				>
				</el-input>
				<el-input
					v-else
					v-model="state.tableData.param.params.like_termName"
					clearable
					size="default"
					placeholder="请输入标题名称"
					style="max-width: 180px"
				>
				</el-input>
				<el-button size="default" type="primary" class="ml10" @click="searchData" :loading="state.tableData.loading">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
			</div>
			<el-table :data="state.tableData.data" style="width: 100%" v-loading="state.tableData.loading">
				<el-table-column type="index" label="序号" width="60" fixed="left" />
				<el-table-column
					prop="unitId"
					v-if="userInfos.roles.includes('admin')"
					label="单位编号"
					show-overflow-tooltip
					min-width="150px"
					fixed="left"
				></el-table-column>
				<el-table-column
					prop="unitName"
					v-if="userInfos.roles.includes('admin')"
					label="单位名称"
					show-overflow-tooltip
					min-width="150px"
					fixed="left"
				></el-table-column>
				<el-table-column prop="termName" label="导出标题" show-overflow-tooltip min-width="200px"> </el-table-column>
				<el-table-column prop="beginTime" label="学期开始时间" show-overflow-tooltip min-width="180px"></el-table-column>
				<el-table-column prop="endTime" label="导出记录时间" show-overflow-tooltip min-width="180px"> </el-table-column>
				<el-table-column prop="adminName" label="管理员" show-overflow-tooltip min-width="120px"></el-table-column>
				<el-table-column prop="createTime" label="操作时间" show-overflow-tooltip min-width="180px"></el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onExport(scope.row)">下载</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10, 20, 30, 40, 50]"
				v-model:current-page="state.tableData.param.current"
				background
				v-model:page-size="state.tableData.param.size"
				layout="total, sizes, prev, pager, next, jumper"
				:total="state.tableData.total"
			>
			</el-pagination>
		</div>
	</div>
</template>

<script setup lang="ts" name="systemScore">
import { defineAsyncComponent, reactive, onMounted, ref, nextTick } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { toRaw } from '@vue/reactivity';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
import scoreApi from '/@/api/score';

// 引入组件
// 定义变量内容
const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
const state = reactive({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			column: '',
			current: 1,
			order: '',
			params: {
				like_unitName: '',
				like_termName: '',
			},
			size: 10,
		},
	},
	addVisible: false,
	editVisible: false,
	row: {},
});
//点击查询
const searchData = () => {
	state.tableData.param.current = 1;
	initTableData();
};
// 初始化表格数据
const initTableData = () => {
	state.tableData.loading = true;
	let paramCopy = toRaw(state.tableData.param);
	for (let k in paramCopy.params) {
		if ([null, undefined, ''].includes(paramCopy.params[k])) {
			delete paramCopy.params[k];
		}
	}
	scoreApi()
		.pageTerm(paramCopy)
		.then((res: any) => {
			const { records, total } = res;
			state.tableData.data = records;
			state.tableData.total = total;
		})
		.catch((err: any) => {})
		.finally(() => {
			state.tableData.loading = false;
		});
};
// 下载
const onExport = (row: any) => {
	let { id } = row;
	scoreApi().exportTerm({ id: row.id });
};

// 分页改变
const onHandleSizeChange = (val: number) => {
	state.tableData.param.size = val;
	initTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.current = val;
	initTableData();
};
// 页面加载时
onMounted(() => {
	searchData();
});
</script>

<style scoped lang="scss">
.system-Unit-container {
	.system-Unit-padding {
		padding: 15px;
		.el-table {
			flex: 1;
			.logo {
				width: 40px;
				height: 40px;
			}
		}
	}
}
</style>
