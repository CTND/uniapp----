import {request} from '@/common/js/request'
export default {
	// 这里如果写成onShareAppMessage: res => { ... }形式的箭头函数，在内部会无法获得this
	onShareAppMessage(res) {
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log(res.target)
		}
		var shareImg = '';
		if(this.$store.state.System.share_cover != ''){
			shareImg = this.$store.state.System.share_cover;
		}
		if(this.$store.state.ShareData.imageUrl){
			shareImg = this.$store.state.ShareData.imageUrl;
		}
		var shareData =  {
			title: this.$store.state.System.share_title,
			imageUrl: shareImg,
			path: this.fullPath()
		};
		if(this.$store.state.ShareData.title){
			shareData.title = this.$store.state.ShareData.title;
		}
		console.log('自定义分享内容', shareData, this.$store.state.ShareData)
		return shareData;
	},
	onShareTimeline(res) {
		//console.log('来自页面内分享按钮', res)
		if (res.from === 'button') {// 来自页面内分享按钮
			console.log('来自页面内分享按钮',res.target)
		}
		return {
			title: this.$store.state.System.share_title,
			path: this.fullPath()
		}
	},
	data() {
		return {
			fullLoading: false, //全屏加载
			isLoading: false, //刷新数据
			totalCount:0,//总数据量
			pageNo: 0, //页码
			pageSize: 10, //每页加载数据量
			
			mainHeight:0,//获取页面主体高度
			
			isSubmit: false, //是否正在提交数据
			share: {}, //分享内容
			itemDataKey: "navigateToItemData",
			
			custom_Footer: false,//自定义四部导航
		
			//模态数据
			modal_data: {},
			
			//自动定位类型当前位置数据
			locationdata:{
				adcode: '',
				address: '',
				city: '',
				citycode: '',
				district: '',
				latitude: '',
				longitude: '',
				province: '',
			},
			//选择类型的位置数据
			check_location:{
				latitude: '',
				longitude: '',
				name: '',
			},
			
			isInItial: false, //是否对gui-page进行了inItial
		}
	},
	watch:{
		isLoading: {
			handler (newValue, value) {
				if(this.$refs['guipage']){
					this.$refs['guipage'].loadingChange(newValue);
				}
			},
			deep: true
		},
		fullLoading: {
			handler (newValue, value) {
				if(this.$refs['guipage']){
					if(newValue){
						this.$refs['guipage'].openFullLoading();
					}else{
						this.$refs['guipage'].closeFullLoading();
					}
				}
			},
			deep: true
		}
	},
	computed: {
		System(){
			return this.$store.state.System;
		},
		userInfo(){
			return this.$store.state.userInfo;
		},
	},
	mounted() {
	    // 在mounted钩子中访问$refs
	},
	onLoad: function(){
		//取出本地缓存的位置数据
		let locationdata = this.$util.getKey('locationdata');
		if(locationdata){
			this.locationdata = JSON.parse(locationdata);
		}
		//console.log('mixin-onLoad', this.locationdata)
		
		if(this.$refs.guipage && this.fullLoading === false){
			this.fullLoading = true;
			setTimeout(()=>{
				this.fullLoading = false;
			}, 500)
		}
	},
	onShow(){
		const t = this;
		if (this.$refs.guipage) {
			//初始化全局点击事件
			this.$refs['guipage'].inItial();
			this.getRefs('guipage', this, 0, (ref)=>{
				ref.getDomSize('guiPageBody', (e)=>{
					// 此处 88 请更具实际情况进行调整
					//console.log('此处 88 请更具实际情况进行调整', e)
					//console.log('此处 88 请更具实际情况进行调整1',this.isSwitchPage)
					let sub = 10;
					this.mainHeight  = e.height - uni.upx2px(sub);
				});
			});
		}else{
			//console.log('不存在guipage@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
			let  windowHeight = this.$store.state.systemInfo.windowHeight;
			this.mainHeight = windowHeight;
		}
		//获取系统设置
		this.$store.dispatch('getSystem', (res)=>{
			//console.log('SSSSSSSSSSSSSSSSSS', res)
			if(Object.keys(res).length){
				let System = res;
				//设置标题颜色
				uni.setNavigationBarColor({
				    frontColor: '#000000',
				    backgroundColor: System.title_bg_color
				})
				//设置底部菜单
				var pages = getCurrentPages();
				if(pages.length){
					var page = pages[pages.length - 1];
					var url = page.$page.fullPath;
					page.$page.fullPath;//原始路由
					//console.log('原始路由', url)
					let clear_path = this.$util.clearurlParam(page.$page.fullPath);
					//console.log('清除参数后的路由', this.$util.clearurlParam(page.$page.fullPath))
					if(System.tabbar && System.tabbar.list && System.tabbar.list.length>=2){
						//要做判断的路由数组
						let router_list = System.tabbar.list.map((item) => item.link.path); 
						//console.log('要做判断的路由数组', router_list)
						let index = router_list.indexOf(url);
						let cindex = router_list.indexOf(clear_path);
						//console.log('判断是否是自定义导航页', index, cindex)
						if(index > -1){
							this.custom_Footer = true;
							setTimeout(()=>{
								this.$store.state.tabbarData.value = index;
							},200)
						}else if(cindex > -1){
							this.custom_Footer = true;
							setTimeout(()=>{
								this.$store.state.tabbarData.value = cindex;
							},200)
						}else{
							for(var i = 0; i < router_list.length; i++){
								//console.log('i-'+url.indexOf(router_list[i]))
								if(url.indexOf(router_list[i]) > -1){
									this.custom_Footer = true;
									setTimeout(()=>{
										this.$store.state.tabbarData.value = i;
									},200)
									break;
								}
							}
						}
					}
				}
			}
		})
		//获取未读消息
		this.getNotifyCount();
		
		//判断是否登录
		console.log('islogin', this.isLogin({nav:false}))
	},
	onReady(){
		const t = this;
		// 保持屏幕常亮
		// #ifndef H5
		uni.setKeepScreenOn({
			keepScreenOn: true
		});
		// #endif
	},
	
	//监听页面卸载
	onUnload(){
		
	},
	
	methods: {
		//全局处理列表数据 页面加载状态
		dataListEvent(data = {}, hiddenloadmore = 0){
			console.log('this.list.length', this.list.length)
			if(this.$refs.guipage){
				this.apiLoadingStatus = false;
				this.$refs.guipage.endReload();//停止刷新
				if(data.list != undefined){
					if(data.totalCount != undefined){
						this.totalCount = data.totalCount;
						if(data.totalCount > this.list.length){
							this.queryForm.pageNo += 1;//还有数据 页面数增加1
							this.$refs.guipage.stoploadmore();//停止加载动画，准备下一次加载
						}else{
							this.$refs.guipage.nomore();//没有更多数据
						}
					}else{
						console.log('data.totalCount-1')
					}
					if(this.list.length == 0){
						this.$refs.guipage.empty();//数据为空
						this.$refs.guipage.hiddenloadmore();//隐藏已加载全部数据
					}
					if(hiddenloadmore == 1){
						this.$refs.guipage.hiddenloadmore();
					}
				}else{
					this.$refs.guipage.stoploadmore();//停止加载动画，准备下一次加载
				}
				if(data.list && data.list.length == 0){
					this.$refs.guipage.nomore();//没有更多数据
				}
				
			}
			
		},
		//获取未读消息
		getNotifyCount(){
			const t = this;
			if(this.isLogin({nav:false}) && this.System.use_im == 1){
				this.$store.state.menuDot = 0;
				this.$request('getNotifyCount', {},{
					showLoading: false,
				}).then((res)=>{
					let this_page = t.getPageShed();
					console.log('this_page', this_page)
					if(res.data.data.count > 0){
						let arr = ['/pages/index/Sindex', '/pages/same/news/index', '/pages/same/moyue/index', '/pages/home/index'];
						let index = arr.indexOf(this_page);
						if(index > -1){
							if(this.$store.state.menuDot == 0){
								this.$store.state.menuDot = 1;
								// uni.showTabBarRedDot({
								// 	index: 1
								// })
							}
						}
					}
				})
			}
		},
		
		//按钮渐变样式
		butGradStyle(colors = []){
			let style = {};
			let Grad = 'linear-gradient(to right, #fbb672,  #f89330 )';
			if(colors.length == 2){
				Grad = 'linear-gradient(to right, '+colors[0]+', '+colors[1]+')';
			}
			style['background-image'] = Grad;
			return style;
		},
		//向服务器写日志
		writeLog(data){
			if(!Object.keys(data).length) return;
			this.$request('writeLog', data,{
				showLoading: false
			}).then((res)=>{})
		},
		/**
		 * 检查登录
		 * @return {Boolean}
		 */
		isLogin(options={}){
			const token = uni.getStorageSync('token');
			if(token){
				return true;
			}
			if(options.nav !== false){
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
			return false;
		},
		
		/**
		 * 获取当前页面栈
		 */
		fullPath(){
			const t = this;
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			var url = page.$page.fullPath;
			var params = this.$store.state.shareParams;
			if(this.$store.state.ShareData.path){
				url = this.$store.state.ShareData.path;
			}
			
			let keys = [];//已存在的参数
			if (url.indexOf('?') != -1){
				let url_params = t.$util.urlToJson(url);
				keys = Object.keys(url_params);
			}
			if (Object.keys(params).length) {
				Object.keys(params).forEach(function(key) {
					if(keys.indexOf(key) == -1){
						if (url.indexOf('?') != -1) {
							url += "&" + key + "=" + params[key];
						} else {
							url += "?" + key + "=" + params[key];
						}
					}
				});
			}
			
			url = url.replace(/\s/g, '');
			let share_path = '/pages/index/index?shareid=0';
			//附带用户分享参数
			let userInfo = uni.getStorageSync('userInfo');
			if(userInfo){
				let userInfoData = JSON.parse(userInfo);
				share_path = '/pages/index/index?shareid=' + userInfoData.userid;
			}
			share_path = share_path + '&redirect_url=' + this.$util.base64_encode(encodeURIComponent(url));
			
			//console.log('分享页面+参数', share_path)
			return share_path;
		},
		//获取当前页面栈
		getPageShed(){
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			var url = page.$page.fullPath;
			return url;
		},
		/**
		 * 显示消息提示框
		 *  @param {Object} params 参数
		 */
		msg(title = '', param={}){
			if(!title) return;
			setTimeout(()=>{
				uni.showToast({
					title: title,
					duration: param.duration || 1500,
					icon: param.icon || 'none',
				});
			}, 200)//延迟执行
		},
		//弹窗
		showModalEvent(modal_data = {}, options={}){
			const _this = this;
			if(Object.keys(modal_data).length){
				let cancelText = modal_data.cancelText ? modal_data.cancelText : '取消';
				let confirmText = modal_data.confirmText ? modal_data.confirmText : '确定';
				let title = modal_data.title ? modal_data.title : '';
				let content = modal_data.content ? modal_data.content : '';
				let options_obj = options;
				if(modal_data.options){
					options_obj = Object.assign({}, modal_data.options, options);
				}
				// #ifdef APP-PLUS
				if(_this.$util.isAndroid()){
					cancelText = modal_data.confirmText ? modal_data.confirmText : '确定';
					confirmText = modal_data.cancelText ? modal_data.cancelText : '取消';
				}
				// #endif
				uni.showModal({
					title: title,
					content: content,
					showCancel: modal_data.showCancel != undefined ? modal_data.showCancel : false,
					cancelText: cancelText, 
					confirmText: confirmText,
					success: function (res) {
						// #ifdef APP-PLUS
						if(_this.$util.isAndroid()){
							if (res.confirm) {
								//console.log('取消');
								_this.modalEventBack(options_obj, 0);
							} else if (res.cancel) {
								if(modal_data.path != undefined && modal_data.path != ''){
									uni.navigateTo({
										url: modal_data.path
									});
									return;
								}
								_this.modalEventBack(options_obj, 1);
							}
						}else{
							if (res.confirm) {
								if(modal_data.path != undefined && modal_data.path != ''){
									uni.navigateTo({
										url: modal_data.path
									});
									return;
								}
								_this.modalEventBack(options_obj, 1);
							} else if (res.cancel) {
								//console.log('取消');
								_this.modalEventBack(options_obj, 0);
							}
						}
						// #endif
						// #ifndef APP
						if (res.confirm) {
							if(modal_data.path != undefined && modal_data.path != ''){
								uni.navigateTo({
									url: modal_data.path
								});
								return;
							}
							_this.modalEventBack(options_obj, 1);
						} else if (res.cancel) {
							//console.log('取消');
							_this.modalEventBack(options_obj, 0);
						}
						// #endif
					}
				});
			}
		},
		//弹窗返回
		modalEventBack(options, v){
			console.log('mixin-modal弹窗返回', options, v)
		},
		//显示模态弹窗
		showModalPopup(data = {}, options = {}){
			//console.log('mixin-modal_data', data)
			this.modal_data = data;
			if(this.$refs['guipage']){
				this.$refs['guipage'].modalPopupOpen(data, options);
			}
		},
		//modal弹窗回调
		popupCallback(v, options){
			const t = this;
			this.$refs['guipage'].modalPopupClose();
			//console.log('modal弹窗回调', v, options)
			
			if(v == 1){
				if(options.path != undefined && options.path != ''){
					uni.navigateTo({
						url: options.path
					});
					return;
				}
			}
		},
		// 获取ref ( 循环获取，直到 组件创建完成并获取成功 )
		getRefs(ref, _this, count, fun) {
			if (count >= 50) {
				fun(_this.$refs[ref]);
				return false;
			}
			var refReturn = _this.$refs[ref];
			if (refReturn) {
				fun(refReturn);
			} else {
				count++;
				setTimeout(() => {
					this.getRefs(ref, _this, count, fun);
				}, 100);
			}
		},
		
		/**
		 * 获取页面栈
		 * @param {Number} preIndex为1时获取上一页
		 * @return {Object} 
		 */
		prePage(preIndex = 1){
			const pages = getCurrentPages();
			//let prePage = pages[pages.length - 2];
			const Page = pages[pages.length - (preIndex + 1)];
			//return Page.$vm;
			return Page;
		},
		//返回
		goBack(delayed = 0) {
			if (getCurrentPages().length == 1) {
				this.redirectTo('/pages/index/index');
			} else {
				setTimeout(()=>{
					uni.navigateBack();
				}, delayed)
			}
		},
		
		//全局事件处理
		clickEvent(data){
			const t = this;
			console.log('收到点击事件', JSON.stringify(data))
			if(data.event == undefined) return;
			let event = data.event;
			let options = data.options ? data.options : {};
			uni.$emit('clickEvent', data);//触发全局的自定义事件
			if(event == 'openWxApp'){//打开微信小程序
				// #ifdef MP-WEIXIN
				if(options.appId && options.openPath){
					uni.navigateToMiniProgram({
						appId: options.appId,
						path: options.openPath,
						extraData: {
							'data1': 'test'
						},
						success(res) {
							// 打开成功 
						},
						fail(err) {
							console.log('err', err);
							this.msg('打开失败');
						}
					})
				}
				// #endif
				// #ifndef MP-WEIXIN
				this.msg('不支持打开小程序');
				// #endif
			}
			if(options.ref){
				//缓存商城配送模式
				this.$util.setKey('delivery_type', e.options.ref);
			}
		},
		/**
		 * navigatorTo跳转页面
		 * @param {String} url
		 * @param {Object} options
		 * @param {Boolean} options.login 是否检测登录  
		 * @param {Object} params 传递的附加参数
		 */
		navTo(url, options ={ login: false }, params ={}, model = ''){
			console.log('navTo',url, options,params)
			//console.log('this.getPageShed()@@@@@@@@@@@@@', this.getPageShed())
			let jump_url = '';
			//console.log('类型', typeof url === "object")
			if(typeof url === "object") {
				//事件拦截登录
				if(options.login && !this.isLogin({nav:false})){
					this.redirectTo('/pages/login/login', {
						backurl:encodeURIComponent(this.getPageShed())
					});
					return;
				}
				if(url.event){
					this.clickEvent({
						event: url.event,
						options: url,
						params:params
					});
					return;
				}else{
					if(url.path){
						jump_url = url.path;
					}
				}
			}else{
				jump_url = url;
				if(Object.keys(params).length){
					let keys = Object.keys(params);
					if(keys.indexOf('event') > -1){
						//事件拦截登录
						if(options.login && !this.isLogin({nav:false})){
							this.redirectTo('/pages/login/login', {
								backurl:encodeURIComponent(this.getPageShed())
							});
							return;
						}
						this.clickEvent({
							event: params.event,
							options: params,
							params: params
						});
						return;
					}
				}
			}
			//console.log('跳转路由1111111',jump_url, options, params)
			
			//事件拦截登录
			if(options.login && !this.isLogin({nav:false})){
				this.redirectTo('/pages/login/login', {
					backurl:encodeURIComponent(jump_url)
				});
				return;
			}
			if(jump_url.indexOf('https://') == 0){
				jump_url = '/pages_public/webview/index?link='+encodeURIComponent(jump_url);
				uni.navigateTo({
					url:jump_url
				})
			}else{
				this.redirectTo(jump_url, params, model);
			}
		},
		
		/**
		 * 页面跳转
		 * @param {string} to 跳转链接 /pages/index/index
		 * @param {Object} param 参数 {key : value, ...}
		 * @param {string} mode 模式 
		 */
		redirectTo(to = '', param = {}, mode = '') {
			console.log('redirectTo跳转', to, param, mode)
			let url = to;
			let tabbarList = []
			for (let i = 0; i < tabbarList.length; i++) {
				if (to.indexOf(tabbarList[i]) != -1) {
					uni.switchTab({
						url: url
					})
					return;
				}
			}
			if (Object.keys(param).length) {
				Object.keys(param).forEach(function(key) {
					if (url.indexOf('?') != -1) {
						url += "&" + key + "=" + param[key];
					} else {
						url += "?" + key + "=" + param[key];
					}
				});
			}
			console.log('组成的路由', url)
			switch (mode) {
				case 'switchTab':
					// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
					uni.switchTab({
						url: url
					})
					break;
				case 'redirectTo':
					// 关闭当前页面，跳转到应用内的某个页面。
					uni.redirectTo({
						url: url
					});
					break;
				case 'reLaunch':
					// 关闭所有页面，打开到应用内的某个页面。
					uni.reLaunch({
						url: url
					});
					break;
				default:
					// 保留当前页面，跳转到应用内的某个页面
					uni.navigateTo({
						url: url
					});
			}
		},
		
		/**
		 * $request请求
		 * @param {String} module 路由
		 * @param {Boolean} data 请求参数
		 * @param {Boolean} ext 附加参数
		 * @param {Boolean} ext.showLoading 是否显示loading状态，默认不显示
		 * @param {Boolean} ext.hideLoading 是否关闭loading状态，默认关闭
		 * @param {Boolean} ext.login 未登录拦截
		 * @param {Boolean} ext.setLoaded 加载完成是设置页面加载完毕
		 */
		$request(module, data={}, ext={}){
			if(ext.login && !this.isLogin()){
				return false;
			}
			if(ext.showLoading){
				if(this.isLoading === false){
					this.isLoading = true;
				}
			}
			return new Promise((resolve, reject)=> {
				request(module, data, ext).then(result => {
					
					if(ext.showLoading && this.isLoading === true){
						this.isLoading = false;
					}
					if(result.data.code === 500){
						let msg = result.data.msg ? result.data.msg.toString() : '错误';
						this.msg(msg);
					}else if(result.data.code == 401){//用户没有权限(令牌、用户名、密码错误)
						this.$store.commit('logout');
						return;
					}else if(result.data.code == 402){ //弹出modal窗口
						if(result.data.data.modal_data){
							this.showModalEvent(result.data.data.modal_data);
						}
					}else if(result.data.code == 403){ //弹出modalPopup层
						if(result.data.data.modal_data){ 
							this.showModalPopup(result.data.data.modal_data);
						}
					}
					this.$refs.confirmBtn && this.$refs.confirmBtn.stop();
					resolve(result);
				}).catch((err) => {
					reject(err);
				})
			})
		}
	},
}
