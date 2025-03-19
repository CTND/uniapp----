<template>
	<view>
		<up-popup :show="showStore" :round="10" closeable @close="showStore = false">
			<view class="popup-box" style="height: 80vh;">
				<view class="popup-but-title">
					<view class="but-box cancel"></view>
					<view style="flex: 1;text-align: center;font-size: 17px;">选择提货门店</view>
					<view class="but-box true">&nbsp;&nbsp;&nbsp;</view>
				</view>
				<scroll-view scroll-y="true" style="height: 70vh;background-color:#f0f0f0;padding: 10px;">
					<view class="store-item" v-for="(store, sindex) in store_list" :key="sindex"
					@click="selectStore(store)"
					>
						<view class="content-box">
							<view class="store-name" style="flex: 1;font-weight: bold;">
								{{store.store_name}}
							</view>
							<view class="store-status-box" :style="{backgroundColor:store.run_data.tag_color}">
								{{store.run_data.name}}
							</view>
							<view style="font-size: 26rpx;color: #909399;line-height: 25px;">
								营业时间:{{store.start_time}} - {{store.end_time}}
							</view>
							<view class="store-address-box">
								<text class="address">{{store.address}}</text>
							</view>
						</view>
						<view class="select-box">
							<!-- <view class="but-box" >选择</view> -->
							<view style="font-size: 24rpx;color: #909399;line-height: 25px;text-align: center;">{{store.space}}km</view>
							<view style="display: flex;justify-content: space-between;padding-top: 20px;">
								<view class="micon icon-daohang" @click.stop="$util.toLocation(store.latitude, store.longitude)"></view>
								<view class="micon icon-dianhua" 
								style="margin-left: 15px;"
								@click.stop="$util.callPhone(store.mobile)"></view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</up-popup>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				showStore: false, //是否显示门店列表
				store_list: [], //提货门店列表
			}
		},
		methods:{
			//打开门店
			open(){
				this.getStoreList();
			},
			//获取提货门店
			getStoreList(){
				const t = this;
				this.$request('storeList', {
					citycode: this.locationdata.citycode,
				},{
					showLoading: true,
				}).then((res)=>{
					if(res.data.data.list){
						console.log('准备选择门店', res)
						//this.store_list = res.data.data.list;
						let list = res.data.data.list.map((item)=>{
							let space = 0;
							if(item.latitude && item.longitude && t.locationdata.latitude && t.locationdata.longitude){
								space = t.$util.getDistance(item.latitude,item.longitude,t.locationdata.latitude, t.locationdata.longitude);
							}
							item.space = space.toFixed(2);
							item.sortval = space.toFixed(2);//排序字段
							return item;
						})
						this.store_list = list; //追加新数据
						this.store_list.sort(this.$util.Arrsort);
						this.showStore = true;
					}else{
						this.msg('没有可选门店');
					}
				})
			},
			//选择门店
			selectStore(store){
				this.$util.setKey('store', JSON.parse(JSON.stringify(store)))
				this.$emit('store-callback', JSON.parse(JSON.stringify(store)));
			},
		}
	}
</script>

<style lang="scss" scoped>
	.popup-box{
		height: 60vh;
		background-color:#f0f0f0;
		.popup-title-box{
			border-bottom: 1px solid #e7e6e4;
			height: 50px;
			line-height: 50px;
			text-align: center;
			font-size: 17px;
			color: #303133;
			font-weight: bold;
		}
		.popup-but-title{
			padding: 16px 15px 15px;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #e7e6e4;
			position: relative;
			background-color: #fff;
			.but-box{
				font-size: 17px;
			}
			.cancel{
				color: #909399;
				position: absolute;
				left: 15px;
				top: 15px;
			}
			.true{
				color: #287eef;
			}
		}
	}
	//门店列表
	.space-box{
		padding: 0 5px;
		font-size: 12px;
		color: #606266;
		padding-top: 6rpx;
	}
	.store-item{
		display: flex;
		background-color: #ffffff;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		margin-bottom: 10rpx;
		.cover-box{
			width: 50px;
			height: 50px;
			border-radius: 5px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.content-box{
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			min-width: 0;
			padding-right: 10rpx;
			.store-name{
				font-size: 16px;
				color: #303133;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
			}
			.store-status-box{
				width: 50px;
				height: 40rpx;
				line-height: 40rpx;
				border-radius: 4rpx;
				text-align: center;
				font-size: 24rpx;
				color: #ffffff;
				background-color: #e60213;
				margin: 5px 0;
			}
			.store-address-box{
				font-size: 26rpx;
				color: #909399;
				line-height: 1.5;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				.micon{
					color:#909399;
				}
				.address{
					color: #909399;
				}
				
			}
		}
		.select-box{
			
			padding-left: 10px;
			.micon{
				width: 44rpx;
				height: 44rpx;
				line-height: 40rpx;
				padding: 4rpx;
				text-align: center;
				background-color: #fbefef;
				color: #e60213;
				border-radius: 60rpx;
			}
			.but-box{
				width: 55px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				border-radius: 50px;
				background-color: $uni-color-yellow;
				font-size: 14px;
				color: #303133;
			}
		}
	}
</style>