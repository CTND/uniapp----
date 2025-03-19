<template>
	<up-navbar height="50px" :autoBack="true" 
	:customStyle="{}">
		<template #left>
			<view class="micon icon-jiantou-copy" style="color: #ffffff;font-weight: bold;"></view>
		</template>
		<template #center>
			<view style="color: #ffffff;">会员中心</view>
		</template>
		<template #right>
			<view class="nav-right-box" >
				
			</view>
		</template>
	</up-navbar>
	<view class="body-box">
		<view class="top-box" 
		:style="{backgroundImage:'url(' +$util.img('images/member/card-top-bg.jpg') +')'}">
			<swiper :current="current"
			style="height: 400rpx;"
			@change="swiperChange"
			>
				<swiper-item v-for="(item, index) in list" :key="index" >
					<view class="card-box" :style="{backgroundImage:'url(' +item.cover +')'}">
						<view style="display: flex;">
							<view class="level-title">
								<view class="icon-box" v-if="item.level_ico">
									<image :src="item.level_ico" mode="widthFix"></image>
								</view>
								<view class="level-value">Lv.{{item.level_value}}</view>
							</view>
							<view class="level-name" :style="{color: item.color}">{{item.level_name}}</view>
						</view>
						<view class="day-box" :style="{color: item.color}">{{item.validity>0?item.validity+'天有效':'永久有效'}}</view>
						
						<view style="padding-top: 20rpx;">
							<view class="power-box" v-if="item.consume_discount > 0" :style="{color: item.color}">
								消费享受{{item.consume_discount}}折优惠
							</view>
							<view class="power-box" v-if="item.point_feedback > 0" :style="{color: item.color}">
								享受{{item.point_feedback}}倍积分回赠
							</view>
							<view class="power-box" v-if="item.send_point > 0" :style="{color: item.color}">
								开卡赠送{{item.send_point}}积分
							</view>
							<view class="power-box" v-if="item.send_balance > 0" :style="{color: item.color}">
								开卡赠送{{item.send_balance}}余额
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="card-select">
			<view style="font-size: 16px;font-weight: bold;padding: 30rpx 40rpx;color: #303133;">续费特价</view>
			<view class="flex-box">
				<view class="flex-block" v-for="(card, cindex) in list" :key="cindex"
				:style="{borderColor:current == cindex ? '#eecb95':'#f9ead5'}"
				@click="current = cindex"
				>
					<view class="info-box" :style="{backgroundColor:current == cindex ? '#fcf8ef':'#ffffff'}">
						<view class="card-title">{{card.validity>0?card.validity+'天':card.level_name}}</view>
						<view class="card-price">
							<text style="font-size: 14px;">￥</text>{{card.get_price}}
						</view>
					</view>
					<view class="card-footer" :style="{
						backgroundColor:current == cindex ? '#eecb95':'#f9ead5',
						color:current == cindex ? '#521f02':'#96705d',
					}">
						{{card.level_name}}
					</view>
				</view>
			</view>
			<view style="font-size: 16px;font-weight: bold;padding: 30rpx 40rpx;color: #303133;">权益说明</view>
			<view style="font-size: 14px;color: #606266;line-height: 1.5;padding: 0 20px;height: 20vh;overflow: hidden;">
				<text v-if="list.length">{{list[current].remark}}</text>
			</view>
			<u-button
			v-if="list.length"
			text="立即开通" 
			shape="circle" 
			size="large"
			:customStyle="{
				background: 'linear-gradient(90deg, #e6b25f, #dd8f16)',
				color:'#ffffff',
				width:'80%',
				margin:'30rpx auto',
				height: '45px',
				marginTop:'20px'
			}"
			@click="createOrder()"
			></u-button>
		</view>
		
	</view>
</template>

<script>
	import payParam from '@/common/js/payParam.js'; 
	export default{
		data() {
			return {
				current:0,
				list:[]
			}
		},
		onLoad: function() {
			
		},
		onShow() {
			this.getCards();
		},
		methods:{
			swiperChange(e){
				console.log('swiperChange', e)
				this.current = e.detail.current
			},
			getCards(){
				this.$request('getCardList', {},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.list){
						this.list = res.data.data.list;
					}
					
				})
			},
			//下单
			createOrder(){
				if(this.isSubmit) return;
				this.isSubmit = true;
				uni.showLoading({
					title: '加载中..'
				});
				this.$util.throttle(async ()=>{
					this.$request('createCardOrder', {
						level_id: this.list[this.current].level_id
					},{
						showLoading: false,
					}).then((res)=>{
						uni.hideLoading();
						this.isSubmit = false;
						if(res.data.code == 200){
							if(!res.data.data.payData){ 
								uni.showToast({title: '付款参数错误', icon:'none'});
								return;
							}else{
								payParam.pay(res.data.data.payData, (result)=>{
									if(result == 1){
										uni.showToast({title: '开卡成功！', icon:'success'});
									}
								});
							}
						}else{
							uni.showToast({title: res.data.msg, icon:'none'});
						}
					})
				})
			},
		}
	}
</script>


<style scoped lang="scss">
	.body-box{
		position: relative;
		height: 100vh;
		background-color: #ffffff;
		.top-box{
			background-size: 100% 100%;
			background-repeat: no-repeat;
			height: 320px;
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			padding: 200rpx 20rpx 10rpx 20rpx;
			.card-box{
				background-size: 100% 100%;
				background-repeat: no-repeat;
				border-radius: 16rpx;
				overflow: hidden;
				height: 360rpx;
				margin: 0 10rpx;
				padding: 30rpx;
				.level-title{
					display: flex;
					padding-top: 0rpx;
					.icon-box{
						width: 25px;
						height: 25px;
						border-radius: 30px;
						overflow: hidden;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.level-value{
						font-size: 18px;
						font-weight: bold;
						color: #ffffff;
						padding-left: 2px;
						line-height: 25px;
					}
					
				}
				.level-name{
					font-size: 18px;
					color: #ffffff;
					padding-left: 15%;
					width: 150px;
					overflow: hidden;
					line-height: 25px;
				}
				
				.day-box{
					font-size: 14px;
					color: #606266;
					padding-top: 10rpx;
					padding-left: 10rpx;
				}
				.power-box{
					font-size: 28rpx;
					color: #606266;
					padding-top: 8rpx;
					padding-left: 10rpx;
				}
			}
			
		}
		.card-select{
			background-color: #ffffff;
			height: 150px;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;
			position: absolute;
			left: 0;
			top: 300px;
			width: 100%;
			.flex-box{
				display: flex;
				flex-wrap: wrap;
				padding-left: 40rpx;
				.flex-block{
					width: calc( (100% - 60rpx) / 3);
					margin-right: 10rpx;
					margin-bottom: 30rpx;
					background-color: #ffffff;
					border-radius: 20rpx;
					overflow: hidden;
					border: 2px solid #efcb93;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.info-box{
						text-align: center;
						color: #521f02;
						padding: 20rpx 0;
						.card-title{
							font-size: 18px;
							font-weight: bold;
							padding-left: 10rpx;
						}
						.card-price{
							font-size: 20px;
							font-weight: bold;
							padding-top: 15rpx;
							flex: 1;
						}
					}
					.card-footer{
						background-color: #fae9d5;
						font-size: 12px;
						height: 25px;
						line-height: 25px;
						text-align: center;
						color: #96705d;
						overflow: hidden;
					}
				}
			}
		}
		
	}
</style>