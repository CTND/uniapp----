<template>
	<gui-page>
		<template v-slot:gBody>
			<view class="vue-box">
				<view class="cell-item" @click="$util.callPhone(System.kefu_phone)">
					<view class="content">
						<view class="title">联系平台客服</view>
					</view>
					<view class="cell-icon-box">
						<sd-icon name="icon-jiantou1" size="16" color="#909399"></sd-icon>
					</view>
				</view>
				
				<view class="cell-item" @click="navTo('/pages_setting/feedback/feedback', {login:true})">
					<view class="content">
						<view class="title">产品建议</view>
						<view class="gui-text" style="padding-top: 5px;">
							向开发者反馈产品服务及相关优化建议
						</view>
					</view>
					<view class="cell-icon-box" style="padding-top: 8px;">
						<sd-icon name="icon-jiantou1" size="16" top="3" color="#909399"></sd-icon>
					</view>
				</view>
				
				
				
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
			this.isLogin();
			
		},
		computed: {
			
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.none-border{
		border: none!important;
	}
	.vue-box{
		padding: 10px 0;
		.none-border{
			border: none!important;
		}
		.group-box{
			background-color: #ffffff;
			padding: 0px 10px;
			margin-bottom: 12px;
			border-radius: 10px;
			overflow: hidden;
		}
		.cell-item {
			display: flex;
			padding: 16px 15px 15px 15px;
			background-color: #ffffff;
			border-radius: 10px;
			margin: 10px;
			.content{
				flex: 1;
				font-size: 15px;
				color: #909399;
				padding-right: 5px;
				.title{
					color: #303133;
					font-size: 16px;
					font-weight: bold;
				}
			}
			.cell-icon-box{
				
			}
		}
	}
	
	
</style>