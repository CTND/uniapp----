<template>
	<gui-page  
	:refresh="true"
	:loadmore="false" 
	:customHeader="true" 
	:customFooter="custom_Footer"
	@reload="reload"
	@loadmorefun="loadmorefun" 
	:apiLoadingStatus="apiLoadingStatus" 
	:customStyle="{
		backgroundImage:'linear-gradient(to bottom, #ffffff, #F6F6F6 20%)',
	}"
	:customHeaderStyle="{height:'80px'}"
	@clickCallback="linkClick"
	ref="guipage"
		
	>
		<template v-slot:gHeader>
			<up-navbar
				height="48px"
				@rightClick="openNavbar"
				:bgColor="System.title_bg_color"
				:customStyle="{borderBottom:'1px solid #f0f0f0'}"
			>
				<template #left>
					<view style="padding-left: 10px;padding-top: 5px;">
						<view class="micon icon-tianjia" style="color: #303133;font-size: 18px;font-weight: bold;padding-left: 10px;"
						@click="openNavbar()"></view>
					</view>
				</template>
				<template #center><view style="font-size: 18px;color:#303133;font-weight: bold;">消息</view></template>
				<template #right>
				</template>
			</up-navbar>
		</template>
		<!-- <template v-slot:gFixedTop>
			<view>
				
				<view class="search-box" style="margin-top: 50px;">
					<u-search 
					placeholder="搜索" 
					v-model="queryForm.keyword" 
					height="32px"
					bgColor="rgba(0,0,0,0.05)"
					:inputStyle="{fontSize:'16px',color:'#606266'}"
					:showAction="true" 
					actionText="搜索" 
					animation
					@change="searchChange"
					@search="queryData"
					@custom="queryData"
					></u-search>
				</view>
			</view>
		</template> -->
		<template v-slot:gBody>
			<view class="list-body">
				<view class="list-item" 
				v-for="(item, index) in list" :key="index"
				@click="listClick(item)"
				>
					<view class="list-left-box">
						<view class="icon-box">
							<up-image :show-loading="false"
							:src="item.icon" 
							width="100rpx" height="100rpx" radius="110rpx"></up-image>
						</view>
					</view>
					<view class="list-content">
						<view class="list-title">
							<u-parse :content="item.title || ''" :tagStyle="{
								div: 'white-space:nowrap;text-overflow:ellipsis;overflow: hidden;'
							}"></u-parse>
						</view>
						<view class="list-ftitle">
							{{item.ftitle}}
						</view>
					</view>
					<view class="list-right-box">
						<view class="time-box">
							{{item.type == 'dialog' ? $util.getDateLen(item.create_time) : ''}}
						</view>
						<view class="badge-box">
							<view style="padding-right: 2px;">
								<up-badge
								type="error" 
								:absolute="false"
								:max="99"
								:value="item.count_num"></up-badge>
							</view>
							<view v-if="item.type != 'dialog'" class="micon icon-jiantou1" 
							style="color: #909399;font-size: 14px;font-weight: bold;line-height: 17px;"></view>
						</view>
					</view>
				</view>
			</view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" text="暂无数据" marginTop="25vh"></u-empty>
			
			<!-- 全屏加载 -->
			
			
			<!--加载中-->
			 
			 
			
			<!-- 顶部更多操作 -->
			<navbar-more-popup ref="navbarMore" @more-back="moreBack" position="left"></navbar-more-popup>
			
			<push-popup-vue ref="pushPopup"></push-popup-vue>
		</template>
	</gui-page>
</template>
<script>
	import pushPopupVue from '../push-popup.vue';
export default {
	components:{
		pushPopupVue
	},
	data() {
		return {
			count_no_read:0,
			list:[],
			showAction:false,
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
		if(!this.isLogin()){
			return false;
		}
		this.queryData()
	},
	methods: {
		//链接点击事件
		linkClick(e){
			if(e.event == 'push'){
				this.$refs['pushPopup'].open();
			}
		},
		//搜索框内容改变
		searchChange(){
			console.log('searchChange')
			if(this.queryForm.keyword == ''){
				this.showAction = false;
			}else{
				this.showAction = true;
			}
		},
		
		//打开顶部更多操作
		openNavbar(){
			this.$refs.navbarMore.open([
				{
					title:'全部已读',
					icon:'icon-a-shenqing1',
					ref:'allRead'
				},
				{
					title:'删除已读',
					icon:'icon-icon',
					ref:'deleteRead'
				},
				{
					title:'全部删除',
					icon:'icon-shanchu2',
					ref:'allDelete'
				},
				{
					title:'扫一扫',
					icon:'icon-mendianzitidaihexiaosvg',
					ref:'scan'
				},
				{
					title:'通讯录',
					icon:'icon-tongxunlu',
					ref:'book'
				}
			])
		},
		//点击更多返回
		moreBack(e){
			this.$refs.navbarMore.close();
			if(e.ref == 'scan'){
				// #ifdef APP
				// 允许从相机和相册扫码
				uni.scanCode({
					success: function (res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					}
				});
				// #endif
			}else if(e.ref == 'book'){
				this.navTo('/pages_same/friend/book', {login: true});
			}else{
				this.operateNotify(e.ref);
			}
		},
		//对消息进行操作
		async operateNotify(ref = '', from_userid = '', type=''){
			if(ref != ''){
				var res = await this.$request('notifyOperate', {
					ref: ref, 
					from_userid:from_userid, 
					type:type,
				},{
					showLoading: false
				});
				console.log('对消息进行操作', res)
				if(res.data.code == 200){
					this.queryData();
					this.getNotifyCount();
				}
			}
		},
		//点击阅读
		listClick(item){
			if(item.type == 'dialog'){
				var index = this.list.findIndex(n => n.nid == item.nid);
				if(index > -1){
					this.list[index].status = 1;
				}
			}
			if(item.router){
				this.navTo(item.router, {login:true});
			}
			this.operateNotify('allRead', item.from_userid, item.type);
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
			this.$request('notifyList', queryForm,{
				showLoading: false
			}).then((res)=>{
				console.log('消息列表', res)
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
	.search-box{
		padding: 0 20px;
		margin-bottom: 10px;
	}
	.list-body{
		padding: 5px 0;
		padding-top: 10px;
		//height: calc( 100vh - 130px );
		.list-item{
			display: flex;
			//margin-bottom: 10rpx;
			padding: 20rpx 20px 20rpx 15px;
			//border: 1px solid #f0f0f0;
			.list-left-box{
				position: relative;
				min-width: 0;
				.icon-box{
					// width: 110rpx;
					// height: 110rpx;
					// border-radius: 100px;
					// overflow: hidden;
					// image{
					// 	width: 100%;
					// }
				}
			}
			.list-content{
				flex: 1;
				padding: 0 16rpx;
				padding-top: 8rpx;
				min-width: 0;
				overflow: hidden;
				.list-title{
					font-size: 16px;
					color: #1b1b1b;
					overflow: hidden;
				}
				.list-ftitle{
					padding-top: 6rpx;
					font-size: 14px;
					color: #969696;
					white-space:nowrap;
					overflow: hidden;
					text-overflow:ellipsis;
				}
			}
			.list-right-box{
				padding-top: 8px;
				.time-box{
					font-size: 12px;
					color: #909399;
				}
				.badge-box{
					padding-top: 10px;
					display: flex;
				}
			}
		}
	}
</style>