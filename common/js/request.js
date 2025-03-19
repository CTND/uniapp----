import store from '@/store'
import Config from './config.js'
import cache from './cache.js'
import apis from './apis.js'
var requestUrl = Config.baseUrl+'/addons/public_serve/public/index.php/';
var moduleMaps = {};
var api_list = apis.getApis();
api_list.forEach((i,j)=>{
	moduleMaps = Object.assign({}, moduleMaps, i);
})
/**
 * @param {String} module  
 * @param {String} operation  
 * @param {Object} data 请求参数
 * @param {Object} ext 附加参数
 */
export const request = (module, data={}, ext={})=>{
	return new Promise((resolve, reject) => {
		
		const cloudFnName = moduleMaps[module];
		if(!cloudFnName){
			console.log('接口不存在'+module)
			return;
		}
		data.uniacid = Config.uniacid;
		data.userid = 0;
		let userInfo = uni.getStorageSync('userInfo');
		if(userInfo){
			let userInfoData = JSON.parse(userInfo);
			data.userid = userInfoData.userid;
		}
		
		let token = uni.getStorageSync('token');
		//判断环境
		let env = 'wx_app';
		// #ifdef APP-PLUS
		env = 'plus_app';
		// #endif
		// #ifdef H5
		env = 'h5';
		// #endif
		// #ifdef MP-TOUTIAO
		env = 'dy_app';
		// #endif
		// #ifdef MP-KUAISHOU
		env = 'ks_app';
		// #endif
		data.env = env;
		
		var post_data = JSON.parse(JSON.stringify(data));
		//追加位置数据
		if(!post_data.locationdata){
			var locationdata = cache.get('locationdata');
			if(locationdata){
				post_data.locationdata = JSON.parse(locationdata);
			}
		}
		//追加设备deviceId
		let deviceId = '';
		if(Object.keys(store.state.systemInfo).length){
			deviceId = store.state.systemInfo.deviceId;
		}else{
			deviceId = randomWord();
		}
		post_data.deviceId = deviceId;
		
		if(ext.cache && typeof(ext.cache) === 'number' && ext.cache > 0){
			const cacheResult = cache.get(module);
			if(cacheResult !==false){
				//console.log('从缓存中获取的数据-----------------------------------------------------'+module)
				resolve(cacheResult);
				return;
			}
		}
		uni.request({//返回系统数据
			url:requestUrl+cloudFnName,
			data: post_data,
			method:"POST",
			timeout:1000*600,
			header: {
				'content-type': 'application/json',
				'Authorization': token ? token : ''
			},
			success:(res)=>{
				if(res.data.code === 200){
					if(ext.cache && typeof(ext.cache) == 'number' && ext.cache > 0){//缓存数据
						cache.put(module, res, ext.cache);
					}
				}
				resolve(res);
			},
			fail: function (err) {
				reject(err);
			}
		});
	})
}



//判断安卓还是iOS
function isAndroid() {
	let platform = uni.getDeviceInfo().platform
	if (platform == 'ios') {
		return false;
	} else if (platform == 'android') {
		return true;
	}
}

//生成固定长度的随机字符串
function randomWord(len = 32) {
	var str = '',
		range = len,
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	// 随机产生
	for (var i = 0; i < range; i++) {
		let pos = Math.round(Math.random() * (arr.length - 1))
		str += arr[pos]
	}
	return str;
}