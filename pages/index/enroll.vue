<template>
	<gui-page  
	:refresh="true"
	:loadmore="true" 
	
	:customHeader="false"
	:customFooter="custom_Footer"
	:apiLoadingStatus="apiLoadingStatus" 
	@reload="reload" 
	@loadmorefun="loadmorefun" 
	ref="guipage"
	>
		
		<template v-slot:gBody>
			
			<view class="list-body">
				<view class="list-item" v-for="(item, index) in list" :key="index"
				@click="toDetail(index)"
				>
					<view class="list-content">
						<view class="list-title text-overflow">{{item.form_name}}</view>
						<view class="list-desc-box">
							开始时间：{{item.start_date}}
						</view>
						<view class="list-desc-box">
							结束时间：{{item.end_date}}
						</view>
					</view>
					<view class="icon-box" :style="{color:item.status==1?'#18b566':'#dd6161'}">
						<!-- <sd-icon name="icon-jiantou1" size="18" color="#cccccc"
						:custom-style="{lineHeight:'60px'}" 
						></sd-icon> -->
						{{item.status_msg}}
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
			modalSlot:'',
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
		toDetail(index){
			if(this.list[index].status == 0){
				this.msg('活动已结束')
				return;
			}else{
				if(this.list[index].window_message == ''){
					this.navTo('/pages_public/customform/index', {login: true}, {form_id:this.list[index].form_id})
				}else{
					this.showModalEvent({
						title:'提示',//提示标题
						content: this.list[index].window_message,
						showCancel:true,
						cancelText: '取消',
						confirmText: '去报名',
						path:''
					},{form_id:this.list[index].form_id})
				}
			}
		},
		//弹窗返回
		modalEventBack(options, v){
			console.log('mixin-modal弹窗返回', options, v)
			if(v == 1){
				this.navTo('/pages_public/customform/index', {login: true}, {form_id: options.form_id})
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
			const queryForm = this.queryForm;
			this.$request('getFormList', queryForm,{
				showLoading: true
			}).then((res)=>{
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
		padding: 10px;
		.list-item{
			margin-bottom: 20rpx;
			background-color: #ffffff;
			padding: 15px;
			border-radius: 10px;
			display: flex;
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
					color: #909399;
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