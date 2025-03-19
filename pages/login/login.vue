<template>
	<gui-page 
	:customHeader="false" 
	:customStyle="{
		backgroundImage:'linear-gradient(to bottom, '+ $util.colorToRgba(this.System.default_color, 0.85) +', #f3f4f6 35%)',
		paddingTop:'50px'
	}"
	ref="guipage"
	>
		
		<!-- 页面主体 -->
		<template v-slot:gBody>
			<!-- #ifndef MP-TOUTIAO -->
			<view class="gradual-box">
				<view class="but-box">
					<sd-icon name="icon-guanbi1" color="#ffffff" size="18" bold @click="noLogin()"></sd-icon>
				</view>
				<view class="logo-box">
					<image :src="System.logo" mode="widthFix"></image>
				</view>
			</view>
			<view style="padding:40rpx;padding-top: 20px;background: #ffffff;border-radius: 15px;width: 92%;margin: auto">
				<view style="padding-left:20rpx;padding-bottom: 20rpx;">
					<text class="gui-h3 gui-block gui-color-black">亲，欢迎登录！</text>
				</view>
				<form @submit="formSubmit" style="margin-top:60rpx;">
					<view class="form-box">
						<!-- #ifdef MP-WEIXIN -->
							<button v-if="loginConfig.wx_auth_avatar=='1'" class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
							   <up-image :show-loading="false"
							   :src="authData.avatar == '' ? $util.img('images/system/avatar.png') : authData.avatar" 
							   width="80px" height="80px" radius="80px"></up-image>
							</button> 
							<input v-if="loginConfig.wx_auth_avatar=='1'" type="nickname" name="nickname" class="weui-input" placeholder="请输入昵称" maxlength="6"/>
							<!--  -->
						<!-- #endif --> 
						<view class="input-box border-f0" v-if="loginMode=='mobile' && use_code && loginConfig.code_login == '1'">
							<u--input 
							type="number" 
							class="gui-form-input" 
							v-model="formData.mobile" 
							name="phone" 
							border="none"
							clearable
							fontSize="16px"
							:placeholderStyle="{fontSize:'16px',color:'#606266'}"
							placeholder="请填写11位手机号" />
						</view>
						
						<view class="input-box border-f0" v-if="loginMode=='account' && loginConfig.account_login == '1'">
							<u--input 
							class="gui-form-input" 
							v-model="formData.username" 
							name="username" 
							border="none"
							clearable
							fontSize="16px"
							:placeholderStyle="{fontSize:'16px',color:'#606266'}"
							placeholder="请填写登录账号" />
						</view>
						<view style="margin-top: 40rpx;"></view>
						<view class="input-box border-f0" v-if="loginMode=='mobile' && use_code && loginConfig.code_login == '1'">
							<u--input 
							type="number" 
							class="gui-form-input gui-flex1" 
							name="code"
							v-model="formData.code" 
							border="none"
							clearable
							fontSize="16px"
							:placeholderStyle="{fontSize:'16px',color:'#606266'}"
							placeholder="短信验证码" />
							<view 
							class="sendmsg gui-block gui-border-l gui-text-right" 
							@tap="getVCode" style="color: #2979ff;">{{vcodeBtnName}}</view>
						</view>
						
						<view class="input-box border-f0" v-if="loginMode=='account' && loginConfig.account_login == '1'">
							<u--input 
							class="gui-form-input" 
							v-model="formData.password" 
							:type="isPwd?'password':'text'"
							name="password" 
							border="none"
							fontSize="16px"
							:placeholderStyle="{fontSize:'16px',color:'#606266'}"
							placeholder="请填写登录密码" />
							<sd-icon name="icon-icon-" top="5" size="22" :color="isPwd?'#adadad':'#2979ff'"
							@click="changePwdType"></sd-icon>
						</view>
						
						<view v-if="use_code === false && authData.mobile" style="font-size: 24px;font-weight: bold;text-align: center;">
							{{authData.mobile}}
						</view>
						
						<view class="gui-margin-top gui-flex gui-rows gui-space-between" hover-class="gui-tap" style="padding: 10px 5px;">
							<text v-if="loginMode=='account' && loginConfig.code_login == '1'" 
							class="gui-text gui-color-gray gui-block gui-text-right" style="color: #2979ff!important;"
							@tap="changeLoginModel('mobile')">手机号登录</text>
							<text v-if="loginMode=='mobile' && loginConfig.account_login == '1'" class="gui-text gui-color-gray gui-block gui-text-right" style="color: #2979ff!important;"
							@tap="changeLoginModel('account')">账号密码登录</text>
							<text v-if="loginConfig.register == '1'" class="gui-text gui-color-gray gui-block gui-text-right"
							@click="redirectTo('/pages/login/register/register', {}, 'reLaunch')"
							>
								没有账号？去注册
							</text>
						</view>
						<!-- {{loginMode}}-{{loginConfig.account_login}}-{{loginConfig.code_login}} -->
						<view style="margin-top:40rpx;">
							<!-- #ifdef MP-WEIXIN -->
							<u-button
							v-if="show_wx_phone_but && authData.mobile == '' && loginMode=='mobile' && loginConfig.wx_mobile_login == '1'"
							type="primary" 
							open-type="getPhoneNumber" 
							text="手机号快捷登录"
							shape="circle" 
							@getphonenumber="mobileAuthLogin" 
							throttleTime="1000"
							:customStyle="$util.butStyle('primary',{gra:2,marginTop:'15px'})"
							size="large"
							></u-button>
							<button
							v-if="authData.mobile != '' || loginMode=='account'"
							form-type="submit"
							type="primary"
							:style="[$util.butStyle('primary',{gra:2,marginTop:'15px'}),{borderRadius:'40px'}]"
							>立即登录</button>
							<!-- 验证码登录 -->
							<button v-if="loginMode=='mobile' && show_wx_phone_but === false" 
							form-type="submit"
							type="primary"
							:style="[$util.butStyle('primary',{gra:2,marginTop:'15px'}),{borderRadius:'40px'}]"
							>立即登录</button>
							
							<button 
							type="primary" 
							@click="noLogin()" 
							:style="[$util.butStyle('primary',{gra:2,marginTop:'10px'}),{borderRadius:'40px'}]"
							>
								<text style="color: #ffffff;">暂不登录</text>
							</button>
							<!-- #endif -->
							
							<!-- #ifndef MP-WEIXIN -->
							<u-button type="primary" text="登 录"
							shape="circle" throttleTime="1000"
							size="large"
							:disabled="!is_agree"
							:customStyle="$util.butStyle('primary',{gra:2,marginTop:'10px'})"
							@click="mobileLogin"
							></u-button>
							<!-- #endif -->
						</view>
					</view>
				</form>
				
				<!-- #ifdef APP-PLUS -->
				<view v-if="loginConfig.wxopen" class="gui-flex gui-row gui-nowrap gui-justify-content-center" style="margin-top: 80rpx;">
					<view class="micon wxico"></view>
				</view>
				<!-- #endif -->
				<view class="gui-margin-top gui-flex gui-rows gui-space-between" style="padding-right: 0px;">
					<view class="regisiter-agreement" style="padding-right: 0px;">
						<view style="display: flex;">
							<text class="micon" v-bind:class="[is_agree?'sd-checked':'sd-check']"
							style="line-height: 20px;font-size: 20px;"
							@click="agreeChage"></text>
						</view>
						<view style="flex: 1;">
							<text style="padding-left: 8px;">我已同意以下协议：</text>
							<text class="color-base-text" v-for="(item,index) in agreeDate.agree_list" :key="index"
							@click="navTo('/pages_public/agree/index?id='+item.id, {login:false})"
							>{{"《"+item.title+"》"}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- #endif-->
			
			<!-- #ifdef MP-TOUTIAO -->
			<view class="wrapper douyin-login-wrapper">
				<image class="icon" :src="$util.img('images/douyin/microapp.png')"></image>
				<view class="login-tip">登录以体验更多精彩内容</view>
				<button class="login-button" data-eventsync="true" @click="getUserProfile">
					<image class="douyin-icon" :src="$util.img('images/douyin/Vector.png')"></image>
					抖音用户信息授权登录
				</button>
				<view class="app-login-tip">请先登录抖音以便进行后续操作</view>
				<view class="gui-margin-top gui-flex gui-rows gui-space-between" style="padding-right: 0px;padding-left: 30px;">
					<view class="regisiter-agreement" style="padding-right: 0px;">
						<view style="display: flex;">
							<text class="micon" v-bind:class="[is_agree?'sd-checked':'sd-check']"
							style="line-height: 20px;font-size: 20px;"
							@click="agreeChage"></text>
						</view>
						<view style="flex: 1;">
							<text style="padding-left: 8px;">我已同意以下协议：</text>
							<text class="color-base-text" v-for="(item,index) in agreeDate.agree_list" :key="index"
							@click="navTo('/pages_public/agree/index?id='+item.id, {login:false})"
							>{{"《"+item.title+"》"}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- #endif -->
			
			
			
			<!-- 完善信息 -->
			<u-popup :show="showPopup" :round="15" @close="closePopup" :closeOnClickOverlay="false">
				<view class="popup-box">
					<view class="popup-item">
						<view class="item-title" style="font-size: 18px;">您的性别是？</view>
						<view class="item-content" style="display: flex;justify-content: space-between;">
							<view class="item-but" @click="setNearbyTerm(2)">
								<view class="sex-box" :class="[dataForm.sex == 2 ? 'but-active' : '']">
									<image :src="$util.img('images/system/girl.png')" mode="widthFix"></image>
								</view>
								<view class="sex-text">女生</view>
							</view>
							<view class="item-but" @click="setNearbyTerm(1)">
								<view class="sex-box" :class="[dataForm.sex == 1 ? 'but-active' : '']">
									<image :src="$util.img('images/system/man.png')" mode="widthFix"></image>
								</view>
								<view class="sex-text">男生</view>
							</view>
						</view>
					</view>
					
					<view class="popup-item" style="border-bottom: 1px solid #f0f0f0;">
						<view class="edit-info-box">
							<view class="edit-title">您的生日是？</view>
							<view class="input-box">
								<picker mode="date" :value="dataForm.birthday" :start="startDate" :end="endDate" @change="bindDateChange">
									<view class="uni-input">{{ dataForm.birthday ? dataForm.birthday : '请选择生日' }}</view>
								</picker>
							</view>
						</view>
					</view>
					
					<u-button
					type="primary" 
					text="确 定"
					shape="circle" 
					throttleTime="1000"
					size="large"
					:customStyle="$util.butStyle('primary',{marginTop:'60px', backgroundColor:System.big_but_color,width:'80%'})"
					@click="saveUserData()"
					></u-button>
				</view>
			</u-popup>
			 
		</template>
	</gui-page>
</template>
<script>
	import validate from "@/common/js/checker.js";
	// #ifdef APP-PLUS
	import { univerifyLogin } from '@/common/js/univerify.js'
	// #endif
	export default {
		data() {
			return {
				loginMode: 'mobile',//登录类型切换
				// 密码可视 类型切换
				isPwd  : true,
				//登录配置
				loginConfig:{
					wxopen:false,
					account_login:'0',
					page_auth:'0',
					code_login:'0',
					improve: '0',
					wx_mobile_login:'0', //微信手机号登录
					wx_auth_avatar:'0',
					register: '0'
				},
				agreeDate:{
					agree_list:[],//协议列表
					alert_content:''
				},
				vcodeBtnName   : "发送验证码",
				countNum       : 120,
				countDownTimer : null,
				use_code: true, //是否显示手机号 验证码输入界面
				show_wx_phone_but: true, //是否显示微信手机号授权按钮
				//短信验证码登录数据
				formData: {
					mobile: '',//用户填写的手机号
					code: '',//用户填写的验证码
					key_phone:'',//系统发送验证码的手机号
					key: '',//系统发送的验证码
					
					username:'',//账号
					password:'',//登录密码
				},
				//微信登录数据
				authData:{
					mobile: '',
					openid:'', //微信小程序openid
					session_key:'', //微信小程序
					avatar:'',
					nickname:''
				},
				backurl: '', // 返回页
				redirect: 'redirectTo', // 跳转方式
				
				showAgree:false,//是否显示协议弹窗
				is_agree:false,//是否同意了协议
				
				//微信登录
				isSub: false, // 提交防重复
				openid:'',//公众号openid
				callback:'',//返回函数
				
				//完善信息
				showPopup: false,
				dataForm:{
					sex:0,
					birthday:'0000-00-00'
				},
				token:'', //临时存储
				userid:0, //后台传递的用户ID
			}
		},
		onLoad(options) {
			console.log('登录页参数',options )
			if(options.backurl){
				this.backurl = options.backurl;
			}
			if(options.redirect){
				this.redirect = options.redirect;
			}
			if(options.openid){
				this.openid = options.openid;
			}
			if(options.userid){
				this.userid = options.userid;
			}
			
			this.Getagree();
			//获取登录配置
			this.getLoginConfig();
		},
		onShow() {
			// #ifdef MP-WEIXIN || MP-TOUTIAO
			this.getCode((res)=>{})
			// #endif
			
			// #ifdef H5
			if(this.System.weid > 0 && this.openid == ''){
				let url = this.System.siteroot+'app/auth/wechartAuth?uniacid='+ this.System.weid
				window.location.replace(url);
			}
			// #endif
		},
		
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			getLoginConfig(){
				this.$request('loginConfig', {},{
					showLoading: false
				}).then((res)=>{
					//console.log('登录配置', res)
					if(res.data.data.loginConfig){
						var loginConfig = res.data.data.loginConfig;
						//loginConfig.wx_mobile_login = 1;
						this.loginConfig = loginConfig;
						// #ifdef MP-WEIXIN
						if(this.System.weid > 0 && this.openid=='' && loginConfig.page_auth == 1){
							this.redirectTo('/pages/login/wx_auth',{},'redirectTo')
						}
						// #endif
						// #ifdef H5
						if(this.System.weid > 0 && this.openid=='' && loginConfig.page_auth == 1 && loginConfig.h5_url !=''){
							let url = this.System.siteroot+'app/auth/wechartAuth?uniacid='+ this.System.weid;
							window.location.href = url;
						}
						// #endif
						if(loginConfig.account_login == '1'){
							this.loginMode = 'account';
						}
						if(loginConfig.code_login == '1'){
							this.loginMode = 'mobile';
						}
					}
				})
			},
			//获取头像
			onChooseAvatar(e){
				const t = this;
				const { avatarUrl } = e.detail;
				if(avatarUrl){
					uni.uploadFile({
						url: t.$util.uploadUrl('image'),
						filePath: avatarUrl,
						name: 'file[]',
						formData:{},
						success: (result) => {
							const resue = JSON.parse(result.data)
							if(resue.code == 200){
								this.authData.avatar = resue.data.file_url;
							}else{
								uni.showModal({
									content: '上传错误',
									showCancel: false
								});
							}
						}
					});
				}
			},
			
			
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
			goHome : function () {
				uni.redirectTo({
					url:'/pages/index/index'
				})
			},
			//获取验证码
			getVCode(){
				var myreg = /^[1][0-9]{10}$/;
				if (!myreg.test(this.formData.mobile)){
					uni.showToast({ title: '请正确填写手机号码', icon : "none"});
					return false;
				}
				// vcodeBtnName 可以阻止按钮被多次点击 多次发送 return 会终止函数继续运行
				if (this.vcodeBtnName != '发送验证码' && this.vcodeBtnName != '重新发送'){return ;}
				this.vcodeBtnName =  "发送中...";
				this.$request('GetPhoneCode', {
					phone: this.formData.mobile
				},{
					showLoading: true
				}).then((res)=>{
					console.log('发送短信', res)
					this.msg(res.data.msg);
					if (res.data.code == 200) {
						this.formData.key_phone = res.data.data.key_phone;
						this.formData.key = res.data.data.key;
						// 倒计时
						this.countNum       = 60;
						this.countDownTimer = setInterval(()=>{this.countDown();}, 1000);
						this.show_wx_phone_but = false; //隐藏微信手机号授权按钮
						this.loginMode = 'mobile';
					}else{
						this.vcodeBtnName = '重新发送';
					}
				})
				
			},
			//重新发送
			countDown(){
				if (this.countNum < 1){
					clearInterval(this.countDownTimer);
					this.vcodeBtnName = "重新发送";
					return ;
				}
				this.countNum--;
				this.vcodeBtnName = this.countNum + '秒重发';
			},
			
			//微信提交表单
			formSubmit: function(e){
				this.authData.nickname = e.detail.value.nickname;
				let data = JSON.parse(JSON.stringify(this.authData));
				data.nickname = e.detail.value.nickname;
				data.mobile = this.formData.mobile;
				data.code = this.formData.code;
				data.key_phone = this.formData.key_phone;//系统发送验证码的手机号
				data.key = this.formData.key;//系统发送的验证码
				data.username = this.formData.username;//账号
				data.password = this.formData.password;//登录密码
				console.log('提交表单', data)
				if (this.verify(data)) {
					this.login(data);
				}
			},
			
			//手机号验证码 账号登录
			mobileLogin(){
				const t = this;
				var data = this.formData;
				if (this.verify(data)) {
					this.login(data);
				}
			},
			//关闭登录
			closeLogin(){
				const t = this;
				uni.hideLoading();
				this.isSub = false;
				var backurl = decodeURIComponent(this.backurl);
				console.log('this.backurl', backurl)
				if(this.backurl){
					if(backurl == '/pages_setting/index'){
						uni.navigateBack();
					}else{
						uni.redirectTo({
							url: decodeURIComponent(this.backurl)
						});
					}
				}else{
					t.redirectTo(t.System.jump_path, {}, t.System.jump_type);
				}
			},
			//暂不登录
			noLogin(){
				const t = this;
				// uni.redirectTo({
				// 	url: t.System.jump_path
				// });
				uni.reLaunch({
					url: t.System.jump_path
				});
			},
			// 密码可视 类型切换
			changePwdType : function(){
				this.isPwd = !this.isPwd;
			},
			//切换登录方式
			changeLoginModel(e){
				console.log('切换登录方式', e)
				if(this.loginMode == e) return;
				this.loginMode = e;
				
				this.formData.mobile = '';
				
				//微信登录参数
				this.authData.mobile = '';
				
				this.use_code = true;
				this.show_wx_phone_but = true;
			},
			
			/**
			* @description: 抖音获取用户数据
			* @return {Promise<void>}
			*/
			async getUserProfile() {
				const t = this;
				uni.getUserProfile({
					desc: '用于完善会员资料', // 必填，声明获取用户个人信息后的用途
					success: (res) => {
						console.log('抖音获取用户数据', res)
						t.authData.avatar = res.userInfo.avatarUrl;
						t.authData.nickname = res.userInfo.nickName;
						t.loginMode = 'dy_app';
						t.login(this.authData);
					},
					fail: (err) => {
						console.error('获取用户信息失败', err);
					}
				});
			},
			/**
			 * 登录
			 */
			login(data = {}) {
				const t = this;
				if(Object.keys(data).length = 0){
					this.msg('登录数据错误！')
					return;
				}
				if(this.is_agree === false){
					this.msg('请同意服务协议！')
					return;
				}
				
				var shareid = uni.getStorageSync('shareid');
				//console.log('分销参数', shareid)
				if(shareid){
					data.shareid = shareid;
				}
				if(this.openid){
					data.wechat_openid = this.openid
				}
				// #ifdef H5
					data.member_id = this.userid;
				// #endif
				if((this.loginMode==='wxlogin' || this.loginMode==='mobile') && data.mobile){
					data.username = this.generateRandomString(3) + data.mobile;
				}
				data.loginMode = this.loginMode;
				// #ifdef MP-WEIXIN
				if((!data.avatar || !data.nickname) && this.loginConfig.wx_auth_avatar=='1'){
					this.msg('请完善头像和昵称')
					return;
				}
				// #endif
				console.log('登录数据', JSON.stringify(data));
				//console.log('this.loginMode', this.loginMode)
				//return;
				
				uni.showLoading({
					title: '登录中...'
				});
				this.$request('Login', data,{
					showLoading: false
				}).then((res)=>{
					console.log('登录', JSON.stringify(res))
					//this.msg(res.data.msg);
					if(res.data.code == 200 && res.data.data.token){
						this.$store.commit('setToken', {
							token: res.data.data.token,
							tokenExpired: 72000000000000000*60
						});
						this.$store.dispatch('getUserInfo', (res)=>{
							if(Object.keys(res).length){
								this.dataForm.sex = res.sex;
								this.dataForm.birthday = res.birthday;
								if(this.System.cheat == 2){
									if(this.loginConfig.improve == 1){
										if(res.sex == 0 || res.birthday == '0000-00-00'){
											uni.hideLoading();
											this.showPopup = true;
										}else{
											this.closeLogin();
										}
									}else{
										this.closeLogin();
									}
								}else{
									this.closeLogin();
								}
							}else{
								this.msg('用户信息不存在');
							}
						})
					}
				})
			},
			closePopup() {
				this.showPopup = false
			},
			//完善信息提交
			saveUserData(){
				this.$request('UpdateUserInfo', this.dataForm,{
					showLoading: true
				}).then((res)=>{
					//console.log('完善信息提交', res)
					if (res.data.code == 200) {
						this.closeLogin();
					}
				})
			},
			//获取日期
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					year = year - 30;
				} else if (type === 'end') {
					year = year + 0;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			//生日改变
			bindDateChange: function(e) {
				this.dataForm.birthday = e.detail.value
			},
			setNearbyTerm(e){
				this.dataForm.sex = e;
			},
			//随机字符串
			generateRandomString(length) {
				let result = '';
				const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
				for (let i = 0; i < length; i++) {
					result += characters.charAt(Math.floor(Math.random() * characters.length));
				}
				return result;
			},
			//本机号码一键登录
			async Uinlogin() {
				const t = this;
				if(this.is_agree === false){
					uni.showToast({
						title:'必须同意协议才可使用该应用！',
						icon:"none"
					});
					return;
				}
				await univerifyLogin(() => {
					uni.closeAuthView();//客户端关闭一键登录授权界面
				}, res => {
					let loginMobile = res.phoneNumber
					t.$request('univerifyLogin', {
						mobile:loginMobile
					},{
						showLoading: true
					}).then((result)=>{
						uni.showToast({
							title: result.data.msg,
							duration: 2000,
							icon:'none'
						});
						if(result.data.code == 200){
							if(result.data.data.token){
								t.$store.commit('setToken', {
									token: result.data.data.token,
									tokenExpired: 7200*60
								});
							}
							t.logined();
						}
						
					})
				})
			},
			//APP微信登录
			plusWxlogin(){
				const t = this;
				
				uni.login({ 
					"provider": "weixin",
					"onlyAuthorize": true, // 微信登录仅请求授权认证
					success: function(event){
						const {code} = event
						t.$request('getAccess_token',{
							code: event.code
						}, {
							showLoading: false
						}).then((res)=>{
							if(res.data.code == 200){
								t.$request('Wxlogin',res.data.data.userInfo, {
									showLoading: true
								}).then((result)=>{
									t.$util.showToast({title:result.data.msg});
									if(result.data.code==200 && result.data.data.token){
										t.$store.commit('setToken', {
											token: result.data.data.token,
											tokenExpired: 7200*60
										});
									}else{
										t.$util.showToast({title:res.data.msg});
									}
								});
							}else{
								t.$util.showToast({title:res.data.msg});
							}
						});
					},
					fail: function (err) {
				        console.log('登录授权失败', err)
				        // err.code是错误码
				    }
				})
			},
			
			//微信小程序授权手机号
			mobileAuthLogin(e) {
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					var data = {
						iv: e.detail.iv,
						encryptedData: e.detail.encryptedData
					};
					if (this.isSub) {
						return;
					}
					this.isSub = true;
					this.getCode(authInfo => {
						console.log('authInfo11', authInfo)
						if (authInfo.openid && authInfo.session_key) {
							data.openid = authInfo.openid;
							data.session_key = authInfo.session_key;
							this.$request('GetPhoneNumber', data,{
								showLoading: true
							}).then((res)=>{
								if(res.data.data.phone){
									this.loginMode = 'wxlogin';
									this.authData.mobile = res.data.data.phone;
									this.formData.mobile = res.data.data.phone;
									this.use_code = false; //关闭验证码验证
									this.isSub = false;
									this.getCode();
									this.login(this.authData);
								}else{
									this.msg(res.data.msg);
								}
							})
						}else{
							this.msg(res.data.msg);
						}
					});
				}
			},
			
			/**
			 * 获取用户登录凭证code
			 */
			getCode(callback) {
				// 微信小程序
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
										this.authData.openid = res.data.data.openid;
										this.authData.session_key = res.data.data.session_key;
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
				// 支付宝小程序
				// #ifdef MP-ALIPAY
				uni.login({
					scopes: 'auth_base',
					success: res => {
						if (res.authCode) {}
					}
				})
				// #endif
				// 头条小程序
				// #ifdef MP-TOUTIAO
				uni.login({
					success: result => {
						console.log('头条小程序', result)
						if (result.code) {
							this.$request('code2Session',{
								code: result.code,
								anonymous_code: result.anonymousCode
							}, {
								showLoading: false
							}).then((res)=>{
								this.loginMode = 'dy_app';
								//console.log('抖音获取用户openid', res)
								if(res.data.code == 200){
									if(res.data.data.openid && res.data.data.session_key){
										this.authData.openid = res.data.data.openid;
										this.authData.session_key = res.data.data.session_key;
									}else{
										uni.showToast({
											title: '获取openid错误',
											icon: 'fail',
										});
									}
								}
							});
						}
					}
				})
				// #endif
				// 百度小程序
				// #ifdef MP-BAIDU
				uni.login({
					success: res => {
						if (res.code) {}
					}
				})
				// #endif
			},
			
			/**
			 * 登录验证
			 * @param {Object} data
			 */
			verify(data) {
				console.log('verify', this.loginMode, data)
				let rule = [];
				// 手机号验证
				if (this.loginMode == 'mobile') {
					rule = [
						{ name: 'mobile', checkType: 'required', errorMsg: '请输入手机号' },
						{ name: 'mobile', checkType: 'phoneno', errorMsg: '请输入正确的手机号'},
						{ name: 'code', checkType: 'required', errorMsg: '请填写验证码' }
					];
				}else if (this.loginMode == 'wxlogin'){
					rule = [
						{ name: 'mobile', checkType: 'required', errorMsg: '请输入手机号' },
						{ name: 'mobile', checkType: 'phoneno', errorMsg: '请输入正确的手机号'},
					];
				}else if (this.loginMode == 'account') {
					rule = [
						{ name: 'username', checkType: 'required', errorMsg: '账号不能为空' },
						{ name: 'password', checkType: 'required', errorMsg: '密码不能为空' }
					];
				}
				//console.log('rule', rule)
				var checkRes = validate.check(data, rule);
				if (checkRes) {
					return true;
				} else {
					this.msg(validate.error);
					return false;
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.border-f0{
		border-bottom: 1rpx solid #E1E2E3 !important;
	}
	.other-login-icons{width:88rpx; height:88rpx; text-align:center; font-size:70rpx; margin:20rpx;}
	.sendmsg{ width:200rpx; font-size:28rpx; padding-top:30rpx;}
	.gui-form-input{
		font-size: 32rpx;
	}
	.wxico:after{
		color: #28c445;
		content: "\e607";
		font-size: 116rpx;
	}
	.avatar-wrapper{
		width: 80px;
		height: 80px;
		border-radius: 80px;
		overflow: hidden;
		margin: 10px auto;
		margin-top: 30px;
		border: 1px solid #f0f0f0;
	}
	.weui-input{
		border: 1px solid #f0f0f0;
		border-radius: 10px;
		height: 40px;
		line-height: 40px;
		width: 150px;
		margin: auto;
		padding: 0 10px;
		font-size: 15px;
		text-align: center;
		margin-bottom: 10px;
	}
	.gradual-box{
		//#7b31f8 #aa4cfd ,
		//background-image: linear-gradient(to bottom, #a7bfff,  #F8F8F8 );
		position: relative;
		//background-image: linear-gradient(to bottom, #ac4cfd,  #F8F8F8 );
		padding-top: 240rpx;
		/* #ifdef MP-WEIXIN */
		padding-top: 100rpx;
		/* #endif */
		padding-bottom: 60rpx;
		.but-box{
			position: absolute;
			top: 100rpx;
			left: 10px;
		}
		.logo-box{
			width: 80px;
			height: 80px;
			border-radius: 10px;
			overflow: hidden;
			margin: auto;
			image{
				width: 100%;
			}
		}
	}
	// 注册协议
	.regisiter-agreement{
		display: flex;
		padding: 10rpx;
		color: #909399;
		font-size: 12px;
		line-height: 40rpx;
		margin-top: 25px;
		width: 100%;
		.micon{
			line-height: 25px;
		}
		.color-base-text{
			color: #008AFF !important;
		}
	}
	.sd-check:after{
		content: "\e8bb";
		color: #909399;
	}
	.sd-checked:after{
		content: "\e62c";
		color: #008AFF !important;
	}
	.sd-checked,.sd-check{
		font-size: 36rpx;
	}
	.agree-box{
		padding: 20rpx 0;
		.agree-item{
			font-size: 28rpx;
			color: #008AFF;
			margin-right: 10rpx;
		}
	}
	.form-box{
		padding: 0 20upx;
		.input-box{
			display: flex;
			padding: 10rpx;
			height: 90rpx;
			.micon{
				padding: 25rpx 20rpx;
				font-size: 36rpx!important;
				color: #909399;
			}
			.sd-account:after{
				content: "\e668";
			}
			.sd-code:after{
				content: "\e66b";
			}
			.sd-password:after{
				content: "\e66d";
			}
		}
	}
	
	.popup-box{
		height: 80vh;
		padding: 0 15px;
		.popup-item{
			padding: 15px 0;
			
			.item-title{
				font-size: 14px;
				color: #303133;
				font-weight: bold;
				padding: 10px 15px;
			}
			.item-content{
				padding: 10px;
				.item-but{
					padding: 0 50px;
					.sex-box{
						width: 60px;
						height: 60px;
						border-radius: 60px;
						box-sizing: border-box;
						image{
							width: 100%;
						}
					}
					.but-active{
						border: 2px solid #2979ff;
					}
					.sex-text{
						font-size: 16px;
						padding-top: 5px;
						text-align: center;
					}
				}
				
			}
			.edit-info-box {
				padding: 20upx;
				.edit-title{
					font-size: 18px;
					color: #303133;
					font-weight: bold;
				}
				.edit-desc{
					font-size: 32upx;
					color: #909399;
					line-height: 60upx;
				}
				.input-box{
					padding-top: 10px;
					padding-bottom: 10rpx;
					.uni-input{
						font-size: 32upx;
						color: #909399;
						line-height: 60upx;
					}
				}
			}
		}
	}
	
	// 抖音
	.login-btn {
	  margin-top: 40rpx;
	  background-color: #FE2C55;
	  color: #FFFFFF;
	}
	
	.login-btn::after {
	  border: none;
	}
	.wrapper {
		padding: 52rpx 32rpx 0 32rpx;
		box-sizing: border-box;
		width: 100vw;
		min-height: 100vh;
		background-color: #F2F2F2;
	}
	.douyin-login-wrapper {
	  position: relative;
	  background-color: #ffffff;
	}
	
	.douyin-login-wrapper .icon {
	  width: 144rpx;
	  height: 144rpx;
	  margin: 30px auto;
	}
	
	.douyin-login-wrapper .login-tip {
	  font-weight: 500;
	  font-size: 32rpx;
	  line-height: 48rpx;
	  color: #161823;
	  text-align: center;
	  padding-bottom: 50px;
	}
	
	.douyin-login-wrapper .login-button {
	  width: 80%;
	  height: 88rpx;
	  margin: 30px auto;
	  background: #fe2c55;
	  font-size: 30rpx;
	  font-weight: 500;
	  color: rgba(255, 255, 255, 0.9);
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  border-radius: 16rpx;
	}
	
	.douyin-login-wrapper .login-button .douyin-icon {
	  width: 28rpx;
	  height: 32rpx;
	  margin-right: 10rpx;
	}
	
	.douyin-login-wrapper .app-login-tip { 
	  width: 100%;
	  text-align: center;
	  font-weight: 400;
	  font-size: 13px;
	  line-height: 18px;
	  color: rgba(22, 24, 35, 0.6);
	}
</style>