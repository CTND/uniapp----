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
			
			<view class="list-body" v-if="list.length">
				<view class="list-item" v-for="(item, index) in list" :key="index">
					<view class="default-box" v-if="item.is_default == 1">
						<image :src="$util.img('images/system/default2.png')" mode="widthFix"></image>
					</view>
					<view class="list-content" @click="checkEd(item)">
						<view class="list-title ">
							<view class="list-name text-overflow">{{item.name}}</view>| 
							 <view class="title-text-realname text-overflow">{{item.realname}}</view>
							<view class="title-text">{{item.mobile}}</view>
						</view>
						<view class="list-desc-box">
							{{item.address}}{{item.notes}}
						</view>
					</view>
					<view class="icon-box">
						<sd-icon name="icon-shanchu2" size="18" color="#cccccc"
						:custom-style="{lineHeight:'60px',marginRight:'5px'}" 
						@click="delItem(item)"
						></sd-icon>
						<sd-icon name="icon-bianji11" size="18" color="#cccccc"
						:custom-style="{lineHeight:'60px',}" 
						@click="navTo('/pages_member/address/edit', {login: true}, {id: item.id})"
						></sd-icon>
						
					</view>
				</view>
				<view style="height: 50px;"></view>
			</view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" text="暂无数据" marginTop="25vh" ></u-empty>
			<u-button
			text="添加地址" 
			shape="circle" 
			icon="icon-tianjia"
			iconColor="#ffffff"
			class="fixed-but"
			:customStyle="{
				backgroundColor:System.big_but_color,color:'#ffffff',width:'80%',margin:'auto'
			}"
			@click="navTo('/pages_member/address/edit', {login: true})"
			></u-button>
			
			
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
		
	},
	onShow() {
		this.queryData()
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
			this.$request('memberAddress', post_data,{
				showLoading: false,
			}).then((res)=>{
				if(this.queryForm.pageNo == 1) {
					this.list = [];
				}
				if(res.data.data.list.length){
					let list = res.data.data.list;
					this.list = this.list.concat(list); //追加新数据
				}
				this.dataListEvent(res.data.data, 1);
			})
		},
		//选择
		checkEd(item){
			//调用上一个页面的方法 或者 设置数据
			let prePage = this.prePage();
			prePage.$vm.checkAddress = JSON.parse(JSON.stringify(item));
			this.goBack();
		},
		delItem(item){
			this.showModalEvent({
				title:'提示',//提示标题
				content: '确定要删除当前地址吗？',
				showCancel:true,
				cancelText: '取消',
				confirmText: '删除',
			},item)
		},
		modalEventBack(options, v){
			if(v == 1){
				if(this.isSubmit) return;
				this.isSubmit = true;
				this.$util.throttle(async ()=>{
					this.$request('memberAddressDelete', options,{
						showLoading: false,
					}).then((res)=>{
						this.msg(res.data.msg);
						this.isSubmit = false;
						this.queryData();
					})
				})
			}
		},
	}
}
</script>

<style lang="scss" scoped>
	.fixed-but{
		position: fixed;
		bottom: 30px;
		left: 10%;
		height: 90rpx;
	}
	.list-body{
		padding: 10px;
		min-height: 90vh;
		.list-item{
			margin-bottom: 20rpx;
			background-color: #ffffff;
			padding: 10px 10px 10px 15px;
			border-radius: 8px;
			display: flex;
			position: relative;
			overflow: hidden;
			.default-box{
				position: absolute;
				left: 0;
				top: 0;
				width: 25px;
				height: 25px;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.list-content{
				flex: 1;
				min-width: 0;
				
				.list-title{
					font-size: 16px;
					font-weight: bold;
					color: #303133;
					display: flex;
					.list-name{
						max-width: 120px;
						overflow: hidden;
					}
					.title-text-realname{
						font-size: 14px;
						font-weight: 400;
						color: #606266;
						line-height: 20px;
						max-width: 100px;
						padding: 0 5px;
					}
					.title-text{
						font-size: 14px;
						font-weight: 400;
						color: #606266;
						line-height: 20px;
					}
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
				display: flex;
			}
		}
	}
</style>