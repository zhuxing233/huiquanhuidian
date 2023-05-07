<template>
	<div class="system-add-role-container">
		<el-dialog title="修改单位" v-model="state.isShowDialog" width="769px">
			<el-form ref="dialogFormRef" :rules="rules" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单位名称" prop="unitName">
							<el-input v-model="state.ruleForm.unitName" placeholder="请输入单位名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
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
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单位地址" prop="addressName">
							<el-cascader v-model="state.ruleForm.addressName" class="w100" size="default" :options="regionData" @change="handleChange" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="详细地址" prop="addressDetail">
							<el-input v-model="state.ruleForm.addressDetail" placeholder="请输入单位详细地址" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="单位负责人" prop="userId">
							<el-select
								v-model="state.ruleForm.userId"
								class="w100"
								filterable
								remote
								reserve-keyword
								placeholder="请输入序号或者用户名"
								:remote-method="remoteMethod"
								:loading="state.loading"
							>
								<el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="到期时间" prop="validTime">
							<el-date-picker v-model="state.ruleForm.validTime" class="w100" type="date" placeholder="请选择到期时间" size="default" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="单位描述" prop="remark">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入单位描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="logo" prop="image">
							<el-upload
								class="avatar-uploader"
								action=""
								:http-request="uploadImage"
								:show-file-list="false"
								name="multipartFile"
								:before-upload="beforeAvatarUpload"
							>
								<img v-if="state.ruleForm.imageUrl !== ''" :src="state.ruleForm.imageUrl" class="avatar" />
								<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">修 改</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemEditUnit">
import { nextTick, onMounted, reactive, ref, defineProps } from 'vue';
import { provinceAndCityData, regionData, rovinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data';
import unitApi from '/@/api/unit';
import userApi from '/@/api/user';
import commonApi from '/@/api/common';
import { FormInstance, FormRules, ElMessage, UploadProps } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { Session } from '/@/utils/storage';
const dialogFormRef = ref();
const emit = defineEmits(['ok', 'cancel']);
const props = defineProps({
	row: Object,
});
// const dialogFormRef = ref();
// 定义变量内容
const state = reactive({
	isShowDialog: false,
	ruleForm: {
		unitName: '', // 单位名称
		image: '', //logo
		userId: 0, //单位负责人
		address: '', // 单位地址
		orderSort: 0, // 排序
		validTime: '', //到期时间
		remark: '', // 单位描述
		addressName: [],
		addressDetail: '',
		unitId: 0,
		imageUrl: '',
	},
	menuProps: {
		children: 'children',
		label: 'label',
	},
	loading: false,
	options: [] as OptionType[],
	selectedAddress: [] as string[],
});
const rules = reactive<FormRules>({
	unitName: [
		{
			required: true,
			message: '请输入单位名称',
			trigger: 'change',
		},
	],
	addressName: [
		{
			required: true,
			message: '请输入单位省/市/区',
			trigger: 'change',
		},
	],
	addressDetail: [
		{
			required: true,
			message: '请输入单位详细地址',
			trigger: 'change',
		},
	],
	validTime: [
		{
			required: true,
			message: '请选择授权到期时间',
			trigger: 'change',
		},
	],
	image: [
		{
			required: false,
			message: '请上传单位logo',
			trigger: 'change',
		},
	],
});
const uploadImage = (param: any) => {
	let formData = new FormData();
	formData.append('multipartFile', param.file);
	formData.append('handlerNo', 'localFileHandler');
	commonApi()
		.upload(formData)
		.then((res) => {
			state.ruleForm.image = res.fileId;
			state.ruleForm.imageUrl = import.meta.env.VITE_API_HTTP + res.filePath;
		});
};
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
	state.ruleForm.imageUrl = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	if (rawFile.type !== 'image/jpeg') {
		ElMessage.error('Avatar picture must be JPG format!');
		return false;
	} else if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error('Avatar picture size can not exceed 2MB!');
		return false;
	}
	return true;
};
// 打开弹窗
const openDialog = (row: RowUnitType) => {
	state.isShowDialog = true;
	// dialogFormRef.value?.resetFields();
	// state.ruleForm.imageUrl = '';
	let { image, path, addressName, addressDetail, orderSort, remark, phonenumber, validTime, unitId, unitName, userId, userName } = row;
	state.ruleForm.unitName = unitName;
	state.ruleForm.image = image;
	state.ruleForm.userId = userId;
	state.ruleForm.orderSort = orderSort;
	state.ruleForm.validTime = validTime;
	state.ruleForm.orderSort = orderSort;
	state.ruleForm.addressDetail = addressDetail;
	state.ruleForm.remark = remark;
	state.ruleForm.imageUrl = path ? import.meta.env.VITE_API_HTTP + path : '';
	state.ruleForm.unitId = unitId;
	if (userId) remoteMethod(userId.toString());
	if (addressName) {
		state.ruleForm.addressName = [
			TextToCode[addressName[0]].code,
			TextToCode[addressName[0]][addressName[1]].code,
			TextToCode[addressName[0]][addressName[1]][addressName[2]].code,
		];
		state.selectedAddress = state.ruleForm.addressName.map((e) => {
			return CodeToText[e];
		});
	}
};
// 关闭弹窗
const closeDialog = () => {
	state.isShowDialog = false;
	emit('cancel');
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 修改
const onSubmit = async () => {
	await dialogFormRef.value.validate((valid, fields) => {
		if (valid) {
			let params = {
				unitId: state.ruleForm.unitId,
				unitName: state.ruleForm.unitName,
				image: state.ruleForm.image,
				orderSort: state.ruleForm.orderSort,
				remark: state.ruleForm.remark,
				validTime: state.ruleForm.validTime,
				addressName: state.selectedAddress,
				addressDetail: state.ruleForm.addressDetail,
				userId: state.ruleForm.userId,
			};
			unitApi()
				.unitSave(params)
				.then(() => {
					ElMessage.success('修改单位成功!');
					emit('ok');
					closeDialog();
				})
				.catch((err) => {});
		} else {
			// console.log('error submit!', fields);
		}
	});
};

const handleChange = () => {
	state.selectedAddress = state.ruleForm.addressName.map((e) => {
		return CodeToText[e];
	});
};
const remoteMethod = (query: string) => {
	if (!query) {
		return;
	}
	userApi()
		.userLike({ unitId: state.ruleForm.unitId, params: query })
		.then((res: any) => {
			state.options = res.map((e) => {
				return {
					label: e.userName,
					value: e.userId,
					disabled: e.userId === 1,
				};
			});
		});
};
onMounted(() => {
	openDialog(props.row);
});
// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-add-role-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
.avatar-uploader .avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
