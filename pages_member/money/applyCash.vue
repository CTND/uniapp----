<template>
	<gui-page 
		ref="guipage"
		
		:customHeader="false"
		:customStyle="{
			backgroundColor:System.full_bg_color,
			padding:'10px 15px 0 15px'
		}"
	>
		
		<template v-slot:gBody>
			<view class="card-box">
				<image class="bg-img" :src="$util.img('images/member/card-bg.png')" style="width:100%;height:100%"></image>
				<view class="content-box">
					<view class="text-but" @click="navTo('/pages_member/money/cashRecord', {login: true}, {role:'share'})">提现记录</view>
					<view class="content-title">账户余额（元）</view>
					<view class="big-num-box">{{memberInfo.bonus || 0}}</view>
					<view class="money-desc">当前余额为可提现的佣金余额</view>
				</view>
			</view>
			<view class="worker-notify-box">
				<view v-if="setting.cash_min_money>0">1.每次最少提现 ￥{{setting.cash_min_money}}元</view>
				<view v-if="setting.cash_everyday_maxmoney>0">2.每日提现上限 ￥{{setting.cash_everyday_maxmoney}}元</view>
			</view>
			<view class="form-box">
				<view class="form-block">
					<view class="form-item item-b">
						<view class="form-label">
							提现金额
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<up-input
									class="input"
									placeholder="请输入提现金额"
									v-model="ruleForm.cash_money"
									type='number'
									border="none"
									clearable
									:placeholderStyle="{fontSize:'17px',color:'#ceccca',fontWeight: '400'}"
									:customStyle="{fontSize:'20px',fontWeight: 'bold'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									@clear="inputClear"
									@focus="inputFocus"
									></up-input>
								</view>
							</view>
						</view>
					</view>
					
					<view class="form-item" style="padding-top: 5px;" @click="navTo('/pages_member/bankAccount/List', {login: true}, {ref: 'check'})">
						<view class="form-label">
							提现账户
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box" style="color: #606266;">
									{{ruleForm.type_data.type == '' ? '' : ruleForm.type_data.label +' ' + ruleForm.account_number}}
								</view>
								<view v-if="ruleForm.type_data.type == ''" class="placeholder-box">请选择</view>
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy"
								size="14" color="#c0c4cc" top="18"></sd-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<u-button
			type="primary" 
			text="提 交"
			shape="circle" 
			throttleTime="1000"
			size="large"
			:customStyle="$util.butStyle('primary',{marginTop:'30px',marginBottom:'30px',width:'90%'})"
			@click="save()"
			></u-button>
			
			<!--加载中-->
			 
			 
			<!-- 全屏加载 -->
			
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				memberInfo:{
					bonus:0
				},
				setting:{
					cash_min_money: 0,
					cash_everyday_maxmoney: 0,
					cash_hander_fee: 0,
				},
				ruleForm:{
					role:'share', //提现角色
					cash_money:'',
					type_data: {
						label: '',
						type: ''
					},
					account_name: '',
					account_fname: '',
					account_number: '',
					account_code: ''
				},
			}
		},
		onLoad: function(options) {
			if(options.role){
				this.ruleForm.role = options.role;
			}
			this.$request('resellerSetting', {},{
				showLoading: false,
			}).then((res)=>{
				if(res.data.data.setting){
					this.setting = res.data.data.setting;
				}
			})
			this.getDefaultAccount();
		},
		onShow() {
			this.getInfo();
		},
		methods:{
			getInfo(){
				this.$store.dispatch('getUserInfo', (res)=>{
					if(Object.keys(res).length){
						this.memberInfo = res;
					}
				})
			},
			//获取默认账户
			getDefaultAccount(){
				this.$request('getUserBankAccountDefault', {},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.account){
						let item = res.data.data.account;
						let post_data = {
							type_data: item.type_data,
							account_name: item.account_name,
							account_fname: item.account_fname,
							account_number: item.account_number,
							account_code: item.account_code
						};
						this.ruleForm = Object.assign({}, this.ruleForm, post_data);
					}
				})
			},
			
			inputClear(){
				this.ruleForm.cash_money = '';
			},
			inputFocus(){
				this.ruleForm.cash_money = '';
			},
			
			save(){
				if(this.ruleForm.cash_money == ''){
					this.msg('提现金额不能为空')
					return;
				}
				if(this.setting.cash_min_money > 0){
					if(parseFloat(this.ruleForm.cash_money) < parseFloat(this.setting.cash_min_money)){
						this.msg('提现额度不能低于' + this.setting.cash_min_money)
						return;
					}
				}
				if(parseFloat(this.ruleForm.cash_money) > parseFloat(this.memberInfo.bonus)){
					this.msg('可提现金额不足')
					return;
				}
				if(this.ruleForm.type_data.type == ''){
					this.msg('提现账户不能为空')
					return;
				}
				if(this.isSubmit) return;
				this.isSubmit = true;
				let post_data = JSON.parse(JSON.stringify(this.ruleForm));
				this.$request('moneyApplyCash', {
					post_data: post_data
				},{
					showLoading: true,
				}).then((res)=>{
					console.log('申请提现', res)
					this.isSubmit = false;
					if(res.data.code == 200){
						this.inputClear();
						this.msg(res.data.msg)
					}
					this.getInfo();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.worker-notify-box{
		font-size: 14px;
		color: #606266;
		line-height: 1.5;
		border-radius: 5px;
		view{
			padding: 5px 10px;
		}
	}
	
	.card-box{
		height: 160px;
		border-radius: 10px;
		overflow: hidden;
		margin-bottom: 10px;
		position: relative;
		.bg-img{
			display: block;
			position: absolute;
			top: 0;
			left: 0;
		}
		.text-but{
			position: absolute;
			top: 20px;
			right: 20px;
			font-size: 12px;
			color: #ffffff;
		}
		.content-box{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			padding: 20px 15px;
			text-align: center;
			.content-title{
				font-size: 14px;
				color: #ffffff;
			}
			.big-num-box{
				padding-top: 20px;
				font-size: 28px;
				color: #ffffff;
				font-weight: bold;
				text-indent: -10px;
			}
			.money-desc{
				padding-top: 30px;
				font-size: 12px;
				color: #f8f8f8;
			}
		}
	}
	.rech-box{
		background-color: #ffffff;
		padding: 10px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		.rech-title{
			font-size: 15px;
			color: #303133;
			font-weight: bold;
			padding: 5px 10px;
		}
	}
	
	.form-box{
		background-color: #ffffff;
		margin-top: 5px;
		border-radius: 5px;
		
		.title-text{
			padding: 0 5px;
			font-size: 15px;
			color: #909399;
			margin-bottom: 5px;
		}
		.form-block{
			background-color: #ffffff;
			border-radius: 5px;
			padding: 0 15px;
			margin-bottom: 10px;
			.form-item{
				display: flex;
				box-sizing: border-box;
				flex-direction: row;
				line-height: 50px;
				.form-label{
					font-size: 32rpx;
					color: #303133;
				}
				.required::after{
					content: "\e69b";
					color: red;
					font-size: 10px;
					vertical-align:text-top;
				}
				.form-content{
					flex: 1;
					display: flex;
					min-width: 0;
					.content{
						flex: 1;
						min-width: 0;
						text-align: right;
						font-size: 15px;
						color: #303133;
						display: flex;
						padding-right: 5px;
						.input-box{
							flex: 1;
							.input{
								height: 50px;
							}
						}
						.placeholder-box{
							flex: 1;
							text-align: right;
							font-size: 15px;
							color: #909399;
						}
					}
					.icon-box{
						padding-left: 0px;
					}
				}
			}
			.item-b{
				border-bottom: 1px solid #e7e6e4;
			}
		}
	}
</style>