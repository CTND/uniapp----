<template>
	
	<view  :style="[$util.getModelStyle(modelData.options),]">
		<view :style="[{
			padding: modelData.options.blockPadding,
			background: modelData.options.grad == '0' ? modelData.options.background : '',
			backgroundImage:modelData.options.grad == '1'? 'url(' + modelData.options.backgroundImg + ')' : '',
			borderRadius: modelData.options.borderRadius + 'px',
			overflow:modelData.options.roll == 'none' ? '' : 'hidden',
		}]"
		style="background-size: 100% 100%; background-repeat: no-repeat;"
		>
			<view
				v-if="modelData.options.blockTitle"
				:style="{
				  fontSize: modelData.options.blockTitleSize + 'px',
				  color: modelData.options.blockTitleColor,
				}"
				style="font-weight: bold; line-height: 35px"
				@click="getElInfo()"
			  >
				{{ modelData.options.blockTitle }}
			</view>
			<block v-if="modelData.options.roll == 'none'">
				<block v-if="modelData.options.wrap == '0'">
					<up-scroll-list  :indicator="false">
						<view class="good-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)"
						style="margin-right: 20rpx;"
						>
							<view class="cover-box">
								<image :src="item.cover_img" mode="widthFix"></image>
							</view>
							<view class="info-box">
								<view class="gui-product-lines">
									<view class="gui-product-name gui-primary-text">{{item.goods_name}}</view>
								</view>
								<view class="info-content">
									<view class="gui-product-lines gui-flex gui-row gui-nowrap gui-align-items-center gui-space-between">
										<view class="gui-product-lines gui-flex gui-row gui-nowrap gui-align-items-center">
											<view class="gui-block gui-text-small" style="color: #f61652;">￥</view>
											<view class="gui-h6 gui-block" style="color: #f61652;font-weight: bold;">{{item.price}}</view>
										</view>
										<view class="micon icon-jiarugouwuche" style="color: #d81e06;font-size: 22px;"></view>
									</view>
								</view>
								
							</view>
						</view>
					</up-scroll-list>
				</block>
				<block v-else>
					<view class="good-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)"
					style="margin-right: 20rpx;width: calc( (100% - 60rpx) / 3);min-width:calc( (100% - 60rpx) / 3);padding: 12rpx;"
					>
						<view class="cover-box" style="height: 180rpx;">
							<image :src="item.cover_img" mode="widthFix"></image>
						</view>
						<view class="info-box">
							<view class="gui-product-lines">
								<view class="gui-product-name gui-primary-text">{{item.goods_name}}</view>
							</view>
							<view class="info-content">
								<view class="gui-product-lines gui-flex gui-row gui-nowrap gui-align-items-center gui-space-between">
									<view class="gui-product-lines gui-flex gui-row gui-nowrap gui-align-items-center">
										<view class="gui-color-red gui-block gui-text-small">￥</view>
										<view class="gui-h6 gui-block gui-color-red">{{item.price}}</view>
									</view>
									<view class="micon icon-jiarugouwuche" style="color: #d81e06;font-size: 22px;"></view>
								</view>
							</view>
							
						</view>
					</view>
				</block>
			</block>
			
			
			<gui-touch v-else @thStart="thStart" @thMove="thMove" @thEnd="thEnd">
				<view class="gui-flex gui-rows gui-nowrap" 
				:style="{
					width:wrapWidth+'px',
					transform:'translateX('+scLeft+'px)',
				}">
					
					<view class="gui-scrollitems gui-img-in" hover-class="gui-tap" 
					:style="{
						width:itemWidth+'rpx', 
						height:itemHeight+'rpx', 
						marginRight:itemMargin+'rpx',
					}" 
					v-for="(item, idx) in itemsIn" :key="idx" @click="toDetail(item)">
						<view class="good-item" >
							<view class="cover-box">
								<image :src="item.cover_img" mode="widthFix"></image>
							</view>
							<view class="info-box">
								<view class="gui-product-lines">
									<view class="gui-product-name gui-primary-text">{{item.goods_name}}</view>
								</view>
								<view class="info-content">
									<view class="gui-product-lines gui-flex gui-row gui-nowrap gui-align-items-center gui-space-between">
										<view class="gui-product-lines gui-flex gui-row gui-nowrap gui-align-items-center">
											<view class="gui-block gui-text-small" style="color: #f61652;">￥</view>
											<view class="gui-h6 gui-block" style="font-weight: bold;" 
											:style="{color:setting.default_color}">{{item.price}}</view>
											<!-- <view class="gui-text-small gui-block gui-color-gray gui-line-through" v-if="item.market_price>0">{{item.market_price}}</view> -->
										</view>
										<view class="micon icon-jiarugouwuche" style="font-size: 22px;" :style="{color:setting.default_color}"></view>
									</view>
								</view>
								
							</view>
						</view>
					</view>
				</view>
			</gui-touch>
			
		</view>
		
	</view>
</template>

<script>
	export default {
		name:"diy-scroll-block",
		props:{
			modelData:{
				type:[Object],
				default:{
					data: {
						source_ref: 'goods', //数据类型
						ids: [],
					},
					options:{
						roll: 'none'
					}
				}
			}
		},
		data() {
			return {
				list: [],//数据列
				width         : 690,
				itemWidth     : 220,
				itemHeight    : 320,
				itemMargin    : 20,
				items         : [],
				duration      : 25,
				
				scLeft        : 0,
				resetWidth    : 0,
				itemsIn       : [],
				timer         : null,
				timer2        : null,
				speed         : 1,
				timer3        : null,
				wrapWidth     : 5000,
				oX            : 0,
				
				//参数
				setting:{
					default_color: '#f61652',
				},
			};
		},
		created() {
			if(this.modelData.data.source_ref == 'goods'){
				this.getDiyData();
				this.getSetting();
			}
		},
		methods:{
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
			//获取商品数据
			getDiyData(){
				this.$request('getDiyShopGoods', this.modelData,{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.list){
						this.list = res.data.data.list;
						this.items = res.data.data.list;
						this.init();
					}
				})
			},
			toDetail(item){
				this.navTo('/pages_shop/goods/detail', {login: false}, {goods_id: item.goods_id});
			},
			
			init(){
				var len          = this.items.length;
				this.itemsIn     = this.items;
				this.resetWidth  = len * (this.itemWidth + this.itemMargin);
				this.resetWidth  = uni.upx2px(this.resetWidth);
				this.resetWidth *= -1;
				this.itemsIn     = this.itemsIn.concat(this.items);
				this.wrapWidth   = len * (this.itemWidth + this.itemMargin) * 2 + 80;
				this.scrollAnimate();
			},
			scrollAnimate : function () {
				//return;
				if(this.scLeft <= this.resetWidth){
					this.scLeft = 0;
					this.timer = setTimeout(()=>{this.scrollAnimate()}, this.duration+200);
				}else{
					this.scLeft -= this.speed
					this.timer   = setTimeout(()=>{this.scrollAnimate()}, this.duration);
				}
			},
			thStart : function(e){
				clearTimeout(this.timer);
				this.timer = null;
				this.oX    = this.scLeft;
			},
			thMove : function (e){
				clearTimeout(this.timer);
				var tmpleft   = this.oX + e[0][0];
				if(tmpleft < this.resetWidth){ tmpleft = this.resetWidth;}
				if(tmpleft > 0){tmpleft = 0}
				this.scLeft   = tmpleft;
			},
			thEnd : function(e){
				this.timer = null
				if(this.timer3 != null){clearTimeout(this.timer3);}
				this.timer3 = setTimeout(()=>{
					this.scrollAnimate();
				}, 500);
			},
			tapme : function(idx){
				this.$emit('itemTap', this.itemsIn[idx]);
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.gui-product-name{
		font-size:28rpx; 
		line-height:32rpx;
		white-space:nowrap;
		overflow: hidden;
		text-overflow:ellipsis;
	}
	.gui-line-through{
		padding-left: 5px;
	}
	.color-base-bg{
		background-color: red;
	}
	//双列
	.good-item{
		width: 220rpx;
		min-width: 220rpx;
		overflow: hidden;
		background-color: #ffffff;
		border-radius: 10rpx;
		display: inline-block;
		padding: 16rpx 16rpx 10rpx 16rpx;
		
		.cover-box{
			overflow: hidden;
			width: 100%;
			height: 100%;
			height: 188rpx;
			position: relative;
			border-radius: 5px;
			// background-color: red;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.info-box{
			//padding: 0px 5px 0px 5px;
			.gui-product-name{
				padding: 5px 2px;
			}
			.info-content{
				display: block;
				.but-box{
					padding-top: 2px;
				}
			}
			
		}
	}
	
	.gui-scrollitems{overflow:hidden; position:relative;}
	.gui-scrollitems-title{
		position:absolute; 
		width: 100%;
		z-index:1; 
		left:0; 
		bottom:0; 
		height:50rpx; 
		line-height:50rpx; 
		padding:0 15rpx; 
		font-size:28rpx; 
		color:#FFFFFF;
		white-space:nowrap;
		overflow: hidden;
		text-overflow:ellipsis;
	}
</style>