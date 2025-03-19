<template>
	<view>
		<u-popup
		:show="showPopup" 
		closeOnClickOverlay
		bgColor="transparent"
		@close="hide">
			<view class="uni-share">
				<text class="uni-share-title">分享到</text>
				<view class="uni-share-content">
					<!-- #ifndef H5 -->
					<button class="uni-share-content-box" open-type="share">
						<view class="uni-share-content-image">
							<image :src="$util.img('images/share/wx.png')" class="content-image" mode="widthFix" />
						</view>
						<text class="uni-share-content-text">微信好友</text>
					</button>
					<!-- #endif -->
					
					<button class="uni-share-content-box" @click="getPoster()">
						<view class="uni-share-content-image">
							<image :src="$util.img('images/share/poster-ico.png')" class="content-image" mode="widthFix" />
						</view>
						<text class="uni-share-content-text">{{shareOptions.event=='share_poster'?'生成海报':'获取分享码'}}</text>
					</button>
				</view>
				<text class="uni-share-btn" @click="hide()">取消</text>
			</view>
		</u-popup>
		 
		<!-- 海报弹窗 -->
		<u-popup
		:show="showPoster" 
		mode="center"
		bgColor="transparent"
		:closeOnClickOverlay="true"
		@close="closePoster"
		>
			<view class="poster-box">
				<sd-icon
				name="icon-guanbi2"
				size="28" 
				top="0" 
				color="#303133"
				:customStyle="{
					position:'absolute',
					top:'5px',
					right:'5px',
					zIndex:'9999',
					textAlign:'center', display:'block',
				}"
				@click="closePoster"
				></sd-icon>
				
				<view class="img-box" :style="{
					width:shareOptions.event=='share_poster'?'100%':'250px',
					height: shareOptions.event=='share_poster'?'70vh':'250px',
				}">
					<image :src="poster" mode="widthFix" style="width: 100%;"></image>
				</view>
				<view class="poster-but-box">
					<!-- #ifdef H5 -->
					<view style="font-size: 14px;text-align: center;color: #909399;">长按图片保存或分享</view>
					<!-- #endif -->
					<!-- #ifndef H5 -->
					<u-button
					type="primary" 
					:text="shareOptions.event=='share_poster'?'保存海报':'保存分享码'"
					shape="circle" 
					throttleTime="1000"
					size="large"
					:customStyle="$util.butStyle('primary',{backgroundColor:System.big_but_color,width:'80%'})"
					@click="doloadPoster()"
					></u-button>
					<!-- #endif -->
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Config from '@/common/js/config.js'
	/*
	this.$refs.sdShare.show({
		page: 'pages/index/index',
		card_id: this.card_id,
		event:'share_poster' ,//share_poster:要求生成海报  share_code: 只获取分享码
	});
	*/
	export default{
		data() {
			return {
				showPopup:false,
				is_sub:false,//提交状态
				//分享参数 page: 页面  ...其他参数
				shareOptions:{
					event:'share_poster'
				},
				
				//海报
				showPoster:false,
				poster:''
			}
		},
		
		methods:{
			show(options){
				if(options){
					this.shareOptions = JSON.parse(JSON.stringify(options));
				}
				console.log('this.shareOptions', this.shareOptions)
				this.showPopup = true;
			},
			hide() {
				this.showPopup = false;
			},
			//获取分享海报
			getPoster(){
				if(this.is_sub){
					return;
				}
				this.is_sub = true;
				this.$request('getPoster', {
					shareOptions: this.shareOptions
				},{
					showLoading: true,
				}).then((res)=>{
					this.is_sub = false;
					console.log('请求数据getPoster', res)
					if(res.data.data.poster){
						this.poster = res.data.data.poster;
						this.showPoster = true;
					}
				})
				this.hide();
			},
			//关闭海报弹窗
			closePoster(){
				this.poster = '';
				this.showPoster = false;
			},
			//下载海报
			doloadPoster(){
				const t = this;
				if(t.poster){
					// #ifdef MP-WEIXIN
					uni.authorize({
						scope: 'scope.writePhotosAlbum',
						success() {
							console.log('t.poster', t.poster)
							t.$util.downloadFile(t.poster, (res)=>{
								if(res){
									t.$util.saveAlbum(res, (e)=>{
										t.msg('保存成功');
										t.closePoster();
									});
								}
							});
						}
					})
					// #endif
					// #ifdef APP-PLUS
					let url = Config.baseUrl+'/mobile.html?shareid='+this.$store.state.userInfo.userid
					uni.setClipboardData({
						data: url,
						success: function () {
							uni.showModal({
								title: '提示',
								content: '请将复制的推广链接分享给好友',
								success: function (res) {
									if (res.confirm) {
										console.log('用户点击确定');
									}
								}
							});
						}
					});
					// #endif
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* 底部分享 */
	.uni-share {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		background-color: #fff;
	}
	
	.uni-share-title {
		line-height: 60rpx;
		font-size: 14px;
		padding: 15rpx 0;
		text-align: center;
		border-bottom: 1px solid #f0f0f0;
	}
	
	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		padding: 15px;
	}
	
	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		width: 30%;
	}
	
	.uni-share-content-image {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 50px;
		height: 50px;
		overflow: hidden;
		border-radius: 50px;
		background-color: #F7F7F7;
		padding: 5px;
	}
	
	.content-image {
		width: 100%;
	}
	
	.uni-share-content-text {
		font-size: 24rpx;
		color: #333;
		padding-top: 10px;
		padding-bottom: 10px;
	}
	
	.uni-share-btn {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 14px;
		border-top-color: #f5f5f5;
		border-top-width: 1px;
		border-top-style: solid;
		text-align: center;
		color: #666;
	}
	
	//海报弹窗
	.poster-box{
		width: 90vw;
		background-color: #fff;
		padding-bottom: 10px;
		border-radius: 5px;
		position: relative;
		.img-box{
			width: 100%;
			height: 70vh;
			overflow: hidden;
			position: relative;
			overflow-y: auto;
			margin: auto;
			// image{
			// 	width: 100%;
			// }
		}
		.poster-but-box{
			padding: 15px 10px;
		}
	}
</style>