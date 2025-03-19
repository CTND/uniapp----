<template>
	<gui-page  
	:apiLoadingStatus="apiLoadingStatus"
	:refresh="true"
	:customHeader="true"
	:customFooter="custom_Footer"
	@reload="reload"
	:customStyle="{
		background: diyData.length ? diyData[0].options.background: '',
	}"
	:customHeaderStyle="{height:'80px'}"
	@clickCallback="linkClick"
	ref="guipage"
	>
		<template v-slot:gHeader>
			<up-navbar height="50px" 
			:bgColor="System.title_bg_color"
			:autoBack="diyData[0].options.search=='0'&&diyData[0].options.is_bank=='1'?true:false"
			:customStyle="{background:System.title_bg_color}">
				<template #left>
					<view v-if="diyData[0].options.search=='0'&&diyData[0].options.is_bank=='1'" class="micon icon-jiantou-copy" 
					style="color: #303133;font-weight: bold;" :style="{color:diyData[0].options.tabbarColor}"></view>
					<view v-if="diyData[0].options.location=='1'"
					class="city-box" @click="navTo('/pages_public/cityList/index', {login:false})">
						<view class="city-name">{{cityname || '选择城市'}}</view>
						<view class="micon icon-sanjiaodown"></view>
					</view>
				</template>
				<template #center>
					<view v-if="diyData[0].options.search=='0'">{{diyData[0].data.pageName}}</view>
				</template>
				<template #right>
					<view class="nav-right-box" >
						
					</view>
				</template>
			</up-navbar>
		</template>
		<template v-slot:gBody> 
			
			<!-- DIY模块 -->
			<diy-module v-if="page_id" ref="diyModule" :pageId="page_id" @diy-back="diyBack"></diy-module>

			<!-- 弹窗 -->
			<up-popup :show="showPopup" mode="center" :round="10" :safeAreaInsetBottom="false" closeable @close="closePopup">
				<view class="alert-box" >
					<image :src="alert_img" mode="widthFix"></image>
					<view class="but" :style="{backgroundColor:System.big_but_color}" @click="navTo(alert_path, {login: true})">查看详情</view>
				</view>
			</up-popup>
			<!-- 右下角挂件 -->
			<view class="fixed-box" v-if="System.float_ico">
				<view class="micon-box" @click="navTo(System.float_ico_link)">
					<image :src="$util.img(System.float_ico)" mode="widthFix"></image>
				</view>
			</view>
			
			<store-list ref="storeList" @store-callback="storeCallback"></store-list>
			<gui-iphone-bottom></gui-iphone-bottom>
		</template>
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
			apiLoadingStatus:false,
			page_id:0,
			cityname:'',
			citycode:'',
			showPopup:false,
			alert_img:'', //弹窗图片
			alert_path: '',//弹窗路径
			id: 0,
			diyData:[
				{
					name: "page",
					data: {
					    pageName: "",
					    searchTitle: "请输入商品名称"
					},
					head: {
						height: 200,
						background: null,
						imagelist: [],
						interval: 10, //轮播时间
						borderRadius: 50,
						PaddingTop: 0,
					},
					options: {
					    background: "",
					    tabbarbackground: "rgba(255, 255, 255, 1)",
					    tabbarColor: "#303133",
					    show_tabbar: "0",
					    is_bank: "0",
					    search: "0",
					    location: "0",
					}
				}
			], //diy页面返回数据
			
			device_no:'', //设备编号
		}
	},
	watch: {
		//监听数据变化
	    diyData(newValue) {
			//console.log('diyData发生了改变');
			//console.log('新值为：' + JSON.stringify(newValue));
			//获取位置
			if(this.citycode == '' && newValue[0].options.location=='1'){
				this.$util.getLocationData((res)=>{
					if(res.citycode && res.city != ''){
						this.cityname = res.city;
						this.citycode = res.citycode;
						this.locationdata = res;
					}else{
						this.navTo('/pages_public/cityList/index', {login:false})
					}
				})
			}
	    }
	},
	onLoad: function(options) {
		if(options.page_id){
			this.page_id = options.page_id;
		}
		if(options.did){
			this.device_no = options.did;
		}
	},
	onShow() {
		this.getDiyPage();
	},
	methods: {
		//链接点击事件
		linkClick(e){
			if(e.event == 'scan'){
				if(this.device_no == ''){
					this.startScan(e.options);
				}else{
					this.navTo('/pages_charging/index', {login: false}, {device_no: this.device_no});
				}
			}else if(e.event == 'select_store'){
				this.$refs.storeList.open();
			}
		},
		//选择门店返回
		storeCallback(e){
			//console.log('checkCallback', e)
			this.navTo('/pages_shop/class/index', {login: false})
		},
		//关闭弹窗
		closePopup(){
			this.showPopup = false;
		},
		//扫码
		startScan(options = {}){
			const t = this;
			console.log('扫码', options)
			// 只允许通过相机扫码
			uni.scanCode({
				onlyFromCamera: true,
				success: function (res) {
					console.log('扫码内容：', res);
					if(res.scanType == 'WX_CODE'){ //小程序码
						let path = res.path;
						var urlToJson = t.$util.urlToJson(path);
						if(urlToJson.scene){
							var str = t.$util.base64_decode(urlToJson.scene);
							console.log('index_scene', str)
							if(options && Object.keys(options).length){
								if(options.path){
									let jump_path = options.path;
									if(jump_path.indexOf('?') == -1){
										jump_path = jump_path + '?';
									}
									jump_path = jump_path + str;
									t.navTo(jump_path, {login: false});
									//var did = t.$util.geturlParam(str,'did');
									
								}
							}
						}
					}
				},
				fail(err) {
					console.log('扫码错误', err)
				}
			});
		},
		//获取DIy页面
		getDiyPage(){
			let post = {
				id: this.page_id,
				target: 'index'
			};
			this.$request('GetDiyPage', post,{
				showLoading: false,
			}).then((res)=>{
				
				if(res.data.data.page_id){
					this.id = res.data.data.page_id;
				}
				if(res.data.data.diyData && res.data.data.diyData.length){
					if(res.data.data.diyData[0].options.must_login == '1'){
						//必须登录
						if(!this.isLogin({nav:false})){
							// #ifdef MP-WEIXIN
							this.openidLogin();
							// #endif
							
							// #ifndef MP-WEIXIN
							this.redirectTo('/pages/login/login', {
								backurl:encodeURIComponent('/pages/page/index?page_id='+this.page_id)
							}, 'redirectTo')
							// #endif
						}
					}
					if(res.data.data.diyData[0].options.window_alert_src){//有弹窗
						this.alert_path = res.data.data.diyData[0].options.window_alert_path;
						let img = res.data.data.diyData[0].options.window_alert_src;
						this.alert_img = img;
						let page_alert = this.$util.getKey('page_alert');
						if(!page_alert){
							this.$util.setKey('page_alert', 'page_alert', 300);
							this.showPopup = true;
						}
					}
				}
			})
		},
		//下拉刷新
		reload(){
			this.$refs.diyModule.getDiyData();
			this.apiLoadingStatus = true;
		},
		//DIY页面返回
		diyBack(data){
			this.apiLoadingStatus = false;
			console.log('DIY页面返回11111111111', data)
			if(data.length){
				this.diyData = data;
			}
			setTimeout(()=>{
				this.$refs.guipage.endReload();//停止刷新
			},500)
		},
		//登录
		openidLogin(){
			this.getCode((e)=>{
				//console.log('微信隐藏登录',e)
				if(e.openid){
					this.openid = e.openid;
					let data = {openid: e.openid};
					var shareid = uni.getStorageSync('shareid');
					if(shareid){
						data.shareid = shareid;
					}
					this.$request('wxOpenIdLogin', data,{
						showLoading: false,
					}).then((res)=>{
						//console.log('微信隐藏登录请求数据', res)
						if(res.data.data.userInfo.token){
							let token = res.data.data.userInfo.token;
							this.$store.commit('setToken', {
								token: token,
								tokenExpired: 7200*60
							});
							this.$store.dispatch('getUserInfo', (userInfo)=>{
								//console.log('获取用户信息', userInfo)
								if(Object.keys(userInfo).length){
									this.userInfo = Object.assign({}, this.userInfo, userInfo);
								}
							})
						}
					})
				}
			})
		},
		getCode(callback){
			// #ifdef MP-WEIXIN
			uni.login({
				provider: 'weixin',
				timeout: 3000,
				success: res => {
					if (res.code) {
						this.$request('getOpenid',{
							code: res.code
						}, {
							showLoading: false
						}).then((res)=>{
							if(res.data.code == 200){
								if(res.data.data.openid && res.data.data.session_key){
									typeof callback == 'function' && callback(res.data.data);
								}else{
									this.msg('获取openid错误');
								}
							}else{
								this.msg(res.data.msg);
							}
						});
					}
				},
				fail: () => {
					this.msg('请求失败');
				}
			})
			// #endif
		}
	}
}
</script>

<style lang="scss" scoped>
	.fixed-box{
		width: 50px;
		position: fixed;
		right: 10rpx;
		bottom: 150px;
		.micon-box{
			width: 45px;
			height: 45px;
			border-radius: 35px;
			overflow: hidden;
			background-color: #ffffff;
			padding: 10rpx;
			border-radius: 35px;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.nav-right-box{
		display: flex;
		padding-right: 30rpx;
		/* #ifdef MP-WEIXIN */
		padding-right: 90px;
		/* #endif */
	}
	.alert-box{
		height: 45vh;
		width: 75vw;
		border-radius: 20rpx;
		position: relative;
		overflow: hidden;
		image{
			width: 100%;
		}
		.but{
			position: absolute;
			bottom: 40rpx;
			left: calc( (100% - 120px) / 2);
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			font-size: 28rpx;
			color: #ffffff;
			border-radius: 70rpx;
			width: 120px;
		}
	}
	.city-box{
		display: flex;
		max-width: 32vw;
		overflow: hidden;
		.city-name{
			font-size: 15px;
			color: #303133;
			height: 45px;
			line-height: 45px;
			overflow: hidden;
		}
		.micon{
			height: 45px;
			line-height: 45px;
		}
	}
	.search-box{
		background-color: #ffffff; 
		// padding: 5px 0;
		.search-input-box{
			padding: 5px 20px;
		}
		.sort-box{
			background-color: #ffffff;
			padding: 10px 15px;
			display: flex;
			justify-content: space-between;
			.sort-item{
				font-size: 15px;
				color: #303133;
				width: 25%;
				text-align: center;
				.micon{
					color: #606266;
				}
			}
			.active{
				color: #fd7bb7;
				font-weight: bold;
				.micon{
					color: #fd7bb7;
				}
			}
		}
	}
	.list-body{
		padding: 10rpx;
		.list-item{
			height: 100px;
			line-height: 100px;
			margin-bottom: 20rpx;
			background-color: #ffffff;
		}
	}
	
	
</style>