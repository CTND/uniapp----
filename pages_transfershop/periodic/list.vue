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
	:customHeaderStyle="{height:'80px'}"
	@popup-callback="popupCallback"
	ref="guipage"
		>
		
		<template v-slot:gBody>
			
			<view class="list-body">
				<view class="list-item" v-for="(item, index) in list" :key="index"
				>
					<view class="list-content">
						<view class="list-title text-overflow">
							{{item.cityname}} {{item.area_data.name}} {{item.area_data.street_name||''}} 
						</view>
						<view class="list-desc-box" v-for="(li, lndex) in item.li_list" :key="lndex">
							<text class="li-label">{{li.title}}</text><text class="li-content">{{li.tontent}}</text>
						</view>
					</view>
					<view class="action-box">
						<view class="action-flex">
							<view style="flex: 1;">
								<u-parse :content="item.parse"></u-parse>
							</view>
							<view class="action-text-but" v-for="(but, bindex) in item.action_list" :key="bindex"
							@click="orderAction(but, item.id)"
							>
								{{but.title}}
							</view>
						</view>
					</view>
					<view class="icon-box" :style="{backgroundColor:item.status_data.tag_color}">
						{{item.status_data.name}}
					</view>
				</view>
			</view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" text="暂无数据" marginTop="25vh"></u-empty>
			
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
		orderAction(but, order_id){
			but.id = order_id;
			if(but.action == 'delete'){
				this.showModalEvent({
					title:'提示',//提示标题
					content: '确认要' + but.title + '吗？',
					showCancel:true,
					cancelText: '取消',
					confirmText: '确认',
				}, but) 
			}else if(but.action == 'edit'){
				this.navTo('/pages_transfershop/periodic/index', {login: true}, {id:order_id});
			}
		},
		//弹窗返回
		modalEventBack(options, v){
			if(v == 1){
				this.$util.throttle(async ()=>{
					this.$request('transShopPeriodicChange', options,{
						showLoading: true,
					}).then((res)=>{
						if(res.data.code == 200){
							this.msg(res.data.msg);
							this.queryData();
						}
					})
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
			this.$request('transShopPeriodicList', post_data,{
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
	.list-body{
		padding: 10px;
		.list-item{
			margin-bottom: 20rpx;
			background-color: #ffffff;
			padding: 10px 15px;
			border-radius: 2px;
			// display: flex;
			position: relative;
			overflow: hidden;
			.list-content{
				flex: 1;
				min-width: 0;
				.list-title{
					font-size: 17px;
					font-weight: bold;
					color: #303166;
				}
				.list-desc-box{
					font-size: 14px;
					padding-top: 15px;
					.li-label{
						color: #909399;
					}
					.li-content{
						color: #606266;
					}
				}
			}
			.action-box{
				padding-top: 6px;
				.action-flex{
					border-top: 1px solid #f0f0f0;
					display: flex;
					justify-content: flex-end;
					.action-text-but{
						padding: 5px 0px 0 10px;
						font-size: 14px;
						color: #606266;
					}
				}
			}
			.icon-box{
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
	}
</style>