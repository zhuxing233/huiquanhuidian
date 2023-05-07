import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Session } from '/@/utils/storage';
import qs from 'qs';
// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		// 在发送请求之前做些什么 token
		if (Session.get('token')) {
			config.headers!['Authorization'] = `${Session.get('token')}`;
		}
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么

		let res = response.data;
		if (res.status && res.code === 200) {
			return response.data;
		} else if (res instanceof Blob) {
			return response;
		} else {
			// `token` 过期或者账号已在别处登录
			if ([1, 3, 4, 6, 1001, 1002].includes(res.code)) {
				ElMessageBox.alert(response.data.message, '提示', {
					showClose: false,
				})
					.then(() => {
						Session.clear(); // 清除浏览器全部临时缓存
						window.location.href = '/'; // 去登录页
					})
					.catch(() => {});
			} else if ([2, 5].includes(res.code)) {
				ElMessageBox.alert(response.data.message, '提示', {
					showClose: false,
				})
					.then(() => {
						window.location.href = '/home'; // 去首页
					})
					.catch(() => {});
			} else {
				ElMessageBox.alert(response.data.message, '提示', {
					showClose: false,
				})
					.then(() => {})
					.catch(() => {});
			}
			return Promise.reject(service.interceptors.response);
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.error(error.response.statusText);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
// export default service;

function get(url: string, params: any = {}) {
	return new Promise((resolve, reject) => {
		service({
			method: 'get',
			url: url,
			params: params,
			baseURL: params.url,
		})
			.then((res) => {
				resolve(res.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

function postJson(url: string, params: any = {}) {
	return new Promise((resolve, reject) => {
		service({
			method: 'post',
			url: url,
			data: JSON.stringify(params),
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
			},
		})
			.then((res) => {
				resolve(res.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

function postForm(url: string, params: any = {}) {
	return new Promise((resolve, reject) => {
		service({
			method: 'post',
			url: url,
			data: qs.stringify(params),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			},
		})
			.then((res) => {
				resolve(res.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
}
function postFile(url: string, params: any = {}) {
	return new Promise((resolve, reject) => {
		service({
			method: 'post',
			url: url,
			data: params,
			headers: {
				'Content-Type': 'multipart/form-data;charset=UTF-8',
			},
		})
			.then((res) => {
				resolve(res.data);
			})
			.catch((err) => {
				reject(err);
			});
	});
}
function handleReturn(resolve, reject, res) {
	if (res.data.success) {
		if (res.data.result === null) {
			resolve();
		} else {
			resolve(res.data.result);
		}
	} else {
		reject(res);
	}
}
function download(resolve, reject, res) {
	console.log(res);
	if (res.data && res.data instanceof Blob) {
		let url = window.URL.createObjectURL(new Blob([res.data]));
		let link = document.createElement('a');
		link.style.display = 'none';
		link.href = url;
		let contentDisposition = res.headers['content-disposition'];
		let fileName = decodeURI(contentDisposition.split(';')[1].split('=')[1]);
		link.download = fileName;
		document.body.appendChild(link);
		let e = document.createEvent('MouseEvent');
		e.initEvent('click', false, false);
		link.dispatchEvent(e);
		resolve(res);
	} else {
		handleReturn(resolve, reject, res);
	}
}
function getFile(url: string, params: any = {}, method: string) {
	return new Promise((resolve, reject) => {
		service({
			method: method || 'post',
			url: url,
			data: params,
			responseType: 'blob',
			headers: {},
		})
			.then((res) => {
				console.log(res);

				download.bind(null, resolve, reject)(res);
			})
			.catch((err) => {
				console.log(err);

				reject(err);
			});
	});
}
export default { get, postJson, postForm, getFile, postFile };
