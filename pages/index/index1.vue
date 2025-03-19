<template>
	<gui-page 
	
	:refresh="true"
	:loadmore="true" 
	:customHeader="false"
	:customFooter="true"
	:apiLoadingStatus="apiLoadingStatus" 
	@reload="reload" 
	@loadmorefun="loadmorefun" 
	ref="guipage"
	
	:customStyle="{background:'rgba(241, 247, 252, 1)'}"
	>
		<template v-slot:gBody>
			<view class="vue-box" >
				<!-- #ifndef H5 -->
				<view v-if="cardData.show_type == 0" class="card-box" :style="{backgroundImage:'url('+setting.default_img+')'}">
					<view style="display: flex;padding: 10px;">
						<view class="absolute" style="padding-top: 0;padding-left: 0px;font-size: 14px;flex: 1;">
							<view class="realname-box" :style="{color:setting.text_color}">{{cardData.realname}}</view>
							<view :style="{color:setting.text_color}">{{cardData.position}}</view>
							<view :style="{color:setting.text_color,paddingTop:'5px'}">{{cardData.company}}</view>
						</view>
						<view class="pohto-box" v-if="setting.show_logo == 1 && cardData.logo">
							<image :src="cardData.logo" mode="widthFix"></image> 
						</view>
					</view>
					<view :style="{height:'1px',background:setting.text_color,width:'75%',marginLeft:'5px'}"></view>
					<view class="absolute" style="padding-top: 5px;padding-left: 5px;">
						<view class="mobile-box" @click="$util.callPhone(cardData.phone)">
							<view style="width: 20px;height: 20px;overflow: hidden;text-align: center;line-height: 20px;margin-right: 5px;">
								<text class="micon icon-shouji" :style="{color:setting.text_color,fontSize:'16px'}"></text>
							</view>
							<view class="ab-text" :style="{color:setting.text_color,fontSize:'14px'}">{{cardData.phone}}</view>
						</view>
						<view class="mobile-box" v-if="cardData.email" @click="$util.copy(cardData.email)">
							<view style="width: 20px;height: 20px;overflow: hidden;text-align: center;line-height: 20px;margin-right: 5px;">
								<text class="micon icon-youxiang" :style="{color:setting.text_color,fontSize:'16px'}"></text>
							</view>
							<view class="ab-text" :style="{color:setting.text_color,fontSize:'14px'}">{{cardData.email}}</view>
						</view>
						<view class="address-box" @click="$util.copy(cardData.address)">
							<view style="width: 20px;height: 20px;overflow: hidden;text-align: center;line-height: 20px;margin-right: 5px;">
								<text class="micon icon-dizhi1" :style="{color:setting.text_color,fontSize:'16px'}"></text>
							</view>
							<view class="ab-text" :style="{color:setting.text_color,fontSize:'14px'}">{{cardData.address}}</view>
						</view>
					</view>
				</view>
				<video v-if="cardData.show_type == 1 && cardData.video_url" 
				id="myVideo"
				:src="cardData.video_url" 
				autoplay
				:poster="cardData.video_cover?cardData.video_cover:''" 
				:controls="true"
				object-fit="cover"
				class="gui-course-video" 
				></video>
				<view class="but-box" v-if="cardData.card_id">
					<view class="but" > 
						<u-button type="primary" text="分享名片"
						throttleTime="1000"
						size="large"
						icon="icon-fenxiang"
						iconColor="#3d6eff"
						:customStyle="$util.butStyle('primary',{backgroundColor:'#ffffff',width:'90%',borderRadius:'30px',border:'1px solid #3d6eff',color:'#3d6eff',
						height:'40px',lineHeight:'40px'})"
						@click="shareDo()"
						></u-button>
					</view>
					<view class="but">
						<u-button type="primary" text="惠存名片"
						throttleTime="1000"
						size="large"
						icon="icon-xiazai"
						iconColor="#ffffff"
						:customStyle="$util.butStyle('primary',{backgroundColor:System.big_but_color,width:'90%',borderRadius:'30px',height:'40px',lineHeight:'40px'})"
						@click="collectCard()"
						></u-button>
					</view>
				</view>
				
				<view class="data-box" style="margin-bottom: 15px;">
					<!-- <view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;">
						个人信息
					</view> -->
					<scroll-view class="scroll-data-box" scroll-x="true" scroll-left="0">
						<view class="flex-block">
							<view class="title">联系电话</view>
							<view class="f-title" @click="$util.callPhone(cardData.phone)">
								<view style="height: 30px;line-height: 30px;">
									<text class="micon icon-shouji"></text>
								</view>
								<view class="f-text">{{cardData.phone}}</view>
							</view>
						</view>
						<view class="flex-block" v-if="cardData.wx">
							<view class="title">联系微信</view>
							<view class="f-title" @click="$util.copy(cardData.wx)">
								<view style="height: 30px;line-height: 30px;padding-right: 2px;">
									<text class="micon icon-weixin"></text>
								</view>
								<view class="f-text">{{cardData.wx}}</view>
							</view>
						</view>
						<view class="flex-block" v-if="cardData.qq">
							<view class="title">联系QQ</view>
							<view class="f-title" @click="$util.copy(cardData.qq)">
								<view style="height: 30px;line-height: 30px;">
									<text class="micon icon-QQ"></text>
								</view>
								<view class="f-text">{{cardData.qq}}</view>
							</view>
						</view>
						<view class="flex-block" v-if="cardData.email">
							<view class="title">联系邮箱</view>
							<view class="f-title" @click="$util.copy(cardData.email)">
								<view style="height: 30px;line-height: 30px;">
									<text class="micon icon-youxiang"></text>
								</view>
								<view class="f-text">{{cardData.email}}</view>
							</view>
						</view>
						<view class="flex-block" @click="$util.toLocation(cardData.latitude, cardData.longitude)">
							<view class="title">联系地址</view>
							<view class="f-title">
								<view style="height: 30px;line-height: 30px;">
									<text class="micon icon-dizhi1"></text>
								</view>
								<view class="f-text">{{cardData.address}}</view>
							</view>
						</view>
					</scroll-view>
				</view>
				
				<view class="data-box" style="margin-bottom: 5px;background-color: #ffffff;box-shadow: 0px 0px 20px 2px rgba(61, 110, 255, 0.08);;padding: 10px;border-radius: 8px;display: flex;">
					<view style="flex: 1;">
						<u-avatar-group
						   :urls="cardData.urls"
						   size="35"
						   gap="0.4"
						   maxCount="8"
					   ></u-avatar-group>
					</view>
					<view style="width: 100px;line-height: 35px;color: #606266;padding-left: 10px;">
						<text style="color: #606266;font-size: 14px;margin-right: 5px;">{{cardData.volume}}人浏览</text>
					</view>
					<view style="width: 100px;text-align: right;line-height: 35px;color: #606266">
						<text style="color: #606266;font-size: 14px;margin-right: 5px;">{{cardData.count_num}}</text> 
						<text class="micon icon-tuijian"></text>
					</view>
				</view>
				
				<view class="data-box" v-if="cardData.desc" style="padding-top: 0;">
					<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;padding-bottom: 5px;">
						个人简介
					</view>
					<view class="data-item" style="background-color: #ffffff;box-shadow: 0px 0px 20px 2px rgba(61, 110, 255, 0.08);padding: 10px;border-radius: 8px">
						<view class="item-content">
							<!-- {{cardData.desc}} -->
							<u-parse :content="cardData.desc"></u-parse>
							<audio v-if="cardData.audio_url" 
							style="text-align: left;margin-top: 10px;" :src="cardData.audio_url" name="我的语音简介" controls></audio>
						</view>
						<view style="display: flex;flex-wrap: wrap;">
							<view class="label-box" v-for="(label,lindex) in cardData.label_arr" :key="lindex"
							:class="[label.status == 1 ? 'label-box-active' : '']"
							@click="setZan(label)"
							>
								<text class="micon" :class="[label.status == 1 ? 'icon-dianzan_kuai' : 'icon-tuijian']"
								:style="{color:label.status == 1 ? '#2979ff' : '#606266'}"
								></text>
								<text :style="{color:label.status == 1 ? '#2979ff' : '#606266'}">{{label.label}}</text>
							</view>
						</view>
					</view>
				</view>
				
				<view v-if="cardData.show_help == 1 && cardData.help_cover"  
				style="margin: 5px auto;border-radius: 5px;overflow: hidden;box-shadow: 0px 0px 20px 2px rgba(61, 110, 255, 0.08);" 
				@click="navTo('/pages_calling_card/help/userRouter', {login:false}, {card_id:card_id})">
					<image :src="cardData.help_cover" mode="widthFix" style="width: 100%;"></image>
				</view>
				
				<view class="data-box" v-if="cardData.files_list.length && setting.show_img == 1" style="display: block;">
					<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;padding-bottom: 10px;">
						图片展示
					</view>
					<!-- <view class="img-item" v-for="(img, iindex) in cardData.files_list" :key="iindex"
					@click="$util.previewImage(iindex, cardData.files_list)"
					>
						<image :src="img" mode="widthFix"></image>
					</view> -->
					<swiper circular :autoplay="true" style="height: 200px;border-radius: 10px;overflow: hidden">
						<swiper-item v-for="(img, iindex) in cardData.files_list" :key="iindex" style="width: 100%;">
							<image :src="img" mode="widthFix" style="width: 100%;" @click="$util.previewImage(iindex, cardData.files_list)"></image>
						</swiper-item>
					</swiper>
				</view>
				
				<view class="data-box" v-if="cardData.video_url && setting.show_video == 1" style="display: block;">
					<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;padding-bottom: 10px;">
						我的视频
					</view>
					<view v-if="cardData.video_url">
						<!-- <u-parse :content="'<video src='+cardData.video_url+' poster='+cardData.video_cover+' width=100% controls object-fit=fill></video>'"></u-parse>
						 -->
						<video id="Video"
						v-if="cardData.video_url"
						class="gui-course-video" 
						:src="cardData.video_url" 
						:poster="cardData.video_cover" 
						:controls="true"
						object-fit="cover"
						></video>
					</view>
					
				</view>
				
				<view v-if="cardData.essay_list.length" style="padding:10px;background-color: #ffffff;">
					<view class="item-box" v-for="(item, index) in cardData.essay_list" :key="index" 
					:class="[index < cardData.essay_list.length -1 ? 'border-b' : '']"
					@click.stop="essayClick(item)"
					>
						<view class="cover-box">
							<u--image :src="item.essay_cover" :width="150" :height="100" :radius="5" :lazy-load="true"></u--image>
						</view>
						<view class="content-box">
							<view class="essay-name">
								{{item.essay_name}}
							</view>
							<view class="content-footer">
								<!-- <text class="gui-icons">&#xe609; {{item.essay_count}}</text> -->
								<sd-icon name="sd-eye" size="16" color="#adadad">
									<template v-slot:icoContent>
										<text class="gui-text-small gui-text"> {{item.essay_count}} </text>
									</template>
								</sd-icon>
								<sd-icon name="sd-time1" size="16" color="#adadad">
									<template v-slot:icoContent>
										<text class="gui-text-small">{{item.push_time}}</text>
									</template>
								</sd-icon>
								
							</view>
						</view>
					</view>
				</view>
				<!-- #endif -->
				
				
				<!-- #ifdef H5 -->
				<view class="list-body">
					<view class="list-item" v-for="(item, index) in list" :key="index"
					@click="navTo('/pages_calling_card/cardInfo', {login: false}, {card_id: item.card_id})"
					>
						<view class="avatar-box" v-if="item.logo">
							<image :src="item.logo" mode="widthFix"></image>
						</view>
						<view class="list-content">
							<view class="list-title text-overflow">
								{{item.realname}}
							</view>
							<view v-if="item.position" class="list-desc-box">
								职位：{{item.position}}
							</view>
							<view v-if="item.phone" class="list-desc-box">
								联系电话：{{item.phone}}
							</view>
						</view>
						<view class="icon-box" >
							<sd-icon name="icon-jiantou1" size="20" color="#606266" top="30"></sd-icon>
						</view>
					</view>
				</view>
				<!-- #endif -->
				
				
			</view>
			<!--加载中-->
			 
			 
			<!-- 全屏加载 -->
			
			
			<u-popup
			:show="showPopup" 
			closeOnClickOverlay
			bgColor="transparent"
			@close="closePopup"
			>
				<view class="popup-box" @click="showPopup = false">
					<image :src="$util.img('images/share/share-tip2.png')"></image>
				</view>
			</u-popup>
			
			<!-- 分享 -->
			<sd-share ref="sdShare" @share-callback="shareCallback"></sd-share>
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				showPopup:false,
				setting:{
					default_img: '',
					show_logo: 0,
					show_img: 0,
					show_video: 0,
					text_color:'#303133',
				},
				cardData:{
					card_id:0,
					logo:'',
					realname:'',
					position:'',
					phone:'',
					company:'',
					address:'',
					files_list:[],
					video_url:'',
					video_cover:'',
					essay_list:[],
					urls:[],
					label_list:[],
					label_arr:[],
					show_help:0
				},
				
				list:[],
				//列表渲染数据
				totalCount:0,//总数据量
				apiLoadingStatus:false,
				
				card_id:0,
				queryForm:{
					pageNo: 1,
					pageSize: 10,
					keyword: '',
					class_id:0
				}
			}
		},
		watch: {
			//监听名片ID变化  把变化后的ID注入系统分享参数
		    card_id(newValue) {
				this.$store.state.shareParams.card_id = newValue;
		    }
		},
		onLoad: function(options) {
			if(options.card_id){
				this.card_id = options.card_id;
				uni.setStorageSync('card_id', options.card_id)
			}
			if(options.scene){
				var scene = decodeURIComponent(options.scene);
				var str = t.$util.base64_decode(scene);
				var card_id = t.$util.geturlParam(str,'card_id');
				if(card_id){
					this.card_id = card_id;
					uni.setStorageSync('card_id', card_id);
				}
			}
			if(options.class_id){
				this.queryForm.class_id = options.class_id;
			}
			this.getSetting();
			var fullPath = this.fullPath();
		},
		onShow() {
			// #ifndef H5
			// 
			// #endif
			var card_id = uni.getStorageSync('card_id');
			if(card_id){
				this.card_id = card_id;
			}
			this.queryData();
			this.getCard();
		},
		methods:{
			setZan(label){
				if(!this.isLogin()){
					return;
				}
				this.$util.throttle(async ()=>{
					this.$request('callingSetZan', label,{
						showLoading: true,
					}).then((res)=>{
						console.log('请求数据', res)
						if(res.data.code == 200){
							let label_arr = JSON.parse(JSON.stringify(this.cardData.label_arr));
							let index = label_arr.findIndex(n=>n.label_id == label.label_id);
							if(index > -1){
								label_arr[index].status = res.data.data.result;
							}
							this.cardData.label_arr = label_arr;
						}
					})
				})
			},
			getSetting(){
				this.$request('callingSetting', {},{
					showLoading: false,
				}).then((res)=>{
					console.log('获取的配置-------------------------', res)
					
					this.$refs.guipage.endReload();//停止刷新
					if(res.data.data.setting){
						this.setting = res.data.data.setting;
					}
				})
			},
			getCard(){
				this.$request('callingGetCard', {card_id: this.card_id},{//
					showLoading: false,
				}).then((res)=>{
					console.log('名片详情', res)
					if(res.data.data.cardData){
						let cardData = res.data.data.cardData;
						this.cardData = cardData;
						this.card_id = cardData.card_id;
						if(cardData.user_id){
							uni.setStorageSync('user_id', cardData.user_id);
						}else{
							uni.removeStorageSync('user_id');
						}
						if(cardData.seek_url){
							this.$store.state.tabbarData.list[2].link.path = cardData.seek_url;
							console.log('看下数据',  this.$store.state.tabbarData)
						}
					}
				})
			},
			essayClick(item){
				let url = '/pages_public/essay/info?essay_id='+item.essay_id;
				this.navTo(url);
			},
			//收藏
			collectCard(){
				if(!this.isLogin()){
					return;
				};
				this.$util.throttle(async ()=>{
					this.$request('callingCollecrCard', {card_id:this.cardData.card_id},{
						showLoading: true,
					}).then((res)=>{
						this.msg(res.data.msg);
					})
				})
			},
			//分享
			shareDo(){
				this.$store.state.ShareData.title = this.cardData.realname + ' 的名片，请惠存！';
				this.$store.state.ShareData.path = '/pages/index/index';
				this.$store.state.shareParams.card_id = this.cardData.card_id;
				// #ifdef H5
				 this.showPopup = true;
				 return;
				// #endif
				 
				// #ifndef H5
				this.$refs.sdShare.show({
					page: 'pages/index/index',
					share_ref:'poster',
					options: {
						card_id: this.cardData.card_id
					}
				});
				// #endif
			},
			//分享返回
			shareCallback(){
				console.log('shareCallback')
			},
			closePopup() {
				this.showPopup = false;
			},
			
			//下拉刷新
			reload(){
				// #ifndef H5
				this.getSetting();
				this.getCard();
				// #endif
				
				// #ifdef H5
				this.queryData();
				// #endif
			},
			
			//上拉加载
			loadmorefun(){
				console.log('上拉加载')
				// #ifndef H5
				 
				this.$refs.guipage.nomore();//没有更多数据
				// #endif
				
				// #ifdef H5
				this.queryData(); 
				// #endif
			},
			queryData() {
				this.queryForm.pageNo = 1;
				this.totalCount = 0;
				this.fetchData();
			},
			fetchData() {
				if(this.totalCount > 0 && this.totalCount <= this.list.length){
					return;
				}
				this.apiLoadingStatus = true;
				const queryForm = this.queryForm;
				this.$request('callingCardList', queryForm,{
					showLoading: true
				}).then((res)=>{
					if(this.queryForm.pageNo == 1){
						this.list = [];
					} 
					if(res.data.data.list.length){
						let list = res.data.data.list;
						this.list = this.list.concat(list);
					}
					this.dataListEvent(res.data.data);
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.gui-course-video{
		width: 100%;
		border-radius: 10px;
		overflow: hidden;
	}
	.label-box{
		background-color: #f4f4f5;
		height: 32px;
		line-height: 32px;
		text-align: center;
		font-size: 14px;
		color: #606266;
		border-radius: 5px;
		margin: 5px 8px;
		padding: 0 10px;
	}
	.label-box-active{
		background-color: rgba(226, 240, 255, 1);
	}
	.item-box{
		display: flex;
		margin-bottom: 20rpx;
		padding: 10rpx 0 20rpx 0;
		.cover-box{
			width: 150px;
		}
		.content-box{
			flex: 1;
			padding: 10rpx 10rpx 0 20rpx; 
			min-width: 0;
			.essay-name{
				font-size: 15px;
				color: #606266;
				line-height: 1.5;
				height: 130rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
			}
			.content-footer{
				height: 50rpx;
				padding-top: 30rpx;
				color: #909399;
				font-size: 12px;
				display: flex;
				justify-content: space-between;
				.gui-icons{
					font-size: 12px;
				}
			}
		}
	}
	.border{
		border-bottom: 1px solid #909399;
	}
	.popup-box{
		height: 100vh;
		width: 100vw;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.bg-box{
		position: absolute;
		top: 0;
		left: 0;
		width: 150%;
		height: 240px;
		background-color: #2979ff;
		border-bottom-left-radius: 40%;
		border-bottom-right-radius: 40%;
		margin-left: -25%;
	}
	.vue-box{
		padding: 10px 15px;
		padding-top:80px;
		.card-box{
			background-repeat: no-repeat;
			background-size: 100% 100%;
			margin: auto;
			border-radius: 14px;
			padding: 10px 15px;
			overflow: hidden;
			position: relative;
			image{
				width: 100%;
			}
			.pohto-box{
				width: 60px;
				height: 60px;
				border-radius: 60px;
				overflow: hidden;
				border: 1px solid #f0f0f0;
				image{
					width: 100%;
				}
			}
			.absolute{
				padding-top: 20px;
				padding-left: 20px;
				.realname-box{
					font-size: 22px;
					color: #303133;
					font-weight: bold;
					padding: 5px 0;
				}
				.position-box{
					font-size: 16px;
					padding: 5px 0;
				}
				.ab-text{
					flex: 1;
					height: 20px;
					line-height: 20px;
					font-size: 14px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}
				.micon{
					font-size: 14px;
				}
				.mobile-box{
					display: flex;
					padding-top: 5px;
					font-size: 14px;
				}
				.company-box{
					display: flex;
					padding: 5px 0;
					font-size: 14px;
				}
				.address-box{
					display: flex;
					padding: 5px 0;
					font-size: 14px;
				}
			}
			
		}
		
		.but-box{
			padding: 15px 0;
			display: flex;
			justify-content: space-between;
			.but{
				width: 49%;
			}
		}
		.data-box{
			// padding: 15px;
			padding-top: 0px;
			// background-color: #ffffff;
			margin-bottom: 15px;
			.scroll-data-box{
				height: 90px;
				white-space: nowrap;
				overflow: hidden;
				.flex-block{
					min-width: 45%;
					height: 75px;
					border: 1px solid #f0f0f0;
					background-color: #ffffff;
					border-radius: 8px;
					padding: 10px;
					display: inline-block;
					margin: 10px 10px 0 0;
					box-shadow: 0px 0px 4px 2px rgba(35, 89, 176, 0.08);
					.title{
						font-size: 16px;
						color: #303133;
						margin-bottom: 5px;
						padding-left: 2px;
					}
					.f-title{
						display: flex;
						.micon{
							color: #606266!important;
						}
						.f-text{
							flex: 1;
							font-size: 15px;
							line-height: 30px;
							color: #606266;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}
			}
			.data-info{
				font-size: 16px;
				color: #606266;
				padding-top: 15px;
			}
			.data-item{
				padding: 15px 0 0 0;
				.item-label{
					font-size: 15px;
					color: #909399;
				}
				.item-content{
					flex: 1;
					font-size: 15px;
					color: #606266;
				}
				.item-icon-box{
					width: 30px;
					height: 30px;
					background-color: #faebde;
					border-radius: 2px;
					line-height: 30px;
					text-align: center;
					
					.micon{
						font-size: 24px;
						color: #ff5123;
						display: block;
						line-height: 30px;
					}
				}
				.item-content-pu{
					flex: 1;
					font-size: 16px;
					color: #303133;
					line-height: 30px;
					padding-left: 10px;
				}
				
				
			}
		}
	}
	
	.img-item{
		height: 200px;
		overflow: hidden;
		border: 1px solid #f0f0f0;
		border-radius: 5px;
		margin-bottom: 10px;
		image{
			width: 100%;
		}
	}
	
	.list-body{
		.list-item{
			margin-bottom: 20rpx;
			background-color: #ffffff;
			padding: 15px;
			border-radius: 10px;
			display: flex;
			.avatar-box{
				width: 70px;
				height: 70px;
				border-radius: 5px;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.list-content{
				flex: 1;
				padding-left: 10px;
				min-width: 0;
				.list-title{
					font-size: 17px;
					font-weight: bold;
					color: #303166;
				}
				.list-desc-box{
					font-size: 15px;
					color: #606266;
					padding-top: 10px;
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