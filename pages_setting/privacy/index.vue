<template>
	<view class="vue-box">
		<view class="group-box">
			<view class="cell-item" @click="navTo('/pages_setting/privacy/desc?ref=device', {login:true})">
				<view class="title">设备信息收集说明</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<sd-icon name="icon-jiantou1" size="18" color="#cccccc"></sd-icon>
				</view>
			</view>
			<view class="cell-item" @click="navTo('/pages_setting/privacy/desc?ref=place', {login:true})">
				<view class="title">身份信息收集说明</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<sd-icon name="icon-jiantou1" size="18" color="#cccccc"></sd-icon>
				</view>
			</view>
			<view class="cell-item" @click="navTo('/pages_setting/privacy/desc?ref=location', {login:true})">
				<view class="title">位置信息收集说明</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<sd-icon name="icon-jiantou1" size="18" color="#cccccc"></sd-icon>
				</view>
			</view>
			<view v-if="System.cheat == 2" class="cell-item none-border" @click="navTo('/pages_setting/privacy/desc?ref=face', {login:true})">
				<view class="title">刷脸信息收集说明</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<sd-icon name="icon-jiantou1" size="18" color="#cccccc"></sd-icon>
				</view>
			</view>
		</view>
		
		<view class="group-box">
			<view class="cell-item none-border" @click="navTo('/pages_setting/privacy/privacy', {login:false})">
				<view class="title">隐私政策</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<sd-icon name="icon-jiantou1" size="18" color="#cccccc"></sd-icon>
				</view>
			</view>
		</view>
		
	</view>
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
			this.isLogin();
			
		},
		methods:{
			
			
		}
	}
</script>

<style lang="scss" scoped>
	.vue-box{
		padding: 10px;
		.none-border{
			border: none!important;
		}
		.group-box{
			background-color: #ffffff;
			padding: 0px 10px;
			margin-bottom: 12px;
			border-radius: 5px;
			overflow: hidden;
			.cell-item {
				display: flex;
				padding: 0 5px;
				border-bottom: 1px solid #f0f0f0;
				box-sizing: border-box;
				height: 55px;
				line-height: 55px;
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
					padding-top: 17px;
				}
			}
			
		}
	}
	
	.action-box{
		background-color: #ffffff;
		border-radius: 5px;
		text-align: center;
		padding: 15px;
		font-size: 16px;
		margin-top: 20px;
	}
	
</style>