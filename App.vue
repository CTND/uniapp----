<script>
	let __timerId = 0;
	// #ifdef APP-PLUS
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update'
	// #endif
	export default {
		onLaunch: function() {
			const t = this;
			//监听离线推送客户端监听推送消息
			uni.onPushMessage((res) => {
				console.log("收到uni.onPushMessage推送消息：",res) //监听推送消息
				//uni.$emit('pushEvent',res);//触发全局推送事件
				// #ifdef APP-PLUS 
				//创建本地通知栏消息
				/*uni.createPushMessage({
					content:res.data
				})*/
				// #endif
			})
			
			//监听IM消息事件
			// uni.$on('msgEvent',function(data){
			// 	console.log('监听到事件来自 msgEvent 数据-app', data);
				
			// })
			
			//监听推送消息事件
			uni.$on('pushEvent',function(data){
				console.log('监听到事件来自 pushEvent 数据', data);
			})
			
			// #ifdef APP-PLUS
			//获取设备信息
			if(plus.runtime.isAgreePrivacy()){
				uni.getSystemInfo({
					success: e=> {
						this.initSize(e);
						console.log('设备信息',e)
					}
				})
			}
			
			/*if(this.$util.isAndroid()){
				const plugin = uni.requireNativePlugin("DCloud-PushSound");
				//获取当前应用注册的所有的通知渠道
				plugin.getAllChannels((p) => {
					console.log("获取当前应用注册的所有的通知渠道channels :" ,p);//返回数组
				})
				//测试本地通知渠道
				plugin.testNotification({
					channelId: "Pushorder" //渠道id
				});
				plugin.setCustomPushChannel({
					soundName: "order",
					channelId: "Pushorder",
					channelDesc:"渠道描述",
					enableLights:true,
					enableVibration:true,
					importance:4,
					lockscreenVisibility:0
				});
			}*/
			// #endif
			
			
			// #ifndef APP-PLUS
			uni.getSystemInfo({
				success: e=> {
					this.initSize(e);
					console.log('设备信息',e)
				}
			})
			// #endif
			
			// #ifdef MP-WEIXIN
			//版本检查
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function (res) {
				// 请求完新版本信息的回调
			});
			updateManager.onUpdateReady(function (res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
			updateManager.onUpdateFailed(function (res) {
				console.log('新的版本下载失败')
			});
			// #endif
			//获取系统数据
			this.$store.dispatch('getSystem', (System)=>{
				// #ifdef APP-PLUS
				if(System.cheat==2){
					checkUpdate().then(res => {
						//console.log("检查更新结果1------------------", res) 
					});
				}
				// #endif
			});
			
			//检查登录
			this.initLogin();
		},
		onShow: function() {
			const t = this;
			//this.openTimer();
			let timer = setInterval(() => {
			    this.getCid()
			    const cid = uni.getStorageSync('push_clientid')
			    if (cid){
					clearInterval(timer)
				};
			}, 2000)
		},
		onHide: function() {
			this.closeTimer();
			// #ifndef H5
			uni.offKeyboardHeightChange();//移除所有键盘监听
			// #endif
		},
		methods: {
			//获取客户端推送标示
			getCid(){
				// #ifdef APP-PLUS
				if(!plus.runtime.isAgreePrivacy()){
					return;
				}
				uni.getPushClientId({
					success: (res) => {
						let push_clientid = res.cid
						console.log('客户端推送标识cid:',push_clientid)
						uni.setStorageSync('push_clientid', push_clientid);
					},
					fail(err) {
						//console.log('客户端推送标识错误:',err)
					}
				})
				// #endif
			},
			
			//登录状态
			async initLogin(){
				const token = uni.getStorageSync('token');
				if(token){
					this.$store.commit('setToken', {
						token
					});
				}
			},
			/**
			 * 存储设备信息 参考colorUI
			 * @param {Object} 
			 */
			initSize(e) {
				const systemInfo = e;
				let navigationBarHeight;
				let custom = {};
				// #ifndef MP
				custom = {
					height: 36,
					width: 88
				};
				navigationBarHeight = 44;
				// #endif
				// #ifdef MP-WEIXIN
				custom = wx.getMenuButtonBoundingClientRect();
				navigationBarHeight = custom.bottom + custom.top - e.statusBarHeight * 2;
				// #endif	
				// #ifdef MP-TOUTIAO
				custom = tt.getMenuButtonBoundingClientRect();
				navigationBarHeight = custom.bottom + custom.top - e.statusBarHeight * 2;
				// #endif	
				systemInfo.custom = custom;
				systemInfo.navigationBarHeight = navigationBarHeight;
				systemInfo.development = process.env.NODE_ENV == "development";
				//Vue.prototype.systemInfo = systemInfo;
				this.$store.commit('setStateAttr', {
					key: 'systemInfo',
					val: systemInfo
				})
			},
			
			//打开全局定时器
			openTimer(){
				this.closeTimer();
				__timerId = setInterval(()=>{
					this.$store.commit('setStateAttr', {
						key: 'timerIdent',
						val: !this.$store.state.timerIdent
					})
					//console.log('this.$store.state.timerIdent2222222222222222222222', this.$store.state.timerIdent)
				}, 1000)
			},
			//关闭定时器
			closeTimer(){
				if(__timerId != 0){
					clearInterval(__timerId);
					__timerId = 0;
				}
			},
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-plus/index.scss";
	// 图标文件
	@import "@/common/css/iconfont.css";
	//公共样式
	@import "@/common/css/common.css";
	/* 加载框架核心样式 */
	@import "@/common/css/grace.scss";
	/* 加载深色模式适配样式 */
	@import "@/common/css/graceDark.scss";
	/* 加载自定义样式 */
	@import "@/common/css/custom.scss";
	page{background:$main;}
	.popup-img{
		width: 200px;
		height: 200px;
		overflow: hidden;
		margin: auto;
		margin-bottom: 20px;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>
