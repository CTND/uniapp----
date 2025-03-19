<template>
	<gui-page  
	
	:refresh="true"
	:loadmore="true" 
	
	:customHeader="false"
	:customFooter="customFooter"
	:apiLoadingStatus="apiLoadingStatus" 
	@reload="reload" 
	@loadmorefun="loadmorefun" 
	ref="guipage"
		>
		
		<template v-slot:gBody>
			
			<view class="list-body">
				<view class="list-item" v-for="(item, index) in list" :key="index"
				@click="openFile(item)"
				>
					<view class="icon-box">
						<text class="micon icon-caidan" style="font-size: 20px;"></text>
					</view>
					<view class="center">
						<view class="title text-overflow">{{item.file_name}}</view>
					</view>
					<view class="after-box">
						<text class="micon icon-iconfonticonfonti2copycopy"></text>
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
			current:0,
			tabs_list:[],
			//列表渲染数据
			totalCount:0,//总数据量
			apiLoadingStatus:false,
			queryForm:{
				pageNo: 1,
				pageSize: 10,
				keyword: '',
				der_id:0
			}
		}
	},
	onLoad: function(options) {
		if(options.der_id){
			this.queryForm.der_id = options.der_id;
		}
		this.queryData();
	},
	onShow() {
		
	},
	methods: {
		tabsClick(item) {
			this.current = item.index;
			this.queryData();
		},
		openFile(item){
			if(item.file_url){
				uni.downloadFile({
					url: item.file_url,
					success: function (res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							showMenu: true,
							success: function (res) {
						        console.log('打开文档成功');
							},
							fail(err) {
								console.log('打开失败', err)
							}
						});
					}
				});
				
			}
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
			var post_data = JSON.parse(JSON.stringify(this.queryForm));
			
			this.$request('fileList', post_data,{
				showLoading: true
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
		padding: 15px 10px;
		.list-item{
			padding: 15px;
			margin-bottom: 20rpx;
			background-color: #ffffff;
			border-radius: 5px;
			display: flex;
			line-height: 25px;
			.icon-box{
				font-size: 18px;
				color: #606266;
			}
			.center{
				flex: 1;
				padding-left: 5px;
				overflow: hidden;
				.title{
					font-size: 16px;
					color: #303133;
				}
			}
			.after-box{
				padding-left: 5px;
				.micon{
					color: #909399;
				}
			}
		}
	}
</style>