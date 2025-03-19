<template>
	<view v-if="System.cheat==2">
		<!-- #ifdef MP-WEIXIN -->
		<view class='identification'>
			<view class='camera' v-if="showCamera">
				<camera device-position="front" flash="off" @error="error" class="camera"></camera>
			</view>
		</view>
		<view class='message' v-if="msgStatus == 0">
			<text>将脸对准圆框内，即可自动扫描识别</text>
			<view v-if="recordStatus == 0">准备开始认证</view>
			<view v-else-if="recordStatus == 1">{{countDownNum}}s</view>
			<view v-else>认证结束</view>
		</view>
		<view class='message' v-if="msgStatus == 1">
			<image :src="$util.img('images/system/success.png')" mode='widthFix'></image>
			<view class='msgTitle'>认证成功</view>
			<view class='msgContent'>感谢您对我们的信任</view>
			<view class='nextBtn' @click="goBack()">进入首页</view>
		</view>
		<view class='message' v-if="msgStatus == -1">
			<image :src="$util.img('images/system/error.png')" mode='widthFix'></image>
			<view class='msgTitle'>认证失败</view>
			<view @click="rescan" class='nextBtn'>重新扫描</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef APP-PLUS -->
		
		<view class="face-box">
			<image :src="$util.img('images/system/face-auth.png')"></image>
		</view>
		<view class='message'>
			<text>将脸对准圆框内，点击开始认证按钮</text>
		</view>
		
		<u-button type="primary" text="开始认证"
		shape="circle" throttleTime="1000"
		size="large"
		:customStyle="$util.butStyle('primary',{marginTop:'60px', backgroundColor:System.big_but_color,width:'80%'})"
		@click="appStart()"
		></u-button>
		<!-- #endif -->
		
		<!--加载中-->
		 
		<!-- 真人头像 -->
		<img-cropping selWidth="300" selHeight="300" @upload="Upload" ref="imgCropping"></img-cropping>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				countDownNum: 10, // 录制视频时间
				msgStatus: 1, // 识别状态，0为未识别或识别中，1为识别成功，-1为识别失败
				i: '',
				recordNum: 0, // 记录识别次数
				showCamera: false, // 是否显示相机
				recordStatus: 0 ,// 录制状态，0为未开始录制， 1为开始录制，2为结束录制
				auth_video:'',//认证的视频地址
				
				//app认证
				do_ref:'face_auth',
				is_sub:false,
				is_auth:0, //是否实名认证
				face_auth:0, //是否通过人像验证
				realname:'',
				idcard:''
			}
		},
		onLoad(options) {
			console.log('认证参数------------------------', options)
			if(options.do_ref){
				this.do_ref = options.do_ref;
			}
			// #ifdef MP-WEIXIN
			this.getAuthorize('scope.camera', 1)
			// #endif
		},
		onShow() {
			this.$store.dispatch('getUserInfo', (res)=>{
				if(Object.keys(res).length){
					this.is_auth = res.is_auth;
					this.face_auth = res.face_auth;
					this.idcard = res.idcard;
					this.realname = res.realname;
				}
			})
		},
		methods: {
			//app认证
			async appStart(){
				const t = this;
				if(this.is_auth == 0 || this.realname == '' || this.idcard == ''){
					this.showModalEvent({
						title:'提示',//提示标题
						content: '请先完成实名认证！',
						showCancel:true,
						cancelText: '取消',
						confirmText: '去认证',
					}, {ref:'realName'})
					return;
				}
				if(this.do_ref == 'face_auth' && this.face_auth == 1){
					this.msg('已通过验证，请勿重复认证！');
					return;
				}
				if(t.is_sub) return;
				t.is_sub = true;
				const faceAuth = uniCloud.importObject('faceAuth');
				const res = await faceAuth.getCertifyId({
					realName: t.realname,
					idCard: t.idcard,
					metaInfo:uni.getFacialRecognitionMetaInfo()
				})
				if(res.errCode == 0 && res.certifyId){
					let certifyId = res.certifyId;
					uni.startFacialRecognitionVerify({
					    certifyId:certifyId,
					    progressBarColor: "#CC0000", //刷脸圈的颜色
					    screenOrientation: "port", //认证界面UI朝向
					    success:(e)=>{
							t.is_sub = false;
							t.getFaceAuthResult(certifyId);
					    },
					    fail:(e)=>{
							t.is_sub = false;
					        console.log('fail', JSON.stringify(e))
					    },
					    complete:(e)=>{
					        console.log(JSON.stringify(e))
					    }
					})
				}
			},
			//获取人脸识别结果
			async getFaceAuthResult(certifyId = ''){
				if(this.is_sub) return;
				if(!certifyId) {
					this.msg('认证ID不能为空');return;
				}
				const faceAuth = uniCloud.importObject('faceAuth');
				const result = await faceAuth.getAuthResult(certifyId);//获取认证结果
				if(result.errCode == 0 && result.authState === 'SUCCESS'){
					this.is_sub = true;
					this.$util.throttle(async ()=>{
						this.$request('appFaceAuthUpdata', {
							pictureUrl: result.pictureUrl,
							do_ref: this.do_ref
						},{
							showLoading: true,
						}).then((res)=>{
							//console.log('认证后的参数---------------------------', res)
							if(res.data.code == 200){
								this.$store.dispatch('getUserInfo', (res)=>{})
								if(this.do_ref == 'real_avatar'){
									this.$refs.imgCropping.setImg(res.data.data.img_path);
								}else{
									this.msg(res.data.msg);
									setTimeout(()=>{
										uni.navigateBack();
									},500)
								}
							}else{
								this.is_sub = false;
							}
						})
					})
				}else{
					this.msg('认证失败,请重新认证！');
					this.is_sub = false;
				}
			},
			//弹窗返回
			modalEventBack(e, v){
				if(e.ref == 'realName'){
					if(v == 1){
						this.navTo('/pages_setting/information/real_name/index', { login: true });
					}
				}
			},
			//上传真人头像
			Upload(rsp) {
				const t = this;
				this.isLoading = true;
				uni.uploadFile({
					url: t.$util.uploadUrl('image'),
					filePath: rsp.path,
					name: 'file[]',
					formData:{},
					success: (result) => {
						const resue = JSON.parse(result.data);
						if(resue.code == 200){
							this.$request('UserInfoUpdate', {
								ref:'avatar',
								val: resue.data.file_source,
								real_avatar: 1
							},{
								showLoading: true,
							}).then((res)=>{
								this.msg('设置成功！');
								if(res.data.code == 200){
									this.$store.dispatch('getUserInfo', (res)=>{})
									setTimeout(()=>{
										uni.navigateBack();
									},500)
								}
							})
						}else{
							uni.showModal({
								content: '上传错误',
								showCancel: false
							});
						}
					},
					fail: (err) => {
						uni.showModal({
							content: '上传错误',
							showCancel: false
						});
					},
					complete() {
						t.isLoading = false;
					}
				});
			},
			//小程序认证
			getAuthorize: function(value, num) { // 判断是否授权摄像头和录音，num表示判断的序号，1为摄像头，2为录音
			    let _this = this
			    uni.getSetting({
					success: res => {
						if (res.authSetting[value] != true) {
							uni.authorize({
								scope: value,
								success () {
									_this.successNext(num)
								}, 
								fail() {
									uni.showModal({
										title: '开启' + (num == 1 ? '摄像机' : '录音') + '失败',
										showCancel: false,
										content: '点击确定重试!',
										success: function (res) {
											if (res.confirm) {
												_this.openSetting(value, num)
											}
										}
									});
								}
							})
						} else { // 权限开启成功
							_this.successNext(num)
						}
					}
			    })
			},
			
			openSetting: function(value, num) { // 打开设置页
			    var _this =this;
			    uni.openSetting({
					success(res) {
						if (res.authSetting[value] != true){
							uni.showModal({
								title: '开启' + (num == 1 ? '摄像机' : '录音') + '失败',
								showCancel: false,
								content: '点击确定重试!',
								success: function (res) {
									if (res.confirm) {
										_this.openSetting(value, num)
									}
								}
							});
						} else {
							_this.successNext(num)
						}
					}, 
					fail(res) {
						console.log(res)
					}
			    })
			},
			successNext: function(num) {
			    if (num == 1) { // 摄像头权限获取成功，去获取录音权限
					this.getAuthorize('scope.record', 2)
			    } else if (num == 2) { // 录音权限获取成功，开始录像
					this.openCamera();
			    }
			},
			openCamera: function() { // 打开相机
			    this.showCamera = true;
			    this.ctx = uni.createCameraContext();
			    this.countDown();
			},
			
			countDown: function (e) { // 视频录制三秒
			    let that = this;
			    let countDownNum = 5; // 获取倒计时初始值
			    let i = this.i;
			    if (!i) {
					i = 2
			    }
			    that.recordNum++;
				this.recordStatus = 1;
				this.timer = setInterval(function () {
					if (countDownNum == 5) {
						that.startRecord(); // 开始录制
					}
					countDownNum--;
					that.countDownNum = countDownNum;
					that.i = i;
					if (countDownNum == 0) {
					  clearInterval(that.timer); // 清空定时器
					  that.stopRecord(); // 结束录制
					}
				}, 1000)
			},
			
			startRecord() { // 开始录制
			    var _this = this;
			    _this.ctx.startRecord({
					success: (res) => {
						console.log('录像开始', res)
					},fail(res){
						console.log('录像未开始')
					}
			    })
			},
			stopRecord() {
			    var that = this;
			    that.ctx.stopRecord({
					success: (res) => {
						that.recordStatus = 2;
						that.uploadFile(res)
					},fail(res){
						that.judgeStatus()
					}
			    })
			},
			judgeStatus: function() { // 失败时判断是否继续识别
			    var that = this;
			    if (that.recordNum < 3 && that.msgStatus != 1) {
					setTimeout(function () {
						that.countDownNum = 5;
						that.countDown();
					}, 1000)
			    } else if (that.recordNum == 3 && that.msgStatus != 1) {
					that.countDownNum = 5;
					that.msgStatus = -1;
			    }
			},
			
			uploadFile: function(file) { // 上传视频
			    var that = this;
				const t = this;
			    uni.showLoading({
					title: '识别中...',
			    })
				const uploadTask = uni.uploadFile({
					url: t.$util.uploadUrl('video'),
					filePath: file.tempVideoPath,//file.tempThumbPath,
					name: 'file[]',
					formData:{},
					success: (result) => {
						uni.hideLoading();
						const resue = JSON.parse(result.data)
						//console.log('录制视频上传完成resue', resue)
						if(resue.code == 200){
							that.auth_video = resue.data.file_url;
							that.identify(resue.data.file_source)
						}else{
							that.judgeStatus()
						}
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showModal({
							content: '错误',
							showCancel: false
						});
						that.judgeStatus()
					}
				});
			},
			
			identify: function(video_url) { // 请求后端人脸识别接口
				var that = this;
			    uni.showLoading({
			    	title: '识别中...'
			    });
			    this.$request('VideoFaceAuth', {
			    	video_url:video_url,
					do_ref: that.do_ref
			    },{
			    	showLoading: false
			    }).then((res)=>{
					//console.log('识别结果', res)
			    	uni.hideLoading();
			    	this.$util.msg(res.data.msg);
			    	if(res.data.code == 200){
			    		that.msgStatus = 1;
						this.$request('UserInfoUpdate', {
							ref:'auth_video',
							val:this.auth_video,
							do_ref: that.do_ref
						},{
							showLoading: false
						}).then((res)=>{
							if(res.data.code == 200){
								this.$store.dispatch('getUserInfo');
							}
						})
			    	}else{
						that.msgStatus = -1;
						that.judgeStatus()
					}
			    })
			},
			
			// 重新扫描
			rescan() {
			    // this.onLoad();
				this.getAuthorize('scope.camera', 1);
			    this.msgStatus = 0;
				this.recordNum = 0;
				this.recordStatus = 0;
			},
			
			onUnload: function () {
				var that = this;
				clearInterval(that.timer);
			},
			error(e) {
				console.log('error',e.detail);
			}
		}
	}
</script>

<style scoped lang="scss">
	.face-box{
		width: 200px;
		height: 200px;
		margin: 50px auto;
		image{
			width: 100%;
			height: 100%;
			overflow: hidden;
			border-radius: 100%;
		}
	}
	.identification {
	  width: 480rpx;
	  height: 480rpx;
	  margin-top: 10%;
	  margin-left: 50%;
	  transform: translate(-50%, 0);
	}
	
	.identification .camera {
		width: 430rpx;
		height: 430rpx;
		position: absolute;
		top: 20rpx;
		left: 20rpx;
		border-radius: 430rpx;
	}
	
	.identification .camera .zz {
	  width: 100%;
	  height: 100%;
	  position: absolute;
	  top: 0;
	  overflow: hidden;
	}
	
	.identification .camera camera {
	  width: 100%;
	  height: 100%;
	}
	
	.message {
	  text-align: center;
	  margin-top: 60rpx;
	}
	
	.message text {
	  font: 24rpx/50rpx "";
	  color: #333;
	  display: flex;
	  justify-content: center;
	}
	
	.message view {
	  font: 46rpx/50rpx "";
	  color: #4877D1;
	  display: flex;
	  justify-content: center;
	  margin-top: 40rpx;
	}
	
	.message view.msgTitle {
	  font: 32rpx/50rpx "";
	  color: #333;
	  display: flex;
	  justify-content: center;
	  margin-top: 20rpx;
	}
	
	.message view.msgContent {
	  font: 24rpx/50rpx "";
	  color: #999;
	  display: flex;
	  justify-content: center;
	  margin-top: 20rpx;
	}
	
	.message image {
	  width: 70rpx;
	  height: 70rpx;
	}
	
	.message .nextBtn {
	  width: 400rpx;
	  margin: 40rpx auto 0;
	  background: #4877D1;
	  color: #fff;
	  font: 32rpx/80rpx "";
	  border-radius: 50rpx;
	}
	
	.crl-dot {
	  width: 10rpx;
	  height: 10rpx;
	  background: red;
	  position: absolute;
	  top: -10rpx;
	  left: -10rpx;
	}

</style>