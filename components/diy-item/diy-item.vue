<template>
	<view class="activity-box">
		<view class="activity-block" v-for="(a, i) in list" :key="i" 
		@click="navTo('/pages_servedoor/item/detail',{login:true},{id:a.id})"
		>
			<view class="cover-box" v-if="a.cover_img">
				<up-image :show-loading="false" 
				:src="a.cover_img" 
				width="120px" height="120px"></up-image>
			</view>
			<view class="info-box">
				<view class="activity-title">{{a.title}}</view>
				<view class="desc">{{a.desc_text}}</view>
				<view class="activity-item">
					<view class="item-label" style="font-size: 16px;color: #fc3565;font-weight: bold;">
						￥{{a.price}}
					</view>
					<view v-if="showMarket(a)" class="item-label gui-line-through" style="font-size: 14px;margin-left: 5px;">
						￥{{a.market_price}}
					</view>
				</view>
				<view class="activity-item" style="justify-content: space-between;">
					<view  class="item-label">
						<text class="micon icon-shijian1" style="font-size: 13px;"></text>
						<text style="font-size: 12px;color: #909399;padding-left: 2px;">{{a.time_len}}分钟</text>
						<text style="font-size: 12px;color: #909399;padding-left: 10px;">已售:{{a.sale_num}}</text>
					</view>
					<view class="but-box"
					@click.stop="navTo('/pages_servedoor/order/Create',{login:true},{id:a.id})"
					>立即下单</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props:{
		citycode:{
			type: [String,Number],
			default: ''
		}
	},
	data() {
		return {
			list:[],
			//列表渲染数据
			totalCount:0,//总数据量
			apiLoadingStatus:false,
			queryForm:{
				pageNo: 1,
				pageSize: 10,
				keyword: '',
			},
			locationdata:{},//当前位置数据
			cityname:'',
			
		}
	},
	
	created() {
		
	},
	methods: {
		//是否显示划线价
		showMarket(a){
			if(parseFloat(a.market_price) > 0 && (parseFloat(a.market_price) > parseFloat(a.price))){
				return true;
			}
			return false;
		},
		queryData() {
			this.queryForm.pageNo = 1;
			this.totalCount = 0;
			this.fetchData();
		},
		fetchData() {
			let post_data = JSON.parse(JSON.stringify(this.queryForm));
			this.$request('doorItemList', post_data,{
				showLoading: true
			}).then((res)=>{
				//console.log('获取位置-diy-item', res)
				if(this.queryForm.pageNo == 1) this.list = []; //如果是第一页需手动制空列表
				if(res.data.data.list.length){
					let list = res.data.data.list;
					this.list = this.list.concat(list); //追加新数据
				}
				this.totalCount = res.data.data.totalCount;
				if(res.data.data.totalCount > this.list.length){
					this.queryForm.pageNo += 1;//还有数据 页面数增加1
				}
				this.$emit('reload-end');
			})
		},
		
	}
}
</script>

<style lang="scss" scoped>
	.activity-box{
		padding: 5px 15px;
		.activity-block{
			// background-color: #ffffff;
			border-radius: 8px;
			overflow: hidden;
			display: flex;
			margin-bottom: 10px;
			box-shadow: 0 0 10px rgba(0,0,0,.1);
			height: 120px;
			.cover-box{
				
			}
			.info-box{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				flex: 1;
				padding: 8px 10px;
				.activity-title{
					font-size: 17px;
					color: #303133;
					font-weight: bold;
					padding-bottom: 5px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
				}
				.desc{
					font-size: 12px;
					color: #909399;
				}
				.activity-item{
					display: flex;
					flex-direction: row;
					.item-label{
						font-size: 14px;
						color: #909399;
						line-height: 25px;
					}
					.but-box{
						padding: 0 10px;
						height: 50rpx;
						line-height: 50rpx;
						border-radius: 50rpx;
						background-color: #fd7bb7;
						text-align: center;
						font-size: 24rpx;
						color: #ffffff;
					}
				}
			}
			
		}
	}
</style>