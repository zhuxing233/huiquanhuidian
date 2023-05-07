<template>
	<div class="system-Group-container layout-padding">
		<div class="system-Group-padding layout-padding-auto layout-padding-view">
			<div class="system-group-search mb15">
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
					v-model="state.tableData.param.params.like_groupName"
					clearable
					size="default"
					placeholder="请输入组别名称"
					style="max-width: 180px"
				>
				</el-input>
				<el-button size="default" type="primary" class="ml10" @click="searchData" :loading="state.tableData.loading">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddGroup('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增组别
				</el-button>
			</div>
			<el-table :data="state.tableData.data" style="width: 100%" row-key="groupId">
				<el-table-column type="expand">
					<template #default="props">
						<el-table :data="props.row.grades" :border="false">
							<el-table-column label="" prop="" width="90" />
							<el-table-column label="班级名称" prop="gradeName" />
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
							<el-table-column label="班级描述" prop="remark" />
							<el-table-column label="操作" show-overflow-tooltip width="140">
								<template #default="scope">
									<el-button size="small" text type="primary" @click="onOpenEditGrade('edit', scope.row)">修改</el-button>
									<el-button size="small" text type="primary" @click="onTabelGradeRowDel(scope.row)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column prop="unitId" label="单位编号" show-overflow-tooltip min-width="80px" v-if="userInfos.roles.includes('admin')">
				</el-table-column>
				<el-table-column prop="unitName" label="单位名称" show-overflow-tooltip min-width="150px" v-if="userInfos.roles.includes('admin')">
				</el-table-column>
				<!-- <el-table-column prop="groupType" label="组别类型" show-overflow-tooltip> </el-table-column> -->
				<el-table-column prop="groupName" label="组别名称" show-overflow-tooltip> </el-table-column>
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
				<el-table-column prop="remark" label="组别描述" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="180">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenAddGrade('add', scope.row)">新增班级</el-button>
						<el-button size="small" text type="primary" @click="onOpenEditGroup('edit', scope.row)">修改</el-button>
						<el-button size="small" text type="primary" @click="onTabelGroupRowDel(scope.row)">删除</el-button>
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
		<groupDialog ref="groupDialogRef" @refresh="initTableData()" />
		<gradeDialog ref="gradeDialogRef" @refresh="initTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemGroup">
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { toRaw } from '@vue/reactivity';
import groupApi from '/@/api/group';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';

// 引入组件
const groupDialog = defineAsyncComponent(() => import('/@/views/system/group/groupDialog.vue'));
const gradeDialog = defineAsyncComponent(() => import('/@/views/system/group/gradeDialog.vue'));

// 定义变量内容
const groupDialogRef = ref();
const gradeDialogRef = ref();
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
				like_groupName: '',
			},
			size: 10,
		},
	},
	groupVisible: false,
	gradeVisible: false,
	groupRow: {},
	gradeRow: {},
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
		groupApi()
			.groupPage(paramCopy)
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
		groupApi()
			.groupList({ unitId: userInfos.value.unitId })
			.then((res: any) => {
				state.tableData.data = res;
			})
			.catch((err: any) => {})
			.finally(() => {
				state.tableData.loading = false;
			});
	}
};
// 打开新增组别弹窗
const onOpenAddGroup = (type: string) => {
	groupDialogRef.value.openDialog(type);
};
// 打开编辑组别弹窗
const onOpenEditGroup = (type: string, row: any) => {
	console.log(row);
	groupDialogRef.value.openDialog(type, row);
};
// 打开新增班级弹窗
const onOpenAddGrade = (type: string, row: any) => {
	gradeDialogRef.value.openDialog(type, row);
};
// 打开编辑班级弹窗
const onOpenEditGrade = (type: string, row: any) => {
	gradeDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelGroupRowDel = (row: any) => {
	ElMessageBox.confirm(
		userInfos.value.unitId == '0'
			? `此操作将永久删除 ${row.unitName} 下的组别：${row.groupName}, 是否继续?`
			: `此操作将永久删除组别：${row.groupName}, 是否继续?`,
		'提示',
		{
			confirmButtonText: '删除',
			cancelButtonText: '取消',
			type: 'warning',
		}
	)
		.then(() => {
			groupApi()
				.groupDelete({ groupId: row.groupId })
				.then(() => {
					ElMessage.success('删除成功');
					initTableData();
				})
				.catch((err) => {});
		})
		.catch(() => {});
};
const onTabelGradeRowDel = (row: any) => {
	ElMessageBox.confirm(`此操作将永久删除班级：${row.gradeName}, 是否继续?`, '提示', {
		confirmButtonText: '删除',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			groupApi()
				.gradeDelete({ gradeId: row.gradeId })
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
.system-Group-container {
	.system-Group-padding {
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
