<template>
	<view>
		<u-popup
		:show="showKefu" 
		mode="center" 
		bgColor="transparent"
		:closeOnClickOverlay="true"
		@close="closeKefu()"
		>
			<view class="kefu-box">
				<view class="center-box">
					<view class="kefu-text">
						已为您接通专属客服
					</view>
					<view class="kefu-ico">
						<image :src="$util.img('images/system/kefu001.png')" mode="widthFix" style="width: 100%;height: 100%;"></image>
					</view>
					<view class="kefu-desc">
						消费过程中遇到任何问题可优先处理！
					</view>
					<!-- #ifdef MP-WEIXIN -->
					<u-button type="primary" open-type="contact"
					:customStyle="$util.butStyle('primary',{marginTop:'30px', backgroundColor:System.big_but_color,width:'80%'})"
					>立即咨询</u-button>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS || MP-TOUTIAO -->
					<u-button type="primary"
					:customStyle="$util.butStyle('primary',{marginTop:'30px', backgroundColor:System.big_but_color,width:'80%'})"
					 @click="$util.callPhone(System.kefu_phone)"
					>立即咨询</u-button>
					<!-- #endif -->
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	
	export default{
		data() {
			return {
				showKefu:false,
			}
		},
		
		methods:{
			show(){
				this.showKefu = true;
			},
			hide() {
				this.showKefu = false;
			},
			closeKefu(){
				this.showKefu = false;
			},
		}
	}
</script>

<style lang="scss">
	//客服
	.kefu-box{
		width: 85vw;
		margin: auto;
		padding-bottom: 100upx;
		.center-box{
			border-radius: 20upx;
			background-color: #FFFFFF;
			padding: 60upx 30upx;
			overflow: hidden;
			.kefu-text{
				font-size: 32upx;
				text-align: center;
				-webkit-text-stroke-width: 0.2px;
				line-height: 60upx;
			}
			.kefu-ico{
				width: 80px;
				height: 80px;
				margin: 40upx auto;
			}
			.kefu-desc{
				font-size: 14px;
				text-align: center;
				color: #606266;
			}
		}
		
	}
</style>