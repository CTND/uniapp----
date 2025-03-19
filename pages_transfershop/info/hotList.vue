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
			
			<view class="list-body">
				<view class="block-box" v-for="(item, index) in list" :key="index"
				@click="navTo('/pages_transfershop/info/detail', {login: false}, {id: item.id})"
				>
					<view class="list-item">
						<view class="cover-box">
							<view v-if="item.tag_text" class="top-tag">{{item.tag_text}}</view>
							<image :src="item.cover_img" mode="aspectFill"></image>
						</view>
						<view class="list-content" style="padding-right: 10rpx;">
							<view class="list-title">{{item.title}}</view>
							<view class="area-box" style="padding-top: 6rpx;">
								<view class="area-text" style="color: #7A8699;">
									{{item.area_data.name + ' | '+item.area_data.street_name}}
								</view>
								<view class="space-box" style="color: #7A8699;">{{item.space}}km</view>
							</view>
							
							<view class="list-tag-box" style="padding-right: 0;">
								<view class="tag-box">
									<view class="tag-flex">
										<view class="tag" v-for="(tag, i) in item.tag_list" :key="i" 
										:style="{ backgroundColor: `rgba(41,95,204, 0.1)` }">
											<text :style="{ color: `rgba(41,95,204, 1)` }">{{tag.name}}</text>
										</view>
									</view>
								</view>
							</view>
							<view class="list-desc-box">
								<view class="desc-price">
									<template v-if="item.nature == 1">
										{{item.show_mianyi == 0 ? item.rent_money+'元/月':'面议'}}
									</template>
									<template v-else>
										{{item.transfer_fee}}万元
									</template>
								</view>
								<view class="desc-text-box" style="padding-left: 20px;color: #7A8699;">
									<text>{{item.extent}}</text><text class="hotTxt">m<text class="hot-txt">2</text></text>
								</view>
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
				// is_hot:0,
				// nature:1,
				// type:0,
				citycode:'',
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
		if(options.is_hot){
			this.queryForm.is_hot = options.is_hot;
		}
		if(options.nature){
			this.queryForm.nature = options.nature;
		}
		if(options.type){
			this.queryForm.type = options.type;
		}
		if(options.title){
			uni.setNavigationBarTitle({
				title: options.title
			});
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
		font-size: 10px;
		color: #929599
	}
	.tag-box{
		padding: 5px 10px;
		.tag-flex{
			display: flex;
			flex-wrap: wrap;
			.tag{
				padding: 2px 5px;
				border-radius: 2px;
				font-size: 13px;
				color: #606266;
				background-color: #ffffff;
				margin-right: 5px;
				margin-bottom: 5px;
			}
		}
	}
	.list-body{
		padding: 10px;
		.block-box{
			box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(20,36,51,0.05);
			border-radius: 16rpx;
			background-color: #ffffff;
			margin-bottom: 20rpx;
			.list-item{
				display: flex;
				padding: 10px;
				.cover-box{
					width: 120px;
					height: 100px;
					border-radius: 16rpx;
					overflow: hidden;
					position: relative;
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
						z-index: 998;
					}
				}
				.list-content{
					flex: 1;
					padding-left: 8px;
					padding-right: 10px;
					min-width: 0;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.list-title{
						font-size: 28rpx;
						color: #36414D;
						font-weight: bold;
						line-height: 18px;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}
					.list-desc-box{
						display: flex;
						padding-top: 1px;
						.desc-text-box{
							flex: 1;
							color: #606266;
							font-size: 14px;
						}
						.desc-price{
							color: red;
							font-size: 14px;
						}
					}
					.list-tag-box{
						padding: 10rpx 0;
						.tag-box{
							flex: 1;
							padding: 0;
							.tag-flex{
								display: flex;
								flex-wrap: wrap;
								.tag{
									background-color: #295FCC;
									color: #ffffff;
									border-radius: 50rpx;
									font-size: 24rpx;
									margin-right: 8rpx;
									height: 40rpx;
									line-height: 42rpx;
									padding: 0 16rpx;
									margin-bottom: 4rpx;
									display: inline-block;
								}
							}
						}
					}
					.area-box{
						color: #606266;
						font-size: 14px;
						display: flex;
						.area-text{
							flex: 1;
						}
						.space-box{
							padding-left: 10px;
							color: #909399;
							font-size: 13px;
						}
					}
				}
			}
		}
	}
</style>