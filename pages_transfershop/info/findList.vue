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
				<view class="list-item" v-for="(item, index) in list" :key="index"
				@click="toDetail(index)"
				>
					<view class="list-content">
						<view class="list-title text-overflow">
							找 {{item.cityname}} {{item.area_data.name}} 的店铺
						</view>
						<view class="list-desc-box" >
							面积要求：{{item.extent_min>0?item.extent_min:'不限'}} - {{item.extent_max>0?item.extent_max:'不限'}} <text class="hotTxt">m<text class="hot-txt">2</text></text>
						</view>
						<view class="list-desc-box">
							租金要求：<text style="color: #FF6633;">{{item.rent_money_min>0?item.rent_money_min:'不限'}} - {{item.rent_money_max>0?item.rent_money_max:'不限'}} 元/月</text> 
						</view>
						<view class="list-desc-box">
							转&nbsp;&nbsp;让&nbsp;&nbsp;费：<text style="color: #FF6633;">{{item.transfer_fee_min>0?item.transfer_fee_min:'不限'}} - {{item.transfer_fee_max>0?item.transfer_fee_max:'不限'}} 万元</text> 
						</view>
						<view class="list-desc-box">
							发布时间：{{item.create_time}}
						</view>
					</view>
					<view class="icon-box" :style="{color:'#18b566'}" @click="$util.callPhone(item.mobile)">
						<view class="micon icon-dianhua1" style="color: #FF6633;font-size: 32px;margin-top: 20px;"></view>
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
				citycode:''
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
	onLoad: function() {
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
			this.apiLoadingStatus = true;
			const post_data = JSON.parse(JSON.stringify(this.queryForm));
			post_data.citycode = this.citycode;
			this.$request('transShopfindList', post_data,{
				showLoading: false,
			}).then((res)=>{
				console.log('数据列表', res)
				if(this.queryForm.pageNo == 1) {
					this.list = [];
				}
				if(res.data.data.list.length){
					let list = res.data.data.list;
					this.list = this.list.concat(list); //追加新数据
					/*let list = res.data.data.list.map((item)=>{
						let space = 0;
						if(item.latitude && item.longitude && t.locationdata.latitude && t.locationdata.longitude){
							space = t.$util.getDistance(item.latitude,item.longitude,t.locationdata.latitude, t.locationdata.longitude);
						}
						item.space = space.toFixed(2);
						item.sortval = space.toFixed(2);//排序字段
						return item;
					})
					this.list = this.list.concat(list); //追加新数据
					this.list.sort(this.$util.Arrsort);
					*/
				}
				this.dataListEvent(res.data.data);
			})
		},
		
		
	}
}
</script>

<style lang="scss" scoped>
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
					font-size: 16px;
					font-weight: bold;
					color: #303133;
				}
				.list-desc-box{
					font-size: 14px;
					color: #909399;
					padding-top: 10rpx;
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