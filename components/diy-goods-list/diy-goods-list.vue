<template>
	<!--商品列表-->
	<!-- {{modelData.data.layout}} -->
	<view v-if="list.length" class="goods-body" :style="[$util.getModelStyle(modelData.options)]"
	:class="[modelData.data.layout]"
	>
		<view class="good-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
			<view class="cover-box">
				<image :src="item.cover_img" mode="widthFix"></image>
				<view class="color-base-bg goods-tag" v-if="modelData.data.tag == '1'">{{ modelData.data.tagText }}</view>
				<view class="goods-tag-img" v-if="modelData.data.tag == '3'">
					<image :src="$util.img(modelData.data.tagsrc)" mode=""></image>
				</view>
			</view>
			<view class="info-box">
				<view class="gui-product-lines" style="padding: 16rpx 0;">
					<view class="gui-product-name gui-primary-text" >
						{{item.goods_name}}
					</view>
				</view>
				<!-- <view class="demo-tag">
					<view class="demo-tag-owner">
						自营
					</view>
					<view class="demo-tag-text">
						放心购
					</view>
				</view> -->
				<view v-if="modelData.options.ShowSale =='1' || modelData.options.ShowPlugin =='1'"
				class="gui-text-small gui-color-gray" 
				style="padding-bottom: 10rpx;display: flex;">
					<view v-if="modelData.options.ShowSale =='1'">已售{{item.sale_num || 0}}{{item.unit}}</view>
					<view style="padding-left: 20rpx;" v-if="modelData.options.ShowPlugin =='1'">{{item.plugin_rate || 0}}%好评</view>
				</view>
				<view class="info-content">
					<view class="gui-product-lines gui-flex gui-row gui-nowrap gui-align-items-center gui-space-between"
					:style="{paddingTop:modelData.data.layout=='row'? '10px' : ''}"
					>
						<view class="gui-product-lines gui-flex gui-row gui-nowrap gui-align-items-center" :style="{color:setting.default_color}">
							<view class="gui-block gui-text-small">￥</view>
							<view class="gui-h5 gui-block" style="font-weight: bold;">{{item.price}}</view>
							<view class="gui-text-small gui-block gui-color-gray gui-line-through" v-if="item.market_price>0">￥{{item.market_price}}</view>
						</view>
						
						<view v-if="modelData.data.layout=='column' && modelData.options.ShowButton == '0'" 
						class="gui-text-small gui-block gui-color-gray" style="padding-right: 5px;">
							<!--{{item.sale_num}}人购买-->
							<view class="buy-new-box micon icon-jiarugouwuche"></view>
						</view>
						<view v-if="modelData.data.layout=='row' && modelData.options.ShowButton == '0'"
						class="gui-text-small gui-block gui-color-gray" style="padding-right: 5px;">
							<view class="buy-new-box micon icon-jiarugouwuche"></view>
						</view>
					</view>
					<view class="but-box" v-if="modelData.options.ShowButton == '1'">
						<view>
							<!-- <view v-if="modelData.data.layout=='row'" class="gui-text-small gui-block gui-color-gray" style="padding-right: 5px;text-align: center;">
								{{item.sale_num}}人购买
							</view> -->
							<u-button
							:text="modelData.options.buttonText" 
							:customStyle="{
								height:'30px',
								backgroundColor:System.big_but_color,
								color:'#ffffff',
								margin:'auto',
								borderRadius: modelData.options.buttonRadius+'px'
							}"
							></u-button>
						</view>
					</view>
				</view>
				
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	name: 'diy-goods-list',
	props: {
		modelData:{
			type:[Object],
			default:{
				name:'',
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
			//参数
			setting:{
				default_color: '#f61652',
			},
		};
	},
	
	created() {
		this.getDiyData();
		this.getSetting();
	},
	methods: {
		//获取商品数据
		getDiyData(){
			this.$request('getDiyShopGoods', this.modelData,{
				showLoading: false,
			}).then((res)=>{
				console.log('DIY获取商品数据', res)
				if(res.data.data.list){
					this.list = res.data.data.list;
				}
			})
		},
		toDetail(item){
			this.navTo('/pages_shop/goods/detail', {login: true}, {goods_id: item.goods_id});
		},
		//获取参数
		getSetting(){
			this.$request('getShopSetting', {},{
				showLoading: false,
				cache: 10*60
			}).then((res)=>{
				if(res.data.data.setting){
					this.setting = res.data.data.setting;
				}
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	.demo-tag {
		display: flex;
		margin-top: 5px;
		margin-bottom: 10rpx;
	}
	
	.demo-tag-owner {
		background-color: red;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 4rpx 14rpx;
		border-radius: 50rpx;
		font-size: 20rpx;
		line-height: 1;
	}
	
	.demo-tag-text {
		border: 1px solid #f0f0f0;
		color: #606266;
		margin-left: 10rpx;
		border-radius: 50rpx;
		line-height: 1;
		padding: 4rpx 14rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		font-size: 20rpx;
		line-height: 1;
	}
	.buy-new-box{
		width: 40rpx;
		height: 40rpx;
		border-radius: 50rpx;
		line-height: 40rpx;
		text-align: center;
		color: rgb(255, 73, 0);
		//background: linear-gradient(90deg, rgb(255, 119, 0), rgb(255, 73, 0));
		font-size: 24px;
	}
	.gui-product-name{font-size:28rpx; line-height:32rpx;}
	.gui-line-through{
		padding-left: 5px;
	}
	.color-base-bg{
		background-color: red;
	}
	.goods-tag {
		color: #ffffff;
		line-height: 1;
		padding: 8rpx 12rpx;
		position: absolute;
		border-top-left-radius: 10rpx;
		border-bottom-right-radius: 10rpx;
		top: 0;
		left: 0;
		font-size: 22rpx;
	}
	
	.goods-tag-img {
		position: absolute;
		border-top-left-radius: 10rpx;
		width: 80rpx;
		height: 80rpx;
		top: 0;
		left: 0;
		z-index: 5;
		overflow: hidden;
	
		image {
			width: 100%;
			height: 100%;
		}
	}
	//双列
	.goods-body.column{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.good-item{
			width: calc( (100% - 6px) / 2 );
			overflow: hidden;
			background-color: #ffffff;
			border-radius: 2px;
			//margin-left: 5px;
			margin-bottom: 10px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.cover-box{
				overflow: hidden;
				// height: 160px;
				position: relative;
				// padding: 10rpx;
				padding-bottom: 0;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.info-box{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 0px 5px 8px 5px;
				.gui-product-lines{
					flex: 1;
					.gui-product-name{
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						min-width: 0;
						font-size:28rpx; 
						line-height:36rpx;
						//background-color: red;
					}
				}
				
				.info-content{
					display: block;
					
					.but-box{
						padding-top: 2px;
					}
				}
				
			}
		}
	}
	
	//横向
	.goods-body.row{
		display: block;
		.good-item{
			overflow: hidden;
			background-color: #ffffff;
			border-radius: 10rpx;
			margin-left: 5px;
			margin-bottom: 8px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 16rpx;
			.cover-box{
				overflow: hidden;
				width: 100px;
				height: 100px;
				// padding: 10rpx;
				position: relative;
				border-radius: 5px;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.info-box{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 2px 5px 8px 5px;
				.gui-product-lines{
					flex: 1;
					.gui-product-name{
						padding: 2px;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						min-width: 0;
						font-size:28rpx; 
						line-height:40rpx;
					}
				}
				.info-content{
					display: flex;
					min-width: 0;
					.gui-product-lines{
						flex: 1;
					}
					.but-box{
						padding: 0 5px 0 10px;
						width: 90px;
					}
				}
				
			}
		}
	}
	
</style>
