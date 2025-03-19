<template>
	<gui-page 
		ref="guipage"
		
		:customFooter="true"
		:showFooterBar="false"
		:customStyle="{
			backgroundColor:System.full_bg_color,
			height:'100vh',
			paddingTop:'20px'
		}"
	>
		<template v-slot:gBody>
			<template v-if="info.id">
				<view style="font-size: 18px;font-weight: bold;color: #303133;padding: 5px 15px;margin-bottom: 0px;">位置信息</view>
				<view class="info-box" style="padding-top: 0px;padding-bottom: 10px;">
					<view class="data-item">
						<view class="data-label">店铺地址</view>
						<view class="data-content" style="font-size: 16px;">
							<text>{{info.cityname}} {{info.area_data.name || ''}} {{info.area_data.street_name ||''}}</text>
						</view>
					</view>
				</view>
				
				<view style="font-size: 18px;font-weight: bold;color: #303133;padding: 5px 15px;margin-bottom: 0px;">经营状态</view>
				<view class="info-box" style="padding-top: 0px;padding-bottom: 10px;">
					<view class="data-item">
						<view class="data-label">当前行业</view>
						<view class="data-content" style="font-size: 16px;">
							<text>{{info.type_data.title}}</text>
						</view>
					</view>
					
					<view class="data-item">
						<view class="data-label">适合经营</view>
						<view class="data-content" style="font-size: 16px;">
							<text class="tag" v-for="(tag, i) in info.suit_list" :key="i">
								{{tag.title}}、
							</text>
						</view>
					</view>
					
				</view>
				
				
				<view style="font-size: 18px;font-weight: bold;color: #303133;padding: 5px 15px;margin-bottom: 0px;">租约相关</view>
				<view class="info-box" style="padding-top: 0px;padding-bottom: 10px;">
					<view class="data-item" v-if="info.nature == 1">
						<view class="data-label">店铺租金</view>
						<view class="data-content red-color">
							<text>{{info.show_mianyi == 0 ? info.rent_money+'元/月':'面议'}}</text>
						</view>
					</view>
					
					<view class="data-item">
						<view class="data-label">{{info.nature == 1 ? '转 让 费': '出售价格'}}</view>
						<view class="data-content red-color">
							<text>{{info.show_mianyi == 0 ? info.transfer_fee+'万' : '面议'}}</text>
						</view>
					</view>
				</view>
				
				<view style="font-size: 18px;font-weight: bold;color: #303133;padding: 5px 15px;margin-bottom: 0px;">转让相关</view>
				<view class="info-box" style="padding-top: 0px;padding-bottom: 10px;">
					<view class="data-item">
						<view class="data-label">转让类型</view>
						<view class="data-content red-color">
							<text>{{info.nature == 1 ? '转让/转租/出租' : '出售'}}</text>
						</view>
					</view>
				</view>
				
				
			</template>
			<!--加载中-->
			 
			<!-- 全屏加载 -->
			
		</template>
		
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				id: 0,
				info:{
					id:0,
					banner_imgs:[],
					item_list:[]
				}
			}
		},
		onLoad: function(options) {
			if(options.id){
				this.id = options.id;
				this.getInfo();
			}
		},
		onShow() {
			
		},
		methods:{
			getInfo(){
				this.$request('transShopInfoDetail', {id: this.id},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.info){
						this.info = res.data.data.info;
					}
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.hotTxt{
		font-size: 16px;
		position: relative; 
	}
	.hot-txt{
		position: relative;
		top: -3px; 
		font-size: 10px;
	}
	.red-color{
		color: #e45656;
		font-weight: bold;
	}
	.icon-xuanzhong3{
		font-size: 18px;
		color: #19be6b;
	}
	.footer-box{
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		.footer-block{
			text-align: center;
			padding: 5px 10px;
			font-size: 16px;
			color: #303133;
			width: 50%;
			height: 45px;
			.micon{
				font-size: 18px;
			}
		}
	}
	.info-box{
		background-color: #ffffff;
		padding: 10px 15px;
		margin-bottom: 10px;
		.title-box{
			display: flex;
			.title{
				flex: 1;
				font-size: 20px;
				color: #303133;
				line-height: 1.5;
			}
			.share-box{
				padding: 10px;
			}
		}
		.tag-box{
			padding-top: 5px;
			.tag-flex{
				display: flex;
				flex-wrap: wrap;
				.tag{
					padding: 3px 5px;
					border-radius: 2px;
					font-size: 13px;
					color: #606266;
					background-color: #f0f0f0;
					margin-right: 5px;
					margin-bottom: 5px;
				}
			}
		}
		.count-box{
			font-size: 14px;
			color: #909399;
			padding-top: 5px;
		}
		.data-item{
			display: flex;
			padding: 15px 0 5px 0;
			line-height:30px;
			.data-label{
				width: 80px;
				font-size: 16px;
				color: #606266;
			}
			.data-content{
				flex: 1;
				font-size: 16px;
			}
			.micon-box{
				width: 25px;
				height: 25px;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>