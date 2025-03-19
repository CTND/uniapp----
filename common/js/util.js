import Config from './config.js'
import store from '@/store/index.js'
import {request} from '@/common/js/request'
import cache from './cache.js'
let debounceTimeout = null,
throttleRunning = false
let progress = '';//上传 下载提示文字
// #ifdef APP-PLUS
const chooseFile = uni.requireNativePlugin('GW-ChooseFileModule')
// #endif
export default {
	/**
	 * 防抖
	 * @param {Function} 执行函数
	 * @param {Number} delay 延时ms   
	 * 防抖的意思是，在连续的操作中，无论进行了多长时间，只有某一次的操作后在指定的时间内没有再操作
	 * 具体场景可以搜索框输入关键字过程中实时 请求服务器匹配搜索结果
	 * this.$util.debounce(async ()=>{
		const res = await this.$request('cart', 'updateNumber', {
			id: this.list[e.index]._id,
			number: e.number
		})
		if(res.status == 1){
			this.list[e.index].number = e.number
			this.calcTotalPrice();
		}else{
			this.$util.msg('数量更新失败');
		}
	}, 500)
	 */
	debounce (fn, delay=500){
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			fn();
		}, delay);
	},
	/**
	 * 节流 节流的意思是，规定时间内，只触发一次
	 * @param {Function} 执行函数
	 * @param {Number} delay 延时ms  
	 * this.$util.throttle(async ()=>{
			const res = await this.$request('coupon', 'receiveCoupon', {
				id: item._id
			}, {
				showLoading: true
			})
			this.$util.msg(res.msg);
			if(res.status === 1){
				item.state = 2;
				item.state_text = '已领取';
			}
		})
	 */
	throttle(fn, delay=500){
		if(throttleRunning){
			return;
		}
		throttleRunning = true;
		fn();
		setTimeout(() => {
			throttleRunning = false;
		}, delay);
	},
	
	/**
	 * 设置缓存   
	 * @param  {[type]} k [键名]  
	 * @param  {[type]} v [键值]  
	 * @param  {[type]} t [时间、单位秒]  
	 */  
	setKey(k, v, t = 600){
		cache.put(k, v, t);//缓存到本地
	},
	/**
	 * 获取缓存   
	 * @param  {[type]} k   [键名]  
	 * @param  {[type]} def [获取为空时默认]  
	 */  
	getKey(k, def){
		return cache.get(k, def);
	},
	/**
	 * 检查登录
	 * @return {Boolean}
	 */
	isLogin(){
		const token = uni.getStorageSync('token');
		if(token){
			return true;
		}
		return false;
	},
	/**
	 * 显示消息提示框
	 *  @param {Object} params 参数
	 */
	msg(title = '', param={}){
		if(!title) return;
		uni.showToast({
			title,
			duration: param.duration || 1500,
			mask: param.mask || false,
			icon: param.icon || 'none',
			position:param.position || 'center'
		});
	},
	
	// rpx转px
	rpxToPx(rpx) {
		return uni.upx2px(rpx)
	},
	// px转rpx
	pxToRpx(px) {
		//计算比例
		let scale = uni.upx2px(100)/100;
		return px/scale
	},
	//获取模块样式
	getModelStyle(options){
		let style = {};
		style.margin = 'auto';
		if(options.width){
			style.width = options.width + '%';
		}
		if(options.height && options.height > 0){
			style.height = options.height + 'px';
		}
		if(options.borderRadius){
			style['border-radius'] = options.borderRadius + 'px';
		}
		if(options.background){
			style.background = options.background+'!important';
		}
		if(options.shadow && options.shadow == 1){
			style['box-shadow'] = '0 0 10px rgba(0,0,0,.1)';
		}
		style.margin = 'auto';
		if(options.marginLeft && options.marginLeft != 0){
			style['margin-left'] = options.marginLeft + 'px';
		}
		if(options.marginRight && options.marginRight != 0){
			style['margin-right'] = options.marginRight + 'px';
		}
		if(options.marginTop){
			style['margin-top'] = options.marginTop + 'px';
		}
		if(options.marginBottom){
			style['margin-bottom'] = options.marginBottom + 'px';
		}
		if(options.paddingLeft){
			style['padding-left'] = options.paddingLeft + 'px';
		}
		if(options.paddingRight){
			style['padding-right'] = options.paddingRight + 'px';
		}
		if(options.paddingTop){
			style['padding-top'] = options.paddingTop + 'px';
		}
		if(options.paddingBottom){
			style['padding-bottom'] = options.paddingBottom + 'px';
		}
		if(options.fontSize){
			style['font-size'] = options.fontSize + 'px';
		}
		if(options.fontWeight && options.fontWeight > 400){
			style['font-weight'] = 'bold';
		}
		if(options.textColor){
			style.color = options.textColor+'!important';
		}
		//console.log('util-style', style) 
		return style;
	},
	//定义全局自定义按钮样式
	butStyle(ref = 'primary', options = {gra:0}){
		let style = {
			margin:'auto',
			height:'96rpx',
			lineHeight:'96rpx',
			border:'none',
			color:'#ffffff'
		}
		//大小样式
		switch (ref) 
		{ 
		  case 'primary':
		  style.width = '100%';
		  break; 
		}
		//渐变样式
		switch (options.gra)
		{ 
			case 0:
			style['background-color'] = '#2979ff';
			break; 
			case 1:
			style['background-image'] = 'linear-gradient(to right, #fbb672,  #f89330 )';
			break; 
			case 2:
			style['background-image'] = 'linear-gradient(to right,#4f7ffd, #2979ff)';
			break; 
		}
		//附加其他参数
		if(Object.keys(options).length){
			let keys = Object.keys(options);
			for(var i = 0; i < keys.length; i++){
				if(keys[i] != 'gra'){
					style[keys[i]] = options[keys[i]];
				}
			}
		}
		return style;
	},
	//全局背景渐变色
	gradientBg(val = 30){
		var style = {};
		var color1 = '#a7bfff';
		var color2 = '#F8F8F8';
		style['background-image'] = 'linear-gradient(to bottom,' + color1 + ',' + color2 + ' ' + val + '%' +')';
		console.log('style', style)
		return style;
	},
	
	//颜色值转换rgba格式
	colorToRgba(color = '', o = 1.0){
		let str = '';
		if(color){
			str = uni.$u.colorToRgba(color, parseFloat(o));
		}
		return str;
	},
	
	//获取上传地址 str:image video 
	uploadUrl(str){
		if(this.isLogin()){
			return Config.baseUrl+'/addons/public_serve/public/index.php/app/Upload/Uploadfile?uniacid='+Config.uniacid+'&type='+str+'&userid='+store.state.userInfo.userid;
		}else{
			return Config.baseUrl+'/addons/public_serve/public/index.php/app/Upload/Uploadfile?uniacid='+Config.uniacid+'&type='+str+'&userid=0';
		}
	},
	
	/**
	 * 图片 视频 文件 选择加上传
	 * @param number num 上传数量
	 * @param {Object} params 参数 type 图片 视频 sourceType：选择相机 摄像头拍照
	 * @param {Object} callback 回调函数
	 * @param string url
	 * return array
	 */
	upload: async function(num = 1, params = {type:'image', sourceType:['album', 'camera']}, callback = null) {
		//console.log('upload-num', num);
		//console.log('upload-params', params);
		let _that = this;
		var _self = this;
		var uploadUrl = this.uploadUrl(params.type);
		if(!params.type){
			this.msg('上传类型错误');
			return;
		}
		let isAndroid = await this.isAndroid();
		if(params.type == 'image' || params.type == 'video' || params.type == 'file'){
			if(!params.sourceType){
				params.sourceType = ['album'];
			}
			if(params.sourceType.length){
				// #ifdef APP-PLUS
				if(isAndroid){
					var check_auth = '';
					for(var i = 0; i < params.sourceType.length; i++){
						if(params.sourceType[i] == 'album'){
							check_auth = 'android.permission.READ_EXTERNAL_STORAGE';
						}else if(params.sourceType[i] == 'camera'){
							check_auth = 'android.permission.CAMERA';
						}
						const result = await this.showAuthTipModal(check_auth);
						console.log('result---', result)
					}
				}
				// #endif
			}
		}
		var data = {
			token: uni.getStorageSync('token'),
		}
		data = Object.assign({}, data, params);
		if(params.type == 'image'){//上传图片
			uni.chooseImage({
				count: num,
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: params.sourceType, //从相册或者拍照
				success: async function(res) {
					const tempFilePaths = res.tempFilePaths;
					var _data = data;
					var imgs = [];
					for (var i = 0; i < tempFilePaths.length; i++) {
						var path = await _self.upload_file_server(tempFilePaths[i], _data, params);
						imgs.push(path);
					}
					//console.log('imgs', imgs)
					typeof callback == 'function' && callback(imgs, params);
				},
				fail(err) {
					console.log('err', err)
					// #ifdef APP-PLUS
					if(err.code !== 12 && err.code !== 11 && err.code !== 0){
						uni.showToast({
							title: '上传失败,请检查是否有相册读写权限或访问相机权限！',
							duration: 2000,
							icon:'none'
						});
					}
					// #endif
				}
			});
		}else if(params.type == 'video'){//上传视频
			uni.chooseVideo({
				sourceType: params.sourceType,
				compressed:false,
				success: async function (res) {
					//console.log('选择视频后', res)
					var path = await _self.upload_file_server(res.tempFilePath, data, params);
					typeof callback == 'function' && callback(path, params);
				},
				fail(err) {
					console.log('err', err)
					// #ifdef APP-PLUS
					if(err.code !== 12 && err.code !== 11 && err.code !== 0){
						uni.showToast({
							title: '上传失败,请检查是否有相册读写权限或访问相机权限！',
							duration: 2000,
							icon:'none'
						});
					}
					// #endif
				}
			});
		}else if(params.type == 'file'){ //上传文件
			// #ifdef APP-PLUS
			if(isAndroid){
				chooseFile.chooseFile({
					count: 1, //选择文件最大数量
					extension: [], //指定文件扩展名 "docx", "xlsx", "pptx"
					paths: [
						{
							deep: true, // deep为true表示扫描文件包含指定目录及以下的全部子目录，false表示只扫描指定目录下一级的文件
							path: 'Download' // 指定根目录下的相对目录，不用写根目录（/storage/emulated/0）
						},
						{
							deep: true,
							path: 'Documents'
						}
					]
				}, function(res){
					//console.log('eee', res)
					if(res.files.length){
						uni.uploadFile({
							url: uploadUrl,
							filePath: res.files[0].path,
							name: 'file[]',
							formData: data,
							timeout: 1000*600,
							success: function(res) {
								var path_str = JSON.parse(res.data);
								if (path_str.code == 200) {
									typeof callback == 'function' && callback(path_str.data.file_path, params);
								} else {
									uni.showToast({
										title: '上传失败',
										icon:'none'
									});
								}
							},
							fail(err) {
								console.log('上传失败', err)
								uni.showToast({
									title: '上传失败',
									duration: 2000,
									icon:'none'
								});
							}
						});
					}
				})
			}
			// #endif
		}else{
			if(!params.tempFilePath){
				this.msg('资源不能为空');
				return;
			}
			var path = await _self.upload_file_server(params.tempFilePath, data, params);
			typeof callback == 'function' && callback(path, params);
		}
	},
	//上传
	upload_file_server(tempFilePath, data, params) {
		let _that = this;
		var uploadUrl = this.uploadUrl(params.type);
		//console.log('uploadUrl', uploadUrl)
		//console.log('upload_file_server-data', data)
		//console.log('upload_file_server-params', params)
		
		uni.showLoading({
			title: '上传中...'
		});
		return new Promise((resolve, reject) => {
			const uploadTask = uni.uploadFile({
				url: uploadUrl,
				filePath: tempFilePath,
				name: 'file[]',
				formData: data,
				timeout: 1000*600,
				success: function(res) {
					var path_str = JSON.parse(res.data);
					console.log('上传成功upload_file_server', path_str)
					if (path_str.code == 200) {
						var backData = '';
						if(params.type == 'image'){
							backData = path_str.data.file_url;
						}else if(params.type == 'video'){
							backData = path_str;
						}else{
							backData = path_str;
						}
						resolve(backData);
						uni.hideLoading();
					} else {
						uni.hideLoading();
						console.log('上传失败', path_str)
						uni.showToast({
							title: path_str.data.msg,
							icon: 'none'
						})
						reject("error");
					}
					uni.hideLoading();
				},
				fail(err) {
					console.log('上传失败', err)
					uni.hideLoading();
					uni.showToast({
						title: '上传失败',
						duration: 2000,
						icon:'none'
					});
				}
			});
		});
	},
	
	
	//获取图片信息
	getImageInfo(path, params, callback = null){
		if(!Object.keys(params).length){
			typeof callback == 'function' && callback(false);
		}
		uni.getImageInfo({
			src: path,
			success: function (image) {
				if(image.width === params.width && image.height === params.height){
					typeof callback == 'function' && callback(true);
				}else{
					typeof callback == 'function' && callback(false);
				}
				console.log(image.width);
				console.log(image.height);
			}
		});
	},
	
	/**
	 * 授权前告知用户使用意图
	 * @param content 
	 * @returns 
	 */
	async showAuthTipModal(authorize=''){
		const t = this;
		// ios端在manifest.json配置权限使用说明，以下权限判断仅在安卓端可用
		// #ifdef APP-PLUS
		// 如果已经授权直接返回
		const contentData = {
			['android.permission.ACCESS_FINE_LOCATION']: {
				title: "定位权限说明",
				describe: "便于您使用该功能为您提供更精准的数据服务，请您确认授权，否则无法使用该功能"
			},
			["android.permission.READ_EXTERNAL_STORAGE"]: {
				title: "相册权限说明",
				describe: "便于您使用该功能实现上传您的照片/图片/视频等，请您确认授权，否则无法使用该功能"
			},
			["android.permission.CAMERA"]: {
				title: "拍摄权限说明",
				describe: "便于您使用该功能拍摄照片、头像等信息，请您确认授权，否则无法使用该功能"
			},
			["android.permission.CALL_PHONE"]: {
				title: "拨打电话权限说明",
				describe: "便于您使用该功能拨打联系人、客服电话，请您确认授权，否则无法使用该功能"
			},
		}
		let isAndroid = await this.isAndroid();
		if(isAndroid){
			let compat = plus.android.importClass('androidx.core.content.ContextCompat')
			let context = plus.android.runtimeMainActivity()
			let result = compat.checkSelfPermission(context, authorize)
			//console.log("result===", result);
			if (result === 0){
				return true;
			}else{
				return new Promise((resolve) => {
					uni.showModal({
						title: contentData[authorize].title,
						content: contentData[authorize].describe,
						success: (res) => {
							//console.log('res.confirm', res.confirm)
							resolve(!!res.confirm)
						},
						fail: () => {

						}
					})
				})
			}
		}else{
			return true;
		}
		// #endif
	},
	//拨打电话
	callPhone(phone){
		const t = this;
		// #ifdef APP-PLUS
		let isAndroid = this.isAndroid();
		if(isAndroid){
			const result = this.showAuthTipModal('android.permission.CALL_PHONE');
			//console.log('result---获取结果', result)
		} 
		// #endif
		uni.makePhoneCall({
		    phoneNumber: phone.toString(),
			success(res){
				console.log('success', res)
			},
			fail(err){
				console.log('err', err)
			}
		});
	},
	
	//打开导航位置
	toLocation(latitude = '', longitude = ''){
		if(latitude && longitude){
			uni.openLocation({
			    latitude: parseFloat(latitude),
			    longitude: parseFloat(longitude),
			    success: function () {
			        console.log('success');
			    },
				fail:function(e){
					console.log(e)
				}
			});
		}
	},
	//选择位置
	checkLocation(convert = 0,callback = null){
		const t = this;
		uni.chooseLocation({
		    success: function (res) {
				if(convert == 1){
					request('getLocationInfo', {
						latitude:res.latitude,
						longitude:res.longitude,
						name: res.name
					}, {}).then(result => {
						console.log('后台解析位置数据', result)
						typeof callback == 'function' && callback(result.data.data.locationdata);
					}).catch((err) => {
						console.log('getLocationInfo-err', err)
					})
				}else{
					typeof callback == 'function' && callback(res);
				}
		    },
			fail(err) {
				console.log('checkLocation-err', err)
			}
		});
	},
	//获取位置
	async getLocationData(callback){
		const t = this;
		// #ifdef APP-PLUS
		let isAndroid = await this.isAndroid();
		if(isAndroid){
			const result = await this.showAuthTipModal('android.permission.ACCESS_FINE_LOCATION');
			console.log('result---', result)
		}
		// #endif
		let locationdata = cache.get('locationdata');
		//console.log('util-locationdata9999999999999999999999999999999999999999999', locationdata)
		if(locationdata){
			let locationdata_obj = JSON.parse(locationdata);
			if(Object.keys(locationdata_obj).length > 2){
				typeof callback == 'function' && callback(locationdata_obj);
				return;
			}
		}
		uni.getLocation({
			type: 'gcj02',
			geocode: true, //默认false，是否解析地址信息 
			success: function (res) {
				var post_data = {
					latitude:res.latitude,
					longitude:res.longitude,
				};
				console.log('本地获取的地址信息@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',res, post_data)
				request('getLocationInfo', post_data, {
					showLoading: false,
				}).then(result => {
					console.log('getLocationInfo-----------------------------', result)
					if(result.data.code == 200){
						locationdata = result.data.data.locationdata;
						//更新位置
						t.updateLocation(locationdata);
					}else{
						locationdata = res;
					}
					//存储位置数据
					cache.put('locationdata', JSON.stringify(locationdata), 5*60);//缓存到本地
					typeof callback == 'function' && callback(locationdata);
				}).catch((err) => {
					console.log('getLocationInfo-err', err)
				})
			},
			fail:(err)=>{
				console.log('获取全局位置错误@@@@@@@@@@@@@@',err)
				typeof callback == 'function' && callback({});
				//t.openConfirm();
			}
		});
	},
	//更新用户位置数据
	updateLocation(data = {}){
		if(!data){
			return;
		}
		const token = uni.getStorageSync('token');
		if(!token){
			console.log('未登录不可更新位置')
			return true;
		}
		request('UpdateUserLocation', {post_data: data}, {}).then(result => {
			console.log('UpdateUserLocation-success', result)
		}).catch((err) => {
			console.log('UpdateUserLocation-err', err)
		})
	},
	openConfirm () {
		const t = this;
		// #ifdef APP-PLUS
			return;
		// #endif
		// #ifdef MP-WEIXIN
		uni.getSetting({
		    success(res) {
		        if (!res.authSetting['scope.userLocation']) {
					uni.authorize({
						scope: 'scope.userLocation',
						success() {
							// 用户已经同意其他操作...
							t.getLocationData();//获取位置
						},
						fail(){
							uni.showModal({
								title: '提示',
								content: '检测到您没打开此程序的定位权限，是否去设置打开？',
								success: function (res) {
									if (res.confirm) {
										console.log('用户点击确定');
										wx.openSetting({
											success: (res) => {
												const pages = getCurrentPages()
												const perpage = pages[pages.length - 1];
												perpage.onLoad() 
												setTimeout(function(){
													t.getLocationData();//重新定位
												},500)
											}
										})
									} else if (res.cancel) {
										//t.openConfirm();//如果拒绝，在这里进行再次获取授权的操作
									}
								}
							});
						}
					})
		        }
		    }
		});
		// #endif
	},
	
	//获取文件名称
	getFileName(file_url = ''){
		let str = '';
		if(file_url){
			let arr = file_url.split("/");
			if(arr.length){
				str = arr[arr.length - 1];
			}
		}
		return str;
	},
	//打开文件
	openFile(url = ''){
		let t = this;
		if(!url){
			return;
		}
		let files_arr = [];
		let files = uni.getStorageSync('temp_files');
		if(files){
			files_arr = JSON.parse(files);
		}
		let file_name = '';
		let file_home = '';
		let arr = url.split("/");
		if(arr.length && arr.length>2){
			file_home = arr[arr.length - 2];
		}
		if(file_home){
			let file_index = files_arr.findIndex(n=>n.file_home == file_home);
			if(file_index > -1){
				let tempFilePath = files_arr[file_index].tempFilePath;
				//本地文件存在 直接打开
				uni.openDocument({
					filePath: tempFilePath,
					showMenu: true,
					success: function (res) {
						console.log('打开文档成功');
					},
					fail() {
						uni.showToast({title: '打开文件失败',icon:'none'});
					}
				});
				return;
			}
		}
		//否则 执行上传 下载 保存
		uni.showLoading({
			title: '加载中..'
		});
		uni.downloadFile({
			url: url,
			success: function (res) {
				var filePath = res.tempFilePath;
				//保存文件到本地
				if(file_home){
					t.saveFile(filePath, function(temp_url){
						if(temp_url){
							files_arr.push({
								file_home: file_home,
								tempFilePath: temp_url
							})
							uni.setStorageSync('temp_files', JSON.stringify(files_arr));
						}
					})
				}
				//打开文件
				uni.openDocument({
					filePath: filePath,
					showMenu: true,
					success: function (res) {
						console.log('打开文档成功');
					},
					fail() {
						uni.showToast({title: '打开文件失败',icon:'none'});
					}
				});
			},
			fail(err) {
				uni.showToast({title: '下载文件失败',icon:'none'});
				console.log('err', err)
			},
			complete() {
				uni.hideLoading();
			}
		});
	},
	/**
	 * 下载文件到本地
	 *  url 文件地址
	 */
	downloadFile(url, callback = null){
		let result = false;
		if(!url){
			return result;
		}
		const downloadTask = uni.downloadFile({
		    url: url,
		    success: (res) => {
		        if (res.statusCode === 200) {
		            result =  res.tempFilePath;
					//返回临时路径
					typeof callback == 'function' && callback(res.tempFilePath);
		        }
		    },
		});
		downloadTask.onProgressUpdate((res) => {
		    uni.showToast({
		    	title:'下载进度' + res.progress,
		    	duration: 3000,
		    	mask: false,
		    	icon: 'none'
		    });
		});
	},
	
	//保存文件到本地
	saveFile(tempFilePath = '', callback = null){
		if(tempFilePath == ''){
			return false;
		}
		uni.saveFile({
			tempFilePath: tempFilePath,
			success: function (res) {
				var savedFilePath = res.savedFilePath;
				typeof callback == 'function' && callback(savedFilePath);
			},
			fail(err) {
				console.log('保存文件错误', err)
			}
		});
	},
	
	//获取本地已保存的文件列表
	getSavedFileList(callback = null){
		uni.getSavedFileList({
			success: function (res) {
				typeof callback == 'function' && callback(res.fileList);
			},
			fail(err) {
				console.log('getSavedFileList-err', err)
			}
		});
	},
	/**
	 * 保存图片到相册
	 * tempFilePath 临时路径
	 */
	saveAlbum(tempFilePath, callback = null){
		if(!tempFilePath){
			return;
		}
		uni.saveImageToPhotosAlbum({
			filePath: tempFilePath,
			success: function () {
				typeof callback == 'function' && callback(tempFilePath);
			},
			fail(err) {
				console.log('保存失败', err)
			}
		});
	},
	
	// 预览图片
	previewImage(index, images=[]) {
		var paths = [];
		if(!images.length){
			return;
		}
		for (let i = 0; i < images.length; i++) {
			paths.push(images[i]);
		}
		uni.previewImage({
			current: index,
			urls: paths
		});
	},
	
	// 判断类型集合
	checkStr(str, type){
		switch (type) {
			case 'mobile': //手机号码
				return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
			case 'tel': //座机
				return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
			case 'card': //身份证
				return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
			case 'mobileCode': //6位数字验证码
				return /^[0-9]{6}$/.test(str)
			case 'pwd': //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
				return /^([a-zA-Z0-9_]){6,18}$/.test(str)
			case 'payPwd': //支付密码 6位纯数字
				return /^[0-9]{6}$/.test(str)
			case 'postal': //邮政编码
				return /[1-9]\d{5}(?!\d)/.test(str);
			case 'QQ': //QQ号
				return /^[1-9][0-9]{4,9}$/.test(str);
			case 'email': //邮箱
				return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
			case 'money': //金额(小数点2位)
				return /^\d*(?:\.\d{0,2})?$/.test(str);
			case 'URL': //网址
				return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
			case 'IP': //IP
				return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
			case 'date': //日期时间
				return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/
					.test(str)
			case 'number': //数字
				return /^[0-9]$/.test(str);
			case 'english': //英文
				return /^[a-zA-Z]+$/.test(str);
			case 'chinese': //中文
				return /^[\\u4E00-\\u9FA5]+$/.test(str);
			case 'lower': //小写
				return /^[a-z]+$/.test(str);
			case 'upper': //大写
				return /^[A-Z]+$/.test(str);
			case 'HTML': //HTML标记
				return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
			default:
				return true;
		}
	},
	//二维数组去重
	getUnique(array){
		let obj = {}
	    return array.filter((item, index) => {
			let newItem = item + JSON.stringify(item)
			return obj.hasOwnProperty(newItem) ? false : obj[newItem] = true
		})
	},
	
	/***************************时间类方法**********************************************/
	//时间转化为多久
	getDateLen(e){
		var date = new Date();
		var timeStamp = Date.parse(date);
		if(e){
			timeStamp = Date.parse(e);
		}
		return uni.$u.timeFrom(timeStamp, 'yyyy年mm月dd日');
	},
	//时间去掉秒数
	getTimehous(e){
		let str = '';
		var strarr = e.split(":");
		if(strarr.length == 3){
			str = strarr[0] + ':' + strarr[1];
		}
		return str;
	},
	//日期时间保留日期
	getDatestr(e){
		let str = '';
		var strarr = e.split(" ");
		if(strarr.length){
			str = strarr[0];
		}
		return str;
	},
	//获取当前日期
	getToday(){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		month = (month > 9) ? month : ("0" + month);
		day = (day < 10) ? ("0" + day) : day;
		var today = year + "-" + month + "-" + day;
		return today;
	},
	
	/**
	* 获取当前时间
	*/
	currentTime() {
	    var date = new Date();
	    var year = date.getFullYear(); //月份从0~11，所以加一
	    let month = date.getMonth();
	    var dateArr = [
	        date.getMonth() + 1,
	        date.getDate(),
	        date.getHours(),
	        date.getMinutes(),
	        date.getSeconds(),
	    ];
	    //如果格式是MM则需要此步骤，如果是M格式则此循环注释掉
	    for (var i = 0; i < dateArr.length; i++) {
	        if (dateArr[i] >= 1 && dateArr[i] <= 9) {
	            dateArr[i] = "0" + dateArr[i];
	        }
	    }
	    var strDate =
	        year +
	        "-" +
	        dateArr[0] +
	        "-" +
	        dateArr[1] +
	        " " +
	        dateArr[2] +
	        ":" +
	        dateArr[3] +
	        ":" +
	        dateArr[4];
	        //此处可以拿外部的变量接收，也可直接返回  strDate:2022-05-01 13:25:30
	       	return strDate;
	},
	
	//计算两个时间之间的时间差 多少天时分秒
	intervalTime(startTime, endTime) {
	    let runTime = parseInt((endTime - startTime) / 1000);
		let year = Math.floor(runTime / 86400 / 365);
		runTime = runTime % (86400 * 365);
		let month = Math.floor(runTime / 86400 / 30);
		runTime = runTime % (86400 * 30);
		let day = Math.floor(runTime / 86400);
		runTime = runTime % 86400;
		let hour = Math.floor(runTime / 3600);
		runTime = runTime % 3600;
		let minute = Math.floor(runTime / 60);
		runTime = runTime % 60;
		let second = runTime;
		let result = {
	        year,
	        month,
	        day,
	        hour,
	        minute,
	        second
		};
		//console.log(`相差${year}年${month}月${day}天${hour}小时${minute}分${second}秒`);
		return result;
	},
	
	//判断是时间戳还是日期格式
	isTimestampOrDate(value) {
		const timestampRegex = /^\d{10}$/; // 匹配10位数字，通常是秒级时间戳
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // 匹配"YYYY-MM-DD"格式的日期
		//console.log('dateRegex.test(value)', dateRegex.test(value), timestampRegex.test(value))
		//return timestampRegex.test(value) || dateRegex.test(value);
		return !dateRegex.test(value);
	},
	/**
	 * 时间戳转日期格式
	 * @param {Object} timeStamp
	 * type == 1 -格式输出  2：年月日
	 */
	timestampToTime(timestamp, type = 1) {
		// 时间戳为10位需*1000，时间戳为13位不需乘1000
		//console.log('传递过来的时间参数', timestamp)
		let str = '';
		if(!timestamp){
			return '';
		}else{
			if(this.isTimestampOrDate(timestamp)){//是时间戳
				timestamp = timestamp.toString();
				//console.log('是时间戳')
			}else{//是日期格式
				//console.log('是日期格式')
				if(!this.isAndroid()){//处理IOS中时间格式
					timestamp = timestamp.replace(/\-/g,'\/');//.replace(/-/g,'/')
				}
				var getDate = new Date(timestamp);
				timestamp =  getDate.getTime();
			}
		}
		//console.log('时间长度', timestamp.length)
		var date = new Date(timestamp.length === 10 ? timestamp * 1000 : timestamp);
		var Y = date.getFullYear();
		var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
		var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var m = date.getMinutes();
		if(m < 10){
			m = "0" + m;
		}
		var s = date.getSeconds();
		if(s < 10){
			s = "0" + s;
		}
		if(type == 1){
			str =  Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
		}else if(type == 2){
			str =  Y + '年' + M + '月' + D + '日 ';
		}else if(type == 3){
			str =  Y + '年' + M + '月' + D + '日 ' + h + ':' + m + ':' + s;
		}else if(type == 4){
			str =  Y + '年' + M + '月' + D + '日 ' + h + ':' + m;
		}
		if(!this.isAndroid()){//处理IOS中时间格式
			str = str.replace(/\-/g,'\/');//.replace(/-/g,'/')
		}
		return str;
	},
	
	timeStampTurnTime(timeStamp, type = "") {
		if (timeStamp != undefined && timeStamp != "" && timeStamp > 0) {
			var date = new Date();
			date.setTime(timeStamp.length === 10 ? timeStamp * 1000 : timeStamp);// 时间戳为10位需*1000，时间戳为13位不需乘1000
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			var h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			var minute = date.getMinutes();
			var second = date.getSeconds();
			minute = minute < 10 ? ('0' + minute) : minute;
			second = second < 10 ? ('0' + second) : second;
			if (type) {
				return y + '-' + m + '-' + d;
			} else {
				return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
			}
	
		} else {
			return "";
		}
	},
	/**
	 * 日期格式转时间戳
	 * @param {Object} timeStamp
	 */
	timeTurnTimeStamp(string) {
		var f = string.split(' ', 2);
		var d = (f[0] ? f[0] : '').split('-', 3);
		var t = (f[1] ? f[1] : '').split(':', 3);
		return (new Date(
			parseInt(d[0], 10) || null,
			(parseInt(d[1], 10) || 1) - 1,
			parseInt(d[2], 10) || null,
			parseInt(t[0], 10) || null,
			parseInt(t[1], 10) || null,
			parseInt(t[2], 10) || null
		)).getTime() / 1000;
	},
	/**
	 * 倒计时
	 * @param {Object} seconds 秒
	 */
	countDown(seconds) {
		let [day, hour, minute, second] = [0, 0, 0, 0]
		if (seconds > 0) {
			day = Math.floor(seconds / (60 * 60 * 24))
			hour = Math.floor(seconds / (60 * 60)) - (day * 24)
			minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
			second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
		}
		if (day < 10) {
			day = '0' + day
		}
		if (hour < 10) {
			hour = '0' + hour
		}
		if (minute < 10) {
			minute = '0' + minute
		}
		if (second < 10) {
			second = '0' + second
		}
		var data = {
			d: day,
			h: hour,
			i: minute,
			s: second
		};
		return data;
	},
	
	//秒转换时长
	secondsToTime(milliseconds = 0, type){
		const getDurations = (milliseconds) => {
		      // days
			const days = milliseconds / 1000 / 60 / 60 / 24
			const daysRound = Math.floor(days)
			const daysStr = `${daysRound > 0 ? `${daysRound}天` : ''}`
			  // hours
			const hours = milliseconds / 1000 / 60 / 60 - (24 * daysRound)
			const hoursRound = Math.floor(hours)
			const hoursStr = `${hoursRound > 0 ? `${hoursRound}时` : ''}`
			  // minutes
			const minutes = milliseconds / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound)
			const minutesRound = Math.floor(minutes)
			const minutesStr = `${minutesRound > 0 ? `${minutesRound}分` : ''}`
			  // seconds
			const seconds = milliseconds / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound)
			const secondsRound = Math.floor(seconds)
			const secondsStr = `${secondsRound > 0 ? `${secondsRound}秒` : ''}`
			  // ms
			const ms = milliseconds - (24 * 60 * 60 * 1000 * daysRound) - (60 * 60 * 1000 * hoursRound) - (60 * 1000 * minutesRound) - (secondsRound * 1000)
			const msStr = `${ms > 0 ? `${ms}毫秒` : ''}`
		
			const str = `${daysStr}${hoursStr}${minutesStr}${secondsStr}${msStr}`
			//console.log('获取时长', str)
			return str
		}
		
		    // get date
		const getDate = (milliseconds) => {
			let date = new Date(milliseconds/1);
		      // year
			const year = date.getFullYear()
		      // month
			let month = date.getMonth() + 1;
			month = (month < 10 ? '0' + month : month);
		      // day
			let day = date.getDate();
			day = (day < 10 ? '0' + day : day);
		      // hour
			let hours = date.getHours();
			hours = (hours < 10 ? '0' + hours : hours);
		      // minutes
			let minutes = date.getMinutes();
			minutes = (minutes < 10 ? '0' + minutes : minutes);
		      // seconds
			let seconds = date.getSeconds();
			seconds = (seconds < 10 ? '0' + seconds : seconds);
		
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
		}
		
		if (type === 'duration') {
		  return getDurations(milliseconds)
		}
		if (type === 'date') {
		  return getDate(milliseconds)
		}
	},
	
	/**
	 * 获取某天日期
	 * @param {Object} day
	 */
	getDay: function(day) {
		var today = new Date();
		var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
		today.setTime(targetday_milliseconds);
	
		const doHandleMonth = function(month) {
			var m = month;
			if (month.toString().length == 1) {
				m = "0" + month;
			}
			return m
		}
	
		var tYear = today.getFullYear();
		var tMonth = today.getMonth();
		var tDate = today.getDate();
		var tWeek = today.getDay();
		var time = parseInt(today.getTime() / 1000);
		tMonth = doHandleMonth(tMonth + 1);
		tDate = doHandleMonth(tDate);
	
		const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
		return {
			't': time,
			'y': tYear,
			'm': tMonth,
			'd': tDate,
			'w': week[tWeek]
		};
	},
	
	/************************************************************************************************/

	// 普通数组排序console.log(arr.sort(compare));    
	compareSort (x, y) {//比较函数
	    if (x < y) {
	        return -1;
	    } else if (x > y) {
	        return 1;
	    } else {
	        return 0;
	    }
	},
	
	//数组对象排序console.log(arr.sort(compare));
	Arrsort (obj1, obj2) {
	    var val1 = obj1.sortval;
	    var val2 = obj2.sortval;
	    if (parseFloat(val1) < parseFloat(val2)) {
	        return -1;
	    } else if (parseFloat(val1) > parseFloat(val2)) {
	        return 1;
	    } else {
	        return 0;
	    }            
	},
	// 将Object的属性输出成Array
	objOfPropertyToArr(object) {
	    var arr = [];
	    var i = 0;
	    for (var item in object) {
	        arr[i] = item;
	        i++;
	    }
	    return arr;
	},
	// 将Object的属性值输出成Array
	objOfValueToArr(object) {
	    var arr = [];
	    var i = 0;
	    for (var item in object) {
	        arr[i] = object[item];
	        i++;
	    }
	    return arr;
	},	
	
	/**
	 * 图片路径转换
	 * @param {String} img_path 图片地址
	 * @param {Object} params 参数，针对商品、相册里面的图片区分大中小，size: big、mid、small
	 * path -------- images/xxx/xxx
	 */
	img(img_path, params) {
		var path = "";
		var baseUrl = Config.baseUrl;
		if(store.state.System.cdn_domain){
			baseUrl = store.state.System.cdn_domain;
		}
		if (img_path && img_path != undefined && img_path != "") {
			if (img_path.indexOf("http://") == -1 && img_path.indexOf("https://") == -1) {
				path = baseUrl + "/addons/public_serve/public/" + img_path;
			} else {
				path = img_path;
			}
		}
		return path;
	},
	
	/**
	 * 数值去重
	 * @param {Array} arr 数组
	 * @param {string} field 字段
	 */
	unique(arr, field) {
		const res = new Map();
		return arr.filter((a) => !res.has(a[field]) && res.set(a[field], 1));
	},
	/**
	 * 判断值是否在数组中
	 * @param {Object} elem
	 * @param {Object} arr
	 * @param {Object} i
	 */
	inArray: function(elem, arr) {
		return arr == null ? -1 : arr.indexOf(elem);
	},
	
	/**
	 * 复制
	 * @param {Object} message
	 * @param {Object} callback
	 */
	copy(value, callback) {
		// #ifdef H5
		var oInput = document.createElement('input'); //创建一个隐藏input（重要！）
		oInput.value = value; //赋值
		document.body.appendChild(oInput);
		oInput.select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		oInput.className = 'oInput';
		oInput.style.display = 'none';
		uni.hideKeyboard();
		uni.showToast({
			title: '复制成功',
			duration: 2000,
			icon:'none'
		});

		typeof callback == 'function' && callback();
		// #endif

		// #ifdef MP || APP-PLUS
		uni.setClipboardData({
			data: value,
			success: () => {
				typeof callback == 'function' && callback();
			}
		});
		// #endif
	},
	
	//JS获取富文本里的文字内容
	getText(str) {
		return str.replace(/<[^<>]+>/g, "").replace(/&nbsp;/gi, "");
	},
	/*移除HTML标签代码*/
	removeHTMLTag(str) {
		str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
		str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
		//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
		str=str.replace(/ /ig,'');//去掉 
		return str;
	},
	//转意符换成普通字符
	escape2Html(str) { 
		var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'}; 
		return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];}); 
	}, 
	/**
	 * 是否是微信浏览器
	 */
	isWeiXin() {
		// #ifndef H5
		return false;
		// #endif
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 显示消息提示框
	 *  @param {Object} params 参数
	 */
	showToast(params = {}) {
		params.title = params.title || "";
		params.icon = params.icon || "none";
		params.position = params.position || 'bottom';
		params.duration = 1500;
		uni.showToast(params);
	},
	/**
	 * 检测苹果X以上的手机
	 */
	isIPhoneX() {
		let res = uni.getDeviceInfo();
		if (res.model.search('iPhone X') != -1) {
			return true;
		}
		return false;
	},
	//判断安卓还是iOS
	async isAndroid() {
		let platform = uni.getDeviceInfo().platform
		if (platform == 'ios') {
			return false;
		} else if (platform == 'android') {
			return true;
		}
	},
	/**
	 * 深度拷贝对象
	 * @param {Object} obj
	 */
	deepClone(obj) {
		const isObject = function(obj) {
			return typeof obj == 'object';
		}

		if (!isObject(obj)) {
			throw new Error('obj 不是一个对象！')
		}
		//判断传进来的是对象还是数组
		let isArray = Array.isArray(obj)
		let cloneObj = isArray ? [] : {}
		//通过for...in来拷贝
		for (let key in obj) {
			cloneObj[key] = isObject(obj[key]) ? this.deepClone(obj[key]) : obj[key]
		}
		return cloneObj
	},
	refreshBottomNav() {
		var bottomNav = uni.getStorageSync("bottom_nav");
		bottomNav = JSON.parse(bottomNav);
		for (var i = 0; i < bottomNav.list.length; i++) {
			var item = bottomNav.list[i];
			var obj = {
				index: i
			};
			obj.text = item.title;
			obj.iconPath = this.img(item.iconPath);
			obj.selectedIconPath = this.img(item.selectedIconPath);
			if (bottomNav.type == 1) {
				// 图文
			} else if (bottomNav.type == 2) {
				// 图片
			} else if (bottomNav.type == 3) {
				// 文字
			}
			uni.setTabBarItem(obj);
		}
	},
	
	
	/**
	 * 判断手机是否为iphoneX系列
	 */
	uniappIsIPhoneX() {
		let isIphoneX = false;
		let systemInfo = uni.getDeviceInfo();
		// #ifdef MP
		if (systemInfo.model.search('iPhone X') != -1 || systemInfo.model.search('iPhone 11') != -1 || systemInfo.model.search(
				'iPhone12') != -1) {
			isIphoneX = true;
		}
		// #endif

		// #ifdef H5
		var u = navigator.userAgent;
		var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

		if (isIOS) {
			if (systemInfo.screenWidth == 375 && systemInfo.screenHeight == 812 && systemInfo.pixelRatio == 3) {
				isIphoneX = true;
			} else if (systemInfo.screenWidth == 414 && systemInfo.screenHeight == 896 && systemInfo.pixelRatio == 3) {
				isIphoneX = true;
			} else if (systemInfo.screenWidth == 414 && systemInfo.screenHeight == 896 && systemInfo.pixelRatio == 2) {
				isIphoneX = true;
			}
		}
		// #endif
		return isIphoneX;
	},
	/**
	 * 判断手机是否为iphone11系列
	 */
	uniappIsIPhone11() {
		let isIphone11 = false;
		let systemInfo = uni.getDeviceInfo();
		// #ifdef MP
		if (systemInfo.model.search('iPhone 11') != -1) {
			isIphone11 = true;
		}
		// #endif
		return isIphone11;
	},
	/**
	 * 判断当前页面栈是否存在，如果存在，则返回该页面栈，否则跳转到该页面
	 * @param {Object} url
	 */
	jumpPage(url) {
		let jump = true;
		let arr = getCurrentPages().reverse();
		for (let i = 0; i < arr.length; i++) {
			if (url.indexOf(arr[i].route) != -1) {
				jump = false;
				uni.navigateBack({
					delta: i
				});
				break;
			}
		}
		if (jump) {
			this.$util.diyRedirectTo(url);
		}
	},
	/**
	 * 计算两个经纬度之间的距离
	 * @param {Object} lat1
	 * @param {Object} lng1
	 * @param {Object} lat2
	 * @param {Object} lng2
	 */
	getDistance(lat1, lng1, lat2, lng2) {
		//console.log('getDistance1111111111111111111111111', lat1, lng1, lat2, lng2)
		if(!lat1 || !lng1 || !lat2 || !lng2){
			return '--';
		}
		var radLat1 = lat1 * Math.PI / 180.0;
		var radLat2 = lat2 * Math.PI / 180.0;
		var a = radLat1 - radLat2;
		var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
		var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
			Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		s = s * 6378.137; // EARTH_RADIUS;
		s = Math.round(s * 10000) / 10000;
		return s;
	},
	/**
	 * js获取两个经纬度之间的距离
	 * @param lat1 第一点的纬度
	 * @param lng1 第一点的经度
	 * @param lat2 第二点的纬度
	 * @param lng2 第二点的经度
	 * @returns {Number}
	 */
	distance(la1, lo1, la2, lo2) {
	    var La1 = la1 * Math.PI / 180.0;
	    var La2 = la2 * Math.PI / 180.0;
	    var La3 = La1 - La2;
	    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
	    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
	    s = s * 6378.137;
	    s = Math.round(s * 10000) / 10000;
	    s = s.toFixed(2);
	    return s;
	},
	// #ifdef H5
	/**
	 * 判断该浏览器是否为safaria浏览器
	 */
	isSafari() {
		let res = uni.getDeviceInfo();
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('applewebkit') > -1 && ua.indexOf('mobile') > -1 && ua.indexOf('safari') > -1 &&
			ua.indexOf('linux') === -1 && ua.indexOf('android') === -1 && ua.indexOf('chrome') === -1 &&
			ua.indexOf('ios') === -1 && ua.indexOf('browser') === -1) {
			return true;
		} else {
			return false;
		}
	},
	// #endif
	
	/**
	 * 转换数字，保留f位
	 * @param {Object} e
	 * @param {Object} f
	 */
	numberFixed(e, f) {
		if (!f) {
			f = 0;
		}
		return Number(e).toFixed(f);
	},
	
	/**
	 * 保留任意位小数
	 * @param number 数值
	 * @param precision 保留小数位数
	 * @param toFixed 是否四舍五入
	 * @param isNumber 返回值是否为数值类型
	 * @returns {any}
	 */
	toDecimal(number, precision = 2, toFixed = true, isNumber = true) {
	    (number == undefined || number == null || number == "" || Number.isNaN(number)) && (number = 0)
	    let newNumber = String(number);
	    let arr = newNumber.split(".");
	    arr[0] == '' && (arr[0] = 0);
	    // 如果不是小数，补充对应的0
	    if (arr.length === 1) {
	        return isNumber ? Number(newNumber) : (newNumber + "." + "0".repeat(precision))
	    } else {
	        // 如果是小数 但位数比要保留的位数少 也是要补0
	        if (arr[1].length <= precision) {
	            return isNumber ? Number(newNumber) : (newNumber + "0".repeat(precision - arr[1].length));
	        } else {
	
	            let intNumber = parseInt(arr[0]);// 整数部分
	
	            let decimal = String(arr[1]);// 所有小数部分
	
	            let frontDecimal;//有效小数部分
	
	            if (Number(decimal) == 0) {
	                frontDecimal = 0
	            } else {
	                if (decimal.length <= precision) {
	                    //小数量小于所需小数位
	                    frontDecimal = decimal;
	                } else {
	                    //小数量大于所需小数位
	                    frontDecimal = (precision > 0 ? (decimal.substr(0, precision)) : 0) * 1;
	
	                    let moreDecimal = parseInt(decimal.substr(precision, 1));
	
	                    let spliceNumber = decimal.substr(precision, 5);
	                    if (spliceNumber === '49999') {
	                        moreDecimal += 1;
	                    }
	                    if (moreDecimal >= 5) {
	                        frontDecimal += 1;
	                    }
	                    //判断小数部位是否需要进位 类似于19.996 保留2位小数 就是20.00
	                    if (frontDecimal === Math.pow(10, precision)) {
	                        frontDecimal = '0'.repeat(precision)
	                        intNumber += 1;
	                    }
	                    //处理 0.015 0.009 保留的小数中有0出现的情况
	                    if (String(frontDecimal).length < precision) {
	                        frontDecimal = '0'.repeat(precision - String(frontDecimal).length) + frontDecimal
	                    }
	                }
	            }
	
	            return isNumber ? Number(`${intNumber}.${frontDecimal}`) : `${intNumber}.${frontDecimal}`
	        }
	    }
	},
	
	//生成从minNum到maxNum的随机数
	randomNum(minNum, maxNum) {
	    switch (arguments.length) {
	        case 1:
	            return parseInt(Math.random() * minNum + 1, 10)
	            break
	        case 2:
	            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
	            break
	        default:
	            return 0
	            break
	    }
	},
	
	//生成固定长度的随机字符串
	randomWord(len = 32) {
	    var str = '',
	        range = len,
	        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	    // 随机产生
	    for (var i = 0; i < range; i++) {
	        let pos = Math.round(Math.random() * (arr.length - 1))
	        str += arr[pos]
	    }
	    return str;
	},
	
	//判断微信、支付宝付款码
	codeType(text) {
	    text = text * 1
	    if (text >= 25 && text <= 30) {
	        return 'alipay'
	    } else if (text >= 10 && text <= 15) {
	        return 'wxpay'
	    } else {
	        return false
	    }
	},
	
	//语音播报
	audioPlay(text, that) {
	    console.log(text);
	    let bdVoiceToken = localStorage.bdVoiceToken;
	    if (!bdVoiceToken) {
	        return that.$message.error('未配置语音播报参数');
	    }
	    text = encodeURIComponent(encodeURIComponent(text));
	    let url = 'http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=abcdxxx&tok=' + bdVoiceToken + '&tex=' + text + '&vol=9&per=0&spd=5&pit=5&aue=3';
	    let audio = '<audio autoplay="autoplay">' + '<source src="' + url + '" type="audio/mpeg">' + '<embed height="0" width="0" src="' + url + '">' + '</audio>'
	    $('body').append(audio)
	},
	
	//判断金额
	priceTest(price) {
	    var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d{0,2})$/;
	    if (!reg.test(price)) {
	        return false
	    } else {
	        return true;
	    }
	},
	
	/**
	 * 获取url参数
	 * @param {Object} callback
	 */
	getUrlCode(callback) {
		var url = location.search;
		var theRequest = new Object();
		if (url.indexOf('?') != -1) {
			var str = url.substr(1);
			var strs = str.split('&');
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
			}
		}
		typeof callback == 'function' && callback(theRequest);
	},
	
	base64_encode(str) { // 编码，配合encodeURIComponent使用
	    var c1, c2, c3;
	    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	    var i = 0, len = str.length, strin = '';
	    while (i < len) {
	        c1 = str.charCodeAt(i++) & 0xff;
	        if (i == len) {
	            strin += base64EncodeChars.charAt(c1 >> 2);
	            strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
	            strin += "==";
	            break;
	        }
	        c2 = str.charCodeAt(i++);
	        if (i == len) {
	            strin += base64EncodeChars.charAt(c1 >> 2);
	            strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	            strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
	            strin += "=";
	            break;
	        }
	        c3 = str.charCodeAt(i++);
	        strin += base64EncodeChars.charAt(c1 >> 2);
	        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
	        strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
	        strin += base64EncodeChars.charAt(c3 & 0x3F)
	    }
	    return strin
	},
	
	base64_decode(input) { // 解码，配合decodeURIComponent使用
	    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	    var output = "";
	    var chr1, chr2, chr3;
	    var enc1, enc2, enc3, enc4;
	    var i = 0;
	    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	    while (i < input.length) {
	        enc1 = base64EncodeChars.indexOf(input.charAt(i++));
	        enc2 = base64EncodeChars.indexOf(input.charAt(i++));
	        enc3 = base64EncodeChars.indexOf(input.charAt(i++));
	        enc4 = base64EncodeChars.indexOf(input.charAt(i++));
	        chr1 = (enc1 << 2) | (enc2 >> 4);
	        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	        chr3 = ((enc3 & 3) << 6) | enc4;
	        output = output + String.fromCharCode(chr1);
	        if (enc3 != 64) {
	            output = output + String.fromCharCode(chr2);
	        }
	        if (enc4 != 64) {
	            output = output + String.fromCharCode(chr3);
	        }
	    }
	    return this.utf8_decode(output);
	},
	utf8_decode:function(utftext) { // utf-8解码
	    var string = '';
	    let i = 0;
	    let c = 0;
	    let c1 = 0;
	    let c2 = 0;
	    while (i < utftext.length) {
	        c = utftext.charCodeAt(i);
	        if (c < 128) {
	            string += String.fromCharCode(c);
	            i++;
	        } else if ((c > 191) && (c < 224)) {
	            c1 = utftext.charCodeAt(i + 1);
	            string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
	            i += 2;
	        } else {
	            c1 = utftext.charCodeAt(i + 1);
	            c2 = utftext.charCodeAt(i + 2);
	            string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
	            i += 3;
	        }
	    }
	    return string;
	},
	
	//url参数转换成对象
	urlToJson:function(url = ''){
		let obj = {};
		var index = url.indexOf('?'); // 看url有没有参数
		//console.log('index', index)
		var params = url.substr(index + 1); // 截取url参数部分 name = aaa & age = 20
		//console.log('params', params);
		if(params) { // 有参数时
			let parr = params.split('&');  // 将参数分割成数组 ["name = aaa", "age = 20"]
			for(let i of parr) {           // 遍历数组
				let arr = i.split('=');  // 1） i name = aaa   arr = [name, aaa]  2）i age = 20  arr = [age, 20]
				obj[arr[0]] = arr[1];  // obj[arr[0]] = name, obj.name = aaa   obj[arr[0]] = age, obj.age = 20
			}
		}
		return obj;
	},
	//获取url指定参数
	geturlParam:function(url, name){
		//console.log('获取url指定参数', url, name)
		if(url=='' || name=='') return false;
		var theRequest = new Object();
		if (url.indexOf('?') != -1) {
			var str = url.replace('?', '&');
		}else{
			var str = url;
		}
		var strs = str.split('&');
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
		}
		if(theRequest[name]){
			return theRequest[name];
		}else{
			return 0;
		}
	},
	//清除路由参数
	clearurlParam:function(url){
		var strarr = url.split("?");
		if(strarr.length){
			return strarr[0];
		}else{
			return false;
		}
	},
	isBase64(str) {
		if(!Object.keys(str).length){
			return false;
		}
		if(str.indexOf('=') == -1){
			str += '=';
		}
	    let notBase64 = /[^A-Z0-9+\/=]/i; // remove this line and make sure you pass in a string
		let len = str.length;
		if (!len || len % 4 !== 0 || notBase64.test(str)) {
		   return false;
		}
		let firstPaddingChar = str.indexOf('=');
		return firstPaddingChar === -1 || firstPaddingChar === len - 1 || (firstPaddingChar === len - 2 && str[len - 1] === '=');
	},
}
