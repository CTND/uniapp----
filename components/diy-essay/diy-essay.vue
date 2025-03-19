<template>
	<view v-if="list.length" :style="[$util.getModelStyle(modelData.options)]">
		<view class="item-box" v-for="(item, index) in list" :key="index" 
		:class="[index < list.length -1 ? 'u-border-bottom' : '']"
		@click.stop="essayClick(item)"
		>
			<view class="content-box">
				<view class="essay-name">
					{{item.essay_name}}
				</view>
				<view class="content-footer">
					<view class="gui-text-small gui-text">浏览:{{item.essay_count}}次</view>
					<view class="gui-text-small" style="padding-left: 10px;">发布:{{item.push_time}}</view>
				</view>
			</view>
			<view class="cover-box">
				<up-image :src="item.essay_cover" :width="80" :height="80" :radius="5" :lazy-load="true"></up-image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"diy-essay",
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
				list:[]
			};
		},
		created() {
			let post_data = {
				pageNo: 1,
				pageSize:100
			};
			let user_id = uni.getStorageSync('user_id');
			if(user_id){
				post_data.user_id = user_id;
			}
			this.$request('Diyessaylist', post_data,{
				showLoading: false,
			}).then((res)=>{
				console.log('获取文章列表', res)
				if(res.data.code == 200 && res.data.data.list.length){
					this.list = res.data.data.list;
				}
			})
		},
		methods:{
			essayClick(item){
				let url = '/pages_public/essay/info?essay_id='+item.essay_id;
				this.navTo(url);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item-box{
		display: flex;
		margin-bottom: 10rpx;
		padding: 5px 0 8px 0;
		.cover-box{
			display: block;
		}
		.content-box{
			flex: 1;
			padding: 0 5px; 
			min-width: 0;
			.essay-name{
				font-size: 16px;
				color: #303133;
				line-height: 1.5;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
			.content-footer{
				display: flex;
				padding: 5px 0;
				color: #909399;
				font-size: 12px;
			}
		}
	}
	.border{
		border-bottom: 1px solid #909399;
	}
</style>