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
		backgroundColor:System.full_bg_color,
	}"
	ref="guipage"
		>
		<template v-slot:gFixedTop>
			<view class="top-box">
				<view class="time-box" style="flex: 1;" @click="showYearMonth = true">{{date_str}}</view>
				<view class="time-box" style="font-weight: 400;font-size: 15px;padding-right: 5px" @click="showType = true">
					{{queryForm.type.text}}
				</view>
			</view>
		</template>
		<template v-slot:gBody>
			<view class="list-body" v-if="list.length">
				<view class="list-item" v-for="(item, index) in list" :key="index">
					<view class="icon-box">
						<up-image :show-loading="false"
						:src="$util.img('images/system/currency.png')" 
						width="50px" height="50px" ></up-image>
					</view>
					<view class="item-content" :style="{borderBottom:index<list.length-1?'1px solid #e4e7ed':'none'}">
						<view class="item-data">
							<view class="title">{{item.descs}}</view>
							<view class="ftitle">{{item.create_time}}</view>
						</view>
						<view class="item-end-box">{{item.status==1?'+':'-'}}￥{{item.value}}</view>
					</view>
				</view>
			</view>
			<view style="height: 30px;"></view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" text="暂无数据" marginTop="20vh"></u-empty>
			
			<!-- 全屏加载 -->
			
			
			<!--加载中-->
			 
			 
			<!-- 年月选择器 -->
			<u-datetime-picker
			:show="showYearMonth"
			v-model="date_value"
			mode="year-month"
			closeOnClickOverlay
			cancelText="全部记录"
			cancelColor="#303133"
			@close="showYearMonth = false"
			@cancel="dateCancel"
			@confirm="dateConfirm"
			></u-datetime-picker>
			<!-- 类型选择器 -->
			<up-picker :show="showType" :columns="columns" @confirm="actionConfirm" @cancel="showType = false"
			 closeOnClickOverlay @close="showType = false"></up-picker>
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
				date:'',
				account_type: "bonus",
				from_type: "share",
				type: {
					text: '全部',
					value: 0
				}
			},
			//年月
			date_str:'',
			date_value: Number(new Date()),//日期默认值
			showYearMonth:false,
			
			//类型
			showType: false,
			columns:[
				[
					{
						text: '全部',
						value: 0
					},
					{
						text: '收入',
						value: 1
					},
					{
						text: '支出',
						value: 2
					}
				]
			]
		}
	},
	onLoad: function(options) {
		if(options.account_type){
			this.queryForm.account_type = options.account_type;
			let title = '明细';
			if(options.account_type == 'money'){
				title = '余额明细';
			}else if(options.account_type == 'bonus'){
				title = '佣金明细';
			}else if(options.account_type == 'point'){
				title = '积分明细';
			}
			uni.setNavigationBarTitle({
				title: title
			});
		}
		if(options.from_type){
			this.queryForm.from_type = options.from_type;
		}
	},
	onShow() {
		this.dateConfirm();
		this.queryData();
	},
	methods: {
		actionConfirm(e){
			this.queryForm.type = e.value[0];
			this.showType = false;
			this.queryData();
		},
		//日期操作
		dateCancel(){
			this.queryForm.date = '';
			this.date_str = '全部记录';
			this.showYearMonth = false;
			this.queryData();
		},
		dateConfirm(e){
			var now = new Date();
			if(e){
				now = new Date(e.value);
			}
			var year = now.getFullYear();
			let month = now.getMonth() + 1;
			month = month < 10 ? `0${month}` : month;
			var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
			
			var date = year + '-' + month + '-' + day;
			this.queryForm.date = date;
			this.date_str = year + '年' + month + '月';
			this.showYearMonth = false;
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
			this.$request('moneyRecord', post_data,{
				showLoading: false,
			}).then((res)=>{
				if(this.queryForm.pageNo == 1){
					this.list = [];
				} 
				if(res.data.data.list.length){
					let list = res.data.data.list;
					this.list = this.list.concat(list);
				}
				this.dataListEvent(res.data.data);
			})
		},
	}
}
</script>

<style lang="scss" scoped>
	.top-box{
		background-color: #ffffff;
		padding: 10px 20px;
		display: flex;
		.time-box{
			font-size: 16px;
			font-weight: bold;
		}
	}
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
					padding: 15px 10px 8px 10px;
					color: #fc3565;
					font-size: 14px;
				}
			}
			
		}
	}
</style>