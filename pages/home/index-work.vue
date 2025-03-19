<template>
	<gui-page  
	:refresh="true"
	:loadmore="false" 
	
	:customHeader="false" 
	:customFooter="custom_Footer"
	@reload="reload" 
	:apiLoadingStatus="apiLoadingStatus"
	:customStyle="{
		backgroundColor:userhome.options.pageBox.background,
	}"
	@popup-callback="popupCallback"
	ref="guipage"
	>
		<template v-slot:gBody>
			<view class="phone-box"
			:style="{
				background: userhome.options.pageBox.background,
				backgroundImage: userhome.options.topBox.grad == '1' ?
				'linear-gradient(to bottom, '+ $util.colorToRgba(userhome.options.topBox.background, 1) +', '+userhome.options.pageBox.background+' 60%)' : ''
			}"
			>
			
			<view class="top-box"
			:style="{
				height:userhome.options.topBox.height > 0 ? userhome.options.topBox.height + 'px' : 'auto',
				background: userhome.options.topBox.grad == '0' ? userhome.options.topBox.background : '',
				
			}"
			>
			<view :style="{ padding: userhome.options.infoBox.padding }" style="position: relative;">
				<view class="info-box" >
					<view class="avatar-box">
						<image :src="memberInfo.avatar || $util.img('images/system/avatar.png')" style="width: 100%; height: 100%"></image>
					</view>
					<view class="content-box" @click="isLogin()" >
						<view  class="nickname" :style="{ color: userhome.options.infoBox.color }">
							<u-parse :content="(memberInfo.realname ? memberInfo.realname : memberInfo.nickname) || '未登录 请登录'"></u-parse>
							<text v-if="memberInfo.member_level_name" class="gui-badge  gui-bg-blue gui-color-white" 
							style="padding: 2px 5px;margin:0 10rpx;font-size: 10px;font-weight: 400;" 
							:style="{ color: userhome.options.infoBox.color }">
								{{memberInfo.member_level_name || ''}}
							</text>
						</view>
						<view class="menber-number" :style="{ color: userhome.options.infoBox.color }">
							ID:{{memberInfo.userid || ''}}
						</view>
						<view class="menber-number" :style="{ color: userhome.options.infoBox.color }">
							{{memberInfo.mobile || '账号：**** ****'}}
						</view>
					</view>
					<view style="flex: 1;padding: 10px 0 10px 0;">
						<view style="display: flex;">
							<view style="font-size: 12px;":style="{ color: userhome.options.infoBox.color }">状态：</view>
							<view class="tag-box"
							:style="{backgroundColor: status_data.find==1?'#18b566':'#2979ff'}"
							>{{status_data.find==1?'找司机': status_data.find==2?'待业中':'游客'}}</view>
						</view>
						
						<!-- <view style="display: flex;padding-top: 5px;">
							<view style="font-size: 12px;":style="{ color: userhome.options.infoBox.color }">工作状态：</view>
							<view class="tag-box"
							:style="{backgroundColor: status_data.await==1?'#18b566':'#2979ff'}"
							>{{status_data.await==1?'待业中':''}}</view>
						</view> -->
					</view>
					<view class="set-block">
						<sd-icon name="icon-huaban" size="22"
						:color="userhome.options.infoBox.color"
						@click="toSet()"
						></sd-icon>
					</view>
				</view>
			</view>
			
			

			<view style="padding: 10px 15px" v-if="userhome.options.dataBox.display == '1' && userhome.dataBoxList.length">
				<view class="datainfo-box" 
				:style="{
					backgroundColor: userhome.options.dataBox.background ? userhome.options.dataBox.background : 'none',
                }">
					<block v-for="data in userhome.dataBoxList" :key="data.ref">
						<view class="datainfo-block" v-if="data.display == '1'" @click="dataNav(data)">
							<view class="num-box" 
							:style="{
								color: userhome.options.dataBox.color,
								fontSize:data.font_size?data.font_size+'px':''
							}">
								{{data.auto?data.auto:memberInfo[data.ref] || 0 }}
							</view>
							<view class="num-name" 
							:style="{
								color: userhome.options.dataBox.color,
							}"
							>{{ data.title }}</view>
						</view>
					</block>
				</view>
			</view>
		  </view>
		  
			<view style="padding: 10px;">
				<view style="display: flex;justify-content: space-around;">
					<view style="width: 40%;background-color: #ffffff;border-radius: 5px;padding: 15px;text-align: center;"
					@click="navTo('/pages_member/follow/userList', {login: true}, {find: 2})"
					>
						<view style="font-size: 17px;font-weight: bold;">{{my_follow || 0}}</view>
						<view style="font-size: 14px;color: #606266">我关注的司机</view>
					</view>
					
					<view style="width: 40%;background-color: #ffffff;border-radius: 5px;padding: 15px;text-align: center;"
					@click="navTo('/pages_member/follow/userList', {login: true}, {find: 1})"
					>
						<view style="font-size: 17px;font-weight: bold;">{{me_follow || 0}}</view>
						<view style="font-size: 14px;color: #606266">关注我的老板</view>
					</view>
				</view>
			</view>
			
			<view style="padding:0 10px;">
				<view class="group-box" style="padding:10px;">
					<up-radio-group
					    v-model="status_data.find"
					    placement="column"
					    @change="groupChange"
					  >
						<view v-for="(item, index) in radiolist1" style="display: flex;">
							<up-radio
							  :customStyle="{marginBottom: '8px',marginLeft:'10px'}"
							  :key="index"
							  :label="item.name"
							  :name="item.value"
							  @change="radioChange"
							  >
							</up-radio>
							<view style="padding-left: 5px;font-size: 16px;">（{{item.title}}）</view>
						</view>
					    
					</up-radio-group>
					<view v-if="!focus && !memberInfo.remark" style="font-size: 14px;color: #909399;border: 1px solid #f0f0f0;padding: 5px;border-radius: 5px;" @click="focus = true">
						编辑你的需求或你擅长的挖机工作
					</view>
					<view v-if="!focus && memberInfo.remark" style="font-size: 14px;color: #909399;border: 1px solid #f0f0f0;padding: 5px;border-radius: 5px;" @click="focus = true">{{memberInfo.remark}}</view>
					<up-input
						v-if="focus"
					    placeholder="请输入内容"
					    border="surround"
					    clearable
						v-model="memberInfo.remark"
						:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
						:customStyle="{paddingRight:'10px',height:'30px'}"
						:focus="focus"
						@blur="blur"
					  ></up-input>
				</view>
			</view>
			
			<view style="padding: 0 10px;">
				<view style="display: flex;justify-content: space-between;">
					<view v-if="follow_me_code" style="width: 48%;background-color: #ffffff;border-radius: 5px;padding: 10px;text-align: center;">
						<view style="font-size: 17px;font-weight: bold;">我是司机</view>
						<view style="font-size: 14px;color: #606266">扫此码注册后关注我</view>
						<view style="width: 100%;border: 1px solid #f0f0f0;padding: 5px;border-radius: 2px;margin-top: 5px;"
						@click="$util.previewImage(0, [follow_me_code])"
						>
							<image :src="follow_me_code" mode="widthFix" style="width: 100%;height: 100%;"></image>
						</view>
					</view>
					
					<view v-if="to_follow_code" style="width: 48%;background-color: #ffffff;border-radius: 5px;padding: 10px;text-align: center;">
						<view style="font-size: 17px;font-weight: bold;">我是老板</view>
						<view style="font-size: 14px;color: #606266">扫此码注册后被我关注</view>
						<view style="width: 100%;border: 1px solid #f0f0f0;padding: 5px;border-radius: 2px;margin-top: 5px;"
						@click="$util.previewImage(0, [to_follow_code])"
						>
							<image :src="to_follow_code" mode="widthFix" style="width: 100%;height: 100%;"></image>
						</view>
					</view>
				</view>
			</view>
			
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
			
			<!-- 全屏加载 -->
			
			
			<!--加载中-->
			 
			
			
		</template>
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
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
			
			status_data:{
				find: 0,
				await:1,
			},
			my_follow: 0,
			me_follow: 0,
			follow_me_code:'',
			to_follow_code:'', 
			
			focus:false, 
			
			
			radiolist1:[
				{
				    name: '游客',
				    disabled: false,
					value: 0,
					title:'游客模式'
				},
				{
				    name: '招代班司机',
				    disabled: false,
					value: 1,
					title:'找代班的司机勾选此项'
				},
				{
				    name: '待业中',
					disabled: false,
					value: 2,
					title:'司机找活勾选此项'
				},
			]
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
					if(!res.realname){
						this.navTo('/pages_setting/information/real_name/index', {login:true});
					}
					this.$request('findWoekerHomeData', {},{
						showLoading: false,
					}).then((e)=>{
						console.log('我的数据', e)
						let data = e.data.data;
						if(data.status_data){
							this.status_data = e.data.data.status_data;
						}
						this.me_follow = data.me_follow;
						this.my_follow = data.my_follow;
						if(data.to_follow_code){
							this.to_follow_code = data.to_follow_code;
						}
						if(data.follow_me_code){
							this.follow_me_code = data.follow_me_code;
						}
					})
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
					this.navTo('/member/coupon/coupon')
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
			this.getInfo();
			this.$store.dispatch('getSystem', (System)=>{
				console.log('home-获取系统设置', System)
				this.apiLoadingStatus = false;
				if(Object.keys(System).length && System.userhome){
					this.userhome = System.userhome;
				}
				
				this.$refs.guipage.endReload();//停止刷新
			})
		},
		
		//关注公众号
		tofollow(){
			this.showModalPopup({
				title:'长按识别二维码',//提示标题
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
		blur(){
			this.focus = false;
			if(this.isSubmit) return;
			this.isSubmit = true;
			this.$util.throttle(async ()=>{
				const res = await this.$request('UserInfoUpdate', {
					val: this.memberInfo.remark,
					ref: 'remark'
				},{
					showLoading: false,
				})
				this.isSubmit = false;
				if(res.data.code == 200){
					this.msg(res.data.msg);
				}
				console.log('跟新', res)
			})
		},
		//modal弹窗回调
		popupCallback(v, options){
			const t = this;
			if(this.$refs['guipage']){
				this.$refs['guipage'].modalPopupClose();
			}
		},
		
		
		//弹窗返回  可删除
		modalEventBack(options, v){
			if(v == 1){
				if(options.ref == 'openfind'){
					this.$request('findWoekerChangeStatus', {
						value: 1,
						ref: 'find'
					},{
						showLoading: false,
					}).then((res)=>{
						console.log('开启招人', res)
						if(res.data.code == 200){
							this.msg(res.data.msg);
						}
						if(res.data.data.send_notice == 1){
							this.send_notice();
						}
					})
				}
			}
		},
		
		radioChange(e){
			console.log('radioChange', e)
			let r_ref = uni.getStorageSync('r_ref');
			let member_id = uni.getStorageSync('shareid');
			this.$request('findWoekerChangeStatus', {
				value: e,
				ref: 'find',
				r_ref: r_ref,
				member_id: member_id
			},{
				showLoading: false,
			}).then((res)=>{
				if(res.data.code){
					this.msg(res.data.msg);
				}
				if(res.data.data.send_notice == 1){
					this.send_notice();
				}
				this.getInfo();
				console.log('请求数据', res)
			})
		},
		send_notice(){
			let locationdata = this.$util.getKey('locationdata');
			if(locationdata){
				locationdata = JSON.parse(locationdata);
			}
			this.$request('findWoekerSendNotice', {locationdata:locationdata},{
				showLoading: false,
			}).then((res)=>{
				console.log('发送通知', res)
			})
		},
	}
}
</script>

<style lang="scss" scoped>
	
	.group-box{
		background-color: #ffffff;
		padding: 0px 10px;
		margin-bottom: 12px;
		border-radius: 10px;
		overflow: hidden;
	}
	.cell-item {
		display: flex;
		padding: 18px 15px 15px 5px;
		border-bottom: 1px solid #f0f0f0;
		.title{
			color: #303133;
			font-size: 17px;
		}
		.content{
			flex: 1;
			font-size: 15px;
			text-align: right;
			color: #909399;
			padding-right: 5px;
		}
		.cell-icon-box{
			
		}
	}
	.tag-box{
		height: 18px;
		line-height: 18px;
		border-radius: 5px;
		padding: 0 5px;
		font-size: 12px;
		color: #ffffff;
		background-color: #2979ff;
		margin-left: 5px;
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
		  // height: 100vh;
	      .top-box {
	        position: relative;
	        background-size: 100% 100%;
	        background-repeat: no-repeat;
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
	            .menber-number {
	              font-size: 13px;
	              color: #606266;
				  padding-top: 3px;
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
	      padding: 15px;
	      display: flex;
	      justify-content: space-around;
	      border-radius: 10px;
	      .datainfo-block {
	        text-align: center;
	        width: 35%;
	        .num-box {
	          font-size: 18px;
	          font-weight: bold;
	          color: #303133;
	        }
	        .num-name {
	          font-size: 13px;
	          color: #606266;
	          padding-top: 8px;
	        }
	      }
	    }
		

	
</style>