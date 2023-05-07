<template>
	<div class="system-User-container layout-padding">
		<div class="system-User-padding layout-padding-auto layout-padding-view">
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
					v-model="state.tableData.param.params.like_userName"
					clearable
					size="default"
					placeholder="请输入用户名称"
					style="max-width: 180px"
				></el-input>
				<el-button size="default" type="primary" class="ml10" @click="searchData" :loading="state.tableData.loading">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddUser('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增用户
				</el-button>
			</div>
			<el-table :data="state.tableData.data" style="width: 100%" v-loading="state.tableData.loading">
				<!-- <el-table-column type="index" label="序号" width="60" /> -->
				<el-table-column
					prop="unitId"
					label="单位编号"
					show-overflow-tooltip
					min-width="80px"
					fixed="left"
					v-if="userInfos.roles.includes('admin')"
				></el-table-column>
				<el-table-column
					prop="unitName"
					label="单位名称"
					show-overflow-tooltip
					min-width="150px"
					fixed="left"
					v-if="userInfos.roles.includes('admin')"
				></el-table-column>
				<el-table-column prop="userName" label="用户名称" show-overflow-tooltip fixed="left" min-width="150px"></el-table-column>
				<el-table-column prop="dept" label="部门岗位" show-overflow-tooltip :formatter="formatterDept" min-width="200px"> </el-table-column>
				<el-table-column prop="group" label="组别班级" show-overflow-tooltip :formatter="formatterGroup" min-width="200px"></el-table-column>
				<el-table-column prop="mainDept" label="主管部门岗位" show-overflow-tooltip :formatter="formattermainDept" min-width="200px">
				</el-table-column>
				<el-table-column prop="userPermissionsName" label="用户权限" show-overflow-tooltip min-width="120px"> </el-table-column>
				<el-table-column prop="isRank" label="是否参与排名" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.isRank === '0'">是</el-tag>
						<el-tag type="info" v-else>否</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="phonenumber" label="手机号" show-overflow-tooltip min-width="150px"></el-table-column>
				<el-table-column prop="remark" label="用户描述" show-overflow-tooltip min-width="150px"></el-table-column>
				<el-table-column prop="entryTime" label="入职时间" show-overflow-tooltip min-width="150px"></el-table-column>
				<el-table-column label="操作" fixed="right" min-width="100px">
					<template #default="scope">
						<el-button v-if="scope.row.loginName !== 'admin'" size="small" text type="primary" @click="onOpenEditUser('edit', scope.row)"
							>修改</el-button
						>
						<el-button v-if="scope.row.loginName !== 'admin'" size="small" text type="primary" @click="onTabelUserRowDel(scope.row)">删除</el-button>
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
		<!-- <AddUer ref="addUserRef" />
		<EditUser ref="editUserRef" /> -->
		<userDialog ref="userDialogRef" @refresh="initTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { toRaw } from '@vue/reactivity';
import userApi from '/@/api/user';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
// 引入组件
const userDialog = defineAsyncComponent(() => import('/@/views/system/user/userDialog.vue'));

// 定义变量内容
const userDialogRef = ref();
const addUserRef = ref();
const editUserRef = ref();
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
				like_userName: '',
			},
			size: 10,
		},
	},
	userVisible: false,
	userRow: {},
});
const formatterDept = (row: any) => {
	let arr = toRaw(row) || [];
	if (arr.userDeptPosts) {
		let depts = arr.userDeptPosts.map((e) => {
			return e.deptName + '/' + e.postName;
		});
		return depts.join('，');
	}
};
const formattermainDept = (row: any) => {
	let arr = toRaw(row) || [];
	if (arr.mainDeptPost) {
		let mainDept = arr.mainDeptPost.deptName + '/' + arr.mainDeptPost.postName;
		return mainDept;
	}
};
const formatterGroup = (row: any) => {
	let arr = toRaw(row) || [];
	if (arr.userGroupGrades) {
		let depts = arr.userGroupGrades.map((e) => {
			if (e.gradeName) {
				return e.groupName + '/' + e.gradeName;
			} else {
				return e.groupName;
			}
		});
		return depts.join('，');
	}
};
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
	userApi()
		.userPage(paramCopy)
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
// 打开新增用户弹窗
const onOpenAddUser = (type: string) => {
	userDialogRef.value.openDialog(type);
};
// 打开编辑用户弹窗
const onOpenEditUser = (type: string, row: any) => {
	userDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelUserRowDel = (row: any) => {
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
			userApi()
				.userDelete({ groupId: row.groupId })
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
.system-User-container {
	.system-User-padding {
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
