<template>
	<gui-page  
	:refresh="true"
	:loadmore="true"
	:customHeader="true" 
	:customFooter="custom_Footer"
	@reload="queryData"
	@loadmorefun="fetchData"
	:apiLoadingStatus="apiLoadingStatus" 
	:customStyle="{
		backgroundColor:System.full_bg_color,
		padding:'0 10px'
	}"
	:customHeaderStyle="{height:'60px'}"
	@popup-callback="popupCallback"
	ref="guipage"
		>
		<template v-slot:gHeader>
			<view class="address-search-box" style="background-color: #ffffff;">
				<view class="city-box"
				@click="navTo('/pages_public/cityList/index', {login:false})">
					<view class="city-info">
						<view class="micon icon-weizhi"></view>
						<view class="city-name">{{cityname || '选择城市'}}</view>
						<view class="micon icon-jiantou_down"></view>
					</view>
				</view>
				<view style="display: flex;flex-direction: column;justify-content: center;">
					<view style="background-color: #909399;width: 1px;height: 20px;"></view>
				</view>
				<view style="flex: 1;">
					<u-search
					placeholder="搜索" 
					v-model="queryForm.keyword" 
					height="32px"
					bgColor="rgba(0,0,0,0.0)"
					searchIconColor="#909399"
					placeholderColor="#909399"
					:inputStyle="{fontSize:'14px',color:'#909399',height:'70rpx',width:'120px'}"
					:showAction="true" 
					actionText="搜索" 
					:actionStyle="{color:'#36414D'}"
					animation
					@change="searchChange()"
					@search="queryData()"
					@custom="queryData()"
					></u-search>
				</view>
			</view>
		</template>
		<template v-slot:gBody>
			
			<view class="goods-body column">
				<view class="good-item" v-for="(item, index) in list" :key="index" 
				@click="navTo('/pages_transfershop/info/detail', {login: false}, {id: item.id})"
				>
					<view class="cover-box">
						<image :src="item.cover_img" mode="aspectFill"></image>
					</view>
					<view class="info-box" :style="{backgroundImage:'url(' + $util.img('images/modules/sd_transshop/over.png') + ')'}"
					style="background-size: 50px 50px;background-repeat: no-repeat;background-position: 90% 90%;"
					>
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
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" 
			text="暂无数据" 
			marginTop="20vh"
			textColor="#c0c4cc"
			></u-empty>
			
			
			<!-- 全屏加载 -->
			
			
		</template>
		
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
			cityname:'',
			citycode:'',
			list:[],
			//列表渲染数据
			totalCount:0,//总数据量
			apiLoadingStatus:false,
			queryForm:{
				pageNo: 1,
				pageSize: 10,
				keyword: '',
				is_case:0
			}
		}
	},
	watch: {
		//监听数据变化
	    citycode: {
	    	handler (newValue, value) {
	    		if(newValue != value){
					this.queryForm.citycode = newValue;
	    			this.queryData();
	    		}
	    	},
			deep: true
	    },
	},
	onLoad: function(options) {
		console.log('收到擦含糊', options)
		if(options.is_case){
			this.queryForm.is_case = options.is_case;
		}
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
	},
	onShow() {
		
	},
	methods: {
		//搜索框内容改变
		searchChange(){
			console.log('searchChange')
			if(this.queryForm.keyword == ''){
				this.showAction = false;
				this.fetchData();
			}else{
				this.showAction = true;
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
			const post_data = JSON.parse(JSON.stringify(this.queryForm));
			post_data.citycode = this.citycode;
			this.$request('transShopOtherList', post_data,{
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
				}
				this.dataListEvent(res.data.data);
			})
		},
		
		
		
	}
}
</script>

<style lang="scss" scoped>
	//位置+搜索框
	.address-search-box{
		width: 90%;
		height: 70rpx;
		line-height: 70rpx;
		background: rgba(255,255,255,0.1);
		border-radius: 32rpx;
		border: 2rpx solid rgba(255,255,255,0.2);
		margin: 10px auto;
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
					color: #36414D;
					// line-height: 64rpx;
					text-align: left;
					font-style: normal;
					margin-right: 10rpx;
					margin-left: 4rpx;
				}
				.micon{
					height:70rpx;
					// line-height: 64rpx;
					font-size: 24rpx;
					color: #36414D;
					font-weight: bold;
				}
			}
			
		}
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