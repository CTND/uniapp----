<template>
	<view class="mix-loading center">
		<view v-if="!isTimeout" class="center">
			<view v-if="mask" class="mask" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent"></view>
			<!-- 黑底菊花 -->
			<view v-if="type === 1" class="chry column center">
				<view class="icon" :style="{backgroundImage:'url(' +$util.img('images/system/loading.png')+ ')'}"></view>
				<text class="tit">{{ title }}</text>
			</view>
			<!-- 仓鼠 -->
			<image v-else-if="type === 2" class="hamster" :src="$util.img('images/system/loading2.png')"></image>
		</view>
	</view>
</template>

<script>
	/**
	 * loading
	 * @prop type 1 黑底菊花 2 小胖仓鼠
	 * @prop mask 遮罩层
	 * @prop timeout 超时时间（秒） 默认10s
	 */
	export default {
		name: 'MixIconLoading',
		data(){
			return {
				isTimeout: false
			}
		},
		props: {
			type: {
				type: Number,
				default: 1
			},
			mask: {
				type: Boolean,
				default: false
			},
			timeout: {
				type: Number,
				default: 10
			},
			title: {
				type: String,
				default: '加载中'
			}
		},
		created() {
			this._timer = setTimeout(()=>{
				if(!this.isLoading){
					return;
				}
				this.isTimeout = true;
				uni.showToast({
					title: '加载超时，请重试',
					icon: 'none'
				})
			}, this.timeout * 1000)
		},
		destroyed() {
			this._timer && clearTimeout(this._timer);
		}
	}
</script>

<style scoped lang='scss'>
	.mix-loading{
		position: fixed;
		left: calc((100vw - 90px) / 2);
		top: calc((100vh - 145px) / 2);
		width: 0;
		height: 0;
		z-index: 999;
	}
	.mask{
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
	}
	.chry{
		min-width: 90px;
		min-height: 90px;
		border-radius: 10rpx;
		background-color: rgba(17,17,17,.7);
		text-align: center;
		padding-top: 15px;
		.icon{
			width: 40px;
			height: 40px;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			animation: mix-loading 1s steps(12) infinite;
			margin: auto;
		}
		.tit{
			margin: 10rpx 0 6rpx;
			font-size: 12px;
			color: #e9e9e9;
		}
	}
	@keyframes mix-loading{
		from {
			transform:rotate(0deg)
		}
		to {
			transform: rotate(1turn)
		}
	}
	.hamster{
		width: 106rpx;
		height: 120rpx;
	}
</style>
