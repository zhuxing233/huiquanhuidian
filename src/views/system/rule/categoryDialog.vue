<template>
	<div class="system-rule-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="dialogFormRef" :model="state.ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col v-if="userInfos.roles.includes('admin')" :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单位名称" prop="unitId">
							<el-select
								v-model="state.ruleForm.unitId"
								class="w100"
								filterable
								remote
								reserve-keyword
								placeholder="请输入序号或者单位名称"
								:remote-method="remoteMethod"
								:loading="state.loading"
							>
								<el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="规则分类" prop="ruleName">
							<el-input v-model="state.ruleForm.ruleName" placeholder="请输入规则分类名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="分类描述" prop="remark">
							<el-input v-model="state.ruleForm.remark" placeholder="请输入规则分类描述" clearable></el-input>
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

<script setup lang="ts" name="systemCategoryDialog">
import { reactive, ref } from 'vue';
import ruleApi from '/@/api/rule';
import unitApi from '/@/api/unit';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
import { FormRules } from 'element-plus';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const props = defineProps({
	row: Object,
});
const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
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
	loading: false,
	loadingBtn: false,
	options: [] as OptionType[],
});
const rules = reactive<FormRules>({
	unitId: [
		{
			required: true,
			message: '请输入单位名称',
			trigger: 'change',
		},
	],
	ruleName: [
		{
			required: true,
			message: '请输入规则分类名称',
			trigger: 'change',
		},
	],
});
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
// 打开弹窗
const openDialog = (type: string, row: any) => {
	dialogFormRef?.value?.resetFields();
	state.dialog.type = type;
	if (type === 'edit') {
		remoteMethod(row.unitId);
		state.ruleForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '修改规则分类';
		state.dialog.submitTxt = '修 改';
	} else {
		if (userInfos.value.unitId == '0') {
			state.ruleForm = {};
		} else {
			state.ruleForm = { unitId: userInfos.value.unitId };
		}
		state.dialog.title = '新增规则分类';
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
			let { unitId, ruleId, ruleName, remark } = state.ruleForm;
			if (state.dialog.type === 'edit') {
				params = {
					unitId,
					ruleId,
					ruleName,
					remark,
				};
			} else {
				params = {
					unitId,
					ruleName,
					remark,
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
