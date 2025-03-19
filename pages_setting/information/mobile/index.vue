<template>
	<gui-page>
		<!-- 页面主体 -->
		<template v-slot:gBody>
			<view style="font-size: 20px;color: #303133;font-weight: bold;padding: 20px">绑定手机号</view>
			<view class="gui-bg-white gui-dark-bg-level-3 gui-padding-x">
				<view class="gui-form-item gui-border-b">
					<text class="gui-form-label">
						+86
						<text class="micon icon-jiantou_down"></text>
					</text>
					<view class="gui-form-body">
						<u--input
						type="number" 
						class="gui-form-input" 
						v-model="formData.mobile" 
						name="phone" 
						border="none"
						clearable
						fontSize="32rpx"
						:placeholderStyle="{fontSize:'30rpx',color:'#808080'}"
						placeholder="请填写11位手机号" />
					</view>
				</view>
				
				<view class="gui-form-item gui-border-b">
					<text class="gui-form-label micon">验证码：</text>
					<view class="gui-form-body">
						<u--input
						type="number" 
						class="gui-form-input gui-flex1" 
						name="code"
						v-model="formData.code" 
						border="none"
						clearable
						fontSize="32rpx"
						:placeholderStyle="{fontSize:'30rpx',color:'#808080'}"
						placeholder="输入短信验证码" />
					</view>
					<gui-tags :text="vcodeBtnName" :size="25" :borderRadius="25" @tap="getVCode"></gui-tags>
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
				mobile: '',//用户填写的手机号
				code: '',//用户填写的验证码
				key_phone:'',//系统发送验证码的手机号
				key: '',//系统发送的验证码
			},
		}
	},
	methods: {
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
				this.msg(res.data.msg);
				if (res.data.code == 200) {
					this.formData.key_phone = res.data.data.key_phone;
					this.formData.key = res.data.data.key;
					// 倒计时
					this.countNum       = 60;
					this.countDownTimer = setInterval(()=>{this.countDown();}, 1000);
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
		submit : function(){
			//定义表单规则
			var rule = [
				{name:"mobile", checkType : "phoneno", checkRule:"", errorMsg:"手机号格式错误"},
			];
			//进行表单验证 e.detail.value 内存放着表单数据
			var formData   = this.formData;
			var checkRes = graceChecker.check(formData, rule);
			if(checkRes){
				// 当验证 js 不适用某个检查时，使用自定义函数进行检查
				if(formData.code == ''){
					uni.showToast({title:"请填写验证码!", icon:"none"});
					return false;
				}
				this.$util.throttle(async ()=>{
					this.$request('Modifymobile', formData,{
						showLoading: true,
					}).then((res)=>{
						if(res.data.code == 200){
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
	}
}
</script>
<style scoped>
	.gui-form-item{
		padding: 12rpx; 
	}
	.gui-form-label{
		color: #606266;
		font-size: 30rpx;
	}
	.sd-must:after{
		content: "\e69b";
		color: red;
		font-size: 20rpx;
		line-height: 10px!important;
	}
</style>