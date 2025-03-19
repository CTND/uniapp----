<template>
	<gui-page
		ref="guipage"
		
		:customStyle="{
			backgroundColor:System.full_bg_color
		}"
		@popup-callback="popupCallback"
	>
		<template v-slot:gBody>
			<view>
				<image :src="img" mode="widthFix" style="width: 100%;"></image>
				
				<view class="block-box">
					<view class="but-box"
					style="background-image: linear-gradient(45deg, #4aa0fd, #57c8fc)"
					@click="getWxCode"
					>
						来访预约
						<view class="micon icon-yonghujieshou"></view>
					</view>
					<view class="but-box"
					style="background-image: linear-gradient(45deg, #21d56b, #5ce694)"
					@click="navTo('/pages_visitor/record', {login: true})"
					>
						来访记录
						<view class="micon icon-xieyixiangqing"></view>
					</view>
					<view class="but-box"
					style="background-color: #fcbd71"
					@click="showInputBox = true"
					>
						员工录入
						<view class="micon icon-xieyixiangqing"></view>
					</view>
				</view>
				
				<!-- <view style="text-align: center;font-size: 16px;color: red;padding-top: 30px;" @click="showInputBox = true">员工录入</view> -->
			</view>
			<!-- 全屏加载 -->
			
			<u-popup
			:show="showInputBox"
			:round="10" @close="closeInputBox">
				<view class="form-box">
					<view class="form-block">
						<view class="form-item border-b">
							<view class="form-label">
								姓名
								<text class="micon required"></text>
							</view>
							<view class="form-content">
								<view class="content">
									<view class="input-box">
										<up-input
										class="input"
										placeholder="请输入您的姓名"
										v-model="ruleForm.realname"
										type='text'
										border="none"
										placeholderStyle="font-size:16px;color:#ceccca;"
										:customStyle="{paddingRight:'10px',height:'60rpx',lineHeight:'60rpx',}"
										inputAlign="right"
										:disableDefaultPadding="true"
										></up-input>
									</view>
									<view class="placeholder-box"></view>
								</view>
							</view>
						</view>
						
						<view class="form-item border-b">
							<view class="form-label">
								电话
								<text class="micon required"></text>
							</view>
							<view class="form-content">
								<view class="content">
									<view class="input-box">
										<up-input
										class="input"
										placeholder="请输入电话"
										v-model="ruleForm.mobile"
										type='text'
										border="none"
										placeholderStyle="font-size:16px;color:#ceccca;"
										:customStyle="{paddingRight:'10px',height:'60rpx',lineHeight:'60rpx'}"
										inputAlign="right"
										:disableDefaultPadding="true"
										></up-input>
									</view>
									<view class="placeholder-box"></view>
								</view>
							</view>
						</view>
						<view class="form-item " @click="showGoodsBox = true">
							<view class="form-label">
								部门
								<text class="micon required"></text>
							</view>
							<view class="form-content">
								<view class="content" style="justify-content: flex-end;">
									<view class="text-box" style="text-align:right">
										{{ruleForm.label || ''}}
									</view>
									<view v-if="ruleForm.label ==''" class="placeholder-box">请选择</view>
								</view>
								<view class="icon-box">
									<sd-icon name="icon-iconfonticonfonti2copycopy"
									size="14" color="#c0c4cc" top="20"></sd-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<u-button type="primary" text="提交"
				throttleTime="1000"
				size="large"
				:customStyle="$util.butStyle('primary',{marginTop:'30px', backgroundColor:System.big_but_color,width:'90%',marginBottom:'50px'})"
				@click="submit()"
				></u-button>
			</u-popup>
			<u-popup
			:show="showGoodsBox"
			:round="10" 
			@close="closeGoodsPopup"
			@open="openGoods"
			>
				<view class="popup-mini-box" style="height: 65vh;">
					<view class="popup-but-title">
						<view class="but-box cancel"></view>
						<view class="but-box true" @click="closeGoodsPopup">关闭</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y" :style="{height: '60vh'}">
						<view class="list-box" v-if="people_list.length">
							<view class="list" hover-class="list-hover" hover-stay-time="100"
							v-for="(item, index) in people_list" :key="index"
							@click="checkGoods(item)"
							>
								<view class="list-item" >
									<view class="list-title">
										{{item.label}}
									</view>
									<view class="action-box">
										<sd-icon 
										v-if="ruleForm.did == item.id"
										name="icon-xuanzhong"
										size="20" color="#287eef" top="0" :customStyle="{textAlign:'center', display:'block'}"></sd-icon>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</u-popup>
		</template>
	</gui-page>
	
</template>

<script>
	export default{
		data() {
			return {
				img: 'https://test.yunzxun.com/addons/public_serve/uploads/2351/images/67458cd06192a.jpg',
				
				focus:false,
				people_list:[],//全员列表
				showInputBox:false, 
				showGoodsBox:false,
				ruleForm:{
					realname:'',
					mobile:'',
					did:'',
					label: '',
					roles:'staff'
				},
			}
		},
		onLoad: function() {
			// #ifdef MP-WEIXIN
			this.getCode((e)=>{
				console.log('微信隐藏登录',e)
				if(e.openid){
					this.$request('wxOpenIdLogin', {openid: e.openid},{
						showLoading: false,
					}).then((res)=>{
						console.log('请求数据', res)
						if(res.data.data.userInfo.token){
							this.userInfo = res.data.data.userInfo;
							let token = res.data.data.userInfo.token;
							this.$store.commit('setToken', {
								token: token,
								tokenExpired: 7200*60
							});
						}
					})
				}
			})
			// #endif
		},
		onShow() {
			this.findPeople();
		},
		methods:{
			getCode(callback){
				// #ifdef MP-WEIXIN
				uni.login({
					provider: 'weixin',
					timeout: 3000,
					success: res => {
						if (res.code) {
							this.$request('getOpenid',{
								code: res.code
							}, {
								showLoading: false
							}).then((res)=>{
								if(res.data.code == 200){
									if(res.data.data.openid && res.data.data.session_key){
										typeof callback == 'function' && callback(res.data.data);
									}else{
										this.msg('获取openid错误');
									}
								}else{
									this.msg(res.data.msg);
								}
							});
						}
					},
					fail: () => {
						this.msg('请求失败');
					}
				})
				// #endif
			},
			getWxCode(){
				this.navTo('/pages_visitor/form', {login: true})
			},
			submit(){
				if(!this.ruleForm.realname){
					this.msg('姓名不能为空');
					return;
				}
				if(!this.ruleForm.mobile){
					this.msg('电话不能为空');
					return;
				}
				if(!this.ruleForm.did){
					this.msg('部门不能为空');
					return;
				}
				this.$request('UpdateUserInfo', this.ruleForm,{
					showLoading: true
				}).then((res)=>{
					//console.log('完善信息提交', res)
					if (res.data.code == 200) {
						this.showInputBox = false;
					}
				})
			},
			findPeople(){
				this.$util.throttle(async ()=>{
					this.$request('departmentList', {},{
						showLoading: false,
					}).then((res)=>{
						console.log('搜索到的用户', res)
						if(res.data.data.list){
							this.people_list = res.data.data.list;
						}
					})
				})
				
			},
			//选择车辆
			checkGoods(item){
				this.ruleForm.did = item.id;
				this.ruleForm.label = item.label;
			},
			openGoods(){
				setTimeout(()=>{
					this.focus = true;
				}, 200)
			},
			closeGoodsPopup(){
				this.focus = false;
				this.showGoodsBox = false;
				this.keyword = '';
				this.people_list = []
			},
			closeInputBox(){
				this.showInputBox = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-box{
		padding: 10px 0;
		.form-block{
			background-color: #ffffff;
			padding: 0 15px;
			margin-bottom: 10px;
			.form-item{
				display: flex;
				// padding: 15px 0;
				box-sizing: border-box;
				height: 110rpx;
				line-height: 110rpx;
				vertical-align: middle;
				.form-label{
					font-size: 16px;
					color: #303133;
				}
				.required::after{
					content: "\e69b";
					color: red;
					font-size: 10px;
					vertical-align:text-top;
				}
				.form-content{
					flex: 1;
					display: flex;
					.content{
						flex: 1;
						min-width: 0;
						text-align: right;
						font-size: 16px;
						color: #303133;
						display: flex;
						.input-box{ 
							flex: 1;
							padding: 0 5px;
							padding-top: 24rpx;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
							min-width: 0;
							vertical-align: bottom;
						}
						.placeholder-box{
							text-align: right;
							font-size: 16px;
							color: #909399;
						}
						.text-box{
							margin-right: 10rpx;
							color: #606266;
							font-size: 28rpx;
						}
					}
					.icon-box{
						padding-left: 5px;
					}
				}
			}
			.item-b{
				border-bottom: 1px solid #e7e6e4;
			}
			//纵向布局
			.column-box{
				padding: 10px 0;
				.form-label{
					font-size: 16px;
					color: #303133;
				}
				.required::after{
					content: "\e69b";
					color: red;
					font-size: 10px;
					vertical-align:text-top;
				}
				.column-content{
					font-size: 16px;
					padding-top: 10px;
					.textarea{
						font-size: 17px;
						line-height: 1.3;
						color: #303133;
						border: 1px solid;
					}
				}
			}
			//操作部分
			.action-box{
				padding: 10px 0;
				.form-label{
					font-size: 17px;
					color: #303133;
				}
				.action-content{
					padding: 10px 5px;
					.step-box{
						display: flex;
						.step-left{
							padding-right: 5px;
							display: flex;
							flex-direction: column;
							.ico-box{
								width: 20px;
								height: 20px;
								margin: auto;
								border-radius: 20px;
								background-color: #bfc9d3;
							}
							.step-lin{
								flex: 1;
								width: 1px;
								background-color: #c0c4cc;
								margin: auto;
							}
						}
						.step-right{
							flex: 1;
							// display: flex;
							// flex-direction: column;
							.step-title{
								font-size: 16px;
								color: #303133;
								margin-bottom: 5px;
								padding-top: 2px;
								padding-left: 3px;
							}
							.step-content{
								flex: 1;
								display: flex;
								flex-wrap: wrap;
								vertical-align: middle;
								.info-box{
									background-color: #e4ecfd;
									display: flex;
									justify-content: space-between;
									height: 30px;
									line-height: 30px;
									border-radius: 3px;
									margin: 5px;
									width: 85px;
									overflow: hidden;
									text-align: center;
									.realname{
										font-size: 15px;
										color: #606266;
										max-width: 70px;
										padding: 0 5px;
										flex: 1;
										min-width: 0;
									}
								}
								.up-box{
									width: 30px;
									height: 30px;
									background-color: #e4ecfd; 
									text-align: center;
									border-radius: 2px;
									margin: 5px;
								}
							}
						}
					}
				}
			}
		}
	}
	.popup-mini-box{
		height: 50vh;
		.popup-but-title{
			padding: 16px 15px 15px;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #e7e6e4;
			.but-box{
				font-size: 17px;
			}
			.cancel{
				color: #909399;
			}
			.true{
				color: #287eef;
			}
		}
		.scroll-Y{
			height: 100%;
			padding-bottom: 60px;
			.list-box{
				.list{
					padding: 0 15px 0 20px;
					.list-item{
						padding: 15px 0;
						display: flex;
						justify-content: space-between;
						border-bottom: 1px solid #f4f4f5;
						.list-title{
							font-size: 17px;
							color: #303133;
							flex: 1;
							max-height: 30px;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
							min-width: 0;
						}
						.action-box{
							padding-right: 10px;
						}
					}
				}
				
			}
		}
	}
	.block-box{
		background-color: #ffffff;
		padding: 10px;
		.but-box{
			height: 80px;
			line-height: 80px;
			text-align: center;
			font-size: 18px;
			color: #ffffff;
			border-radius: 10rpx;
			position: relative;
			overflow: hidden;
			margin-bottom: 10px;
			.micon{
				width: 60px;
				height: 60px;
				position: absolute;
				bottom: 0px;
				right: 0;
				font-size: 58px;
				opacity: 0.2;
			}
		}
	}
</style>