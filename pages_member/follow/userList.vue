<template>
	<gui-page  
	:refresh="true"
	:loadmore="true"
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
				<view class="list-item" v-for="(item, index) in list" :key="index">
					<view class="avatar-box">
						<image :src="item.avatar" mode="widthFix"></image>
					</view>
					<view class="list-content">
						<view style="display: flex;">
							<view class="list-title">
								{{item.realname || item.nickname}}
							</view>
							<view>
								<view class="tag-box"
								:style="{backgroundColor: item.status_data.find ==1?'#18b566':'#2979ff'}"
								>{{item.status_data.find==1?'招工中':item.status_data.find==2?'待业中':'默认'}}</view>
							</view>
						</view>
						
						<view class="list-desc-box">
							{{item.remark}}
						</view>
						<!-- <view v-if="item.find == 1" style="font-size: 12px;color: #909399">
							发布时间 &nbsp;{{item.find_date}}
						</view> -->
					</view>
					<view class="icon-box">
						<!-- <view style="font-size:14px;color: #909399;height: 20px;line-height: 20px;text-align: center;">{{item.space}}km</view> -->
						<view class="small-but" @click="$util.callPhone(item.mobile)">电话联系</view>
						<view v-if="queryForm.find == 2" class="small-but" @click="follow(item)"
						:style="{backgroundColor: item.is_follow ==1?'#18b566':'#2979ff'}"
						>
							{{item.is_follow == 1 ? '已关注' : '关注'}}
						</view>
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
				pageSize: 50,
				keyword: '',
				find: 0
			},
		}
	},
	onLoad: function(options) {
		if(options.find){
			let title = options.find == 1 ? '关注我的老板' : ' 我关注的司机';
			this.queryForm.find = options.find;
			uni.setNavigationBarTitle({
				title: title
			});
		}
		this.queryData()
	},
	onShow() {
		
	},
	methods: {
		//关注
		follow(item){
			if(!this.isLogin({nav: false})){
				this.isLogin();
				return;
			}
			if(item.is_follow == 0){
				this.doFollow({
					member_id: item.userid,
					val: 1,
					ref: 'is_follow',
				});
			}else{
				this.showModalEvent({
					title:'提示',//提示标题
					content: '确定要取消关注吗？',
					showCancel:true,
					cancelText: '取消',
					confirmText: '确认',
					path:''
				},{
					member_id: item.userid,
					val: 0,
					ref: 'is_follow',
				})
			}
			
		},
		
		doFollow(obj = {}){
			this.$request('sameRelevanceChange', obj,{
				showLoading: true
			}).then((res)=>{
				if(res.data.code == 200){
					this.queryData();
					this.msg('操作成功')
				}
			})
		},
		//弹窗返回
		modalEventBack(options, v){
			console.log('mixin-modal弹窗返回', options, v)
			if(v == 1){
				if(options.ref == 'is_follow'){
					this.doFollow(options);
				}
			}
		},
		queryData() {
			this.queryForm.pageNo = 1;
			this.totalCount = 0;
			this.fetchData();
		},
		fetchData() {
			const t = this;
			this.apiLoadingStatus = true;
			if(!this.isLogin({nav:false})){
				setTimeout(()=>{
					this.apiLoadingStatus = false;
					this.$refs.guipage.endReload();//停止刷新
					this.$refs.guipage.hiddenloadmore();
				}, 1000)
				return;
			}
			const post_data = JSON.parse(JSON.stringify(this.queryForm));
			this.$request('findWoekerCollectMy', post_data,{
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
	.small-but{
		margin-bottom: 5px;
	}
	.fixed-right-box{
		position: fixed;
		right: 0;
		bottom: 80px;
		padding: 10px;
		
		.icon-box{
			margin-bottom: 5px;
			width: 40px;
			height: 40px;
			padding: 5px;
			text-align: center;
			color: #ffffff;
			background-color: rgba(0,0,0,.6);
			border-radius: 100px;
			padding-top: 5px;
		}
	}
	.tag-box{
		height: 18px;
		line-height: 18px;
		border-radius: 2px;
		padding: 0 5px;
		font-size: 12px;
		color: #ffffff;
		background-color: #2979ff;
		margin-left: 5px;
	}
	.city-box{
		max-width: 32vw;
		overflow: hidden;
		flex: 1;
		min-width: 40%;
		padding: 0px 5px 0 5px;
		display: flex;
		.city-info{
			display: flex;
			background-color: #f0f0f0;
			border-radius: 30px;
			height: 25px;
			line-height: 25px;
			padding: 0 8px;
			overflow: hidden;
			.city-name{
				font-size: 14px;
				color: #303133;
				font-weight: bold;
				padding-left: 2px;
			}
			.micon{
				font-size: 15px;
			}
		}
		
	}
	.list-body{
		padding: 10px;
		.list-item{
			margin-bottom: 20rpx;
			background-color: #ffffff;
			padding: 10px 5px 10px;
			border-radius: 10px;
			display: flex;
			.avatar-box{
				width: 65px;;
				height: 65px;
				border-radius: 55px;
				margin-top: 5px;
				overflow: hidden;
				image{
					width: 100%;
				}
			}
			.list-content{
				flex: 1;
				min-width: 0;
				padding-left: 10px;
				padding-top: 10px;
				.list-title{
					font-size: 16px;
					font-weight: bold;
					color: #303133;
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