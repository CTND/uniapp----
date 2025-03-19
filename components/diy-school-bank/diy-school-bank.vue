<template>
	<view v-if="list.length" class="options-box">
		
		<view class="list-item gui-border-b" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
			<view class="list-image-box" v-if="item.bank_image">
				<image :src="item.bank_image" mode="widthFix"></image>
			</view>
			<view class="list-content">
				<view class="content-title">
					{{item.bank_title}}
					<text class="title-tag"> 随机</text>
				</view>
				<view class="content-footer">
					<view class="gui-text gui-text" style="color: #c0c4cc;">{{item.count_user || 0}} 人学习</view>
				</view>
			</view>
			<view class="cell-icon-box" style="padding-top: 35px;">
				<sd-icon name="icon-jiantou1" size="18" color="#cccccc"></sd-icon>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		name:"diy-school-bank",
		props:{
			modelData:{
				type:[Object],
				default:{
					data:{
						list:[]
					},
					options:{}
				}
			}
		},
		data() {
			return {
				list:[],
			};
		},
		created() {
			this.getList();
		},
		methods:{
			getList(){
				this.$request('schoolBankList', {
					pageNo: 1,
					pageSize: 10,
					keyword: '',
				},{
					showLoading: false,
				}).then((res)=>{
					//console.log('diy-题库列表', res)
					if(res.data.data.list.length){
						this.list = res.data.data.list;
					}
				})
			},
			toDetail(item){
				this.navTo('/pages_school/answer/detail', {login:true}, {bank_id:item.bank_id})
			},
		}
	}
</script>

<style scoped lang="scss">
	.options-box{
		margin: auto;
		overflow: hidden;
	}
	
	.list-item{
		display: flex;
		padding: 20rpx;
		background-color: #ffffff;
		border-radius: 10px;
		margin-bottom: 10px;
		height: 110px;
		overflow: hidden;
		.list-image-box{
			width: 120px;
			height: 100px;
			border-radius: 5px;
			overflow: hidden;
			image{
				width: 100%;
			}
		}
		.list-content{
			flex: 1;
			padding: 10rpx 20rpx;
			.content-title{
				line-height: 1.5;
				font-size: 17px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				.title-tag{
					background-color: #ecf5ff; 
					color: #3c9cff;
					font-size: 13px;
					padding: 3px 5px;
					border-radius: 2px;
					display: inline-block;
				}
			}
			.content-footer{
				padding: 10rpx 6rpx;
				display: flex;
				justify-content: space-between;
			}
		}
	}
	.popup-box{
		background-color: #ffffff;
		height: 80vh;
		border-top-left-radius: 20upx;
		border-top-right-radius: 20upx;
		padding: 20upx;
		position: relative;
		.big-button{
			position: absolute;
			bottom: 30px;
			left: 5%;
		}
		.popup-top{
			position: relative;
			text-align: center;
			font-size: 32upx;
			font-weight: bold;
			border-bottom: 2upx solid #f8f8f8;
			padding-bottom: 30upx;
			padding-top: 10px;
		}
		.popup-item{
			padding: 15px;
			display: flex;
			border-bottom: 1px solid #f0f0f0;
			.popup-item-title{
				font-size: 16px;
				color: #606266;
				line-height: 30px;
			}
			.popup-item-text{
				font-size: 16px;
				white-space:nowrap;
				overflow: hidden;
				text-overflow:ellipsis;
				line-height: 30px;
				.product-price{
					font-size: 16px;
					font-weight: bold;
					color: orangered;
				}
			}
		}
		
	}
</style>