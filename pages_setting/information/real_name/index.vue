<template>
	<gui-page>
		<!-- 页面主体 -->
		<template v-slot:gBody>
			<view style="font-size: 18px;color: #303133;font-weight: bold;padding: 20px">实名认证</view>
			<view class="gui-bg-white gui-dark-bg-level-3 gui-padding-x">
				<view class="gui-form-item gui-border-b">
					<text class="gui-form-label micon sd-must">真实姓名：</text>
					<view class="gui-form-body">
						<u-input
						class="gui-form-input" 
						v-model="formData.name" 
						type="text"
						name="name" 
						border="none"
						fontSize="32rpx"
						:placeholderStyle="{fontSize:'30rpx',color:'#808080'}"
						placeholder="请输入真实姓名" />
					</view>
				</view>
				<view class="gui-form-item gui-border-b">
					<text class="gui-form-label micon sd-must">手机号码：</text>
					<view class="gui-form-body">
						<u-input
						class="gui-form-input" 
						v-model="formData.mobile" 
						type="text"
						name="mobile" 
						border="none"
						fontSize="32rpx"
						:placeholderStyle="{fontSize:'30rpx',color:'#808080'}"
						placeholder="请输入手机号码" />
					</view>
				</view>
				<!-- <view class="gui-form-item gui-border-b">
					<text class="gui-form-label micon sd-must">身份证号：</text>
					<view class="gui-form-body">
						<u-input
						class="gui-form-input" 
						v-model="formData.idcard" 
						type="idcard"
						name="idcard" 
						border="none"
						fontSize="32rpx"
						:placeholderStyle="{fontSize:'30rpx',color:'#808080'}"
						placeholder="请输入身份证号码" />
					</view>
				</view> -->
				
			</view>	
			
			<view style="margin-top:60rpx;">
				<u-button type="primary" text="提交保存"
				shape="circle" throttleTime="1000"
				size="large"
				:customStyle="$util.butStyle('primary',{gra:2,marginTop:'10px',width:'80%'})"
				@click="submit"
				></u-button>
			</view>
			<!--加载中-->
			 
			
		</template>
	</gui-page>
</template>
<script>
import graceChecker from "@/common/js/checker.js";
export default {
	data() {
		return {
			vcodeBtnName   : "发送验证码",
			countNum       : 120,
			countDownTimer : null,
			formData: {
				idcard:'',
				name:'',
				mobile:''
			},
		}
	},
	onShow() {
		this.isLogin();
		this.getInfo();
	},
	methods: {
		getInfo(){
			this.$store.dispatch('getUserInfo', (res)=>{
				//console.log('用户资料', res)
				if(Object.keys(res).length){
					if(res.realname){
						this.formData.name = res.realname;
					}
					if(res.idcard){
						this.formData.idcard = res.idcard;
					}
					if(res.mobile){
						this.formData.mobile = res.mobile;
					}
				}
			})
		},
		submit : function(){
			//定义表单规则
			var rule = [
				{name:"name", checkType : "string", checkRule:"2,10", errorMsg:"姓名为2-10个字符"},
				//{name:"idcard", checkType : "idCard", checkRule:"", errorMsg:"身份证号码错误"},
				{name:"mobile", checkType : "phone", checkRule:"", errorMsg:"手机号码错误"}
			];
			//进行表单验证 e.detail.value 内存放着表单数据
			var formData   = this.formData;
			console.log('formData', formData)
			var checkRes = graceChecker.check(formData, rule);
			if(checkRes){
				this.$util.throttle(async ()=>{
					this.$request('authAttestation', formData,{
						showLoading: true,
					}).then((res)=>{
						let token = uni.getStorageSync('token');
						console.log('实名人', res, token)
						if(res.data.code == 200){
							this.msg(res.data.msg);
							this.$store.dispatch('getUserInfo', (res)=>{})
							setTimeout(()=>{
								uni.navigateBack();
							},500)
						}
					})
				})
			}else{
				uni.showToast({ title: graceChecker.error, icon: "none" });
			}
			
		},
		pickerChange : function (e) {
			this.genderIndex    = e.detail.value;
			this.formData.name5 = this.gender[this.genderIndex];
		}
	}
}
</script>
<style scoped>
	.gui-form-item{
		padding: 12rpx; 
	}
	.gui-form-label{
		width: 90px;
		font-size: 30rpx;
	}
	.sd-must:after{
		content: "\e69b";
		color: red;
		font-size: 20rpx;
		line-height: 10px!important;
	}
</style>