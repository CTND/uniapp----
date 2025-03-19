<template>
	<gui-page 
		:customHeader="true" 
		:customFooter="custom_Footer"
		:refresh="true"
		@reload="reload()" 
		:customStyle="{
			paddingTop:'50px',
			backgroundColor:System.full_bg_color
		}"
		ref="guipage"
		>
		<template v-slot:gHeader>
			<up-navbar 
			height="48px"
			bgColor="#ffffff"
			>
				<template #left>
					<view class="send-but" @click="openNavbar()" v-if="System.cheat==2">
						<text class="micon icon-gengduo1" style="margin-right: 2px;"></text>
						更多
					</view>
				</template>
				<template #center>
					<view style="color: #303133;">陌约</view>
				</template>
				<template #right>
					<view class="nav-right-box" >
					</view>
				</template>
			</up-navbar>
		</template>
		<template v-slot:gBody>
			<view class="flex-box" v-if="list.length">
				<view class="flex-block" v-for="(item, index) in list" :key="index"
				:style="{backgroundColor:item.bgColor}"
				@click="toModel(item)"
				>
					<view class="icon-box">
						<image :src="item.icon" mode="widthFix"></image>
					</view>
					<view class="content-box">
						<view class="title">{{item.title}}</view>
						<view class="text">{{item.text}}</view>
					</view>
				</view>
			</view>
			<template v-if="activity.length">
				<view style="font-size: 18px;color: #303133;font-weight: bold;padding: 10px 15px;">附近热门活动</view>
				<view class="activity-box" v-for="(a, i) in activity" :key="i" 
				@click="navTo('/pages_same/activity/detail', {login:true}, {id:a.id})">
					<view class="activity-block">
						<view class="cover-box" v-if="a.cover_img">
							<up-image :show-loading="false" 
							:src="a.cover_img" 
							width="110px" height="110px"></up-image>
						</view>
						<view class="info-box" >
							<view class="tag-box" :style="{background:a.status_data.tag_color}">
								{{a.status_data.name}}
							</view>
							<view style="display: flex;flex-direction: column;justify-content: space-between;">
								<view class="activity-title">
									{{a.title}}
								</view>
								<view class="activity-item">
									<view class="item-label">活动人数:</view>
									<view class="item-center">{{a.user_num > 0 ? a.user_num+'人' : '不限'}}</view>
								</view>
								<view class="activity-item">
									<view class="item-label">活动时间:</view>
									<view class="item-center" style="background-color: #f0f0f0;">{{$util.timestampToTime(a.date_time, 4)}}</view>
								</view>
								<!-- <view class="activity-item">
									<view class="item-label">结束时间:</view>
									<view class="item-center">{{$util.timestampToTime(a.end_time, 4)}}</view>
								</view> -->
							</view>
							
						</view>
					</view>
				</view>
			</template>
			<view v-if="activity.length==0 && list.length==0">
				<!-- 引用平台简介 -->
				<profile ref="profile" type="3"></profile>
			</view>
			<view style="height: 10px;"></view>
			<!--加载中-->
			 
			<!-- 全屏加载 -->
			
			<!-- 顶部更多操作 -->
			<navbar-more-popup ref="navbarMore" @more-back="moreBack" position="left"></navbar-more-popup>
			
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				list:[],
				activity:[], //活动列表
				locationdata:{},//当前位置数据
				cityname:'',
				citycode:'',
			}
		},
		watch: {
			//监听数据变化
		    citycode(newValue, value) {
				console.log('监听数据变化 新值为：', newValue, value);
				if(newValue != value){
					this.reload();
				}
		    }
		},
		onLoad: function() {
			this.getModels();
		},
		onShow() {
			//获取位置
			if(this.citycode == ''){
				this.$util.getLocationData((res)=>{
					console.log('获取位置', res)
					if(res.citycode && res.city != ''){
						this.cityname = res.city;
						this.citycode = res.citycode;
						this.locationdata = res;
					}else{
						this.navTo('/pages_public/cityList/index', {login:false})
					}
				})
			}
		},
		methods:{
			//打开顶部更多操作
			openNavbar(){
				this.$refs.navbarMore.open([
					{
						title:'发布活动',
						icon:'icon-huodongyingxiao',
						ref:'action'
					},
					{
						title:'发布需求',
						icon:'icon-huodongyumingxi',
						ref:'demand'
					},
					{
						title:'需求大厅',
						icon:'icon-renwujihua',
						ref:'demandList'
					},
					{
						title:'我的活动',
						icon:'icon-wofaqide',
						ref:'myActivity'
					},
					{
						title:'我的需求',
						icon:'icon-yonghujieshou',
						ref:'myDemand'
					},
				])
			},
			//点击更多返回
			moreBack(e){
				this.$refs.navbarMore.close();
				if(e.ref == 'action' || e.ref == 'demand'){
					this.navTo('/pages_same/activity/send', {login: true}, {type: e.ref});
				}else{
					this.navTo('/pages_same/activity/'+e.ref, {login: true});
				}
			},
			reload(){
				this.$request('getSameActivityList', {
					citycode:this.citycode,
					pageNo:1,
					pageSize:10,
				},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.list){
						this.activity = res.data.data.list;
					}
					this.$refs.guipage.endReload();//停止刷新
					 // 加载完成后停止加载动画
				})
			},
			getModels(){
				this.$request('getSameModels', {},{
					showLoading: false,
				}).then((res)=>{
					
					if(res.data.data.model_list){
						this.list = res.data.data.model_list;
					}
					this.$refs.guipage.endReload();//停止刷新
					 // 加载完成后停止加载动画
				})
			},
			toModel(item){
				if(item.path){
					if(item.path == '/pages_servedoor/worker/list'){
						this.navTo(item.path, {login:true})
					}else{
						this.navTo(item.path, {login:true}, {type_id: item.id})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.send-but{
		padding: 0 20rpx;
		height: 56rpx;
		border-radius: 50rpx;
		line-height: 56rpx;
		background-color: #4f7ffd;
		font-size: 14px;
		color: #ffffff;
		margin-top: 5px;
	}
	.flex-box{
		display: flex;
		flex-wrap: wrap;
		padding: 10px 2px;
		.flex-block{
			display: flex;
			width: calc( (100% - 30px) / 2 );
			margin-bottom: 10px;
			margin-left: 10px;
			justify-content: space-around;
			padding: 15px 10px;
			border-radius: 10px;
			overflow: hidden;
			box-shadow: 0 0 5px 0px #e7f3ff;
			.icon-box{
				width: 100rpx;
				height: 100rpx;
				border-radius: 90rpx;
				overflow: hidden;
				image{
					width: 100%;
				}
			}
			.content-box{
				flex: 1;
				padding-left: 8px;
				padding-top: 5px;
				.title{
					font-size: 17px;
					color: #303133;
					font-weight: bold;
				}
				.text{
					font-size: 12px;
					color: #606266;
					padding-top: 5px;
					padding-left: 2px;
				}
			}
		}
	}
	
	//活动
	.activity-box{
		padding: 0 14px;
		.activity-block{
			background-color: #ffffff;
			border-radius: 8px;
			overflow: hidden;
			display: flex;
			margin-bottom: 10px;
			box-shadow: 0 0 5px #e7f3ff;
			.cover-box{
				
			}
			.info-box{
				flex: 1;
				padding: 10px;
				padding-bottom: 5px;
				position: relative;
				.tag-box{
					position: absolute;
					top: 0%;
					right: 0;
					padding: 5px 10px;
					color: #ffffff;
					border-bottom-left-radius: 5px;
					font-size: 12px;
					font-weight: 400;
				}
				.activity-title{
					font-size: 16px;
					color: #303133;
					font-weight: bold;
					padding-bottom: 5px;
				}
				.activity-item{
					display: flex;
					height: 28px;
					line-height: 28px;
					.item-label{
						font-size: 14px;
						color: #909399;
					}
					.item-center{
						flex:1;
						font-size: 14px;
						color: #606266;
						padding-left: 5px;
					}
				}
			}
		}
	}
</style>