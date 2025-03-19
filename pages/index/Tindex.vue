<template>
	<gui-page 
	:refresh="true"
	:loadmore="true" 
	
	:customHeader="true"
	:customFooter="true"
	:apiLoadingStatus="apiLoadingStatus" 
	@reload="reload" 
	@loadmorefun="loadmorefun" 
	ref="guipage"
	>
		<template v-slot:gHeader>
			<up-navbar height="44px"
			:bgColor="System.title_bg_color"
			:customStyle="{background:System.title_bg_color}">
				<template #left>
					<view class="city-box" @click="navTo('/pages_public/cityList/index', {login:false})">
						<view class="city-name">{{cityname || '选择城市'}}</view>
						<view class="micon icon-sanjiaodown"></view>
					</view>
				</template>
				<template #center>
					<view>{{System.appname}}</view>
				</template>
				<template #right>
					<view class="nav-right-box" >
						
					</view>
				</template>
			</up-navbar>
		</template>
		<template v-slot:gBody>
			<u-swiper
			v-if="indexData.banner_list.length"
			:list="indexData.banner_list"
			:height="indexData.banner_height + 'px'"
			radius="0px"
			style="width: 100%;"
			imgMode="widthFix"
			></u-swiper>
			<view class="body-box">
				
				<view class="data-box" v-if="indexData.show_data">
					<view class="data-block" :style="{backgroundColor: indexData.default_color}">
						<view class="data-num">{{indexData.count_push || 0}}</view>
						<view class="data-text">累计发布数</view>
					</view>
					<view class="data-block" :style="{backgroundColor: indexData.default_color}">
						<view class="data-num">{{indexData.count_find || 0}}</view>
						<view class="data-text">累计用户数</view>
					</view>
				</view>
				
				<!-- DIY模块 -->
				<diy-module v-if="page_id" ref="diyModule" :pageId="page_id" @diy-back="diyBack"></diy-module>
				
				<view v-if="indexData.notice_list.length"
				:style="{backgroundColor: indexData.default_color}"
				style="padding: 5px 0;border-radius: 5px;"
				>
					<up-notice-bar
					direction='row'
					:text="indexData.notice_list" 
					mode="link" 
					:bgColor="indexData.default_color"
					fontSize="16px"
					color="#ffffff"
					></up-notice-bar>
				</view>
				<!-- <view class="location-box" style="display: flex;padding-right: 5px;margin-top: 10px;">
					<view class="city-wrap" style="flex: 1;padding-top: 10px;" @click="navTo('/pages_public/cityList/index', {login:true})">
						<view class="micon icon-dizhi1"></view>
						<view class="city-left">
							当前：{{cityname}}
						</view>
					</view>
					<view style="padding: 0 15px;display: flex;">
						<view class="small-but" style="height: 40px;line-height: 40px;padding: 0;width: 80px;border-radius: 5px;" 
						:style="{backgroundColor: indexData.default_color}"
						@click="navTo('/pages_transfer_store/infoList', {login:true}, {type:'buy', showType:'0',title:'最新转店',use_city:'0'})"
						>最新转店</view>
						<view class="small-but" style="height: 40px;line-height: 40px;padding: 0;width: 80px;border-radius: 5px;margin-left: 10px;"
						:style="{backgroundColor: indexData.default_color}"
						@click="navTo('/pages_transfer_store/infoList', {login:true}, {type:'find', showType:'0',title:'最新找店',use_city:'0'})"
						>最新找店</view>
					</view>
				</view> -->
			</view>
			
			<view class="list-body">
				<view class="list-item" v-for="(item, index) in list" :key="index"
				@click="navTo('/pages_transfer_store/infoDetail', {login:false}, {id:item.id})"
				>
					<view class="cover-box">
						<view v-if="item.is_top == 1" class="top-tag">置顶</view>
						<image :src="item.img ? item.img : setting.default_img" mode="aspectFill"></image>
					</view>
					<view class="list-content">
						<view class="list-title text-overflow">
							{{item.title}}
						</view>
						<view class="list-desc-box">
							{{item.city}} {{item.area}}
						</view>
						<view class="list-desc-box">
							面积：{{item.extent}}
							<text class="hotTxt">
								m<text class="hot-txt">2</text>
							</text>
						</view>
						<view class="list-desc-box" v-if="item.type == 'buy'">
							租金：<text :style="{color:'#e45656',}">{{item.rent}}/{{item.unit}}</text>
						</view>
					</view>
					<view class="icon-box">
						<view style="height: 30px;line-height: 30px;border-radius: 5px;width: 80px;font-size: 14px;color: #ffffff;text-align: center;
						margin-bottom: 5px;
						"
						:style="{backgroundColor: indexData.default_color}"
						>
							{{indexData.but_text1}}
						</view>
						<view style="height: 30px;line-height: 30px;border-radius: 5px;width: 80px;font-size: 14px;color: #ffffff;text-align: center;"
						:style="{backgroundColor: indexData.default_color}"
						>
							{{indexData.but_text2}}
						</view>
					</view>
				</view>
			</view>
			<view style="height: 100px;"></view>
			<!--加载中-->
			 
			 
			<!-- 全屏加载 -->
			
		</template> 
		
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				setting:{
					default_img:''
				},
				page_id:0,
				cityname:'',
				citycode:'',
				diyData:[
					{
						data: {
						    pageName: "",
						    searchTitle: "请输入商品名称"
						},
						options: {
						    background: "",
						    tabbarbackground: "rgba(255, 255, 255, 1)",
						    tabbarColor: "#303133",
						    show_tabbar: "0",
						    is_bank: "0",
						    search: "0",
						    location: "0",
						}
					}
				], //diy页面返回数据
				indexData:{
					banner_list:[],
					banner_height:240 ,
					default_color:'#2b85e4',
					notice_list:[],
					count_push:0,
					count_find:0
				},
				list:[],
				//列表渲染数据
				totalCount:0,//总数据量
				apiLoadingStatus:false,
				queryForm:{
					pageNo: 1,
					pageSize: 10,
					keyword: '',
					is_top:1,
					form:'index'
				}
			}
		},
		watch: {
			//监听数据变化
		    citycode(newValue, value) {
				console.log('监听数据变化 新值为：', newValue, value);
				if(newValue != value){
					this.queryData();
				}
		    }
		},
		onLoad: function() {
			this.getSetting();
			this.getBase();
			let citycode = this.$util.getKey('citycode');
			let cityname = this.$util.getKey('cityname');
			if(citycode && cityname){
				this.citycode = citycode;
				this.cityname = cityname;
			}else{
				this.$util.getLocationData((res)=>{
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
		
		onShow() {
			
			this.getPage();
		},
		methods:{
			getPage(){
				this.$request('GetDiyPage', {
					target:'index',
				},{
					showLoading: false
				}).then(async (res)=>{
					const { data } = await res.data;
					console.log('获取自定义页面@@@@@@@@@@@@@@@@@@@@', data)
					if(data.page_id){
						this.page_id = data.page_id;
					}
				})
			},
			//DIY页面返回
			diyBack(data){
				if(data){
					this.diyData = data;
				}
				this.$refs.guipage.endReload();//停止刷新
				
			},
			//获取设置
			getSetting(){
				this.$request('transferStoreGetSetting', {},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.setting){
						this.setting = res.data.data.setting;
					}
				})
			},
			getBase(){
				this.$request('transferStoreGetIndex', {},{
					showLoading: false,
				}).then((res)=>{
					console.log('请求数据', res) 
					if(res.data.data){
						this.indexData = res.data.data;
					}
				})
			},
			//下拉刷新
			reload(){
				this.getBase();
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
				if(this.totalCount > 0 && this.totalCount <= this.list.length){
					return;
				}
				this.apiLoadingStatus = true;
				const queryForm = JSON.parse(JSON.stringify(this.queryForm));
				queryForm.citycode = this.citycode;
				this.$request('transferStoreInfoList', queryForm,{
					showLoading: true
				}).then((res)=>{
					console.log('列表', res)
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
	.city-box{
		display: flex;
		max-width: 32vw;
		overflow: hidden;
		.city-name{
			font-size: 15px;
			color: #303133;
			height: 45px;
			line-height: 45px;
			overflow: hidden;
		}
		.micon{
			height: 45px;
			line-height: 45px;
		}
	}
	.body-box{
		padding: 10px;
		.data-box{
			padding: 10px 0;
			display: flex;
			justify-content: space-between;
			.data-block{
				width: 48%;
				background-color: #f0f0f0;
				border-radius: 5px;
				padding: 15px;
				text-align: center;
				.data-num{
					font-size: 20px;
					color: #ffffff;
					font-weight: bold;
				}
				.data-text{
					font-size: 14px;
					color: #ffffff;
					padding-top: 8px;
				}
			}
		}
		
		.location-box{
			background-color: #ffffff;
			border-radius: 5px;
			padding: 12px 10px;
			.city-wrap{
				display: flex;
				justify-content: space-between;
				.city-left{
					flex: 1;
					color: #606266;
					font-size: 15px;
				}
				.city-right{
					display: flex;
					align-items: center;
					color: #909399;
					font-size: 15px;
				}
			}
		}
	}
	.hotTxt{
		font-size: 16px;
		position: relative; 
	}
	.hot-txt{
		position: relative;
		top: -3px; 
		font-size: 10px;
	}
	.list-body{
		padding: 10px;
		.list-item{
			margin-bottom: 20rpx;
			background-color: #ffffff;
			border-radius: 2px;
			display: flex;
			overflow: hidden;
			.cover-box{
				position: relative;
				width: 80px;
				height: 80px;
				border-radius: 5px;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
				.top-tag{
					position: absolute;
					top: 0;
					left: 0;
					background-color: #e45656;
					color: #ffffff;
					font-size: 12px;
					padding: 2px 5px;
				}
			}
			.list-content{
				flex: 1;
				min-width: 0;
				padding-left: 10px;
				.list-title{
					font-size: 15px;
					color: #303133;
					font-weight: bold;
					padding: 2px 0;
				}
				.list-desc-box{
					font-size: 14px;
					color: #909399;
				}
			}
			.icon-box{
				padding: 10px 5px;
			}
		}
	}
</style>