<template>
	<view class="vue-box">
		
		<view class="group-box">
			<view class="cell-item">
				<view class="title">姓名</view>
				<view class="content">
					{{userInfo.realname || '待完善'}}
				</view>
			</view>
			
			<view class="cell-item">
				<view class="title">性别</view>
				<view class="content">
					{{userInfo.sex == 1 ? '男' : userInfo.sex == 2 ? '女' : '未知'}}
				</view>
			</view>
			<view class="cell-item none-border">
				<view class="title">国家/地区</view>
				<view class="content">
					中国大陆
				</view>
			</view>
		</view>
		
		<view class="group-box">
			<view class="cell-item">
				<view class="title">证件类型</view>
				<view class="content">
					居民身份证
				</view>
			</view>
			
			<view class="cell-item">
				<view class="title">证件号码</view>
				<view class="content">
					{{userInfo.idcard || '未认证'}}
				</view>
			</view>
			<view class="cell-item none-border">
				<view class="title">认证类型</view>
				<view class="content">
					{{userInfo.idcard ? '身份证实名认证' : '未认证'}}
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
			this.$store.dispatch('getUserInfo', (res)=>{
				if(Object.keys(res).length){
					this.userInfo = res;
				}
			})
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
				padding: 15px 5px;
				border-bottom: 1px solid #f0f0f0;
				.title{
					color: #303133;
					font-size: 16px;
				}
				.content{
					flex: 1;
					font-size: 15px;
					text-align: right;
					color: #909399;
					padding-right: 5px;
				}
				.cell-icon-box{
					
				}
			}
		}
	}
	
</style>