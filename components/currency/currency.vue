<template>
	<view class="rech-box">
		<view class="currency-box">
			<view style="padding-top: 4px;font-size: 15px;">余额：</view>
			<view class="money-box">{{userInfo.currency || 0}}</view>
		</view>
		<scroll-view scroll-y="true" style="height: 42vh">
			<view class="rech-block">
				<view class="block" v-for="(item, index) in list" :key="index"
				:class="[ruleForm.curr_id == item.curr_id ?'active' : 'default']"
				@click="setData(item)"
				>
					<view style="height: 20px;line-height: 20px;" class="text-overflow">
						<text class="num-text" style="font-size: 20px;font-weight: bold;">{{item.num}}</text>
						<text class="num-text" style="font-size: 14px;">陌币</text>
					</view>
					<view class="price-text text-overflow" style="font-size: 14px;padding-top: 2px;height: 20px;line-height: 20px;">
						{{item.price}}元
					</view>
				</view>
				<view class="block" 
				:class="[numberVal ?'active' : 'default']"
				@click="showKeyboard"
				>
					<view style="height: 20px;line-height: 20px;" class="text-overflow">
						<text class="num-text" style="font-size: 20px;font-weight: bold;" 
						:style="{fontSize:numberVal?'20px':'14px'}">
							{{numberVal || '自定义充值'}}
						</text>
					</view>
					<view class="price-text text-overflow" style="font-size: 14px;padding-top: 2px;height: 20px;line-height: 20px;">
						{{numberVal || '0'}}元
					</view>
				</view>
			</view>
			<view class="rech-item">
				<view class="item">
					<view style="flex: 1;display: flex;">
						<view class="micon icon-weixinzhifu" style="color: #05bf45;font-size: 24px;"></view>
						<view style="font-size: 16px;margin-left: 2px;line-height: 24px;">微信支付</view>
					</view>
					<view>
						<view class="micon icon-xuanzhong2" style="color: #fc3565;font-size: 24px;"></view>
					</view>
				</view>
			</view>
		</scroll-view>
		<gui-number-keyboard 
		ref="guink" 
		@keyboardDone="keyboardDone" 
		@keyboardInput="keyboardInput" 
		@keyboardDelete="keyboardDelete"
		:value="numberVal"
		:isPoint="false"
		></gui-number-keyboard>
						
		<view class="footer-fixed-box">
			<view class="text-overflow" style="flex: 1;padding-top: 5px;height: 30px;line-height: 30px">
				<text style="color: #fc3565;font-size: 14px;">￥</text>
				<text style="color: #fc3565;font-size: 20px;font-weight: bold;">{{ruleForm.curr_id?ruleForm.price:numberVal?numberVal:0}}</text>
				<text style="color: #303133;font-size: 14px;margin-left: 10px;">预计到账{{ruleForm.curr_id?ruleForm.num:numberVal?numberVal:0}}陌币</text>
			</view>
			<view>
				<u-button
				type="primary" 
				text="立即充值"
				shape="circle" 
				throttleTime="1000"
				size="large"
				:customStyle="{backgroundColor:'#fc3565',color:'#ffffff',width:'110px',border:'none',height:'40px',lineHeight:'40px'}"
				@click="save()"
				></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import payParam from '@/common/js/payParam.js'; 
	export default{
		data() {
			return {
				list:[],
				ruleForm:{
					curr_id:0,
					num: 0,
					price: 0,
				},
				numberVal: '',
				
				memberInfo:{
					currency:0
				}
			}
		},
		created() {
			this.$store.dispatch('getUserInfo', (res)=>{
				if(Object.keys(res).length){
					this.memberInfo = res;
				}
			})
			
			this.$request('currencyRechList', {},{
				showLoading: false
			}).then((res)=>{
				let list = [];
				if(res.data.data.list){
					list = JSON.parse(JSON.stringify(res.data.data.list));
				}
				this.list = list;
			})
		},
		
		methods:{
			setData(item){
				this.ruleForm = JSON.parse(JSON.stringify(item));
				this.numberVal = '';
			},
			save(){
				if(this.ruleForm.curr_id == 0 && this.numberVal == ''){
					this.msg('金额错误');return;
				}
				if(this.isSubmit) return;
				this.isSubmit = true;
				let post_data = JSON.parse(JSON.stringify(this.ruleForm));
				if(this.ruleForm.curr_id == 0){
					post_data.price = this.numberVal;
					post_data.num = this.numberVal;
				}
				post_data.rech_ref = 'currency';
				uni.showLoading({
					title: '加载中..'
				});
				this.$request('createRechOrder', post_data,{
					showLoading: false,
				}).then((res)=>{
					this.isSubmit = false;
					uni.hideLoading();
					if(res.data.data.payData){
						payParam.pay(res.data.data.payData, (result)=>{
							this.$emit('currency-back', result);
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
			},
			// 第1个示例
			showKeyboard : function () {
				//打开数字键盘
				this.$refs.guink.open();
				this.ruleForm = {
					curr_id:0,
					num: 0,
					price: 0,
				}
			},
			// 监听输入
			keyboardInput : function(e){
				this.numberVal = this.numberVal + '' + e;
			},
			// 监听删除
			keyboardDelete : function(){
				this.numberVal = this.numberVal.substring(0, this.numberVal.length - 1);
			},
			// 完成事件
			keyboardDone : function(e){
				this.$refs.guink.close();
				if(e == 0){
					this.numberVal = '';
				}
			},
			
			rightClick() {
				console.log('rightClick');
			},
		}
	}
</script>

<style lang="scss" scoped>
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
	
	//充值
	.rech-box{
		height: 60vh;
		background-color: #f6f6f6;
		padding: 0 10px;
		border-radius: 15px;
		overflow: hidden;
		.currency-box{
			display: flex;
			padding: 15px 10px 10px 10px;
			vertical-align: bottom;
			view{
				display: inline-block;
			}
			.money-box{
				color: #fc3565;
				font-size: 40rpx;
				font-weight: bold;
			}
		}
		.rech-item{
			background-color: #ffffff;
			padding:10px;
			border-radius:10px;
			overflow: hidden;
			margin-bottom: 10px;
			.item{
				display: flex;
				padding: 10px 0;
			}
		}
		.rech-block{
			background-color: #ffffff;
			padding:10px;
			border-radius:10px;
			overflow: hidden;
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 10px;
			.block{
				background-color: #f6f6f6;
				border: 1px solid #f6f6f6;
				box-sizing: border-box;
				border-radius: 5px;
				padding: 10px 5px;
				width: 31%;
				margin: 5px 1%;
				text-align: center;
				overflow: hidden;
				height: 65px;
			}
			.default{
				.num-text{
					color: #303133;
				}
				.price-text{
					color: #909399;
				}
			}
			.active{
				background-color: #fdf6ec;
				border: 1px solid #fc3565;
				.num-text{
					color: #fc3565;
				}
				.price-text{
					color: #fc3565;
				}
			}
		}
	}
	
	.footer-fixed-box{
		display: flex;
		background-color: #ffffff;
		padding: 10px 15px;
		padding-bottom: 20px;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
</style>