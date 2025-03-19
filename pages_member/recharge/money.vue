<template>
	<gui-page 
		ref="guipage"
		
		:customHeader="false"
		:customStyle="{padding:'20px 10px 0 10px'}"
	>
		
		<template v-slot:gBody>
			<view class="card-box">
				<image class="bg-img" :src="$util.img('images/member/home-top-bg.png')" style="width:100%;height:100%"></image>
				<view class="content-box">
					<view class="text-but" @click="rightClick()">账单</view>
					<view class="content-title">零钱余额（元）</view>
					<view class="big-num-box">{{memberInfo.money || 0}}</view>
					<view class="money-desc">零钱可直接用于下单支付、发红包等场景使用</view>
				</view>
			</view>
			<!-- <view class="card-box">
				<image :src="$util.img('images/member/home-info-bg.png')" style="width:100%;height:100%"></image>
			</view> -->
			<view class="rech-box">
				<view class="rech-title">充值</view>
				<view style="padding:10px 8px">
					<up-input
					class="input"
					placeholder="请输入金额"
					v-model="ruleForm.input_value"
					type='digit'
					clearable
					fontSize="36rpx"
					:placeholderStyle="{fontSize:'16px',color:'#909399'}"
					:disableDefaultPadding="true"
					:customStyle="{height:'90rpx',fontSize:'36rpx'}"
					@clear="inputClear"
					@focus="inputFocus"
					>
					</up-input>
				</view>
				<view class="rech-block-box">
					<view class="rech-block" v-for="(item, index) in list" :key="index" 
					:class="[ruleForm.recharge_id == item.recharge_id ? 'rech-active' : '']"
					@click="setPrice(item)"
					>
						<view class="rech-num text-overflow">{{item.face_value}}</view>
						<view class="rech-price text-overflow">￥{{item.buy_price}}</view>
					</view>
					
					<u-button
					type="primary" 
					text="确 定"
					shape="circle" 
					throttleTime="1000"
					size="large"
					:customStyle="$util.butStyle('primary',{marginTop:'30px',marginBottom:'30px', backgroundColor:'#f29100',width:'90%'})"
					@click="save()"
					></u-button>
				</view>
			</view>
			<!--加载中-->
			 
			 
			<!-- 全屏加载 -->
			
		</template>
		<template v-slot:gFooter>
			
		</template>
		
	</gui-page>
</template>

<script>
	import payParam from '@/common/js/payParam.js'; 
	export default{
		data() {
			return {
				list:[],
				ruleForm:{
					input_value:'',
					recharge_id: 0,
					face_value: '',
				},
				memberInfo:{
					money:0
				}
			}
		},
		onLoad: function() {
			this.$store.dispatch('getUserInfo', (res)=>{
				if(Object.keys(res).length){
					this.memberInfo = res;
				}
			})
		},
		onShow() {
			this.$request('rechargeList', {},{
				showLoading: false,
			}).then((res)=>{
				console.log('请求数据', res)
				if(res.data.data.list){
					this.list = res.data.data.list;
				}
			})
		},
		methods:{
			rightClick() {
				this.navTo('/pages_member/money/moneyRecord', {login: true}, {account_type:'money'})
			},
			setPrice(item){
				item.input_value = '';
				this.ruleForm = JSON.parse(JSON.stringify(item));
			},
			
			inputClear(){
				this.ruleForm = {
					input_value:'',
					recharge_id: 0,
					face_value: '',
				};
			},
			inputFocus(){
				this.ruleForm = {
					input_value:'',
					recharge_id: 0,
					face_value: '',
				};
			},
			
			save(){
				if(this.ruleForm.recharge_id == 0 && this.ruleForm.input_value == ''){
					this.msg('金额错误');return;
				}
				if(this.isSubmit) return;
				this.isSubmit = true;
				let post_data = JSON.parse(JSON.stringify(this.ruleForm));
				post_data.rech_ref = 'money';
				this.$request('createRechOrder', post_data,{
					showLoading: true,
				}).then((res)=>{
					console.log('请求数据', res)
					this.isSubmit = false;
					if(res.data.data.payData){
						payParam.pay(res.data.data.payData, (result)=>{
							this.$emit('money-back', result);
							if(result == 1){
								this.msg('充值成功');
								this.$store.dispatch('getUserInfo', (res)=>{
									if(Object.keys(res).length){
										this.memberInfo = res;
									}
								})
							}
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-right-box{
		display: flex;
		padding-right: 30rpx;
		/* #ifdef MP-WEIXIN */
		padding-right: 90px;
		/* #endif */
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
			font-size: 14px;
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
		padding: 10px 5px;
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
		.rech-block-box{
			display: flex;
			flex-wrap: wrap;
			.rech-block{
				background-color: #f4f4f5;
				border: 1px solid #f4f4f5;
				border-radius: 5px;
				padding: 10px 5px;
				text-align: center;
				margin: 5px;
				width: calc((100% - 30px) / 3);
				overflow: hidden;
				box-sizing: border-box;
				.rech-num{
					font-size: 36rpx;
					color: #303133;
					font-weight: bold;
				}
				.rech-price{
					padding-top: 2px;
					font-size: 14px;
					color: #909399;
					text-indent: -5px;
				}
			}
			.rech-active{
				background-color: #fdf6ec;
				border: 1px solid #f29100;
				.rech-num{
					color: #f29100;
				}
				.rech-price{
					color: #f29100;
				}
			}
		}
	}
</style>