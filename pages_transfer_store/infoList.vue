<template>
	<gui-page  
	
	:refresh="true"
	:loadmore="true" 
	
	:customHeader="false"
	:customFooter="true"
	:apiLoadingStatus="apiLoadingStatus" 
	@reload="reload" 
	@loadmorefun="loadmorefun" 
	ref="guipage"
		>
		<template v-slot:gHeader >
			<view class="type-box" v-if="showType == '1'">
				<view class="type-block" @click="showTypeBox(1, 'citycode')">
					<view class="type-title">{{cityname==''?'区域':cityname}}</view>
					<view class="micon" :class="[typeIndex == 1 ? 'icon-jiantou_down-copy' : 'icon-jiantou_down']"></view>
				</view>
				<view class="type-block" @click="showTypeBox(2, 'class_id')">
					<view class="type-title">店铺类型</view>
					<view class="micon" :class="[typeIndex == 2 ? 'icon-jiantou_down-copy' : 'icon-jiantou_down']"></view>
				</view>
				<view class="type-block" @click="showTypeBox(3, 'extent')">
					<view class="type-title">面积</view>
					<view class="micon" :class="[typeIndex == 3 ? 'icon-jiantou_down-copy' : 'icon-jiantou_down']"></view>
				</view>
				<!-- <view v-if="showType == '1'" class="type-block" @click="showTypeBox(4, 'type')">
					<view class="type-title">类型</view>
					<view class="micon" :class="[typeIndex == 4 ? 'icon-jiantou_down-copy' : 'icon-jiantou_down']"></view>
				</view> -->
			</view>
		</template>
		
		<template v-slot:gBody>
			<view class="list-body">
				<view class="list-item" v-for="(item, index) in list" :key="index"
				@click="navTo('/pages_transfer_store/infoDetail', {login:false}, {id:item.id})"
				>
					<view class="cover-box">
						<image :src="item.img ? item.img : setting.default_img" mode="aspectFill"></image>
					</view>
					<view class="list-content">
						<view class="list-title text-overflow">
							{{item.title}}
						</view>
						<view class="list-desc-box">
							{{item.realname}} {{item.mobile}}
						</view>
						<!-- <view class="list-desc-box">
							{{item.city}} {{item.area}}
						</view> -->
						<view class="list-desc-box">
							面积：{{item.extent}}
							<text class="hotTxt">
								m<text class="hot-txt">2</text>
							</text>
						</view>
						<view v-if="item.type == 'buy'" class="list-desc-box">
							租金：<text :style="{color:'#e45656'}">{{item.rent}}/{{item.unit}}</text>
						</view>
					</view>
					<view class="icon-box">
						<view style="height: 30px;line-height: 30px;border-radius: 5px;width: 80px;font-size: 14px;color: #ffffff;text-align: center;
						margin-bottom: 5px;
						"
						:style="{backgroundColor: setting.default_color}"
						>
							{{indexData.but_text1}}
						</view>
						<view style="height: 30px;line-height: 30px;border-radius: 5px;width: 80px;font-size: 14px;color: #ffffff;text-align: center;"
						:style="{backgroundColor: setting.default_color}"
						>
							{{indexData.but_text2}}
						</view>
					</view>
				</view>
			</view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" text="暂无数据" marginTop="25vh"></u-empty>
			
			<!-- 全屏加载 -->
			
			
			<!--加载中-->
			 
			 
			
			<u-popup
			:show="typePopup" 
			mode="top"
			:round="0"
			@close="closeTypePopup()"
			>
				<view class="popup-mini-box" >
					<scroll-view  scroll-y="true" class="scroll-Y" >
						<view class="list-box" v-if="typeIndex == 2">
							<view class="list" hover-class="list-hover" hover-stay-time="100"
							v-for="(item, index) in type_list" :key="index"
							@click="checkClass(item)"
							>
								<view class="list-item" >
									<view class="list-title">
										{{item.title}}
									</view>
									<view class="action-box">
										<sd-icon 
										v-if="class_id == item.id"
										name="icon-xuanzhong"
										size="20" color="#287eef" top="0" :customStyle="{textAlign:'center', display:'block'}"></sd-icon>
									</view>
								</view>
							</view>
						</view>
						<view class="list-box" v-if="typeIndex == 3">
							<view class="list" hover-class="list-hover" hover-stay-time="100"
							v-for="(item, index) in ty2_list" :key="index"
							@click="checkTy2(index)"
							>
								<view class="list-item" >
									<view class="list-title">
										{{item.title}}
									</view>
									<view class="action-box">
										<sd-icon 
										v-if="ty2Index == index"
										name="icon-xuanzhong"
										size="20" color="#287eef" top="0" :customStyle="{textAlign:'center', display:'block'}"></sd-icon>
									</view>
								</view>
							</view>
						</view>
						<view class="list-box" v-if="typeIndex == 4">
							<view class="list" hover-class="list-hover" hover-stay-time="100" @click="checkType('find')">
								<view class="list-item" >
									<view class="list-title">
										找店
									</view>
									<view class="action-box">
										<sd-icon 
										v-if="queryForm.type == 'find'"
										name="icon-xuanzhong"
										size="20" color="#287eef" top="0" :customStyle="{textAlign:'center', display:'block'}"></sd-icon>
									</view>
								</view>
							</view>
							<view class="list" hover-class="list-hover" hover-stay-time="100" @click="checkType('buy')">
								<view class="list-item" >
									<view class="list-title">
										出租/出售
									</view>
									<view class="action-box">
										<sd-icon 
										v-if="queryForm.type == 'buy'"
										name="icon-xuanzhong"
										size="20" color="#287eef" top="0" :customStyle="{textAlign:'center', display:'block'}"></sd-icon>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</u-popup>
			
		</template>
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
			setting:{
				default_img:''
			},
			list:[],
			//列表渲染数据
			totalCount:0,//总数据量
			apiLoadingStatus:false,
			queryForm:{
				pageNo: 1,
				pageSize: 10,
				keyword: '',
				type:'find'
			},
			showType:'1',
			use_city:'1', //是否使用定位
			//分类选择器
			typeIndex:null,
			typePopup:false,
			cityname:'',
			citycode:'',
			type_list:[],
			class_id:0,
			class_title:'',
			//面积
			ty2Index:null,
			ty2_list:[
				{
					title: '不限',
					vals:[]
				},
				{
					title: '0-60平米',
					vals: [0, 60]
				},
				{
					title: '60-100平米',
					vals: [60, 100]
				},
				{
					title: '100-300平米',
					vals: [100, 300]
				},
				{
					title: '300平米以上',
					vals: [300, '']
				}
			],
			
			indexData:{
				banner_list:[],
				banner_height:240 ,
				default_color:'#2b85e4',
				notice_list:[],
				count_push:0,
				count_find:0
			},
			
		}
	},
	watch:{
		citycode(){
			this.queryData();
		}
	},
	onLoad: function(options) {
		console.log('传递过来的数据', options)
		//this.isLogin();
		if(options.type){
			this.queryForm.type = options.type;
		}
		if(options.showType !== undefined){
			this.showType = options.showType;
		}
		if(options.use_city !== undefined){
			this.use_city = options.use_city;
		}
		if(options.title){
			uni.setNavigationBarTitle({
				title: options.title
			});
		}
		
	},
	onShow() {
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
		this.queryData();
		this.getSetting();
		this.getTypes();
		this.getBase();
		
	},
	methods: {
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
		getTypes(){
			this.type_list = [];
			this.$request('transferStoreTypeList', {},{
				showLoading: false
			}).then((res)=>{
				if(res.data.data.list){
					this.type_list = res.data.data.list;
				}
				this.type_list.unshift({
					id:0,
					title:'全部类型'
				});
			})
		},
		//打开分类选择器
		showTypeBox(e, ref){
			if(ref == 'citycode'){
				this.navTo('/pages_public/cityList/index', {login:true});
				return;
			}else{
				this.typeIndex = e;
			}
			this.typePopup = true;
		},
		//关闭分类选择器
		closeTypePopup(){
			console.log('closeTypePopup')
			this.typePopup = false;
			this.typeIndex = null;
		},
		//选择分类
		checkClass(item){
			this.class_id = item.id;
			this.class_title = item.title;
			this.closeTypePopup();
			this.queryData();
		},
		checkTy2(i){
			this.ty2Index = i;
			this.closeTypePopup();
			this.queryData();
		},
		checkType(e){
			this.queryForm.type = e;
			this.closeTypePopup();
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
			const queryForm = JSON.parse(JSON.stringify(this.queryForm));
			queryForm.citycode = this.citycode;
			queryForm.use_city = this.use_city;
			queryForm.class_id = this.class_id;
			if(this.ty2Index !== null){
				queryForm.vals = this.ty2_list[this.ty2Index].vals;
			}
			console.log('queryForm', queryForm)
			this.$request('transferStoreFindInfoList', queryForm,{
				showLoading: true
			}).then((res)=>{
				console.log('列表', res)
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
		
		//模态弹窗回调
		popupCallback(v, options){
			const t = this;
			this.$refs['guipage'].modalPopupClose();
		}
	}
}
</script>

<style lang="scss" scoped>
	.type-box{
		background-color: #ffffff;
		display: flex;
		justify-content: space-between;
		padding: 3px 10px 0 10px;
		.type-block{
			width: 25%;
			display: flex;
			text-align: center;
			padding: 8px 0;
			justify-content: center;
			overflow: hidden;
			.type-title{
				font-size: 15px;
				color: #606266;
			}
			.micon{
				padding-left: 5px;
				color: #909399;
				font-weight: bold;
			}
		}
	}
	
	.popup-mini-box{
		height: 50vh;
		.popup-but-title{
			padding: 16px 15px 15px;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #e7e6e4;
			.but-box{
				font-size: 17px;
			}
			.cancel{
				color: #909399;
			}
			.true{
				color: #287eef;
			}
		}
		.scroll-Y{
			height: 50vh;
			.list-box{
				.list{
					padding: 0 15px 0 20px;
					.list-item{
						padding: 5px 0;
						display: flex;
						justify-content: space-between;
						border-bottom: 1px solid #f4f4f5;
						.list-title{
							font-size: 15px;
							color: #303133;
							flex: 1;
							max-height: 30px;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
							min-width: 0;
							padding: 2px 0;
						}
						.action-box{
							padding-right: 10px;
						}
					}
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
			border-radius: 5px;
			display: flex;
			overflow: hidden;
			.cover-box{
				width: 80px;
				height: 80px;
				border-radius: 5px;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.list-content{
				flex: 1;
				min-width: 0;
				padding-left: 10px;
				.list-title{
					font-size: 16px;
					color: #303133;
				}
				.list-desc-box{
					font-size: 12px;
					color: #909399;
					padding-top: 2px;
				}
			}
			.icon-box{
				padding: 10px 5px;
			}
		}
	}
</style>