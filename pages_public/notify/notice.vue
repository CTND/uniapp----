<template>
	<gui-page  
	
	:refresh="true"
	:loadmore="true"
	:customFooter="custom_Footer"
	@reload="queryData"
	@loadmorefun="fetchData"
	:apiLoadingStatus="apiLoadingStatus" 
	:customStyle="{
		backgroundColor:System.full_bg_color
	}"
	ref="guipage"
		>
		<template v-slot:gBody>
			
			<view class="list-body">
				<view class="list-item" v-for="(item, index) in list" :key="index">
					<view class="list-content">
						<view class="list-title text-overflow" v-if="item.title">
							{{item.title}}
						</view>
						<template v-if="item.item_list.length">
							<view class="list-desc-box" v-for="(i, j) in item.item_list" :key="j">
								{{i.title}}：<text style="color: #303133;padding-left: 10px;">{{i.item_content}}</text>
							</view>
						</template>
						<view class="content-text" v-if="item.content_text">{{item.content_text || ''}}</view>
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
				type: ['notice'],
			}
		}
	},
	onLoad: function(options) {
		if(options.type){
			let index = this.queryForm.type.indexOf(options.type);
			if(index == -1){
				this.queryForm.type.push(options.type);
			}
		}
		this.queryData()
	},
	onShow() {
		
	},
	methods: {
		queryData() {
			this.queryForm.pageNo = 1;
			this.totalCount = 0;
			this.fetchData();
		},
		fetchData() {
			this.apiLoadingStatus = true;
			const post_data = JSON.parse(JSON.stringify(this.queryForm));
			this.$request('queryNotifyList', post_data,{
				showLoading: false,
			}).then((res)=>{
				console.log('列表', res)
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
			padding: 15px;
			border-radius: 10px;
			.list-content{
				min-width: 0;
				.list-title{
					font-size: 17px;
					font-weight: bold;
					color: #303133;
				}
				.list-desc-box{
					font-size: 28rpx;
					color: #606266;
					padding-top: 15px;
					display: flex;
				}
				.content-text{
					font-size: 28rpx;
					color: #606266;
					line-height: 20px;
					padding-top: 10px;
				}
			}
			.icon-box{
				line-height: 70px;
				font-size: 14px;
				color: #909399;
			}
		}
	}
</style>