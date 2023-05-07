import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import { Session } from '/@/utils/storage';
import loginApi from '/@/api/login';
/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			photo: '',
			time: 0,
			roles: [],
			authBtnList: [],
			unitId: 0,
			unitName: '',
		},
	}),
	actions: {
		async setUserInfos() {
			// 存储用户信息到浏览器缓存

			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
			} else {
				let userInfos: any = await this.getApiUserInfo();
				// let photo: string = (await this.getUserImage(userInfos.image)) as string;
				// userInfos.image = userInfos.path;
				this.userInfos = userInfos;
				Session.set('userInfo', userInfos);
			}
		},
		// 请求用户信息和头像
		async getApiUserInfo() {
			return new Promise((resolve, reject) => {
				loginApi()
					.currentUser({})
					.then((res: any) => {
						Cookies.set('userName', res.userName);
						const roleId = res.roles[0].roleId;
						let defaultRoles: Array<string> = [];
						let defaultAuthBtnList: Array<string> = [];
						// admin 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
						let adminRoles: Array<string> = ['admin'];
						// admin 按钮权限标识
						let adminAuthBtnList: Array<string> = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
						// test 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
						let testRoles: Array<string> = ['common'];
						// test 按钮权限标识
						let testAuthBtnList: Array<string> = ['btn.add', 'btn.link'];
						// 不同用户不同的用户权限
						if (roleId === 1) {
							defaultRoles = adminRoles;
							defaultAuthBtnList = adminAuthBtnList;
						} else {
							defaultRoles = testRoles;
							defaultAuthBtnList = testAuthBtnList;
						}
						// 用户信息数据
						const userInfos = {
							userName: res.userName,
							image: import.meta.env.VITE_API_HTTP + res.path,
							time: new Date().getTime(),
							roles: defaultRoles,
							authBtnList: defaultAuthBtnList,
							unitId: res.unitId,
							unitName: res.unitName,
						};
						resolve(userInfos);
					});
			});
		},
		async getUserImage(image: string) {
			return new Promise((resolve, reject) => {
				loginApi()
					.currentUserImage({ fileId: image })
					.then((res) => {
						const phone = res;
						resolve(phone);
					});
			});
		},
	},
});
