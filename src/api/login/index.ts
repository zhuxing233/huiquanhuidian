import requset from '/@/utils/request';

/**
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 * @method currentUser 获取当前用户详细信息
 * @method currentUserImage 获取当前用户头像
 */
export default function () {
	return {
		signIn: (params: object) => {
			return requset.postJson('/login', params);
		},
		signOut: (params: object) => {
			return requset.get('/logout', params);
		},
		currentUser: (params: object) => {
			return requset.get('/user/currentUser', params);
		},
		currentUserImage: (params: object) => {
			return requset.get('/file/getImage', params);
		},
	};
}
