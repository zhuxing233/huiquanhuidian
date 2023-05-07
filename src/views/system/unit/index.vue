<template>
	<div class="system-Unit-container layout-padding">
		<div class="system-Unit-padding layout-padding-auto layout-padding-view">
			<div class="system-user-search mb15">
				<el-input v-model="state.tableData.param.params.like_unitName" clearable size="default" placeholder="请输入单位名称" style="max-width: 180px">
				</el-input>
				<el-button size="default" type="primary" class="ml10" @click="searchData" :loading="state.tableData.loading">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddUnit">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增单位
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onExportModel">
					<el-icon>
						<ele-Download />
					</el-icon>
					批量导入模板
				</el-button>

				<el-upload
					ref="upload"
					v-model:file-list="state.fileList"
					class="upload-demo ml10 inline-block"
					action="https://www.hqhdgl.com/hqhd/excel/importOrganization"
					:headers="{
						Authorization: Session.get('token'),
					}"
					name="multipartFile"
					:show-file-list="false"
					:on-error="handleError"
					:on-success="handleSuccess"
				>
					<template #trigger>
						<el-button size="default" type="success" class="margin-change" @click="onImportOrganization">
							<el-icon><ele-Upload /></el-icon>
							批量导入
						</el-button>
					</template>
				</el-upload>
			</div>
			<el-table :data="state.tableData.data" style="width: 100%" v-loading="state.tableData.loading">
				<el-table-column type="index" label="序号" width="60" fixed="left" />
				<el-table-column prop="image" label="单位Logo" show-overflow-tooltip min-width="100px" fixed="left">
					<template #default="scope">
						<div style="display: flex; align-items: center" class="logo">
							<el-image
								class="logo"
								:src="http + scope.row.path"
								fit="cover"
								:hide-on-click-modal="true"
								:preview-teleported="true"
								:preview-src-list="[http + scope.row.path]"
							/>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="unitId" label="单位编号" show-overflow-tooltip min-width="150px" fixed="left"></el-table-column>
				<el-table-column prop="unitName" label="单位名称" show-overflow-tooltip min-width="150px" fixed="left"></el-table-column>
				<el-table-column prop="leftDay" label="剩余时间" show-overflow-tooltip min-width="120px">
					<template #default="scope">
						{{ scope.row.leftDay }}
					</template>
				</el-table-column>
				<el-table-column prop="userName" label="单位负责人" show-overflow-tooltip min-width="120px"></el-table-column>
				<el-table-column prop="address" label="单位地址" show-overflow-tooltip min-width="200px">
					<template #default="scope">
						{{ scope.row.addressName?.join('/') }}
					</template>
				</el-table-column>
				<el-table-column prop="addressDetail" label="详细地址" show-overflow-tooltip min-width="200px"></el-table-column>
				<el-table-column prop="orderSort" label="排序" show-overflow-tooltip></el-table-column>
				<el-table-column prop="validTime" label="到期时间" show-overflow-tooltip min-width="200px"></el-table-column>
				<el-table-column prop="remark" label="单位描述" show-overflow-tooltip min-width="200px"></el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
					<template #default="scope">
						<el-button :disabled="scope.row.UnitName === '超级管理员'" size="small" text type="primary" @click="onOpenEditUnit(scope.row)"
							>修改</el-button
						>
						<el-button :disabled="scope.row.UnitName === '超级管理员'" size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
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
		<AddUnit ref="addUnitRef" v-if="state.addVisible" @ok="ok" @cancel="cancel" />
		<EditUnit ref="editUnitRef" v-if="state.editVisible" @ok="ok" :row="state.row" @cancel="cancel" />
	</div>
</template>

<script setup lang="ts" name="systemUnit">
import { defineAsyncComponent, reactive, onMounted, ref, nextTick } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { toRaw } from '@vue/reactivity';
import type { UploadInstance, UploadProps, UploadUserFile } from 'element-plus';
import unitApi from '/@/api/unit';
import { Session } from '/@/utils/storage';
import { CollectionTag } from '@element-plus/icons-vue';
const upload = ref<UploadInstance>();
// 引入组件
const AddUnit = defineAsyncComponent(() => import('/@/views/system/unit/component/addUnit.vue'));
const EditUnit = defineAsyncComponent(() => import('/@/views/system/unit/component/editUnit.vue'));
// 定义变量内容
const addUnitRef = ref();
const editUnitRef = ref();
const http = import.meta.env.VITE_API_HTTP;
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
			},
			size: 10,
		},
	},
	addVisible: false,
	editVisible: false,
	row: {},
	fileList: ref<UploadUserFile[]>([]),
});
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
	console.log(file, uploadFiles);
};

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
	console.log(uploadFile);
};

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length} totally`);
};
const handleError: UploadProps['onError'] = (err) => {
	console.log(err);
	ElMessage.warning(err);
};
const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
	if (response.status) {
		ElMessage.success(`导入成功`);
		initTableData();
	} else {
		ElMessage.warning(response.message);
	}
	console.log(upload.value);

	upload.value!.clearFiles();
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
	unitApi()
		.unitPage(paramCopy)
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
// 打开新增单位弹窗
const onOpenAddUnit = () => {
	state.addVisible = true;
	// setTimeout(() => {
	// 	addUnitRef.value.openDialog();
	// }, 0);
};
// 打开修改单位弹窗
const onOpenEditUnit = (row: Object) => {
	state.row = row;
	state.editVisible = true;
	// editUnitRef.value.openDialog(row);
};
// 删除角色
const onRowDel = (row: RowUnitType) => {
	ElMessageBox.confirm(`此操作将永久删除单位：“${row.unitName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			unitApi()
				.unitDelete({ unitId: row.unitId })
				.then(() => {
					ElMessage.success('删除成功');
					initTableData();
				})
				.catch((err) => {});
		})
		.catch(() => {});
};
const onExportModel = () => {
	unitApi()
		.exportModel({})
		.then((res) => {});
};
const onImportOrganization = () => {};
const ok = () => {
	searchData();
};
const cancel = () => {
	state.addVisible = false;
	state.editVisible = false;
};
const editSubimt = () => {
	searchData();
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
.inline-block {
	display: inline-block;
	margin-right: 10px;
	float: right;
}
.margin-change {
	display: inline-block;
	margin-left: 10px;
}
</style>
