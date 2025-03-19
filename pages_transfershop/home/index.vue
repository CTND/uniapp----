<template>
	<gui-page  
	:refresh="true"
	:loadmore="false" 
	:customHeader="true" 
	:customFooter="true"
	:showFooterBar="true"
	@reload="reload" 
	:apiLoadingStatus="apiLoadingStatus"
	:customStyle="{
		backgroundColor:userhome.options.pageBox.background,
	}"
	@popup-callback="popupCallback"
	@clickCallback="linkClick"
	ref="guipage"
		>
		<template v-slot:gBody>
			<view class="phone-box"
			:style="{
				background:userhome.options.pageBox.grad == '0'? userhome.options.pageBox.background: '',
				backgroundImage:userhome.options.pageBox.grad == '1'? 
				'linear-gradient(to bottom, ' + userhome.options.topBox.background + ', ' +userhome.options.pageBox.background +' 50%)': '',
			}"
			>
			
			<view class="top-box"
			:style="{
				height:userhome.options.topBox.height > 0 ? userhome.options.topBox.height + 'px' : 'auto',
				padding: userhome.options.infoBox.padding,
				background:userhome.options.pageBox.grad == '0' && userhome.options.topBox.bgStyle == '0'? 
				userhome.options.topBox.background: '',
				backgroundImage:userhome.options.topBox.bgStyle == '1' ? 'url(' +userhome.options.topBox.backgroundImg +')': '',
			}"
			>
			<view class="info-body" :style="{ 
				background:userhome.options.infoBox.grad == '0'? userhome.options.infoBox.background : '',
				backgroundImage:userhome.options.infoBox.grad == '1'? 'url(' +userhome.options.infoBox.backgroundImg +')': '',
				padding: userhome.options.infoBox.infoPadding,
			}" style="position: relative;">
				<view class="info-box" >
					<view class="avatar-box">
						<image :src="memberInfo.avatar || $util.img('images/system/avatar.png')" style="width: 100%; height: 100%"></image>
					</view>
					<view class="content-box" @click="isLogin()">
						<view  class="nickname" :style="{ color: userhome.options.infoBox.color }">
							<u-parse :content="(memberInfo.realname ? memberInfo.realname : memberInfo.nickname) || '未登录 请登录'"></u-parse>
							<view style="display: flex;padding-top: 4rpx;">
								<view v-if="memberInfo.level_name" class="gui-bg-blue gui-color-white"
								:style="{ color: userhome.options.infoBox.color }"
								style="padding: 0px 16rpx;font-size: 10px;font-weight: 400;margin-right: 10px;height: 32rpx;line-height: 32rpx;border-radius: 30rpx;" 
								>
									{{memberInfo.level_name || ''}}
								</view>
								<view class="menber-number" :style="{ color: userhome.options.infoBox.color }" 
								style="font-weight: 400;padding-top: 0;">
									ID:{{memberInfo.userid || ''}}
								</view>
							</view>
						</view>
						
						<view class="menber-number" :style="{ color: userhome.options.infoBox.color }">
							{{memberInfo.mobile || '账号：**** ****'}}
						</view>
					</view>
					<view class="set-block">
						<sd-icon name="icon-huaban" size="22"
						:color="userhome.options.infoBox.color"
						@click="toSet()"
						></sd-icon>
					</view>
				</view>
				
				<view v-if="userhome.options.dataBox.display == '1' && userhome.dataBoxList.length">
					<view class="datainfo-box"  
					:style="{
						backgroundColor: userhome.options.dataBox.background == null ? '' : userhome.options.dataBox.background,
				    }"
					>
						<block v-for="data in userhome.dataBoxList" :key="data.ref">
							<view class="datainfo-block" v-if="data.display == '1'" @click="dataNav(data)" 
							style="padding: 0 10rpx;"
							>
								<view class="num-name"
								:style="{
									color: userhome.options.dataBox.color,
								}"
								>{{ data.title }}</view>
								<view class="num-box" 
								:style="{
									color: userhome.options.dataBox.color,
									overflow:'hidden',
								}">
									{{data.auto?data.auto:memberInfo[data.ref] || 0 }}
								</view>
								
							</view>
						</block>
					</view>
				</view>
			</view>
			
			
			
		</view>
		<!--会员卡-->
		<view  v-if="userhome.options.cardBox.grad == '1' && userhome.options.cardBox.backgroundImg"
			:style="{
				padding: userhome.options.menuBox.padding,
				width:'100%',
			}"
			@click="navTo('/pages_member/card/index', {login: true})"
		  >
			<image class="card-img" :src="userhome.options.cardBox.backgroundImg" mode="widthFix"></image>
		</view>
				  
		  <view class="menu-box" 
			:style="{
				padding: userhome.options.menuBox.padding
			}">
			<view v-for="(menublock, mindex) in userhome.menuList" :key="mindex"
			 :class="['menu-block-padding-'+menublock.options.displayStyle]"
			class="menu-block">
				<view class="block-title" v-if="menublock.title && menublock.options.displayStyle == 'block'">{{ menublock.title }}</view>
					
					<view class="block-box-menu" :class="[menublock.options.displayStyle]"
					>
						<view v-for="(menu, sindex) in menublock.list" :key="sindex" class="menu-block-box"
						:style="{
							borderBottom:sindex == menublock.list.length-1 ? 'none' : menublock.options.displayStyle == 'clumn' && menublock.options.showBorder == '1' ? '1px solid #f0f0f0' : '',
							borderColor:menublock.options.displayStyle == 'clumn' && menublock.options.showBorder == '1' ? '#f0f0f0' : '',
							marginTop: menublock.options.displayStyle == 'block' ? menublock.options.margin + 'px' : 'auto',
						}"
						@click="menuClick(menu)"
						>
							<view v-if="menu.icon_img" class="icon_img-box"
							:style="{
								width: menublock.options.iconSize + 'px',
								height: menublock.options.iconSize + 'px',
							}"
							>
								<image :src="menu.icon_img" style="width: 100%; height: 100%"></image>
							</view>

							<view v-else class="micon"
							:class="[menu.font_class]"
							:style="{
								fontSize: menublock.options.iconSize + 'px',
								color: menublock.options.iconColor,
								width: menublock.options.iconSize + 'px',
								height:menublock.options.height > 0 ? menublock.options.height + 'px': menublock.options.iconSize + 'px',
								lineHeight:menublock.options.height > 0? menublock.options.height + 'px': menublock.options.iconSize + 'px',
							}"
							></view>
							<view class="menu-box-title"
							:style="{
							lineHeight: menublock.options.displayStyle == 'clumn' ? menublock.options.height > 0
                            ? menublock.options.height + 'px'
                            : menublock.options.iconSize * 2 + 'px' : '',
							fontSize: menublock.options.fontSize + 'px',
							color: menublock.options.fontColor,
							marginTop:menublock.options.displayStyle == 'clumn'? 'auto':menublock.options.marginTop+'px',
							}"
							>
								{{ menu.title }}
							</view>
							<view v-if="menublock.options.displayStyle == 'clumn'" class="micon icon-iconfonticonfonti2copycopy" 
							style="font-size: 16px;color: #909399;"
							:style="{
							  height:
								menublock.options.height > 0
								  ? menublock.options.height + 'px'
								  : menublock.options.iconSize + 'px',
							  lineHeight:
								menublock.options.height > 0
								  ? menublock.options.height + 'px'
								  : menublock.options.iconSize + 'px',
							}"
							></view>
						</view>
					</view>
				</view>
			</view>
			<!-- && System.cheat==2 -->
			<view class="follow-box" v-if="userhome.options.menuBox.wx_account == 1 && System.wx_code != ''"
			:style="{
				padding: userhome.options.menuBox.padding
			}">
				<view class="flex-box" style="display: flex;">
					<view style="flex: 1;">
						<view style="font-size: 16px;color: #303133">关注公众号</view>
						<view style="font-size: 12px;color: #909399;padding-top: 5px;">关注后可实时接收消息提醒以及动态</view>
					</view>
					<view class="follow-but"  @click="tofollow()">
						关注
					</view>
				</view>
			</view>
			
			<view v-if="System.copyright_text">
				<u-parse :content="System.copyright_text"></u-parse>
			</view>
		</view>
			
			<push-popup-vue ref="pushPopup"></push-popup-vue>
		</template>
		
		<!-- #ifndef MP-TOUTIAO -->
		<template v-slot:gFooter>
			<sd-tabbar :tabbarList="tabbarList" :tabIndex="2"></sd-tabbar>
		</template>
		<!-- #endif -->
	</gui-page>
</template>
<script>
	import pushPopupVue from '../push-popup.vue';
export default {
	components:{
		pushPopupVue
	},
	data() {
		return {
			tabbarList:[
				{
					title: '项目',
					icon: 'icon-shangpinfenlei1',
					path: '/pages_servedoor/item/List'
				},
				{
					title: '订单',
					icon: 'icon-dingdan',
					path: '/pages_servedoor/order/List'
				},
				{
					title: '个人中心',
					icon: 'icon-yonghuming',
					path: '/pages/home/index'
				}
			],
			memberInfo:{},
			userhome: {
				options: {
					pageBox: {
						background: '#FAFAFA',
						padding: '10px 15px 10px 15px',
					},
					topBox: {
						height: '200',
						background: '#33a3dc',
						grad:'0'
					},
					//会员卡
					cardBox: {
						backgroundImg: '',
						grad: '1',
					},
					menuBox: {
						padding: '10px',
					},
					infoBox: {
						padding: '80px 30px 20px 30px',
						color: '#ffffff',
					},
					dataBox: {
						display: '1',
					},
				},
				dataBoxList: [],
				menuList: [],
			},
			list:[],
			//列表渲染数据
			totalCount:0,//总数据量
			apiLoadingStatus:false,
			queryForm:{
				pageNo: 1,
				pageSize: 10,
				keyword: '',
			},
			
			menu_list: [], //附加的菜单
		}
	},
	onLoad: function() {
		
	},
	onShow() {
		this.memberInfo = {};
		let userInfo = uni.getStorageSync('userInfo');
		//console.log('本地缓存的用户数据', userInfo)
		if(userInfo){
			let userInfoData = JSON.parse(userInfo);
			this.memberInfo = userInfoData;
		}
		this.getInfo();
		this.reload();
	},
	
	methods: {
		//去设置
		toSet(){
			//this.navTo('/pages_setting/information/real_name/index', {login:true});
			this.navTo('/pages_setting/index', {login:true}); 
		},
		getInfo(){
			this.$store.dispatch('getUserInfo', (res)=>{
				console.log('用户资料', res)
				if(Object.keys(res).length){
					this.memberInfo = res;
				}
				
			})
		},
		//数据块导航
		dataNav(e){
			console.log(e)
			if(e.model_data){
				let model_data = e.model_data;
				this.showModalEvent(model_data);
				return
			}
			if(e.path){
				this.navTo(e.path, {login:true});
			}else{
				if(e.ref == 'money'){
					this.navTo('/pages_member/recharge/money', {login:true})
				}else if(e.ref == 'point'){
					this.navTo('/pages_member/money/point', {login: true}, {account_type:'point'})
				}else if(e.ref == 'coupon'){
					this.navTo('/pages_member/coupon/coupon')
				}else if(e.ref == 'bonus'){
					this.navTo('/pages_reseller/index')
				}else if(e.ref == 'currency'){
					this.navTo('/pages_member/recharge/currency', {login:true}, {showTop:1})
				}
			}
		},
		//点击事件
		menuClick(menu){
			console.log('menuClick', menu)
			if(!this.isLogin()){
				return;
			}
			if(menu.path.roles){
				if(menu.path.roles != this.memberInfo.roles){
					this.msg('无权访问');return;
				}
			}
			if(menu.path.path !== ''){
				this.navTo(menu.path.path, {login: true});
				return;
			}
			if(typeof menu.path === "object") {
				this.navTo(menu.path, {login: true});
			}
		},
		
		//下拉刷新
		reload(){
			this.$store.dispatch('getSystem', (System)=>{
				console.log('home-获取系统设置', System)
				this.apiLoadingStatus = false;
				if(Object.keys(System).length && System.userhome){
					if(!System.userhome.options.topBox.grad){
						System.userhome.options.topBox.grad = '0';
					}
					if(!System.userhome.options.cardBox.grad){
						System.userhome.options.cardBox.grad = '0';
					}
					this.userhome = System.userhome;
				}
				
				this.$refs.guipage.endReload();//停止刷新
				
				/*
				if(this.isLogin({nav:false})){
					//获取指定数据块
					this.$request('simpleDataMenu', {},{
						showLoading: false,
					}).then((res)=>{
						console.log('请求特定数据块', res)
						if(res.data.data.dataBoxList){
							this.userhome.dataBoxList = res.data.data.dataBoxList;
						}
						
					})
				}else{
					
				}
				*/
			})
		},
		
		//关注公众号
		tofollow(){
			this.showModalPopup({
				title:'请扫码关注',//提示标题
				popup_img: '',
				content:'<img src="' + this.System.wx_code + '" style="display:block;width:200px;height:200px;margin:auto;">\n' +
				'<div style="text-align: center;font-size:14px;">关注公众号后可接收消息通知</div>',//文本内容
				contentAlign: true,//文本是否居中
				confirmText:'我知道了',//确认按钮文字
				showConfirmButton: true, //是否显示确认按钮
				closeOnClickOverlay: false, //是否允许点击遮罩关闭Modal
				soltButton: true, //是否显示solt按钮
				negativeTop: 0, 
			}, {})
		},
		//modal弹窗回调
		popupCallback(v, options){
			const t = this;
			if(this.$refs['guipage']){
				this.$refs['guipage'].modalPopupClose();
			}
		},
		//链接点击事件
		linkClick(e){
			if(e.event == 'push'){
				this.$refs['pushPopup'].open();
			}
		},
	}
}
</script>

<style lang="scss" scoped>
	.card-img{
		width: 100%;
	}
	.follow-code-box{
		padding-top: 10px;
		.code-img-box{
			border-radius: 5px;
			overflow: hidden;
			width: 200px;
			height: 200px;
			margin: auto;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.follow-box{
		.flex-box{
			background-color: #ffffff;
			padding: 15px;
			border-radius: 10px;
			.follow-but{
				padding: 0 15px;
				height: 60rpx;
				border-radius: 60rpx;
				background-color: #4f7ffd;
				line-height: 60rpx;
				margin-top: 5px;
				font-size: 24rpx;
				color: #ffffff;
			}
		}
	}
	.set-block{
		padding-top: 10rpx;
	}
	.phone-box {
		  height: calc( 100vh - 120px );
		  .menber-number {
		  	font-size: 13px;
		  	color: #606266;
		  	padding-top: 3px;
		  }
	      .top-box {
	        position: relative;
	        background-size: 100% 100%;
	        background-repeat: no-repeat;
			.info-body {
				background-size: 100% 100%;
				background-repeat: no-repeat;
				border-radius: 10px;
				overflow: hidden;
				padding: 15px;
				.info-box {
					display: flex;
					.avatar-box {
						width: 60px;
						height: 60px;
						border-radius: 60px;
						overflow: hidden;
					}
					.content-box {
							flex: 1;
							padding-left: 10px;
							padding-top: 2px;
							min-width: 0;
							overflow: hidden;
						.nickname {
							font-size: 15px;
							font-weight: bold;
							color: #606266;
							line-height: 20px;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
						}
						
					}
				}
			}
	        
	      }
	
			.menu-box {
				padding: 10px;
				.menu-block-padding-block{
					padding: 15px 10px 15px;
				}
				.menu-block-padding-clumn{
					padding: 5px 15px;
				}
				.menu-block {
					margin-bottom: 10px;
	                background: #ffffff;
	                border-radius: 5px;
	                
	                .block-title {
	                  font-size: 15px;
	                  color: #303133;
	                  font-weight: bold;
	                  padding: 8px 5px 12px 5px;
	                  margin-top: -10px;
	                }
	                .clumn {
	                  display: block;
	                  .menu-block-box {
	                    display: flex;
	                    width: 100% !important;
	                    margin-bottom: 0 !important;
	                    .menu-box-title {
	                      flex: 1;
	                      text-align: left;
	                      padding-left: 5px;
	                      padding-top: 0px !important;
	                    }
	                    .mobile-icon {
	                      width: auto !important;
	                    }
	                  }
	                }
	                .block {
	                  display: flex;
	                  flex-wrap: wrap;
	                }
	                .block-box-menu {
	                  //padding: 0 10px;
						.menu-block-box {
							width: 25%;
							text-align: center;
							.micon{
								text-align: center;
								margin: auto;
							}
							.icon_img-box,
							.mobile-icon {
								width: 35px;
								height: 35px;
								line-height: 35px;
								text-align: center;
								margin: auto;
								overflow: hidden;
							}
							.menu-box-title {
								font-size: 14px;
								//padding-top: 10px;
							}
						}
					}
				}
			}
	    }
	    .datainfo-box {
	      padding: 15px 0;
	      display: flex;
	      justify-content: space-between;
	      border-radius: 10px;
		  margin-top: 10px;
	      .datainfo-block {
	        text-align: center;
	        width: 35%;
	        .num-box {
	          font-size: 16px;
	          font-weight: bold;
	          color: #303133;
			  padding-top: 5px;
	        }
	        .num-name {
	          font-size: 26rpx;
	          color: #606266;
	          // padding-top: 5px;
	        }
	      }
	    }
		

	
</style>