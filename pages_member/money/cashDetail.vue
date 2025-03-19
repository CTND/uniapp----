<template>
	<gui-page
		ref="guipage"
		
		:customStyle="{
			backgroundColor:System.full_bg_color
		}"
	>
		
		<template v-slot:gBody>
			<view class="view-box" v-if="detail.cid">
				<view class="money-wrap">
					<text>-￥{{ detail.cash_money }}</text>
				</view>
				
				<!-- 状态0待审核1.待转账2已转账 -1拒绝' -->
				<view class="item">
					<view class="line-wrap">
						<text class="label">当前状态</text>
						<text class="value">{{ detail.status_data.name }}</text>
					</view>
					<view class="line-wrap" v-if="detail.status == 1 || detail.status == 2">
						<text class="label">到账金额</text>
						<text class="value">￥{{ detail.real_money }}</text>
					</view>
					<view class="line-wrap">
						<text class="label">手续费</text>
						<text class="value">￥{{ detail.hand_fee }}</text>
					</view>
					<view class="line-wrap">
						<text class="label">申请时间</text>
						<text class="value">{{ detail.create_time }}</text>
					</view>
					<view class="line-wrap" v-if="detail.account_name">
						<text class="label">银行名称</text>
						<text class="value">{{ detail.account_name }}</text>
					</view>
					<view class="line-wrap" v-if="detail.account_number">
						<text class="label">收款账号</text>
						<text class="value">{{ detail.account_number }}</text>
					</view>
					<view class="line-wrap" v-if="detail.status == -1 && detail.reason">
						<text class="label">拒绝理由</text>
						<text class="value">{{ detail.reason }}</text>
					</view>
					<view class="line-wrap" v-if="detail.status == 1 || detail.status == 2">
						<text class="label">转账方式</text>
						<text class="value">{{ detail.type_data.label }}</text>
					</view>
					<view class="line-wrap" v-if="detail.status == 1 || detail.status == 2">
						<text class="label">转账时间</text>
						<text class="value">{{ detail.go_time }}</text>
					</view>
				</view>
			</view>
			<!-- 全屏加载 -->
			
		</template>
	</gui-page>
</template>

<script>
	export default {
		data() {
			return {
				detail: {
					cid:0
				}
			};
		},
		onLoad(options) {
			if(options.cid){
				this.$request('moneyCashDetail', {cid: options.cid},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.detail){
						this.detail = res.data.data.detail;
					}
				})
			}
		},
		onShow() {
			
		},
		methods: {
			
		}
	};
</script>

<style lang="scss">
	.view-box{
		background-color: #FFFFFF;
	}
	.money-wrap {
		text-align: center;
		font-size: 24px;
		font-weight: bold;
		border-bottom: 1px solid $color-line;
		padding: 40rpx;
	}

	.item {
		margin: 40rpx;

		.line-wrap {
			margin-bottom: 20rpx;
			padding: 2px;
			.label {
				display: inline-block;
				width: 200rpx;
				color: $color-tip;
				font-size: $font-size-base;
			}

			.value {
				display: inline-block;
				font-size: $font-size-base;
			}
		}
	}
</style>
