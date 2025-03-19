<template>
	<gui-page  
	
	:refresh="true"
	:loadmore="true"
	:isSwitchPage="false"
	:customHeader="false" 
	:customFooter="custom_Footer"
	@reload="queryData"
	@loadmorefun="fetchData"
	:apiLoadingStatus="apiLoadingStatus" 
	:customStyle="{
		backgroundColor:System.full_bg_color,
	}"
	ref="guipage"
		>
		<template v-slot:gBody>
			<view class="list-body">
				<view class="info-box box-shadow" v-for="(info, index) in list" :key="index"
				@click="navTo('/pages_transfershop/info/detail', {login: false}, {id: info.id})"
				>
					<view style="font-size: 15px;color: #606266;padding:10px;">
						<text style="padding-right: 2px;">NO:</text><text>{{info.order_no}}</text>
					</view>
					<view class="cover-box">
						<image :src="info.cover_img" mode="widthFix"></image>
					</view>
					<view class="title-box border-b">
						<view class="title text-overflow-noreap">
							{{info.title}}
						</view>
						<view class="tag-box" :style="{backgroundColor:info.tag_data.tag_color}">
							{{info.tag_data.name}}
						</view>
					</view>
					<view style="padding: 0 10px;">
						<view class="data-item">
							<view class="data-label">店铺面积：</view>
							<view class="data-content red-color">
								<text>{{info.extent}}</text>
								<text class="hotTxt">
									m<text class="hot-txt">2</text>
								</text>
							</view>
						</view>
						
						<view class="data-item" v-if="info.nature == 1">
							<view class="data-label">店铺租金：</view>
							<view class="data-content red-color">
								<text>{{info.show_mianyi == 0 ? info.rent_money+'元/月':'面议'}}</text>
							</view>
						</view>
						
						<view class="data-item">
							<view class="data-label">{{info.nature == 1 ? '转\&nbsp;\&nbsp;让\&nbsp;\&nbsp;费：': '出售价格：'}}</view>
							<view class="data-content red-color">
								<text>{{info.show_mianyi == 0 ? info.transfer_fee+'万' : '面议'}}</text>
							</view>
						</view>
						
						<view class="data-item">
							<view class="data-label">店铺地址：</view>
							<view class="data-content" style="font-size: 15px;">
								<text>{{info.cityname}} {{info.area_data.name || ''}} {{info.area_data.street_name ||''}}</text>
							</view>
						</view>
					</view>
					<view class="action-box">
						<view class="action-flex">
							<view style="flex: 1;">
								<u-parse :content="info.parse"></u-parse>
							</view>
							<view class="action-text-but" @click="cancelCollect(info.id)">
								取消收藏
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" 
			text="暂无数据" 
			marginTop="20vh"
			textColor="#c0c4cc"
			></u-empty>
			<!-- 全屏加载 -->
			
			
			<!--加载中-->
			 
			
			
		</template>
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
			list:[],
			//列表渲染数据
			totalCount:0,//总数据量
			apiLoadingStatus:false,
			queryForm:{
				pageNo: 1,
				pageSize: 10,
				keyword: '',
			}
		}
	},
	
	onLoad: function() {
		this.queryData()
	},
	onShow() {
		
	},
	methods: {
		//订单操作
		cancelCollect(order_id){
			const t = this;
			this.showModalEvent({
				title:'提示',//提示标题
				content: '确认要取消收藏吗？',
				showCancel:true,
				cancelText: '取消',
				confirmText: '确认',
			}, {id:order_id}) 
		},
		//弹窗返回
		modalEventBack(options, v){
			if(v == 1){
				this.$request('transShopInfoCollect', {id: options.id},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.code == 200){
						this.msg(res.data.msg)
					}
					this.queryData();
				})
			}
		},
		queryData() {
			this.queryForm.pageNo = 1;
			this.totalCount = 0;
			this.fetchData();
		},
		fetchData() {
			this.apiLoadingStatus = true;
			const post_data = JSON.parse(JSON.stringify(this.queryForm));
			this.$request('transShopCollectList', post_data,{
				showLoading: false,
			}).then((res)=>{
				console.log('数据列表', res)
				if(this.queryForm.pageNo == 1) {
					this.list = [];
				}
				if(res.data.data.list.length){
					let list = res.data.data.list;
					this.list = this.list.concat(list); //追加新数据
				}
				this.dataListEvent(res.data.data);
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
	.list-body{
		padding: 10px;
		.info-box{
			background-color: #ffffff;
			// padding: 10px 15px;
			margin-bottom: 15px;
			border-radius: 5px;
			overflow: hidden;
			.cover-box{
				height: 240px;
				overflow: hidden;
				image{
					width: 100%;
				}
			}
			.title-box{
				padding: 10px 10px;
				position: relative;
				.title{
					font-size: 17px;
					color: #303133;
					font-weight: bold;
					line-height: 1.5;
					padding-right: 60px;
				}
				.tag-box{
					position: absolute;
					right: 0;
					top: 0;
					font-size: 14px;
					color: #ffffff;
					height: 28px;
					line-height: 28px;
					padding: 0 5px;
				}
			}
			
			.count-box{
				font-size: 14px;
				color: #909399;
				padding-top: 10px;
				display: flex;
				justify-content: space-between;
			}
			.data-item{
				display: flex;
				padding-top: 5px;
				line-height:30px;
				font-size: 16px;
				.data-label{
					width: 80px;
					color: #606266;
				}
				.data-content{
					flex: 1;
				}
				.micon-box{
					width: 30px;
					height: 30px;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.action-box{
				padding-top: 6px;
				.action-flex{
					border-top: 1px solid #f0f0f0;
					display: flex;
					justify-content: flex-end;
					padding-top: 5px;
					.action-text-but{
						padding: 5px 6px 12px 8px;
						font-size: 14px;
						color: #606266;
					}
				}
			}
		}
	}
</style>