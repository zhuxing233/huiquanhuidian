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
								@change="changeUnit"
								:remote-method="remoteMethod"
								:loading="state.loading"
							>
								<el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户名称" prop="userName">
							<el-input v-model="state.ruleForm.userName" placeholder="请输入用户名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门岗位" prop="dept">
							<el-cascader
								:options="state.deptData"
								:props="state.deptProps"
								placeholder="请选择部门岗位"
								clearable
								class="w100"
								v-model="state.ruleForm.dept"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="组别班级" prop="group">
							<el-cascader
								:options="state.groupData"
								:props="state.groupProps"
								placeholder="请选择组别班级"
								clearable
								class="w100"
								v-model="state.ruleForm.group"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="主管部门岗位" prop="mainDept" label-width="auto">
							<el-cascader
								:options="state.deptData"
								:props="state.mainDeptProps"
								placeholder="请选择部门岗位"
								clearable
								class="w100"
								v-model="state.ruleForm.mainDept"
							>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="学历" prop="degree">
							<el-select v-model="state.ruleForm.degree" class="w100">
								<el-option v-for="item in state.optionsDegree" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="手机号" prop="phonenumber">
							<el-input v-model="state.ruleForm.phonenumber" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="生日" prop="birthday">
							<el-date-picker
								v-model="state.ruleForm.birthday"
								format="YYYY/MM/DD"
								value-format="YYYY-MM-DD"
								type="date"
								placeholder="请选择日期"
								class="w100"
							/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="入职日期" prop="entryTime">
							<el-date-picker
								v-model="state.ruleForm.entryTime"
								format="YYYY/MM/DD"
								value-format="YYYY-MM-DD"
								type="date"
								placeholder="请选择日期"
								class="w100"
							/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="是否参与排名" label-width="auto">
							<el-switch v-model="state.ruleForm.isRank" inline-prompt active-text="是" inactive-text="否" active-value="0" inactive-value="1">
							</el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户权限" label-width="auto" prop="userPermissions">
							<el-select v-model="state.ruleForm.userPermissions" class="w100">
								<el-option v-for="item in state.optionsRole" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="用户描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入用户描述" maxlength="150"></el-input>
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

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref, nextTick } from 'vue';
import userApi from '/@/api/user';
import unitApi from '/@/api/unit';
import deptApi from '/@/api/dept';
import groupApi from '/@/api/group';
import commonApi from '/@/api/common';
import { FormRules } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
import { forEach } from 'lodash';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
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
	loading: false,
	loadingBtn: false,
	options: [] as OptionType[],
	optionsDegree: [] as OptionType[],
	optionsRole: [] as OptionType[],
	deptData: [],
	deptProps: { checkStrictly: true, multiple: true },
	mainDeptProps: { checkStrictly: false, multiple: false },
	groupData: [],
	groupProps: { checkStrictly: false, multiple: false },
});
const rules = reactive<FormRules>({
	unitId: [
		{
			required: true,
			message: '请输入单位名称',
			trigger: 'change',
		},
	],
	userName: [
		{
			required: true,
			message: '请输入用户名称',
			trigger: 'change',
		},
	],
	dept: [
		{
			required: true,
			message: '请选择部门岗位',
			trigger: 'change',
		},
	],
	mainDept: [
		{
			required: true,
			message: '请选择主管部门岗位',
			trigger: 'change',
		},
	],
	degree: [
		{
			required: true,
			message: '请选择学历',
			trigger: 'change',
		},
	],
	phonenumber: [
		{
			required: true,
			message: '请输入手机号',
			trigger: 'change',
		},
	],
	birthday: [
		{
			required: true,
			message: '请选择生日日期',
			trigger: 'change',
		},
	],
	entryTime: [
		{
			required: true,
			message: '请选择入职日期',
			trigger: 'change',
		},
	],
	userPermissions: [
		{
			required: true,
			message: '请选择用户权限',
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
		if (userInfos.value.roles.includes('admin')) {
			remoteMethod(row.unitId);
			changeUnit(row.unitId);
		}
		state.ruleForm = JSON.parse(JSON.stringify(row));
		let { userDeptPosts = [], userGroupGrades = [], mainDeptPost = [] } = row;
		state.ruleForm.dept = (userDeptPosts || []).map((e) => {
			let arr = [];
			if (e.deptId) arr.push(e.deptId);
			if (e.postId) arr.push(e.postId);
			return arr;
		});
		state.ruleForm.group = userGroupGrades ? [userGroupGrades[0].groupId, userGroupGrades[0].gradeId] : [];
		state.ruleForm.mainDept = [mainDeptPost.deptId, mainDeptPost.postId];
		state.dialog.title = '修改用户';
		state.dialog.submitTxt = '修 改';
	} else {
		if (userInfos.value.unitId == 0) {
			state.ruleForm = { isRank: '0' };
		} else {
			state.ruleForm = { unitId: userInfos.value.unitId, isRank: '0' };
			changeUnit(userInfos.value.unitId);
		}
		state.dialog.title = '新增用户';
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
			let { unitId, userId, userName, dept, userPermissions, mainDept, group, degree, phonenumber, birthday, entryTime, isRank, remark } =
				state.ruleForm;
			console.log(state.ruleForm);

			let userDeptPosts = [],
				userGroupGrades = [],
				mainDeptPost = {};
			userDeptPosts = dept.map((e) => {
				return {
					deptId: e[0],
					deptName: '',
					postId: e[1] || null,
					postName: '',
				};
			});
			userGroupGrades =
				group && group.length
					? [
							{
								groupId: group[0],
								groupName: '',
								gradeId: group[1],
								gradeName: '',
							},
					  ]
					: [];
			mainDeptPost = {
				deptId: mainDept[0],
				deptName: '',
				postId: mainDept[1],
				postName: '',
			};
			if (state.dialog.type === 'edit') {
				params = {
					unitId,
					userId,
					userName,
					birthday,
					degree,
					entryTime,
					isRank,
					phonenumber,
					userPermissions,
					remark,
					userDeptPosts,
					userGroupGrades,
					mainDeptPost,
				};
			} else {
				params = {
					unitId,
					userName,
					birthday,
					degree,
					entryTime,
					isRank,
					phonenumber,
					userPermissions,
					remark,
					userDeptPosts,
					userGroupGrades,
					mainDeptPost,
				};
			}
			let paramsRole = { roleId: userPermissions, userIds: userId ? [userId] : [] };
			state.loadingBtn = true;

			Promise.all([userApi().userSave(params)])
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
const onDict = () => {
	commonApi()
		.listByDict([{ dict: 'DEGREE' }, { dict: 'ROLE' }])
		.then((res: any) => {
			state.optionsDegree = res['DEGREE'].map((e) => {
				return {
					label: e.name,
					value: e.code,
				};
			});
			state.optionsRole = res['ROLE'].map((e) => {
				return {
					label: e.name,
					value: e.code,
				};
			});
		});
};
const changeUnit = (val) => {
	onDept(val);
	onGroup(val);
	state.ruleForm.dept = [];
	state.ruleForm.group = [];
	state.ruleForm.mainDept = [];
};
const deepDept = (arr) => {
	const dept = [];
	let obj = {};
	arr.forEach((e) => {
		const tmp = { ...e };
		if (tmp.posts) {
			//内部调用即递归
			tmp.posts = deepDept(tmp.posts);
			obj = {
				label: tmp.deptName,
				value: tmp.deptId,
				children: tmp.posts,
			};
		} else {
			obj = {
				label: tmp.postName,
				value: tmp.postId,
			};
		}
		dept.push(obj);
	});
	return dept;
};
const deepGroup = (arr) => {
	const group = [];
	let obj = {};
	arr.forEach((e) => {
		const tmp = { ...e };
		if (tmp.grades) {
			//内部调用即递归
			tmp.grades = deepGroup(tmp.grades);
			obj = {
				label: tmp.groupName,
				value: tmp.groupId,
				children: tmp.grades,
			};
		} else {
			obj = {
				label: tmp.gradeName,
				value: tmp.gradeId,
			};
		}
		group.push(obj);
	});
	return group;
};
const onDept = (val) => {
	deptApi()
		.deptList({ unitId: val })
		.then((res) => {
			state.deptData = deepDept(res);
		});
};
const onGroup = (val) => {
	groupApi()
		.groupList({ unitId: val })
		.then((res) => {
			state.groupData = deepGroup(res);
		});
};
// 暴露变量
defineExpose({
	openDialog,
});
</script>
