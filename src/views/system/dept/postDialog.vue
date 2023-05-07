<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="dialogFormRef" :model="state.ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="岗位名称" prop="postName">
							<el-input v-model="state.ruleForm.postName" placeholder="请输入岗位名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="是否参与排名" label-width="auto">
							<el-switch v-model="state.ruleForm.isRank" inline-prompt active-text="是" inactive-text="否" active-value="0" inactive-value="1">
							</el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="是否在点赞显示" label-width="auto">
							<el-switch v-model="state.ruleForm.isList" inline-prompt active-text="是" inactive-text="否" active-value="0" inactive-value="1">
							</el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="在班级柱状图显示" label-width="auto">
							<el-switch v-model="state.ruleForm.isBar" inline-prompt active-text="是" inactive-text="否" active-value="0" inactive-value="1">
							</el-switch>
						</el-form-item>
					</el-col>
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="排序" prop="orderSort">
							<el-input-number
								v-model="state.ruleForm.orderSort"
								:min="0"
								:max="999"
								controls-position="right"
								placeholder="请输入排序"
								class="w100"
							/>
						</el-form-item>
					</el-col> -->
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="岗位描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入岗位描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default" :loading="state.loadingBtn">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemPostDialog">
import { reactive, ref } from 'vue';
import deptApi from '/@/api/dept';
import { FormRules } from 'element-plus';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dialogFormRef = ref();
const state = reactive({
	ruleForm: {},
	deptData: [] as DeptTreeType[], // 部门数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
	loadingBtn: false,
});
const rules = reactive<FormRules>({
	postName: [
		{
			required: true,
			message: '请输入岗位名称',
			trigger: 'change',
		},
	],
});
// 打开弹窗
const openDialog = (type: string, row: any) => {
	dialogFormRef?.value?.resetFields();
	state.dialog.type = type;
	if (type === 'edit') {
		state.ruleForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '修改岗位';
		state.dialog.submitTxt = '修 改';
	} else {
		state.ruleForm = { deptId: row.deptId, isRank: '0' };
		state.dialog.title = '新增岗位';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	userDialogFormRef.value.resetFields();
		// });
	}
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = async () => {
	await dialogFormRef.value.validate((valid, fields) => {
		if (valid) {
			let params = {};
			let { deptId, postId, postName, isRank, isList, isBar, remark } = state.ruleForm;
			if (state.dialog.type === 'edit') {
				params = {
					deptId,
					postId,
					postName,
					isRank,
					isList,
					isBar,
					remark,
				};
			} else {
				params = {
					deptId,
					postName,
					isRank,
					isList,
					isBar,
					remark,
				};
			}
			state.loadingBtn = true;
			deptApi()
				.postSave(params)
				.then((res) => {
					closeDialog();
					emit('refresh');
				})
				.catch((err) => {})
				.finally(() => {
					state.loadingBtn = false;
				});
		}
	});

	// if (state.dialog.type === 'add') { }
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
