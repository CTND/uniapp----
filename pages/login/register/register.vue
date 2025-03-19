<template>
	<scroll-view scroll-y="true" class="container">
		<view class="body-wrap">
			<view class="header-wrap">
				<view class="title">注册</view>
				<view class="regisiter-agreement" style="text-align: left;margin-top: 0;">
					<text class="color-tip">已有账号,</text>
					<text class="color-base-text" @click="toLogin">立即登录</text>
				</view>
			</view>
			<view class="form-wrap">
				<view class="input-wrap">
					<view class="content"><input type="text" placeholder="请输入账号" placeholder-class="input-placeholder" class="input" v-model="formData.username" /></view>
				</view>
				<view class="input-wrap">
					<view class="content"><input type="password" placeholder="请输入密码" placeholder-class="input-placeholder" class="input" v-model="formData.password" /></view>
				</view>
				<view class="input-wrap">
					<view class="content">
						<input type="password" placeholder="请确认密码" placeholder-class="input-placeholder" class="input" v-model="formData.rePassword" />
					</view>
				</view>
				<view class="input-wrap">
					<view class="content"><input type="text" placeholder="推荐码" placeholder-class="input-placeholder" class="input" v-model="formData.shareid" /></view>
				</view>
				<!-- <view class="input-wrap">
					<view class="content">
						<view class="area-code">+86</view>
						<input type="number" placeholder="仅限中国大陆手机号注册" placeholder-class="input-placeholder" class="input" maxlength="11" v-model="formData.mobile" />
					</view>
				</view> -->
				<!-- 
				<view class="input-wrap">
					<view class="content">
						<input type="text" placeholder="请输入动态码" placeholder-class="input-placeholder" class="input" v-model="formData.code" />
						<view class="dynacode" :class="dynacodeData.seconds == 120 ? 'color-base-text' : 'color-tip'" @click="sendMobileCode">{{ dynacodeData.codeText }}</view>
					</view>
				</view> -->
			</view>
			
			<view class="btn_view">
				<up-button
				text="注册" 
				shape="circle" 
				:customStyle="{
					backgroundColor:System.big_but_color,color:'#ffffff',width:'90%',margin:'auto'
				}"
				@click="register"
				></up-button>
			</view>
			<view class="regisiter-agreement" style="padding-top: 20px;">
				<view class="mico" v-bind:class="[is_agree?'sd-checked':'sd-check']" @click="agreeChage"></view>
				已阅读并同意以下协议：
				<text class="color-base-text" v-for="(item,index) in agreeDate.agree_list" :key="index"
				@click="navTo('/pages_public/agree/index?id='+item.id, {login:false})"
				>{{"《"+item.title+"》"}}</text>
			</view>
		</view>

	</scroll-view>
</template>

<script>

export default {
	
	data() {
		return {
			allowRegister: true, // 是否允许注册
			registerMode: 'mobile',
			formData: {
				username: '',
				password: '',
				rePassword: '',
				
				mobile: '',//用户填写的手机号
				code: '',//用户填写的验证码
				key_phone:'',//系统发送验证码的手机号
				key: '',//系统发送的验证码
				loginMode:'account',
				shareid:''
			},
			agreeDate:{
				agree_list:[],//协议列表
				alert_content:''
			},
			showAgree:false,//是否显示协议弹窗
			is_agree:false,//是否同意了协议
			isSub: false,
			backurl: '', // 返回页
			dynacodeData: {
				seconds: 120,
				timer: null,
				codeText: '获取动态码',
				isSend: false
			},
			registerConfig: {
				register: '',
				pwd_len:6,
				pwd_complexity:['number','letter']
			}
		};
	},
	onLoad(option) {
		if (option.backurl) this.backurl = option.backurl;
		this.Getagree();
	},
	onShow() {
		
	},
	async onReady() {
		
	},
	methods: {
		//获取隐私政策
		Getagree(){
			this.$request('Getagree', {
				type:[1,2]
			},{
				showLoading: false
			}).then((res)=>{
				if(res.data.data.agree_list.length){
					this.agreeDate = res.data.data;
				}
			})
		},
		//阅读了隐私政策
		readagree(){
			// 如记录用户已经同意过
			this.is_agree = true;
			this.showAgree = false;
		},
		disagree:function(){
			this.is_agree = false;
			this.showAgree = false;
		},
		//勾选协议
		agreeChage(){
			this.is_agree = this.is_agree === false ? true : false;
		},
		
		/**
		 * 注册
		 */
		register() {
			const t = this;
			var data = this.formData;
			if(this.formData.username == ''){
				this.$util.msg('账号不能为空');
				return;
			}
			if(this.formData.password == ''){
				this.$util.msg('密码不能为空');
				return;
			}
			if(this.formData.password !== this.formData.rePassword){
				this.$util.msg('两次密码不一致');
				return;
			}
			/*
			if(this.formData.mobile == ''){
				this.$util.msg('手机号不能为空');
				return;
			}
			if(this.formData.code == ''){
				this.$util.msg('验证码不能为空');
				return;
			}
			*/
			this.$request('Register', data,{
				showLoading: true
			}).then((res)=>{
				this.$util.msg(res.data.msg);
				console.log(res)
				if(res.data.code==200){
					setTimeout(function(){
						if (t.backurl != '') {
							t.redirectTo(decodeURIComponent(t.backurl), {}, 'reLaunch');
						} else {
							t.redirectTo('/pages/login/login', {}, 'reLaunch');
						}
					},1000)
				}
			})
		},
		
		/**
		 * 去登录
		 */
		toLogin() {
			if (this.backurl){
				this.redirectTo('/pages/login/login', {
					backurl: this.backuel
				}, 'reLaunch');
			}else {
				this.redirectTo('/pages/login/login', {}, 'reLaunch');
			}
		},
		/**
		 * 发送手机动态码
		 */
		sendMobileCode() {
			if (this.dynacodeData.seconds != 120) return;
			var data = {
				mobile: this.formData.mobile,
			};
			
			if (this.dynacodeData.isSend) return;
			this.dynacodeData.isSend = true;
			data.phone = this.formData.mobile;
			this.$request('GetPhoneCode', data,{
				showLoading: true
			}).then((res)=>{
				if (res.data.code ==200) {
					this.formData.key_phone = res.data.data.key_phone;
					this.formData.key = res.data.data.key;
					if (this.dynacodeData.seconds == 120 && this.dynacodeData.timer == null) {
						this.dynacodeData.timer = setInterval(() => {
							this.dynacodeData.seconds--;
							this.dynacodeData.codeText = this.dynacodeData.seconds + 's后可重新获取';
						}, 1000);
					}
				} else {
					this.$util.showToast({ title: res.data.msg });
				}
			})
			
		}
	},
	watch: {
		'dynacodeData.seconds': {
			handler(newValue, oldValue) {
				if (newValue == 0) {
					clearInterval(this.dynacodeData.timer);
					this.dynacodeData = {
						seconds: 120,
						timer: null,
						codeText: '获取动态码',
						isSend: false
					};
				}
			},
			immediate: true,
			deep: true
		}
	}
};
</script>

<style lang="scss">

</style>
<style scoped lang="scss">
	page {
		width: 100%;
		background: #fff !important;
	}
	.align-right {
		color: #838383;
	}
	
	.container {
		width: 100vw;
		height: 100vh;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
	
	.header-wrap {
		padding: 0px 40px;
		background-repeat: no-repeat;
		background-size: contain;
		background-position: bottom;
		position: relative;
		margin-bottom: 60upx;
		.title {
			font-size: 36rpx;
			font-weight: bold;
		}
	}
	
	.body-wrap {
		padding-bottom: 100rpx;
		padding-top: 10upx;
		margin: auto;
		border-radius: 30upx;
		background-color: #FFFFFF;
		.form-wrap {
			width: 80%;
			margin: 0 auto;
	
			.input-wrap {
				position: relative;
				width: 100%;
				box-sizing: border-box;
				height: 60rpx;
				margin-top: 50rpx;
	
				.iconfont {
					width: 60rpx;
					height: 60rpx;
					position: absolute;
					left: 0;
					right: 0;
					line-height: 60rpx;
					font-size: $font-size-toolbar;
					color: $color-title;
					font-weight: 600;
				}
	
				.content {
					display: flex;
					height: 60rpx;
					border-bottom: 1px solid $color-line;
					align-items: center;
	
					.input {
						flex: 1;
						height: 60rpx;
						line-height: 60rpx;
						font-size: 32upx;
					}
	
					.input-placeholder {
						font-size: 32upx;
						color: #bfbfbf;
						line-height: 60rpx;
					}
	
					.captcha {
						margin: 4rpx;
						height: 52rpx;
						width: 140rpx;
					}
	
					.dynacode {
						line-height: 60rpx;
						font-size: $font-size-tag;
					}
	
					.area-code {
						line-height: 60rpx;
						margin-right: 20rpx;
						font-size: $font-size-base;
					}
				}
			}
		}
	
		.forget-section {
			display: flex;
			width: 80%;
			margin: 40rpx auto;
	
			view {
				flex: 1;
				font-size: $font-size-tag;
				line-height: 1;
			}
		}
		.btn_view {
			width: 80%;
			margin: 100rpx auto auto;
		}
		.login-btn {
			height: 90rpx;
			line-height: 90rpx;
			border-radius: 90rpx;
			color: #fff;
			text-align: center;
			border: 1px solid;
			width: 100%;
			margin: 0;
		}
		.auth-login {
			margin-top: 20rpx;
			width: calc(100% - 2px);
			height: 82rpx;
			border-radius: 82rpx;
			line-height: 82rpx;
			border: 1px solid;
			color: #fff;
			text-align: center;
			margin-left: 0;
			background-color: #fff;
			text {
				color: #d0d0d0;
			}
			.iconfont {
				font-size: 70rpx;
			}
			.iconweixin {
				color: #1aad19;
			}
		}
	
		// .auth-login{
	
		// 	background-color: #fff;
		// 	display: flex;
		// 	justify-content: center;
		// 	align-items: center;
		// 	text-align: center;
		// 	padding: 0;
		// 	text{
		// 		color: #D0D0D0;
		// 	}
		// 	.iconfont{
		// 		font-size: 70rpx;
		// 	}
		// }
	
		.regisiter-agreement {
			text-align: center;
			margin-top: 30rpx;
			line-height: 1;
			color: #838383;
			line-height: 60rpx;
		}
	
		.regisiter-agreement {
			font-size: 28upx;
		}
	}
	
	.login-btn-box {
		margin-top: 50rpx;
	}
	.login-btn-box.active {
		margin: 30rpx 0 50rpx;
	}
	
	.back-btn {
		font-size: 52rpx;
		position: fixed;
		left: 24rpx;
		top: 72rpx;
		z-index: 9;
		color: #000;
	}
	.login-mode-box {
		display: flex;
		justify-content: flex-end;
		color: $color-tip;
		margin: auto;
		margin-top: 44rpx;
		font-size: 26rpx;
		width: 80%;
	}
	.conten-box{
		padding: 0 30rpx 30rpx;
		background: #ffffff;
		padding: 20px;
		width: 90%;
		margin: auto;
		border-radius: 10px;
		min-height: 80vh;

		.title{
			text-align: center;
			margin-top: 20rpx;
			margin-bottom: 10rpx;
		}
		.close{
			position:absolute;
			right:60rpx;
			top:10rpx
		}
		.con{
			height:100%;
		}
	}

</style>
