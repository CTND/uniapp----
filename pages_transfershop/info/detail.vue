<template>
	<gui-page 
		ref="guipage"
		
		:customFooter="true"
		:showFooterBar="false"
		:customStyle="{
			backgroundColor:System.full_bg_color,
			paddingBottom:'30px'
		}"
	>
		<template v-slot:gBody>
			<template v-if="info.id > 0">
				<!-- 商品媒体信息 -->
				<view >
					<view class="goods-media">
						<!-- 商品图片 -->
						<!-- #ifdef H5 -->
						
						<!-- #endif -->
						<view class="goods-img" :class="{ show: switchMedia == 'img' }">
							<swiper class="swiper" @change="swiperChange" :interval="swiperInterval"
								:autoplay="swiperAutoplay">
								<swiper-item v-for="(item, index) in info.banner_imgs" :key="index"
									:item-id="'goods_id_' + index">
									<view class="item" @click="$util.previewImage(index, info.banner_imgs)">
										<image :src="$util.img(item)" mode="aspectFill" />
									</view>
								</swiper-item>
							</swiper>
							<view class="img-indicator-dots">
								<text>{{ swiperCurrent }}</text>
								<text v-if="info.cover_img">/{{ info.banner_imgs.length }}</text>
							</view>
						</view>
						<!-- 商品视频 -->
						<view class="goods-video" :class="{ show: switchMedia == 'video' }">
							<!-- #ifndef APP-PLUS -->
							<video :src="$util.img(info.video_url)"
								:poster="$util.img(info.video_cover)" 
								objectFit="cover"
							>
							</video>
							<!-- #endif -->
							<!-- #ifdef APP-PLUS -->
							<view class="video-img"
								@click="openVideo($util.img(info.video_url), $util.img(info.video_cover))">
								<image :src="$util.img(info.video_cover)" mode=""></image>
								<view class="video-open">
									<view class="iconfont iconarrow-"></view>
								</view>
							</view>
							<!-- #endif -->
						</view>
					
						<!-- 切换视频、图片 -->
						<view class="media-mode" v-if="info.video_url != ''">
							<text :style="{backgroundColor:switchMedia == 'img'?'red':'rgba(100, 100, 100, 0.6)'}"
								@click="switchMedia = 'img'">图片</text>
							<text :style="{backgroundColor:switchMedia == 'video'?'red':'rgba(100, 100, 100, 0.6)'}"
								@click="switchMedia = 'video'">视频</text>
						</view>
					</view>
				</view>
				<view style="width:100%;padding: 0 20rpx;padding-top: 10rpx;" >
					
					<view style="width: 100%;padding-bottom: 80px;">
						<view class="info-box info-top" style="border-top-left-radius: 15px;border-top-right-radius:15px;overflow: hidden;">
							<view class="auth-box">
								<view class="auth-img">
									<image :src="$util.img('images/modules/sd_transshop/auth.png')" 
									style="width: 70px;height: 15px"
									></image>
								</view>
								<view class="auth-text">实地勘察|证件检查|产权明晰</view>
							</view>
							<view class="relative-box">
								<view class="absolute-box"
								:style="{backgroundImage:'url(' + info.status_img + ')',}"
								></view>
								<view class="relative">
									<view class="title-box">
										<view class="title">{{info.title}}</view>
										<view class="share-box"></view>
									</view>
									<view class="tag-box">
										<view class="tag-flex">
											<view class="tag" v-for="(tag, i) in info.tag_list" :key="i"
											:style="{ backgroundColor: `rgba(41,95,204, 0.1)` }">
												<text :style="{ color: `rgba(41,95,204, 1)` }">{{tag.name}}</text>
											</view>
										</view>
									</view>
									<view class="count-box">
										<text>浏览量：{{info.browse}}</text>
										<!-- <text style="margin-left: 10px;">发布时间：{{info.create_time}}</text> -->
									</view>
									
									<view style="padding:0 30rpx;">
										<view style="background: #F5F7FA;border-radius: 8rpx;display: flex;justify-content: space-between;padding-bottom: 10rpx;">
											<view class="data-item" style="display: block;width: 33%;padding-top: 10rpx;text-align: center;">
												<view class="data-content red-color" style="color: #295FCC;font-size: 32rpx;font-weight: bold;">
													<text>{{info.extent}}</text>
													<text class="hotTxt">
														m<text class="hot-txt">2</text>
													</text>
												</view>
												<view class="data-label" style="color: #737980;font-size: 28rpx;height:18px;line-height:18px;">面积</view>
											</view>
											
											<view class="data-item" v-if="info.nature == 1" style="display: block;width: 33%;padding-top: 10rpx;text-align: center;">
												<view class="data-content red-color">
													<text style="color: #295FCC;font-size: 32rpx;font-weight: bold;">{{info.rent_money+'元/月'}}</text>
												</view>
												<view class="data-label" style="color: #737980;font-size: 28rpx;height:18px;line-height:18px;">租金</view>
											</view>
											
											<view class="data-item" style="display: block;width: 33%;padding-top: 10rpx;text-align: center;">
												<view class="data-content red-color">
													<text style="color: #295FCC;font-size: 32rpx;font-weight: bold;">{{info.show_mianyi == 0 ? info.transfer_fee+'万' : '面议'}}</text>
												</view>
												<view class="data-label" style="color: #737980;font-size: 28rpx;height:18px;line-height:18px;">{{info.nature == 1 ? '转让费': '售价'}}</view>
											</view>
										</view>
										<view style="padding: 10px 0;">
											<view class="new-info-box">
												<view class="key-val-item">
													<view class="key-label">行业</view>
													<view class="key-val">{{info.type_data.title}}</view>
												</view>
												<view class="key-val-item">
													<view class="key-label">租金</view>
													<view class="key-val">{{info.rent_money}}元/月</view>
												</view>
											</view>
											<view class="new-info-box">
												<view class="key-val-item">
													<view class="key-label">管理费</view>
													<view class="key-val">{{info.manage_money}}元/月</view>
												</view>
												<view class="key-val-item">
													<view class="key-label">水电费</view>
													<view class="key-val">{{info.water_money}}</view>
												</view>
											</view>
											<view class="new-info-box">
												<view class="key-val-item">
													<view class="key-label">所属商圈</view>
													<view class="key-val">{{info.business_name}}</view>
												</view>
												<view class="key-val-item">
													<view class="key-label">适合经营</view>
													<view class="key-val">
														<text v-for="(i, j) in info.suit_list" :key="j" 
														style="font-size: 24rpx;color: #606266;margin-right: 10rpx;">
															{{i.title}}
														</text>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
								
							</view>
						</view>
						
						<view class="info-box">
							<view style="font-size: 16px;color: #303133;font-weight: bold;padding: 0 5px 10px 5px;">配套设施</view>
							<view style="display: flex;flex-wrap: wrap;">
								<block v-for="(meat, mindex) in info.meating_list" :key="mindex">
									<view class="meating-block" v-if="meat.selected">
										<view class="meating-ico">
											<image :src="meat.ico" mode="widthFix"></image>
										</view>
										<view class="meating-title">{{meat.title}}</view>
									</view>
								</block>
							</view>
						</view>
						
						<!-- 店铺 -->
						<view v-if="info.user" class="info-box" style="padding: 0 15px 10px 15px">
							<view style="font-size: 16px;color: #303133;font-weight: bold;padding: 8px 5px 10px 5px;">店铺信息</view>
							<view class="new-info-box" style="display: block;">
								<view class="key-val-item" style="width: 100%">
									<view class="key-label">发布时间</view>
									<view class="key-val">{{info.create_time}}</view>
								</view>
								<view class="key-val-item" style="width: 100%">
									<view class="key-label">店铺地址</view>
									<view class="key-val">{{info.cityname}} {{info.area_data.name}}</view>
								</view>
								<view class="key-val-item" style="width: 100%">
									<view class="key-label">详细地址</view>
									<view class="key-val">{{info.location_data.name}}</view>
								</view>
								<view class="key-val-item" style="width: 100%">
									<view class="key-label">店铺简介</view>
									<view class="key-val" style="line-height: 1.5;">{{info.desc}}</view>
								</view>
							</view>
							<view style="height: 80px;margin-top: 10rpx;">
								<image :src="$util.img('images/modules/sd_transshop/map.png')" mode="widthFix" style="width: 100%;height: 100%"></image>
							</view>
							<view style="background: #E6EEFF;border-radius: 0rpx 0rpx 16rpx 16rpx;height: 80rpx;text-align: center;line-height: 80rpx;"
							@click="$util.toLocation(info.latitude, info.longitude)"
							>
								<text class="micon icon-dingwei4" style="color: #295FCC"></text><text style="color: #295FCC;font-size: 32rpx;font-weight: bold">一键导航</text>
							</view>
						</view>
						
						<!-- 顾问 -->
						<view v-if="info.mentor" class="info-box" style="padding: 0 15px 15px 15px">
							<view style="font-size: 16px;color: #303133;font-weight: bold;padding: 8px 5px 10px 5px;">专属顾问</view>
							<view style="display: flex;background-color: #f8f8f8;padding: 10px;border-radius: 5px;height: 70px;">
								<view>
									<u-avatar :src="info.mentor.avatar" shape="circle" size="45"></u-avatar>
								</view>
								<view style="flex: 1;padding-left: 5px;">
									<view style="font-size: 16px;">{{info.mentor.realname}}</view>
									<view style="padding-top: 5px;">
										<up-rate :modelValue="info.mentor.score" readonly gutter="2" :allowHalf="true" size="16" activeColor="#f29100"></up-rate>
									</view>
								</view>
								<view style="padding-top:12px;padding-right: 5px;">
									<view class="but-c" @click="$util.callPhone(info.mentor.mobile)">电话咨询</view>
								</view>
							</view>
						</view>
						
						<view style="font-size: 18px;font-weight: bold;color: #303133;padding: 5px 15px 5px 10px;">推荐店铺</view>
						<view class="goods-body column">
							<view class="good-item" v-for="(item, index) in list" :key="index" 
							@click="navTo('/pages_transfershop/info/detail', {login: false}, {id: item.id})"
							>
								<view class="cover-box">
									<image :src="item.cover_img" mode="aspectFill"></image>
								</view>
								<view class="info-box">
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
						
					</view>
				</view>
			</template>
			<!--加载中-->
			 
			 
			<!-- 全屏加载 -->
			
		</template>
		<template v-slot:gFooter v-if="System.cheat==2">
			<view class="footer-box box-shadow">
				<view class="footer-block" @click="collectInfo" style="flex: 1;">
					<view class="micon icon-guanzhu1" :style="{color:info.is_collect == 1?'#18b566':'#303133'}"></view>
					<view style="font-size: 14px;" 
					:style="{color:info.is_collect == 1?'#18b566':'#303133'}"
					>{{info.is_collect == 1?'已收藏':'收藏'}}</view>
				</view>
				<view class="footer-block" style="background-color: #18b566;color: #ffffff;height: 40px;line-height: 40px;border-radius: 5px;width: 30%;"
				@click="toConversion()"
				:style="{background:'#29CC71'}"
				>
					<text class="micon icon-icon--"></text>
					微聊
				</view>
				<view class="footer-block" style="background-color: #e45656;color: #ffffff;height: 40px;line-height: 40px;border-radius: 5px;width: 30%;margin-left: 5px;" 
				@click="$util.callPhone(info.phone)" 
				:style="{background:'#295FCC'}"
				>
					<text class="micon icon-dianhua"></text>
					电话
				</view>
			</view>
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				id: 0,
				list:[],
				info:{
					id:0,
					banner_imgs:[],
					item_list:[],
					location_data:{
						name: '',
						address: ''
					}
				},
				
				
				swiperInterval: 1,
				swiperAutoplay: false,
				swiperCurrent: 1,
				switchMedia: 'img',
			}
		},
		onLoad: function(options) {
			const t = this;
			if(options.id){
				this.id = options.id;
				this.getInfo();
			}
			let citycode = this.$util.getKey('citycode');
			this.$request('transShopApiInfoPushStoreList', {id:this.id, citycode:citycode},{
				showLoading: false,
			}).then((res)=>{
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
					this.list.sort(this.$util.Arrsort);
				}
			})
		},
		onShow() {
			
		},
		methods:{
			getInfo(){
				let url = 'transShopApiInfoDetail';
				if(this.isLogin({nav:false})){
					url = 'transShopInfoDetail';
				}
				this.$request(url, {id: this.id},{
					showLoading: false,
				}).then((res)=>{
					console.log('详情', res)
					if(res.data.data.info){
						this.info = res.data.data.info;
					}
				})
			},
			collectInfo(){
				this.$request('transShopInfoCollect', {id: this.id},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.code == 200){
						this.msg(res.data.msg)
					}
					this.info.is_collect = res.data.data.is_collect;
				})
			},
			//打开对话
			toConversion(){
				let params = {toID: this.info.userid};
				this.navTo('/pages_same/conversation/index', {login:true}, params)
			},
		}
	}
</script>

<style lang="scss" scoped>
	//双列
	.goods-body.column{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding:20rpx 0;
		.good-item{
			width: calc( (100% - 6px) / 2 );
			overflow: hidden;
			// background-color: #ffffff;
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
	.meating-block{
		width: calc( (100% - 60px) / 5);
		margin: 10rpx;
		padding: 10rpx 0;
		border: 1px solid #ffffff;
		border-radius: 10rpx;
		text-align: center;
		.meating-ico{
			width: 25px;
			height: 25px;
			margin:auto;
			overflow: hidden;
			
			image{
				width: 100%;
				height: 100%;
			}
		}
		.meating-title{
			font-size: 28rpx;
			color: #606266;
			padding-top: 4rpx;
		}
	}
	// 商品媒体信息
	.goods-media {
		width: 100%;
		position: relative;
		overflow: hidden;
		height: 100vw;
		&:after {
			padding-top: 100%;
			display: block;
			content: '';
		}
	
		.goods-img,
		.goods-video {
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			transition-property: transform;
			transition-timing-function: cubic-bezier(0, 0, 0.25, 1);
			transition-duration: 350ms;
			transform: translate3d(0, 0, 0);
		}
	
		.goods-img {
			transform: translateX(100%);
		}
	
		.goods-video {
			transform: translateX(-100%);
		}
	
		.pop-video {
			line-height: 1;
		}
	
		.goods-img.show,
		.goods-video.show {
			transform: translateX(0);
		}
	
		.goods-img .swiper {
			width: 100%;
			height: 100%;
	
			.item {
				width: 100%;
				height: 100%;
			}
	
			image {
				width: 100%;
				height: 100%;
			}
		}
	
		.goods-img .img-indicator-dots {
			position: absolute;
			z-index: 5;
			bottom: 60rpx;
			left: 40rpx;
			background: rgba(100, 100, 100, 0.4);
			color: #fff;
			font-size: $font-size-tag;
			line-height: 40rpx;
			border-radius: 20rpx;
			padding: 0 20rpx;
		}
	
		.goods-video video {
			width: 100%;
			height: 100%;
		}
	
		.goods-video .uni-video-cover {
			background: none;
		}
	
		.media-mode {
			position: absolute;
			width: 100%;
			z-index: 5;
			bottom: 30rpx;
			//#ifdef MP
			bottom: 60rpx;
			//#endif
			text-align: center;
			padding-right:30px;
			line-height: 50rpx;
	
			text {
				background: rgba(100, 100, 100, 0.4);
				color: #fff;
				font-size: $font-size-tag;
				line-height: 50rpx;
				border-radius: 20rpx;
				padding: 0 30rpx;
				display: inline-block;
	
				&:last-child {
					margin-left: 10rpx;
				}
			}
		}
	}
	.back-radio{
		width: 70rpx;
		height: 70rpx;
		line-height: 70rpx;
		border-radius: 100rpx;
		background-color: rgba(255, 255, 255, .8);
		text-align: center;
	}
	
	.but-c{
		height: 30px;
		line-height: 30px;
		border-radius: 5px;
		color: #ffffff;
		background-color: #e45656;
		font-size: 14px;
		padding: 0 10px;
	}
	.hotTxt{
		font-size: 16px;
		position: relative; 
	}
	.hot-txt{
		position: relative;
		top: -3px; 
		font-size: 10px;
	}
	.red-color{
		color: #fea82d;
		font-weight: bold;
	}
	.icon-xuanzhong3{
		font-size: 18px;
		color: #19be6b;
	}
	.footer-box{
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		padding: 10px 20px 10px 0;
		.footer-block{
			text-align: center;
			font-size: 16px;
			color: #303133;
			
			.micon{
				font-size: 18px;
			}
		}
	}
	
	.info-box{
		background-color: #ffffff;
		padding: 10px 15px;
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(20,36,51,0.05);
		border-radius: 16rpx;
		margin-bottom: 10px;
		.relative-box{
			position: relative;
		}
		.absolute-box{
			position: absolute;
			width: 100px;
			height: 100px;
			right: 10rpx;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			//border: 1px solid red;
		}
		.title-box{
			display: flex;
			padding: 10px 10px 5px 10px;
			.title{
				flex: 1;
				font-size: 20px;
				font-weight: bold;
				color: #303133;
				line-height: 1.5;
			}
			.share-box{
				padding: 10px;
			}
		}
		.tag-box{
			padding: 10rpx 10px;
			.tag-flex{
				display: flex;
				flex-wrap: wrap;
				.tag{
					background-color: #295FCC;
					color: #ffffff;
					display: flex;
					align-items: center;
					padding: 8rpx 14rpx;
					border-radius: 50rpx;
					font-size: 24rpx;
					line-height: 1;
					margin-right: 10rpx;
				}
			}
		}
		.count-box{
			font-size: 14px;
			color: #909399;
			padding: 10px 12px;
			// display: flex;
			// justify-content: space-between;
		}
		.data-item{
			display: flex;
			padding-top: 10px;
			line-height:30px;
			.data-label{
				font-size: 16px;
				color: #606266;
			}
			.data-content{
				flex: 1;
				padding-left: 10rpx;
			}
			.micon-box{
				width: 30px;
				height: 30px;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	
	.info-box.info-top{
		background: linear-gradient( 180deg, #E6EEFF 0%, #FFFFFF 35%);
		box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(20,36,51,0.05);
		border-radius: 16rpx;
		padding: 0;
		.auth-box{
			background: linear-gradient( 130deg, #667FFE 0%, #99BBFF 100%);
			box-shadow: 0rpx 8rpx 16rpx 0rpx rgba(102,127,254,0.2);
			border-radius: 16rpx 16rpx 0rpx 0rpx;
			display: flex;
			justify-content: space-between;
			padding: 12px 10px 18rpx 12px;
			.auth-img{
				overflow: hidden;
			}
			.auth-text{
				font-weight: 400;
				font-size: 28rpx;
				color: #f8f8f8;
				line-height: 32rpx;
				text-align: center;
				font-style: normal;
			}
		}
	}
	
	.new-info-box{
		display: flex;
		.key-val-item{
			display: flex;
			width: 50%;
			padding: 16rpx 0;
			.key-label{
				font-size: 28rpx;
				color: #899199;
				line-height: 28rpx;
				width: 70px;
			}
			.key-val{
				font-size: 28rpx;
				color: #36414D;
				line-height: 28rpx;
				flex: 1;
			}
		}
	}
</style>