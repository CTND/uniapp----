<template>
	<gui-page>
		<template v-slot:gBody>
			<view class="vue-box">
				<view class="list" v-if="ref == 'device'">
					<view class="title">
						使用目的
					</view>
					<view class="gui-text">
						用于保障账户、交易安全,完成安全风控,需要读取你的设备识别信息、设备状态信息以及设备环境信息。
					</view>
					
					<view class="title">使用场景</view>
					<view class="gui-text">
						用户主动授权获取收集情况具体情况以实际收集明细数据为准。
					</view>
					
					<view class="title">数据说明</view>
					<view class="gui-text">统计数字非实时更新,可能存在延时。</view>
				</view>
				<view class="list" v-if="ref == 'face' && System.cheat == 2">
					<view class="title">
						使用目的
					</view>
					<view class="gui-text">
						当你选择开启刷脸验证应用于支付、登录等操作时我们可能会要求你通过刷脸验证服务进行身份的核验。
					</view>
					
					<view class="title">使用场景</view>
					<view class="gui-text">
						用户主动使用刷脸获取以实际收集明细数据为准。
					</view>
					
					<view class="title">数据说明</view>
					<view class="gui-text">统计数字非实时更新,可能存在延时。</view>
				</view>
				
				<view class="list" v-if="ref == 'location'">
					<view class="title">
						使用目的
					</view>
					<view class="gui-text">
						当你使用商家服务、本地生活服务推荐、发送地理位置等定位相关功能,需要读取你的地理位置信息。你也可以在本APP首页手动设置城市信息,以便你查看对应的城市服务推荐内容。同时,在采取脱敏、去标识化等数据保护措施的前提下,你使用外卖等生活服务的信息可能会被用于为你提供综合推荐服务内容,你也可以按照页面提示对相关功能进行设置。
					</view>
					
					<view class="title">使用场景</view>
					<view class="gui-text">
						用户主动授权获取。
					</view>
					
					<view class="title">数据说明</view>
					<view class="gui-text">统计数字非实时更新,可能存在延时。</view>
				</view>
				
				<view class="list" v-if="ref == 'place'">
					<view class="title">
						使用目的
					</view>
					<view class="gui-text">
						1.注册账户或使用服务时,你需要提供手机号码或者电子部箱作为户登录名。你需要按照《非银行支付机构网络支付业务管理办法》的要求提供你的身份基本信息,包括姓名、国籍、性别、职业、住址、联系方式以及有效身份证件的种类、号码和有效用限2.根据《支付机构反洗钱和反恐怖融资管理办法》等反洗钱相关法律法规及监管要求收集和留存3.你进行支付指令验证、或者进行一些重要的账户操作时(例如:扰回密码、挂失账户、冻结交易资金、开具账户和资金相关凭证)、使用客户服务或者其他要验证你真实身份的服务或功能。
					</view>
					
					<view class="title">使用场景</view>
					<view class="gui-text">
						用户主动填写或授权。
					</view>
					
					<view class="title">数据说明</view>
					<view class="gui-text">统计数字非实时更新,可能存在延时。</view>
				</view>
			</view>
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				ref:''
			}
		},
		onLoad: function(options) {
			if(options.ref){
				this.ref = options.ref;
				if(options.ref == 'device'){
					uni.setNavigationBarTitle({
					    title: '设备信息收集说明'
					});
				}else if(options.ref == 'place'){
					uni.setNavigationBarTitle({
					    title: '身份信息收集说明'
					});
				}else if(options.ref == 'location'){
					uni.setNavigationBarTitle({
					    title: '位置信息收集说明'
					});
				}else if(options.ref == 'face'){
					uni.setNavigationBarTitle({
					    title: '刷脸信息收集说明'
					});
				}
			}
		},
		onShow() {
			
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.vue-box{
		
		.list{
			background-color: #ffffff;
			margin-bottom: 10px;
			padding: 15px;
			.title{
				color: #303133;
				line-height: 1.5;
				font-size: 17px;
			}
			.gui-text{
				font-size: 15px;
				color: #82848a;
				line-height: 1.75;
				padding-bottom: 10px;
			}
		}
		
	}
</style>