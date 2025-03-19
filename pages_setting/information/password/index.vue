<template>
	<gui-page>
		<!-- 页面主体 -->
		<template v-slot:gBody>
			<view style="font-size: 20px;color: #303133;font-weight: bold;padding: 20px">修改登录密码</view>
			<view class="gui-bg-white gui-dark-bg-level-3 gui-padding-x">
				<view class="gui-form-item gui-border-b">
					<text class="gui-form-label micon sd-must">登录密码：</text>
					<view class="gui-form-body">
						<u--input
						class="gui-form-input" 
						v-model="formData.password" 
						type="password"
						name="password" 
						border="none"
						fontSize="32rpx"
						:placeholderStyle="{fontSize:'30rpx',color:'#808080'}"
						placeholder="请填写登录密码 6-12位字符" />
					</view>
				</view>
				<view class="gui-form-item gui-border-b">
					<text class="gui-form-label micon sd-must">确认密码：</text>
					<view class="gui-form-body">
						<u--input
						class="gui-form-input" 
						v-model="formData.rule_password" 
						type="password"
						name="password" 
						border="none"
						fontSize="32rpx"
						:placeholderStyle="{fontSize:'30rpx',color:'#808080'}"
						placeholder="请填写确认密码" />
					</view>
				</view>
				
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
				password:'',//登录密码
				rule_password:'',//验证密码
			},
		}
	},
	methods: {
		submit : function(){
			//定义表单规则
			var rule = [
				{name:"password", checkType : "string", checkRule:"6,12", errorMsg:"密码至少6个字符"},
				{name:"rule_password", checkType : "samewith", checkRule:"password", errorMsg:"两次密码输入不一致"},
			];
			//进行表单验证 e.detail.value 内存放着表单数据
			var formData   = this.formData;
			var checkRes = graceChecker.check(formData, rule);
			if(checkRes){
				this.$util.throttle(async ()=>{
					this.$request('Modifypassword', formData,{
						showLoading: true,
					}).then((res)=>{
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