import Vuex from '@/store/index.js'
 
export function univerifyLogin(cb, fun, fun1) {
	const commit = Vuex.commit;
	const PROVIDER = 'univerify';
	const univerifyStyle = {
		"fullScreen": true,
		"icon": {
			"path": "static/serve.png" // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo   
		},
		"authButton": {
			"normalColor": "#00A861", // 授权按钮正常状态背景颜色 默认值：#3479f5  
			"highlightColor": "#008B50", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）  
			"disabledColor": "#7fd4b0", // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）  
			"textColor": "#ffffff", // 授权按钮文字颜色 默认值：#ffffff  
			"title": "本机号码一键登录", // 授权按钮文案 默认值：“本机号码一键登录”  
			"borderRadius": "24px" // 授权按钮圆角 默认值："24px" （按钮高度的一半）
		},
		"privacyTerms": {
			"defaultCheckBoxState": true, // 条款勾选框初始状态 默认值： true
			"uncheckedImage": "", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)   
			"checkedImage": "", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)   
			"textColor": "#BBBBBB", // 文字颜色 默认值：#BBBBBB  
			"termsColor": "#00A861", //  协议文字颜色 默认值： #5496E3  
			"prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”  
			"suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”  
		},
	}
	return new Promise((resolve, reject) => {
		uni.getProvider({
			service: 'oauth',
			success: (res) => {
				console.log('一键登录',res)
				if (res.provider.indexOf(PROVIDER) !== -1) {
					// 一键登录已在APP onLaunch的时候进行了预登录，可以显著提高登录速度。登录成功后，预登录状态会重置
					uni.login({
						provider: PROVIDER,
						univerifyStyle: univerifyStyle,
						success: (res) => {
							let loginRes = res.authResult
							uni.closeAuthView();
							uni.showLoading({
								title: "登录中..."
							});
							uniCloud.callFunction({
								name: 'getPhoneNumber', // 你的云函数名称
								data: {
									access_token: loginRes
									.access_token, // 客户端一键登录接口返回的access_token
									openid: loginRes
									.openid // 客户端一键登录接口返回的openid
								}
							}).then(e => {
								console.log('login success', e);
								if (e.result.code == 0) {
									typeof fun == "function" && fun(e.result)
									resolve('suc');
								} else {
									console.log('登录失败', e);
								}
							})
							.catch(err => {
								// 处理错误
								console.error("获取手机号err", err)
								uni.showModal({
									title: `登录失败`,
									content: err.errMsg ||
										"网络异常，请选择其他方式登录",
									showCancel: false
								})
								typeof fun1 == "function" && fun1(err)
								reject('err')
							})
 
						},
						fail: (err) => {
							console.error('授权登录失败：' + JSON.stringify(err));
							univerifyErrorHandler(err, cb);
						}
					})
 
 
				} else {
					cb && cb()
				}
			},
			fail: (err) => {
				console.error('获取服务供应商失败：' + JSON.stringify(err));
				cb && cb()
			}
		});
 
	})
}
 
export function univerifyErrorHandler(err, cb) {
	const state = Vuex.state;
	const obj = {
		showCancel: true,
		cancelText: '其他登录方式',
		success(res) {
			console.log("rinima", res)
			if (res.confirm) {
				uni.redirectTo({
					url: '/pages/login/login'
				});
			}
			if (res.cancel) {
				cb && cb()
			}
		}
	} 
 
	switch (true) {
		// 一键登录点击其他登录方式
		case err.code == 30002:
			uni.closeAuthView();
			cb && cb()
			break;
			// 未开通
		case err.code == 1000:
			uni.showModal(Object.assign({
				title: `登录失败: ${err.code}`,
				content: `${err.errMsg}\n开通指南：https://ask.dcloud.net.cn/article/37965`,
				/* confirmText: '开通指南',
				cancelText: '确定',
				success: (res) => {
					if (res.confirm) {
						setTimeout(() => {
							plus.runtime.openWeb('https://ask.dcloud.net.cn/article/37965')
						}, 500)
					}
				} */
			}, obj));
			break;
			// 预登录失败
		case err.code == 30005:
			uni.showModal(Object.assign({
				showCancel: false,
				title: `登录失败`,
				content: `${state.univerifyErrorMsg ||err.metadata.desc || err.errMsg}`
			}, obj));
			break;
			//用户关闭验证界面
		case err.code == 30003:
			// setTimeout(() => {
			// 	uni.redirectTo({
			// 		url: '/pages/login/login'
			// 	});
			// },500)
			
			break;
	}
}
 