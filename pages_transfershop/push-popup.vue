<template>
	<view>
		<up-popup :show="showPopup" :round="30" closeable @close="close">
			<view class="popup-box-bottom" :style="{backgroundImage:'url(' + $util.img('images/modules/sd_transshop/popup-bg.png') + ')',}">
				<view class="popup-title">发布需求</view>
				<view class="popup-title-desc">这里有10000+条相关资讯信息</view>
				<view class="but-img-box">
					<view class="img-but" :style="{backgroundImage:'url(' + $util.img('images/modules/sd_transshop/b1.png') + ')',}"
					@click="toPush('/pages_transfershop/push/index', 1)"
					>
						<view class="but-content">
							<view class="but-title-box">
								<view class="but-title">店铺转让</view>
								<view class="but-title-desc">快速发布转让、出租信息</view>
							</view>
							<view class="but-button-box">
								发布
							</view>
						</view>
					</view>
					<view class="img-but" :style="{backgroundImage:'url(' + $util.img('images/modules/sd_transshop/b2.png') + ')',}"
					@click="toPush('/pages_transfershop/push/index', 2)"
					>
						<view class="but-content">
							<view class="but-title-box">
								<view class="but-title">房源出售</view>
								<view class="but-title-desc">快速发布房源出售信息</view>
							</view>
							<view class="but-button-box">
								发布
							</view>
						</view>
					</view>
					<view class="img-but" :style="{backgroundImage:'url(' + $util.img('images/modules/sd_transshop/b3.png') + ')',}"
					@click="toPush('/pages_transfershop/periodic/index', 1)"
					>
						<view class="but-content">
							<view class="but-title-box">
								<view class="but-title">我要找店</view>
								<view class="but-title-desc">快速发布找店、求租信息</view>
							</view>
							<view class="but-button-box">
								发布
							</view>
						</view>
					</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPopup:false,
			}
		},
		methods: {
			close() {
				this.showPopup = false
			},
			open(){
				this.showPopup = true;
			},
			toPush(url,nature){
				this.navTo(url, {login:true}, {nature:nature});
				this.close();
			}
		}
	}
</script>

<style lang="scss" scoped>
	//半弹出
	.popup-box-bottom{
		height: 55vh;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 100%;
		padding: 40rpx;
		.popup-title{
			font-weight: 600;
			font-size: 36rpx;
			color: #36414D;
			line-height: 36rpx;
		}
		.popup-title-desc{
			font-size: 24rpx;
			color: #929599;
			line-height: 24rpx;
			padding-top: 16rpx;
		}
		.but-img-box{
			padding: 10px 0;
			
			.img-but{
				height: 80px;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				.but-content{
					padding: 0 20rpx 0 80px;
					display: flex;
					padding-top: 30rpx;
					.but-title-box{
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						.but-title{
							font-weight: 600;
							font-size: 32rpx;
							color: #FFFFFF;
							line-height: 32rpx;
						}
						.but-title-desc{
							font-weight: 400;
							font-size: 24rpx;
							color: #FFFFFF;
							line-height: 24rpx;
							padding-top: 20rpx;
						}
					}
					.but-button-box{
						height: 60rpx;
						line-height: 60rpx;
						width: 60px;
						text-align: center;
						border-radius: 32rpx;
						border: 2rpx solid #FFFFFF;
						font-weight: 600;
						font-size: 24rpx;
						color: #FFFFFF;
						margin-top: 10rpx;
					}
				}
			}
		}
	}
</style>