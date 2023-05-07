<template>
	<div class="system-rule-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="dialogFormRef" :model="state.ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="规则明细" prop="ruleName">
							<el-input v-model="state.ruleForm.ruleName" placeholder="请输入规则明细" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="规则明细分值" label-width="auto" prop="ruleScore">
							<el-input-number
								v-model="state.ruleForm.ruleScore"
								:min="-999"
								:max="999"
								controls-position="right"
								placeholder="请输入规则明细分值"
								class="w100"
							/>
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

<script setup lang="ts" name="systemDetailDialog">
import { reactive, ref } from 'vue';
import ruleApi from '/@/api/rule';
import { FormRules } from 'element-plus';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dialogFormRef = ref();
const state = reactive({
	ruleForm: {},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
	loadingBtn: false,
});
const rules = reactive<FormRules>({
	ruleName: [
		{
			required: true,
			message: '请输入规则明细',
			trigger: 'change',
		},
	],
	ruleScore: [
		{
			required: true,
			message: '请输入规则明细分值',
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
		state.dialog.title = '修改规则明细';
		state.dialog.submitTxt = '修 改';
	} else {
		state.ruleForm = { parentRule: row.ruleId };
		state.dialog.title = '新增规则明细';
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
			let { unitId, ruleId, ruleName, parentRule, ruleScore } = state.ruleForm;
			if (state.dialog.type === 'edit') {
				params = {
					unitId,
					ruleId,
					parentRule,
					ruleName,
					ruleScore,
				};
			} else {
				params = {
					unitId,
					parentRule,
					ruleName,
					ruleScore,
				};
			}
			state.loadingBtn = true;
			ruleApi()
				.ruleSave(params)
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
