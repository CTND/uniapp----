<template>
	<view class="options-box" :style="[$util.getModelStyle(modelData.options)]">
		<template v-if="modelData.options.style=='1'">
			<view class="list-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)"
			:style="{borderBottom:index < list.length - 1 ? '1px solid #f0f0f0' : ''}"
			>
				<view class="list-image-box" v-if="item.course_image">
					<image :src="item.course_image" mode="widthFix"></image>
				</view>
				<view class="list-content">
					<view class="content-title">
						<text class="u-line-2">{{item.course_title}}</text>
					</view>
					<view style="display: flex;">
						<view style="flex: 1;">
							<view class="discount-price">
								<template v-if="item.price>0">
									<text class="unit color-base-text font-size-tag">￥</text>
									<text class="price color-base-text font-size-toolbar">{{ item.price }}</text>
								</template>
								<template v-else>
									<text style="font-size: 14px;color: #909399;font-weight: 400;padding-left: 5px;">免费</text>
								</template>
							</view>
							<view class="content-footer">
								<view class="gui-text" style="color: #c0c4cc;">{{item.count_user || 0}} 人学习</view>
							</view>
						</view>
						<view class="detail-but" :style="{backgroundColor:System.small_but_color}">详情</view>
					</view>
				</view>
			</view>
		</template>
		<template v-else>
			<view class="activity-box">
				<view class="activity-block" v-for="(a, i) in list" :key="i" 
				@click="toDetail(a)"
				>
					<view class="cover-box" v-if="a.course_image">
						<up-image :show-loading="false" 
						:src="a.course_image" 
						width="120px" height="120px"></up-image>
					</view>
					<view class="info-box">
						<view class="activity-title">{{a.course_title}}</view>
						<view class="desc">{{a.descs}}</view>
						<view class="activity-item">
							<view style="flex: 1;display: flex;">
								<view class="item-label" style="font-size: 16px;color: #fc3565;font-weight: bold;">
									￥{{a.price}}
								</view>
								<view v-if="a.market_price>0" class="item-label gui-line-through" style="font-size: 14px;margin-left: 5px;">
									￥{{a.market_price}}
								</view>
							</view>
							<view class="but-box"
							:style="{backgroundColor:System.big_but_color}"
							>查看详情</view>
						</view>
						<view class="activity-item">
							<view  class="item-label">
								<text class="micon icon-shijian1" style="font-size: 13px;"></text>
								<text style="font-size: 12px;color: #909399;padding-left: 2px;">时长{{a.time_len}}分钟</text>
								<text style="font-size: 12px;color: #909399;padding-left: 10px;">{{a.count_user || 0}} 人学习</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</template>
		
	</view>
	
</template>

<script>
	export default {
		name:"diy-course",
		props:{
			modelData:{
				type:[Object],
				default:{
					data:{
						list:[]
					},
					options:{}
				}
			}
		},
		data() {
			return {
				list:[],
			};
		},
		created() {
			this.getList();
			console.log('获取的样式', this.$util.getModelStyle(this.modelData.options))
		},
		methods:{
			getList(){
				this.$request('courseList', {
					pageNo: 1,
					pageSize: 10,
					keyword: '',
				},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.list.length){
						this.list = res.data.data.list;
					}
				})
			},
			toDetail(item){
				this.navTo('/pages_school/course/index', {login:true}, {course_id: item.course_id});
			}
		}
	}
</script>

<style scoped lang="scss">
	.options-box{
		margin: auto;
		overflow: hidden;
	}
	.list-item{
		display: flex;
		padding: 20rpx;
		background-color: #ffffff;
		.list-image-box{
			width: 100px;
			height: 100px;
			border-radius: 5px;
			overflow: hidden;
			image{
				width: 100%;
			}
		}
		.list-content{
			flex: 1;
			padding: 10rpx 20rpx;
			display: flex;
			flex-direction: column;
			.content-title{
				line-height: 20px;
				height: 40px;
				font-size: 16px;
				font-weight: bold;
				overflow: hidden;
				text{
					line-height: 20px;
				}
			}
			.discount-price {
				font-weight: bold;
				line-height: 1;
				color: red;
				.unit {
					margin-right: 6rpx;
				}
			}
			.content-footer{
				padding: 10rpx 6rpx;
			}
			.detail-but{
				background-color: red;
				color: #ffffff;
				border-radius:30px;
				height: 30px;
				line-height: 30px;
				width: 70px;
				text-align: center;
			}
		}
	}
	
	.activity-box{
		padding: 5px 0;
		.activity-block{
			background-color: #ffffff;
			border-radius: 8px;
			overflow: hidden;
			display: flex;
			margin-bottom: 10px;
			box-shadow: 0 0 5px #e7f3ff;
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
						height: 60rpx;
						line-height: 62rpx;
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