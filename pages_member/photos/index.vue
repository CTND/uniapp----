<template>
	<gui-page
	
	:customHeader="false"
	ref="guipage"
		>
		<template v-slot:gHeader>
			<view style="background-color: #ffffff;padding: 8px;">
				<view class="gui-flex gui-row gui-nowrap gui-space-between gui-padding-x">
					<view style="font-size: 14px;color: #606266;line-height: 25px;">
						一个相册最多保存30张照片,还可保存
						<text style="color: #2979ff;">{{30-list.length}}</text>张
					</view>
				</view>
			</view>
		</template>
		<template v-slot:gBody>
			<view style="height:90rpx;"></view>
			<view class="photos-box">
				<view class="img-box" v-for="(item, index) in list" :key="index" 
				@click="$util.previewImage(index, list)" 
				@longpress="deleteImg(index)">
					<image :src="item" 
					:lazy-load="true"
					mode="aspectFill"
					></image>
				</view>
				<view v-if="list.length < 30" class="add-box" style="background-color: #ffffff;" @click="addImage()">
					<view class="micon icon-tianjia"></view>
					<view class="add-text">添加照片</view>
				</view>
			</view>
			
			<!-- <view
			style="width:750rpx; z-index:99;"
			class="gui-flex gui-row gui-nowrap gui-space-around gui-bg-black gui-fixed-lb">
				<view class="gui-cropper-btn" @tap="save()">保存相册</view>
			</view> -->
			<!--加载中-->
			 
			<!-- 全屏加载 -->
			
		</template>
		
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
			list:[]
		}
	},
	watch:{
		list(){
			console.log('数组变化')
		}
	},
	onLoad:function(){
		this.getPhotoData();
	},
	methods: {
		getPhotoData(){
			this.$util.throttle(async ()=>{
				this.$request('getUserPhotoData', {},{
					showLoading: false,
				}).then((res)=>{
					//console.log('请求数据', res)
					if(res.data.data.album){
						this.list = res.data.data.album;
					}
				})
			})
			
		},
		addImage(){
			const t = this;
			let num = 30 - this.list.length;
			this.$util.upload(num, {type:'image', sourceType:['album', 'camera']}, (res)=>{
				if(res.length){
					this.list = this.list.concat(res);
					this.save();
				}
			})
		},
		//长按
		longpress(e){
			console.log('longpress', e)
		},
		deleteImg(index){
			const t = this;
			uni.showModal({
				title: '提示',
				content: '确定要删除该照片吗？',
				success: function (res) {
					if (res.confirm) {
						t.list.splice(index, 1);
						if(t.list.length){
							t.save();
						}
					}
				}
			});
		},
		save(){
			this.$util.throttle(async ()=>{
				this.$request('UpdateUserPhoto', {
					album: this.list
				},{
					showLoading: true,
				}).then((res)=>{
					this.msg(res.data.msg);
				})
			})
		},
	}
}
</script>
<style scoped lang="scss">
	.gui-cropper-wrapper{overflow:hidden;}
	.gui-cropper-bg{}
	.gui-cropper-prev{}
	.gui-cropper-btn{width:350rpx; text-align:center; line-height:50px; font-size:28rpx; color:#FFFFFF;}
	.photos-box{
		// background-color: #ffffff;
		padding: 10px;
		display: flex;
		flex-wrap: wrap;
		.img-box{
			width:calc((100vw - 55px) / 3);
			height: calc((100vw - 50px) / 3);
			margin: 5px;
			border-radius: 5px;
			overflow: hidden;
			position: relative;
			.icon-guanbi1{
				position: absolute;
				top: 5px;
				right: 5px;
				color: red;
			}
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.add-box{
		width:calc((100vw - 55px) / 3);
		height: calc((100vw - 50px) / 3);
		margin: 5px;
		border-radius: 5px;
		overflow: hidden;
		background-color: #f8f8f8;
		text-align: center;
		padding-top: 30px;
		.icon-tianjia{
			font-size: 24px;
			line-height: 30px;
		}
		.add-text{
			font-size: 14px;
			color: #909399;
			padding-top: 10px;
		}
	}
</style>