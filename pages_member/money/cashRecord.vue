<template>
	<gui-page  
	
	:refresh="true"
	:loadmore="true" 
	:isSwitchPage="false"
	:customHeader="true"
	:customFooter="false"
	:apiLoadingStatus="apiLoadingStatus" 
	@reload="reload" 
	@loadmorefun="loadmorefun" 
	:customStyle="{
		backgroundColor:System.full_bg_color
	}"
	ref="guipage"
		>
		<template v-slot:gFixedTop>
			<view style="background-color: #ffffff;padding: 0 10px;">
				<u-tabs
					:list="tabbar_list"
					:scrollable="false"
					lineWidth="40"
					lineColor="#fc3565"
					lineHeight="3px"
					:activeStyle="{
						color: '#303133',
						fontWeight: 'bold',
						transform: 'scale(1.05)',
						fontSize:'16px'
					}"
					:inactiveStyle="{
						color: '#606266',
						transform: 'scale(1)',
						fontSize:'16px'
					}"
					itemStyle="padding-left: 10px; padding-right: 10px; height: 40px;"
					@change="tabbarChange"
				>
				</u-tabs>
			</view>
		</template>
		<template v-slot:gBody>
			
			<view class="list-body" v-if="list.length">
				<view class="list-item" v-for="(item, index) in list" :key="index"
				@click="navTo('/pages_member/money/cashDetail', {login: true}, {cid: item.cid})"
				>
					<view class="icon-box">
						<up-image :show-loading="false"
						:src="$util.img('images/system/money.png')" 
						width="50px" height="50px" ></up-image>
					</view>
					<view class="item-content" :style="{borderBottom:index<list.length-1?'1px solid #e4e7ed':'none'}">
						<view class="item-data">
							<view class="title">{{item.time_str}}</view>
							<view class="ftitle" :style="{color:item.status_data.tag_color}">{{item.status_data.name}}</view>
						</view>
						<view class="item-end-box">￥{{item.cash_money}}</view>
					</view>
				</view>
			</view>
			<view style="height: 30px;"></view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" text="暂无数据" marginTop="20vh"></u-empty>
			
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
				role: 'share'
			},
			current:0,
			tabbar_list:[
				{
					name:'全部记录'
				},
				{
					name:'已完成'
				},
				{
					name:'申请中'
				},
			],
		}
	},
	onLoad: function(options) {
		if(options.role){
			this.queryForm.role = options.role;
		}
	},
	onShow() {
		this.queryData();
	},
	methods: {
		
		tabbarChange(e){
			this.current = e.index;
			this.queryData();
		},
		//下拉刷新
		reload(){
			this.queryData();
		},
		//上拉加载
		loadmorefun(){
			this.fetchData();
		},
		queryData() {
			this.queryForm.pageNo = 1;
			this.totalCount = 0;
			this.fetchData();
		},
		fetchData() {
			 
			this.apiLoadingStatus = true;
			const post_data = JSON.parse(JSON.stringify(this.queryForm));
			post_data.current = this.current;
			this.$request('moneyCashRecord', post_data,{
				showLoading: false,
			}).then((res)=>{
				console.log('提现记录', res)
				if(this.queryForm.pageNo == 1) this.list = []; //如果是第一页需手动制空列表
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
		background-color: #ffffff;
		padding: 0 10px;
		margin-top: 10px;
		.list-item{
			display: flex;
			.icon-box{
				padding: 10px 5px 0px 5px;
			}
			.item-content{
				flex: 1;
				display: flex;
				border-bottom: 1px solid #e4e7ed;
				padding: 12px 5px;
				.item-data{
					flex: 1;
					.title{
						font-size: 15px;
						color: #303133;
					}
					.ftitle{
						font-size: 12px;
						color: #909399;
						padding-top: 10px;
					}
				}
				.item-end-box{
					padding: 10px;
					color: #fc3565;
					font-size: 14px;
					font-weight: bold;
				}
			}
			
		}
	}
</style>