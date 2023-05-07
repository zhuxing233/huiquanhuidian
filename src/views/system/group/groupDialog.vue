<template>
	<div class="system-user-dialog-container">
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
						<el-form-item label="组别名称" prop="groupName">
							<el-input v-model="state.ruleForm.groupName" placeholder="请输入组别名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="组别类型" prop="groupType">
							<el-select v-model="state.ruleForm.groupType" class="w100">
								<el-option v-for="item in state.optionsType" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
							</el-select>
						</el-form-item>
					</el-col> -->
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
						<el-form-item label="组别描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入组别描述" maxlength="150"></el-input>
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

<script setup lang="ts" name="systemGroupDialog">
import { reactive, ref } from 'vue';
import groupApi from '/@/api/group';
import unitApi from '/@/api/unit';
import commonApi from '/@/api/common';
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
const dialogFormRef = ref();

// 定义变量内容
const userDialogFormRef = ref();
const state = reactive({
	ruleForm: {
		isRank: '0',
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
	loading: false,
	loadingBtn: false,
	options: [] as OptionType[],
	optionsType: [] as OptionType[],
});
const rules = reactive<FormRules>({
	unitId: [
		{
			required: true,
			message: '请输入单位名称',
			trigger: 'change',
		},
	],
	groupName: [
		{
			required: true,
			message: '请输入组别名称',
			trigger: 'change',
		},
	],
	groupType: [
		{
			required: true,
			message: '请输入组别类型',
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
	onDict();
	state.dialog.type = type;
	if (type === 'edit') {
		state.ruleForm = JSON.parse(JSON.stringify(row));
		state.dialog.title = '修改组别';
		state.dialog.submitTxt = '修 改';
		remoteMethod(row.unitId);
	} else {
		if (userInfos.value.unitId == 0) {
			state.ruleForm = {
				isRank: '0',
				isList: '1',
			};
		} else {
			state.ruleForm = { unitId: userInfos.value.unitId, isRank: '0', isList: '1' };
		}
		state.dialog.title = '新增组别';
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
			let { unitId, groupId, groupName, groupType = '1', isRank, isList, remark } = state.ruleForm;
			if (state.dialog.type === 'edit') {
				params = {
					unitId,
					groupId,
					groupName,
					isRank,
					isList,
					remark,
					groupType: '1',
				};
			} else {
				params = {
					unitId,
					groupName,
					remark,
					isRank,
					isList,
					groupType: '1',
				};
			}
			state.loadingBtn = true;
			groupApi()
				.groupSave(params)
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
//请求字典
const onDict = () => {
	commonApi()
		.listByDict([{ dict: 'GROUP_TYPE' }])
		.then((res: any) => {
			state.optionsType = res['GROUP_TYPE'].map((e) => {
				return {
					label: e.name,
					value: e.code,
				};
			});
		});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
