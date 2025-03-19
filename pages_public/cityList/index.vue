<template>
	<gui-page 
	 
	ref="guipage"
		>
		<template v-slot:gBody>
			<view class="gui-flex1 gui-flex gui-columns">
				<!-- 搜索组件 -->
				<view 
				class="gui-city-search gui-bg-white gui-dark-bg-level-1">
					<gui-search 
					@clear="search" 
					@inputting="search"></gui-search>
				</view>
				<view 
				style="margin-top:0rpx;" 
				class="gui-padding-x">
					<text 
					class="gui-h6 gui-block gui-primary-text">当前城市 : {{currentCity}}</text>
				</view>
				<view class="gui-flex1 gui-relative" style="background-color: #ffffff;">
					<scroll-view
					:scroll-y="true" 
					:scroll-into-view="showCityId" 
					:scroll-with-animation="true"
					class="gui-absolute-full"
					style="height: 100vh;"
					>
						<view 
						class="gui-padding-x" 
						id="pageTop">
							<text 
							class="gui-h6 gui-block gui-primary-text" 
							style="padding-bottom:10rpx;">热门城市</text>
							<view 
							class="gui-flex gui-rows gui-wrap gui-space-between" 
							style="padding-bottom:10rpx; padding-right:30rpx;">
								<text 
								class="hotcity-item gui-block gui-bg-white gui-dark-bg-level-3" 
								v-for="(item, index) in hotCities" 
								:key="index" 
								:data-cityname="item.name" 
								:data-citycode="item.citycode" 
								@tap="chooseCity">{{item.name}}</text>
							</view>
							<view
							v-for="(cities, index) in cityData" 
							:key="index">
								<text 
								class="gui-city-AZ gui-block gui-primary-text" 
								:id="'gui-city-AZ-'+index">{{index}}</text>
								<text 
								class="city-item gui-block gui-border-b gui-primary-text" 
								:id="'gui-city-list-'+city.citycode" 
								v-for="(city, cindex) in cities" 
								:key="cindex" 
								:data-cityname="city.name" 
								:data-citycode="city.citycode" 
								@tap="chooseCity"
								style="font-size: 15px;"
								>{{city.name}}</text>
							</view>
						</view>
					</scroll-view>
					<view class="gui-city-AZ-right">
						<text class="gui-city-AZ-right-item gui-block gui-transition-all gui-primary-text" 
						v-for="(char, index) in AZ" 
						:key="index"
						:class="[rightTapIdx == index ? 'gui-bg-black' : '', rightTapIdx == index ? 'gui-color-white' : '']" 
						:data-char="char" 
						:data-idx="index" 
						@tap="changAZ" 
						style="font-size: 15px;margin-bottom: 5px"
						>{{char}}</text>
					</view>
				</view>
			</view>
		</template>
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
			cityData     : [],
			AZ           : [],
			currentCity  : "北京市",
			hotCities : [
				{
					name : "北京市",
					citycode: '010', 
					adcode: '11000',
				},
				{
					citycode: '021',
					adcode: '310000',
					name: "上海市",
				},
				{
					citycode: '0571',
					adcode: '330100',
					name: "杭州市",
				},
				{
					name: "西安市",
					citycode: '029',
					adcode: '610100',
				},
				{
					citycode: '022',
					adcode: '120000',
					name: "天津市",
				},
				{
					name: "芜湖市",
					citycode: '0553',
					adcode: '340200',
				}
			],
			showCityId  : '',
			searchTimer : null,
			searchIndex : -1,
			rightTapIdx : -1,
			
		}
	},
	onLoad() {
		this.$request('getCityData', {
			ref:'city_data'
		},{
			showLoading: false,
		}).then((res)=>{
			console.log('获取城市数据', res)
			if(res.data.data.list.city_data){
				this.cityData = res.data.data.list.city_data.cityData;
			}
			if(res.data.data.list.city_data){
				this.AZ = res.data.data.list.city_data.AZ;
			}
		})
	},
	onShow() {
		var cityname = uni.getStorageSync('cityname');
		if(cityname){
			this.currentCity = cityname;
		}
	},
	methods:{
		// 选择
		chooseCity : function(e){
			// 数据保存在 cityname 和 citycode
			var cityname = e.currentTarget.dataset.cityname;
			var citycode = e.currentTarget.dataset.citycode;
			/*uni.showToast({
				title :cityname + " [ "+ citycode +" ]",
				icon  : "none"
			});*/
			//console.log('数据保存在 cityname 和 citycode', cityname, citycode)
			this.currentCity = cityname;
			//设置本地缓存
			this.$util.setKey('citycode', citycode);
			this.$util.setKey('cityname', cityname);
			
			let pages = getCurrentPages();
			let prePage = pages[pages.length - 2];
			//设置数据
			prePage.$vm.cityname = cityname;
			prePage.$vm.citycode = citycode;
			this.goBack();
		},
		// 搜索
		search : function(k){
			k = k.toLowerCase();
			if(k == ''){
				this.showCityId = 'pageTop';
				return;
			}
			if(this.searchTimer != null){
				clearTimeout(this.searchTimer);
			}
			this.searchTimer = setTimeout(()=>{
				this.searchBase(k);
			}, 500);
		},
		searchBase : function(k){
			this.searchIndex = -1;
			for(var i in this.cityData){
				for(var ii = 0; ii < this.cityData[i].length; ii++){
					if(this.cityData[i][ii].name.indexOf(k) == 0 || this.cityData[i][ii].pinyin.indexOf(k) == 0){
						this.searchIndex = this.cityData[i][ii].citycode;
						break;
					}
				}
				if(this.searchIndex != -1){break ;}
			}
			if(this.searchIndex != -1){
				this.showCityId = 'gui-city-list-'+this.searchIndex;
			}
		},
		// 点击切换
		changAZ : function(e){
			this.rightTapIdx = -1;
			var char         = e.currentTarget.dataset.char;
			this.showCityId  = 'gui-city-AZ-' + char;
			this.rightTapIdx = e.currentTarget.dataset.idx;
			setTimeout(()=>{
				this.rightTapIdx = -1;
			}, 2000);
		}
	}
}
</script>
<style scoped>
.gui-h6{line-height:80rpx;font-size:28rpx;}
.gui-city-search{padding:20rpx 100rpx;}
.gui-city-AZ{font-weight:700; line-height:88rpx; font-size:30rpx;}
.gui-city-AZ-right{width:50rpx; position:fixed; right:0; top:80px;}
/* #ifdef H5 */
.gui-city-AZ-right{top:110px;}
/* #endif */
.gui-city-AZ-right-item{line-height:38rpx; height:38rpx; width:38rpx;border-radius:40rpx; font-size:14px; text-align:center;}
.hotcity-item{width:210rpx; font-size:26rpx; height:70rpx; line-height:70rpx; border-radius:10rpx; text-align:center; overflow:hidden; margin:8rpx 5rpx;}
.city-item{line-height:88rpx; height:88rpx; font-size:26rpx;}
</style>