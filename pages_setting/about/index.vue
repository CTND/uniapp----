<template>
	<gui-page>
		<template v-slot:gBody>
			<view class="vue-box">
				<view class="logo-box">
					<image :src="System.logo"></image>
				</view>
				<view class="vision-box">
					版本号 {{$store.state.systemInfo.appVersion || 1.0}}
				</view>
			</view>
			<view class="cell-item" @click="navTo('/pages_public/agree/index?type=1')">
				<view class="title">服务协议</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<sd-icon name="icon-iconfonticonfonti2copycopy" size="16" color="#909399"></sd-icon>
				</view>
			</view>
			<view class="cell-item" @click="navTo('/pages_public/agree/index?type=3')">
				<view class="title">平台简介</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<sd-icon name="icon-iconfonticonfonti2copycopy" size="16" color="#909399"></sd-icon>
				</view>
			</view>
			<view class="copy-box">
				{{System.copytitle || ''}}
			</view>
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				
			}
		},
		onLoad: function() {
			
		},
		onShow() {
			
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.vue-box{
		background-color: #ffffff;
		padding: 50px;
		.logo-box{
			width: 70px;
			height: 70px;
			border-radius: 5px;
			overflow: hidden;
			margin: auto;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.vision-box{
			padding-top: 5px;
			text-align: center;
			font-size: 15px;
			color: #909399;
		}
	}
	.cell-item {
		display: flex;
		padding: 0 20px;
		border-top: 1px solid #f0f0f0;
		background-color: #ffffff;
		height: 52px;
		line-height: 52px;
		box-sizing: border-box;
		
		.title{
			font-size: 17px;
			color: #303133;
		}
		.content{
			flex: 1;
			font-size: 15px;
			text-align: right;
			color: #909399;
			padding-right: 5px;
		}
		.cell-icon-box{
			padding-top: 16px;
		}
	}
	
	.copy-box{
		position: fixed;
		bottom: 50px;
		width: 100%;
		font-size: 12px;
		color: #adadad;
		text-align: center;
	}
</style>