<template>
	<gui-page  
	
	:refresh="true"
	:loadmore="true" 
	
	:customHeader="true"
	:customFooter="custom_Footer"
	:apiLoadingStatus="apiLoadingStatus" 
	@reload="reload" 
	@loadmorefun="loadmorefun" 
	:customStyle="{
		
	}"
	ref="guipage"
		>
		
		<template v-slot:gBody>
			<view class="list-body">
				<view class="list-item" 
				v-for="(item, index) in list" :key="index"
				@click="navTo('/pages_public/notice/info', {login: true}, {id: item.id})"
				>
					<view class="list-left-box" v-if="item.image">
						<view class="icon-box">
							<image :src="item.image" mode="widthFix"></image>
						</view>
					</view>
					<view class="list-content">
						<view class="list-title">
							{{item.noticename}}
						</view>
						<view class="list-ftitle">
							{{item.create_time}}
						</view>
					</view>
					<view class="icon-box">
						<sd-icon name="icon-jiantou1" size="18" color="#606266"
						 top="18"
						></sd-icon>
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
			const queryForm = JSON.parse(JSON.stringify(this.queryForm));
			this.$request('NoticeList', queryForm,{
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
	.list-body{
		padding: 5px 0;
		.list-item{
			display: flex;
			margin-bottom: 10rpx;
			//border-bottom: 1px solid #f0f0f0;
			background-color: #ffffff;
			padding: 10px 15px;
			.list-left-box{
				position: relative;
				min-width: 0;
				.icon-box{
					width: 55px;
					height: 55px;
					border-radius: 55px;
					overflow: hidden;
					border: 1px solid #f0f0f0;
					image{
						width: 100%;
					}
				}
			}
			.list-content{
				flex: 1;
				padding: 0 10px;
				padding-top: 5px;
				min-width: 0;
				overflow: hidden;
				.list-title{
					font-size: 15px;
					color: #303133;
					overflow: hidden;
				}
				.list-ftitle{
					padding-top: 8px;
					font-size: 13px;
					color: #909399;
				}
			}
		}
	}
</style>