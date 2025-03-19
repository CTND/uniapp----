<template>
	
	<gui-page
	:refresh="true"
	:customHeader="true"
	:customFooter="custom_Footer"
	@reload="reload"
	:apiLoadingStatus="apiLoadingStatus"
	:customStyle="{
		background: diyData.length ? diyData[0].options.background: '',
		position:'relative'
	}"
	@clickCallback="linkClick"
	ref="guipage"  
	>
		<template v-slot:gHeader>
			<up-navbar height="50px" :autoBack="false">
				<template #left>
					&nbsp;
				</template>
				<template #center>
					<view>&nbsp;</view>
				</template>
				<template #right>
					<view class="nav-right-box" >
						
					</view>
				</template>
			</up-navbar>
			<gui-mp-navigation-spacing></gui-mp-navigation-spacing>
		</template>
		<template v-slot:gBody> 
		
			<!-- <up-sticky offset-top="0" z-index="9999" :disabled="false">
				<view style="display: flex;padding: 10px;"
				:style="{background: System.default_color}"
				>
					<view class="city-box" 
					style="padding-top: 5px;"
					@click="navTo('/pages_public/cityList/index', {login:false})">
						<view class="city-info">
							<view class="micon icon-weizhi" style="color: #2979ff;padding-top: 0px;font-weight: bold"></view>
							<view class="city-name">{{cityname || '选择城市'}}</view>
						</view>
					</view>
					
					<view style="max-width: 200px;">
						<u-search
						placeholder="搜索" 
						v-model="queryForm.keyword" 
						height="32px"
						bgColor="rgba(0,0,0,0.05)"
						:inputStyle="{fontSize:'14px',color:setting.text_color,height:'30px',width:'120px'}"
						:showAction="true" 
						actionText="搜索" 
						:actionStyle="{color:setting.text_color}"
						animation
						@change="searchChange()"
						@search="queryData()"
						@custom="queryData()"
						></u-search>
					</view>
				</view>
			</up-sticky> -->
			
			<!-- 头部部分 -->
			<view class="top-box" :style="{
				backgroundImage:'url(' + setting.top_img + ')',
				height: setting.top_height+'px',
			}">
				<view class="address-search-box">
					<view class="city-box"
					@click="navTo('/pages_public/cityList/index', {login:false})">
						<view class="city-info">
							<view class="micon icon-weizhi"></view>
							<view class="city-name">{{cityname || '选择城市'}}</view>
							<view class="micon icon-jiantou_down"></view>
						</view>
					</view>
					<view style="display: flex;flex-direction: column;justify-content: center;">
						<view style="background-color: rgba(255,255,255,0.2);width: 1px;height: 20px;"></view>
					</view>
					<view style="flex: 1;">
						<u-search
						placeholder="搜索" 
						v-model="queryForm.keyword" 
						height="32px"
						bgColor="rgba(0,0,0,0.0)"
						searchIconColor="#ffffff"
						placeholderColor="#909399"
						:inputStyle="{fontSize:'14px',color:setting.text_color,height:'30px',width:'120px'}"
						:showAction="true" 
						actionText="搜索" 
						:actionStyle="{color:setting.text_color}"
						animation
						@change="searchChange()"
						@search="queryData()"
						@custom="queryData()"
						></u-search>
					</view>
				</view>
			</view>
			
			<view class="body-box" :style="{top: getBodyTop()}">
				<view class="nav-box">
					<template v-for="(item, index) in diyData" :key="index">
						<template v-if="item.name == 'nav'">
							<diy-nav ref="diyNav" :modelData="item"></diy-nav>
						</template>
					</template>
					<!-- 公告 -->
					<view class="notice-box" v-if="notice_list.length">
						<up-notice-bar
						direction='column'
						:text="notice_list"
						duration="2000"
						:bgColor="'#F5F7FA'"
						:icon="$util.img('images/system/lb.png')"
						fontSize="15px"
						color="#36414D"
						:customStyle="{borderRadius:'5px',lineHeight:'64rpx',padding:'16rpx 24rpx'}"
						></up-notice-bar>
					</view>
				</view>
				
				<!-- 热门 -->
				<view class="base-box">
					<view style="display: flex;padding: 15rpx 10rpx;">
						<image :src="$util.img('images/system/hot.png')" style="width: 28rpx;height: 32rpx;display: block;"></image>
						<view class="big-title">热门店铺</view>
						<view class="end-box"
						@click="navTo('/pages_transfershop/info/hotList', {login: false}, {is_hot:1})"
						>
							更多
							<text class="micon icon-iconfonticonfonti2copycopy" style="font-size: 24rpx;"></text>
						</view>
					</view>
					<view style="height: 18rpx;"></view>
					<gui-touch @thStart="thStart" @thMove="thMove" @thEnd="thEnd" style="overflow: hidden;">
						<view class="gui-flex gui-rows gui-nowrap" 
						:style="{width:wrapWidth+'px',transform:'translateX('+scLeft+'px)'}">
							
							<view class="gui-scrollitems" hover-class="gui-tap"
							:style="{
								width:itemWidth+'rpx', 
								
								marginRight:itemMargin+'rpx',
							}" 
							v-for="(item, idx) in itemsIn" :key="idx" 
							@click="navTo('/pages_transfershop/info/detail', {login: false}, {id: item.id})"
							>
								<view class="good-item" >
									<view class="cover-box">
										<image :src="item.img" mode="aspectFill"></image>
									</view>
									<view class="info-box">
										<view class="gui-product-name gui-primary-text">{{item.title}}</view>
										<view class="info-content">
											<view class="desc-box">浏览量：{{item.browse}}</view>
											<view class="price-box">{{item.rent_money}}/月</view>
										</view>
										
									</view>
								</view>
							</view>
						</view>
					</gui-touch>
				</view>
				
				<!-- 案例 -->
				<view class="base-box">
					<view style="display: flex;padding: 15rpx 10rpx;">
						<image :src="$util.img('images/system/success-1.png')" style="width: 28rpx;height: 32rpx;display: block;"></image>
						<view class="big-title">成功案例</view>
						<view class="end-box"
						@click="navTo('/pages_transfershop/info/caseList', {login: false}, {is_case:'1'})"
						>
							更多
							<text class="micon icon-iconfonticonfonti2copycopy" style="font-size: 24rpx;"></text>
						</view>
					</view>
					<view style="height: 18rpx;"></view>
					<up-scroll-list  :indicator="false">
						<view class="good-item" v-for="(item, index) in case_list" :key="index" 
						@click="navTo('/pages_transfershop/info/detail', {login: false}, {id: item.id})"
						style="margin-right: 20rpx;min-width: 280rpx;"
						>
							<view class="cover-box" style="height: 220rpx;">
								<image :src="item.img" mode="aspectFill"></image>
							</view>
							<view class="info-box">
								<view class="gui-product-name gui-primary-text">{{item.title}}</view>
							</view>
						</view>
					</up-scroll-list>
				</view>
				
				<view style="font-weight: 600;font-size: 36rpx;color: #36414D;line-height: 32rpx;padding: 30rpx 0 20rpx 10rpx;">精选店铺</view>
				<view class="goods-body column">
					<view class="good-item" v-for="(item, index) in list" :key="index" 
					@click="navTo('/pages_transfershop/info/detail', {login: false}, {id: item.id})"
					>
						<view class="cover-box">
							<image :src="item.cover_img" mode="aspectFill"></image>
						</view>
						<view class="info-box">
							<view class="gui-product-lines" style="padding: 10rpx 0;">
								<view class="gui-product-name gui-primary-text">{{item.title}}</view>
							</view>
							<view style="display: flex;justify-content: space-between;padding: 10rpx 0;line-height: 14px;">
								<view style="font-size: 28rpx;color: #7A8699;">{{item.cityname}}</view>
								<view style="font-size: 28rpx;color: #7A8699;">
									<text class="micon icon-dingwei2" style="font-size: 28rpx;color: #7A8699;margin-right: 4rpx;"></text>
									{{item.space}}km
								</view>
							</view>
							<view class="demo-tag">
								<view class="demo-tag-owner" 
								v-for="(tag, tindex) in item.tag_list" :key="tindex"
								:style="{ backgroundColor: `rgba(41,95,204, 0.1)` }"
								>
									<text :style="{ color: `rgba(41,95,204, 1)` }">{{tag.name}}</text>
								</view>
							</view>
							
							<!-- <view class="info-content" >
								<view class="gui-product-lines gui-flex gui-row gui-nowrap gui-align-items-center gui-space-between">
									1
								</view>
							</view> -->
							<view class="gui-text-small gui-color-gray"
							style="padding: 0rpx 10rpx 0 10rpx;display: flex;">
								<view style="color: #FF6633;font-size: 28rpx;font-weight: 600;">
									<template v-if="item.nature == 1">
										{{item.show_mianyi == 0 ? item.rent_money+'元/月':'面议'}}
									</template>
									<template v-else>
										{{item.transfer_fee}}万元
									</template>
								</view>
								<view style="padding-left: 30rpx;font-size: 28rpx;padding-top: 0rpx;">
									<text style="font-size: 28rpx;">{{item.extent}}</text>
									<text class="hotTxt" style="font-weight: 400!important;">
										m<text class="hot-txt">2</text>
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="height: 30px;"></view>
			</view>
			
			<!--加载中-->
			 
			
			
			<!-- 右下角挂件 -->
			<view class="fixed-box" v-if="System.cheat==2">
				<view class="micon-box" @click="navTo({event:'kefu'})">
					<image :src="$util.img('images/system/kefu003.png')" mode="widthFix"></image>
				</view>
			</view>
			<push-popup-vue ref="pushPopup"></push-popup-vue>
		</template>
		
	</gui-page>
</template>
<script>
	import pushPopupVue from './push-popup.vue';
export default {
	components:{
		pushPopupVue
	},
	data() {
		return {
			page_id:0,
			cityname:'',
			citycode:'',
			diyData:[
				{
					name: "page",
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
						padding: 0,
					}
				}
			], //diy页面返回数据
			hot_list :  [], //热门
			case_list: [], //案例
			list:[],
			//列表渲染数据
			totalCount:0,//总数据量
			apiLoadingStatus:false,
			queryForm:{
				pageNo: 1,
				pageSize: 20,
				keyword: '',
				citycode: '',
				ref: 'index',
			},
			
			//参数设置
			setting: {
				id: 0,
				top_img: '',
				top_height:150
			},
			//滚动公告 
			notice_list:[], 
			
			width         : 690,
			itemWidth     : 220,
			itemHeight    : 400,
			itemMargin    : 20,
			items         : [],
			duration      : 50,//滚动速度
			
			scLeft        : 0,
			resetWidth    : 0,
			itemsIn       : [],
			timer         : null,
			timer2        : null,
			speed         : 1,
			timer3        : null,
			wrapWidth     : 5000,
			oX            : 0,
			
			bgOpacity: 0.1, // 背景透明度
		    textOpacity: 1, // 文字透明度
			
		}
	},
	watch: {
		citycode(newValue) {
			this.queryForm.citycode = newValue;
			this.queryData();
			this.getWindow();
		}
	},
	onLoad: function(options) {
		this.$util.getLocationData((res)=>{
			if(res.citycode && res.city != ''){
				if(this.citycode == ''){
					let citycode = this.$util.getKey('citycode');
					let cityname = this.$util.getKey('cityname');
					if(citycode && cityname){
						this.citycode = citycode;
						this.cityname = cityname;
					}else{
						this.cityname = res.city;
						this.citycode = res.citycode;
					}
				}
				this.locationdata = res;
			}else{
				this.navTo('/pages_public/cityList/index', {login:false})
			}
		})
		this.getSetting();
		this.getNotice();
	},
	onShow() {
		
		this.getDiyPage();
		this.queryData();
	},
	onReady() {
		const t = this;
		this.getWindow();
	},
	methods: {
		init(){
			var len          = this.items.length;
			this.itemsIn     = this.items;
			this.resetWidth  = len * (this.itemWidth + this.itemMargin);
			this.resetWidth  = uni.upx2px(this.resetWidth);
			this.resetWidth *= -1;
			//this.itemsIn     = this.itemsIn.concat(this.items);
			this.wrapWidth   = len * (this.itemWidth + this.itemMargin) * 2 + 80;
			this.scrollAnimate();
		},
		scrollAnimate : function () {
			//return;
			if(this.scLeft <= this.resetWidth){
				this.scLeft = 0;
				this.timer = setTimeout(()=>{this.scrollAnimate()}, this.duration+200);
			}else{
				this.scLeft -= this.speed
				this.timer   = setTimeout(()=>{this.scrollAnimate()}, this.duration);
			}
		},
		thStart : function(e){
			clearTimeout(this.timer);
			this.timer = null;
			this.oX    = this.scLeft;
		},
		thMove : function (e){
			clearTimeout(this.timer);
			var tmpleft   = this.oX + e[0][0];
			if(tmpleft < this.resetWidth){ tmpleft = this.resetWidth;}
			if(tmpleft > 0){tmpleft = 0}
			this.scLeft   = tmpleft;
		},
		thEnd : function(e){
			this.timer = null
			if(this.timer3 != null){clearTimeout(this.timer3);}
			this.timer3 = setTimeout(()=>{
				this.scrollAnimate();
			}, 500);
		},
		tapme : function(idx){
			this.$emit('itemTap', this.itemsIn[idx]);
		},
		getBodyTop(){
			let top = '200px';
			if(this.setting.top_height){
				top = parseInt(this.setting.top_height) - 50;
				top = top + 'px';
			}
			return top;
		},
		//获取设置
		getSetting(){
			this.$request('transShopSetting', {},{
				showLoading: false,
			}).then((res)=>{
				if(res.data.data.setting){
					this.setting = res.data.data.setting;
				}
			})
		},
		
		//获取公告
		getNotice(){
			this.$request('transShopNoticeList', {},{
				showLoading: false,
			}).then((res)=>{
				if(res.data.data.list){
					this.notice_list = res.data.data.list;
				}
			})
		},
		
		//获取默认首页数据
		getDiyPage(){
			this.$request('GetDiyPage', {target:'index'},{
				showLoading: false,
			}).then((res)=>{
				if(res.data.data.page_id){
					this.page_id = res.data.data.page_id;
				}
				if(res.data.data.diyData){
					this.diyData = res.data.data.diyData;
				}
			})
		},
		//搜索框内容改变
		searchChange(){
			if(this.queryForm.keyword == ''){
				this.showAction = false;
			}else{
				this.showAction = true;
			}
			this.$util.debounce(this.queryData(), 1000);
		},
		queryData() {
			this.queryForm.pageNo = 1;
			this.totalCount = 0;
			this.fetchData();
		},
		fetchData() {
			const t = this;
			this.apiLoadingStatus = true;
			const post_data = JSON.parse(JSON.stringify(this.queryForm));
			post_data.is_top = 1;
			this.$request('transShopInfoList', post_data,{
				showLoading: false,
			}).then((res)=>{
				console.log('数据列表', res)
				if(this.queryForm.pageNo == 1) {
					this.list = [];
				}
				if(res.data.data.list.length){
					let list = res.data.data.list.map((item)=>{
						let space = 0;
						if(item.latitude && item.longitude && t.locationdata.latitude && t.locationdata.longitude){
							space = t.$util.getDistance(item.latitude, item.longitude, t.locationdata.latitude, t.locationdata.longitude);
							//console.log('计算出的距离', space)
						}
						item.space = space.toFixed(2);
						item.sortval = space.toFixed(2);//排序字段
						return item;
					})
					this.list = this.list.concat(list); //追加新数据
					this.list.sort(this.$util.Arrsort);
				}
				this.dataListEvent(res.data.data);
			})
		},
		
		//获取橱窗数据
		getWindow(){
			const post_data = JSON.parse(JSON.stringify(this.queryForm));
			this.$request('transShopWindowList', post_data,{
				showLoading: false,
			}).then((res)=>{
				//console.log('获取橱窗数据', JSON.stringify(res))
				if(res.data.data.hot_list){
					//this.hot_list = res.data.data.hot_list;
					this.items = res.data.data.hot_list;
					this.init();
				}
				if(res.data.data.case_list){
					this.case_list = res.data.data.case_list;
					
				}
				
			})
		},
		//橱窗点击
		itemTap : function (item) {
			this.navTo('/pages_transfershop/info/detail', {login: false}, {id: item.id});
		},
		//下拉刷新
		reload(){
			this.queryData();
		},
		//DIY页面返回
		diyBack(data){
			if(data){
				this.diyData = data;
			}
			this.$refs.guipage.endReload();//停止刷新
			this.$refs.guipage.hiddenloadmore();
			
		},
		
		//kehu 
		callKefu(){
			this.openPopup()
		},
		
		//链接点击事件
		linkClick(e){
			if(e.event == 'push'){
				this.$refs['pushPopup'].open();
			}
		},
	}
}
</script>

<style lang="scss" scoped>
	.fixed-box{
		width: 50px;
		position: fixed;
		right: 10rpx;
		bottom: 150px;
		.micon-box{
			width: 45px;
			height: 45px;
			border-radius: 35px;
			overflow: hidden;
			background-color: #ffffff;
			padding: 16rpx;
			border-radius: 35px;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	
	
	.top-box{
		position: absolute;
		top:0;
		width: 100%;
		height: 600rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat; 
		margin-bottom: 40px;
		padding-top: 60px;
	}
	.hotTxt{
		font-size: 28rpx;
		position: relative; 
		color: #929599
	}
	.hot-txt{
		position: relative;
		top: -3px; 
		font-size: 8px;
		color: #929599
	}
	//位置+搜索框
	.address-search-box{
		width: 686rpx;
		height: 64rpx;
		background: rgba(255,255,255,0.1);
		border-radius: 32rpx;
		border: 2rpx solid rgba(255,255,255,0.2);
		margin: 30px auto;
		display: flex;
		.city-box{
			display: flex;
			max-width: 32vw;
			overflow: hidden;
			padding: 0 20rpx;
			.city-info{
				display: flex;
				.city-name{
					overflow: hidden;
					font-weight: 600;
					font-size: 24rpx;
					color: #FFFFFF;
					line-height: 64rpx;
					text-align: left;
					font-style: normal;
					margin-right: 10rpx;
					margin-left: 4rpx;
				}
				.micon{
					height: 64rpx;
					line-height: 64rpx;
					font-size: 24rpx;
					color: #ffffff;
					font-weight: bold;
				}
			}
			
		}
	}
	.body-box{
		position: absolute;
		top:200px;
		width: 100%;
		padding: 20rpx;
		.nav-box{
			background-color: #ffffff;
			padding: 30rpx 0;
			box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(20,36,51,0.05);
			border-radius: 16rpx;
			.notice-box{
				padding: 0px 30rpx;
				padding-top: 30rpx;
				background: #ffffff;
				border-radius: 8rpx;
			}
		}
		
		
		.base-box{
			background: #FFFFFF;
			box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(20,36,51,0.05);
			border-radius: 16rpx;
			padding: 15rpx;
			margin-top: 20rpx;
			overflow: hidden;
			.big-title{
				font-weight: 600;
				font-size: 32rpx;
				color: #36414D;
				line-height: 32rpx;
				text-align: left;
				font-style: normal;
				flex: 1;
				padding: 0 10rpx;
			}
			.end-box{
				font-weight: 400;
				font-size: 24rpx;
				color: #929599;
				line-height: 24rpx;
				text-align: right;
				font-style: normal;
			}
			// 热门
			.good-item{
				width: 220rpx;
				min-width: 220rpx;
				overflow: hidden;
				background-color: #ffffff;
				border-radius: 10rpx;
				display: inline-block;
				//padding: 16rpx 16rpx 10rpx 16rpx;
				
				.cover-box{
					overflow: hidden;
					width: 100%;
					height: 75px;
					position: relative;
					border-radius: 5px;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.info-box{
					.gui-product-name{
						padding: 10rpx 2px;
						white-space:nowrap;
						overflow: hidden;
						text-overflow:ellipsis;
						font-weight: 400;
						font-size: 14px;
						color: #36414D;
						line-height: 12px;
					}
					.info-content{
						padding-left: 10rpx;
						.desc-box{
							font-weight: 400;
							font-size: 11px;
							color: #929599;
							line-height: 12px;
							text-align: left;
							font-style: normal;
							padding-top: 8rpx;
						}
						.price-box{
							font-weight: 500;
							font-size: 14px;
							color: #FF6633;
							line-height: 12px;
							text-align: justify;
							font-style: normal;
							padding: 20rpx 0 0rpx 0;
						}
					}
					
				}
			}
			
		}
	}
	
	.gui-line-through{
		padding-left: 5px;
	}
	.color-base-bg{
		background-color: red;
	}
	.gui-scrollitems{overflow:hidden; position:relative;}
	
	//双列
	.goods-body.column{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding:20rpx 0;
		.good-item{
			width: calc( (100% - 6px) / 2 );
			overflow: hidden;
			background-color: #ffffff;
			border-radius: 16rpx 16rpx 0rpx 0rpx;
			//margin-left: 5px;
			margin-bottom: 10px;
			// display: flex;
			// flex-direction: column;
			// justify-content: space-between;
			.cover-box{
				overflow: hidden;
				height: 130px;
				position: relative;
				// padding: 10rpx;
				padding-bottom: 0;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.info-box{
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 0px 5px 8px 5px;
				.gui-product-lines{
					flex: 1;
					padding: 2px;
					.gui-product-name{
						
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						font-size:30rpx; 
						line-height:36rpx;
						font-weight: bold;
						color: #36414D;
					}
				}
				
				.info-content{
					display: block;
					.but-box{
						padding-top: 2px;
					}
				}
				
			}
		}
	}
	
	.demo-tag {
		display: flex;
		padding: 16rpx 0;
		flex-wrap: wrap;
		height: 60px;
		overflow: hidden;
		.demo-tag-owner {
			background-color: #295FCC;
			color: #ffffff;
			border-radius: 50rpx;
			font-size: 24rpx;
			margin-right: 8rpx;
			height: 40rpx;
			line-height: 40rpx;
			padding: 0 16rpx;
			margin-bottom: 4rpx;
		}
		
		.demo-tag-text {
			border: 1px solid #f0f0f0;
			color: #606266;
			margin-left: 10rpx;
			border-radius: 50rpx;
			line-height: 1;
			padding: 4rpx 14rpx;
			display: flex;
			align-items: center;
			border-radius: 50rpx;
			font-size: 20rpx;
			line-height: 1;
		}
	}
</style>