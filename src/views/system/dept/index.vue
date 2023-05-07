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
					v-model="state.tableData.param.params.like_deptName"
					clearable
					size="default"
					placeholder="请输入部门名称"
					style="max-width: 180px"
				>
				</el-input>
				<el-button size="default" type="primary" class="ml10" @click="searchData" :loading="state.tableData.loading">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddDept('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增部门
				</el-button>
			</div>
			<el-table :data="state.tableData.data" style="width: 100%" row-key="deptId">
				<el-table-column type="expand">
					<template #default="props">
						<el-table :data="props.row.posts" :border="false">
							<el-table-column label="" prop="" width="90" />
							<el-table-column label="岗位名称" prop="postName" />
							<!-- <el-table-column label="排序" prop="orderSort" /> -->
							<el-table-column prop="isRank" label="是否参与排名" show-overflow-tooltip>
								<template #default="scope">
									<el-tag type="success" v-if="scope.row.isRank === '0'">是</el-tag>
									<el-tag type="info" v-else>否</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop="isList" label="是否在点赞显示" show-overflow-tooltip>
								<template #default="scope">
									<el-tag type="success" v-if="scope.row.isList === '0'">是</el-tag>
									<el-tag type="info" v-else>否</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop="isBar" label="在班级柱状图显示" show-overflow-tooltip>
								<template #default="scope">
									<el-tag type="success" v-if="scope.row.isBar === '0'">是</el-tag>
									<el-tag type="info" v-else>否</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="岗位描述" prop="remark" />
							<el-table-column label="操作" show-overflow-tooltip width="140">
								<template #default="scope">
									<el-button size="small" text type="primary" @click="onOpenEditPost('edit', scope.row)">修改</el-button>
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
				<el-table-column prop="deptName" label="部门名称" show-overflow-tooltip> </el-table-column>
				<!-- <el-table-column prop="orderSort" label="排序" show-overflow-tooltip> </el-table-column> -->
				<el-table-column prop="isRank" label="是否参与排名" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.isRank === '0'">是</el-tag>
						<el-tag type="info" v-else>否</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="isList" label="是否在点赞显示" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.isList === '0'">是</el-tag>
						<el-tag type="info" v-else>否</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="部门描述" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="180">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenAddPost('add', scope.row)">新增岗位</el-button>
						<el-button size="small" text type="primary" @click="onOpenEditDept('edit', scope.row)">修改</el-button>
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
		<AddDept ref="addDeptRef" />
		<EditDept ref="editDeptRef" />
		<deptDialog ref="deptDialogRef" @refresh="initTableData()" />
		<postDialog ref="postDialogRef" @refresh="initTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemDept">
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { toRaw } from '@vue/reactivity';
import deptApi from '/@/api/dept';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';

// 引入组件
const AddDept = defineAsyncComponent(() => import('/@/views/system/dept/component/addDept.vue'));
const EditDept = defineAsyncComponent(() => import('/@/views/system/dept/component/editDept.vue'));
const deptDialog = defineAsyncComponent(() => import('/@/views/system/dept/deptDialog.vue'));
const postDialog = defineAsyncComponent(() => import('/@/views/system/dept/postDialog.vue'));

// 定义变量内容
const addDeptRef = ref();
const editDeptRef = ref();
const deptDialogRef = ref();
const postDialogRef = ref();
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
				like_deptName: '',
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
		deptApi()
			.deptPage(paramCopy)
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
		deptApi()
			.deptList({ unitId: userInfos.value.unitId })
			.then((res: any) => {
				state.tableData.data = res;
			})
			.catch((err: any) => {})
			.finally(() => {
				state.tableData.loading = false;
			});
	}
};
// 打开新增部门弹窗
const onOpenAddDept = (type: string) => {
	deptDialogRef.value.openDialog(type);
};
// 打开编辑部门弹窗
const onOpenEditDept = (type: string, row: any) => {
	console.log(row);
	deptDialogRef.value.openDialog(type, row);
};
// 打开新增岗位弹窗
const onOpenAddPost = (type: string, row: any) => {
	postDialogRef.value.openDialog(type, row);
};
// 打开编辑岗位弹窗
const onOpenEditPost = (type: string, row: DeptTreeType) => {
	postDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelDeptRowDel = (row: DeptTreeType) => {
	ElMessageBox.confirm(
		userInfos.value.unitId == '0'
			? `此操作将永久删除 ${row.unitName} 下的部门：${row.deptName}, 是否继续?`
			: `此操作将永久删除部门：${row.deptName}, 是否继续?`,
		'提示',
		{
			confirmButtonText: '删除',
			cancelButtonText: '取消',
			type: 'warning',
		}
	)
		.then(() => {
			deptApi()
				.deptDelete({ deptId: row.deptId })
				.then(() => {
					ElMessage.success('删除成功');
					initTableData();
				})
				.catch((err) => {});
		})
		.catch(() => {});
};
const onTabelPostRowDel = (row: DeptTreeType) => {
	ElMessageBox.confirm(`此操作将永久删除岗位：${row.postName}, 是否继续?`, '提示', {
		confirmButtonText: '删除',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			deptApi()
				.postDelete({ postId: row.postId })
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
