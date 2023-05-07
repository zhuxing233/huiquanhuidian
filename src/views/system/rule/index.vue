<template>
	<div class="system-Dept-container layout-padding">
		<div class="system-Dept-padding layout-padding-auto layout-padding-view">
			<div class="system-dept-search mb15">
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
					v-model="state.tableData.param.params.like_ruleName"
					clearable
					size="default"
					placeholder="请输入规则分类名称"
					style="max-width: 180px"
				>
				</el-input>
				<el-button size="default" type="primary" class="ml10" @click="searchData" :loading="state.tableData.loading">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddCategory('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增规则分类
				</el-button>
			</div>
			<el-table :data="state.tableData.data" style="width: 100%" row-key="ruleId">
				<el-table-column type="expand">
					<template #default="props">
						<el-table :data="props.row.sysRuleResponses" :border="false">
							<el-table-column label="" prop="" width="90" />
							<el-table-column label="规则明细" prop="ruleName" />
							<!-- <el-table-column label="排序" prop="orderSort" /> -->
							<el-table-column label="规则分数" prop="ruleScore" />
							<el-table-column label="操作" show-overflow-tooltip width="140">
								<template #default="scope">
									<el-button size="small" text type="primary" @click="onOpenEditDetail('edit', scope.row)">修改</el-button>
									<el-button size="small" text type="primary" @click="onTabelPostRowDel(scope.row)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column prop="unitId" label="单位编号" show-overflow-tooltip min-width="80px" v-if="userInfos.roles.includes('admin')">
				</el-table-column>
				<el-table-column prop="unitName" label="单位名称" show-overflow-tooltip min-width="150px" v-if="userInfos.roles.includes('admin')">
				</el-table-column>
				<el-table-column prop="ruleName" label="规则分类" show-overflow-tooltip> </el-table-column>
				<!-- <el-table-column prop="orderSort" label="排序" show-overflow-tooltip> </el-table-column> -->
				<el-table-column prop="remark" label="分类描述" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="180">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenAddDetail('add', scope.row)">新增明细</el-button>
						<el-button size="small" text type="primary" @click="onOpenEditCategory('edit', scope.row)">修改</el-button>
						<el-button size="small" text type="primary" @click="onTabelDeptRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-if="userInfos.roles.includes('admin')"
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
		<categoryDialog ref="categoryDialogRef" @refresh="initTableData()" />
		<detailDialog ref="detailDialogRef" @refresh="initTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemRule">
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { toRaw } from '@vue/reactivity';
import ruleApi from '/@/api/rule';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';

// 引入组件
const AddDept = defineAsyncComponent(() => import('/@/views/system/rule/component/addDept.vue'));
const EditDept = defineAsyncComponent(() => import('/@/views/system/rule/component/editDept.vue'));
const categoryDialog = defineAsyncComponent(() => import('/@/views/system/rule/categoryDialog.vue'));
const detailDialog = defineAsyncComponent(() => import('/@/views/system/rule/detailDialog.vue'));

// 定义变量内容
const addDeptRef = ref();
const editDeptRef = ref();
const categoryDialogRef = ref();
const detailDialogRef = ref();
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
				like_ruleName: '',
			},
			size: 10,
		},
	},
	deptVisible: false,
	postVisible: false,
	deptRow: {},
	postRow: {},
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
	if (userInfos.value.roles.includes('admin')) {
		ruleApi()
			.rulePage(paramCopy)
			.then((res: any) => {
				const { records, total } = res;
				state.tableData.data = records;
				state.tableData.total = total;
			})
			.catch((err: any) => {})
			.finally(() => {
				state.tableData.loading = false;
			});
	} else {
		ruleApi()
			.ruleList({})
			.then((res: any) => {
				state.tableData.data = res;
			})
			.catch((err: any) => {})
			.finally(() => {
				state.tableData.loading = false;
			});
	}
};
// 打开新增规则分类弹窗
const onOpenAddCategory = (type: string) => {
	categoryDialogRef.value.openDialog(type);
};
// 打开编辑规则分类弹窗
const onOpenEditCategory = (type: string, row: any) => {
	console.log(row);
	categoryDialogRef.value.openDialog(type, row);
};
// 打开新增规则明细弹窗
const onOpenAddDetail = (type: string, row: any) => {
	detailDialogRef.value.openDialog(type, row);
};
// 打开编辑规则明细弹窗
const onOpenEditDetail = (type: string, row: DeptTreeType) => {
	detailDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelDeptRowDel = (row: any) => {
	ElMessageBox.confirm(
		userInfos.value.unitId == '0'
			? `此操作将永久删除 ${row.unitName} 下的规则分类：${row.ruleName}, 是否继续?`
			: `此操作将永久删除规则分类：${row.ruleName}, 是否继续?`,
		'提示',
		{
			confirmButtonText: '删除',
			cancelButtonText: '取消',
			type: 'warning',
		}
	)
		.then(() => {
			ruleApi()
				.ruleDelete({ id: row.ruleId })
				.then(() => {
					ElMessage.success('删除成功');
					initTableData();
				})
				.catch((err) => {});
		})
		.catch(() => {});
};
const onTabelPostRowDel = (row: any) => {
	ElMessageBox.confirm(
		userInfos.value.unitId == '0' ? `此操作将永久删除规则明细：${row.ruleName}, 是否继续?` : `此操作将永久删除规则明细：${row.ruleName}, 是否继续?`,
		'提示',
		{
			confirmButtonText: '删除',
			cancelButtonText: '取消',
			type: 'warning',
		}
	)
		.then(() => {
			ruleApi()
				.ruleDelete({ id: row.ruleId })
				.then(() => {
					ElMessage.success('删除成功');
					initTableData();
				})
				.catch((err) => {});
		})
		.catch(() => {});
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
:deep(.el-table__expanded-cell) {
	padding: 0;
}
:deep(.onse) {
	background: #e2d2d2;
}
.system-Dept-container {
	.system-Dept-padding {
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
