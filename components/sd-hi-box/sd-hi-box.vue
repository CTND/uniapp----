<template>
	<u-popup :show="showHiBox" mode="bottom" :round="15"  @close="closeBox">
		<view class="hi-box">
			<view class="hi-top">
				<view class="avatar-box">
					<image :src="memberInfo.avatar"></image>
				</view>
				<view class="info-box">
					<view class="nickname">
						<u-parse :content="memberInfo.nickname || ''"></u-parse>
					</view>
					<view class="sex-tag" :style="{backgroundColor:memberInfo.sex == 1 ? '#47d4ea' : '#fd7bb7'}">
						<sd-icon :name="memberInfo.sex == 1 ? 'icon-nan1' : 'icon-nv2'" size="12" color="#ffffff" top="1"></sd-icon>
						<text class="sex-text">{{memberInfo.age}}</text>
					</view>
				</view>
				<view v-if="memberInfo.sign" style="font-size: 14px;color: #606266;padding-top: 2px;text-align: center">
					{{memberInfo.sign}}
				</view>
				<view class="micon icon-guanbi1" @click="closeBox"></view>
			</view>
			<view class="hi-msg-box">
				<scroll-view
					:scroll-y="true" 
					style="background-color: #f6f6f6;"
					upper-threshold="60px"
					:scroll-into-view="intoView"
					@touchstart="touchstart"
					@touchend="touchend"
					@scroll="scroll"
					:style="{
						height: 'calc( 80vh - 200px )',
					}"
				>
					<view class="hi-msg-list">
						<view @click="openGift" style="background-color: #feecba;width:75%;margin:5px auto;border-radius: 10px;padding: 10px 15px;">
							<view style="font-size: 15px;color: #7b3907;text-align: center;">送个礼物更容易被回复</view>
							<view  class="gift-msg-box">
								<view class="gift-top-box" style="display: flex;background-color: #ffffff;border-radius: 10px;padding: 10px;margin-top: 10px;">
									<view class="gift-msg-icon">
										<up-image :src="$util.img('images/gift/3.png')" 
										width="50px" height="50px"></up-image>
									</view>
									<view class="gift-text-box">
										<view style="font-size: 14px;color: #606266;padding: 5px;line-height: 1.5;">
											<u-parse :content="'如果你来了 春天就可以不用来了'"></u-parse>
										</view>
									</view>
								</view>
							</view>
						</view>
						<block v-for="(item, index) in Msglist" :key="index">
							<view class="time-box">{{$util.timestampToTime(item.time)}}</view>
							<view class="msg-item"
							:class="[item.from == userData.userid ? 'im-msg-right' : 'im-msg-left']"
							>
								<view class="avatar-box" v-if="item.showAvatar" @click="openInfo(item.from == userData.userid ? userData : memberInfo)">
									<up-avatar :src="item.avatar" 
									shape="square" size="40"></up-avatar>
								</view>
								<view class="msg-center">
									<view class="status-box" v-if="item.from == userData.userid">{{item.isPeerRead ? '已读' : '未读'}}</view>
									<view
									v-if="item.type == 'TIMTextElem' || item.type == 'TIMImageElem' || item.type == 'TIMVideoFileElem'"
									class="content-txt" 
									:class="[item.from == memberInfo.userid ? 'member-bg' : 'default-box']"
									:style="[getContentStyle(item)]"
									>
										<u-parse :content="getMsgContent(item)" :controls="false"></u-parse>
									</view>
									<view v-else-if="item.type == 'TIMSoundElem'"
									class="content-txt"
									:class="[item.from == memberInfo.userid ? 'member-bg' : 'default-box']"
									:style="{width:item.cloudCustomData.recLength < 7 ? '70px' : item.cloudCustomData.recLength*10+'px',maxWidth:'150px'}"
									@click="playAudio(item.payload)"
									>
										<text class="micon" 
										:class="[
											item.from == memberInfo.userid ? 'icon-yuyinbofang' : 'icon-yuyinbofang-copy',
											AudioUUID == item.payload.uuid ? 'ani-box' : ''
										]"
										></text>
										<text v-if="item.cloudCustomData.recLength">
											{{item.cloudCustomData.recLength || ''}}
											<span style="font-size: 12px;color: #909399;margin-left: 2px;">秒</span>
										</text>
										
									</view>
									<view v-else-if="item.type == 'TIMLocationElem'">
										<view class="location-box">
											<view class="location-title">{{item.payload.description}}</view>
											<view class="location-img-box" @click="$util.toLocation(item.payload.latitude, item.payload.longitude)">
												<image :src="'https://restapi.amap.com/v3/staticmap?location='+item.payload.longitude+','+item.payload.latitude+'&zoom=12&size=750*750&scale=1&key='+System.gd_web_key" mode="widthFix"></image>
											</view>
										</view>
									</view>
									<view v-else-if="item.type == 'TIMCustomElem'">
										<view v-if="item.payload.data == 'gift'" class="gift-msg-box">
											<view class="gift-top-box">
												<view class="gift-msg-icon">
													<up-image v-if="item.payload.description"
													:src="item.payload.description" 
													width="60px" height="60px"></up-image>
												</view>
												<view class="gift-text-box">
													<view style="font-size: 15px;color: #ffffff;">
														<u-parse :content="'送@ '+memberInfo.nickname+'1个'+getExtension(item.payload,'gift_name')"></u-parse>
													</view>
													<view style="font-size: 12px;color: #f0f0f0;padding-top: 5px;">hi,送你一个{{getExtension(item.payload,'gift_name')}}~（{{getExtension(item.payload,'gift_price')}}陌币）</view>
												</view>
											</view>
											<view class="gift-msg-footer">送礼给TA</view>
										</view>
										<view v-if="item.payload.data == 'bag'" class="bag-msg-box">
											<view class="bag-box" @click="openBag(item)">
												<view class="icon-box">
													<up-image
													:src="$util.img('images/system/bag1.png')" 
													width="50px" height="50px"></up-image>
												</view>
												<view class="text-box">
													<view style="font-size: 18px;color: #ffffff;font-weight: bold;">
														￥{{moneyFormat(item.payload.description)}}
													</view>
													<view class="descs">
														{{item.payload.extension || '大吉大利 恭喜发财'}}
													</view>
												</view>
											</view>
											<view class="msg-footer">微信红包</view>
										</view>
										<view v-else-if="item.payload.data == 'tip'" 
										class="tip-content-txt">
											<u-parse :content="getMsgContent(item)" :controls="false" @linktap="linkTap"></u-parse>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
					<view :id="intoView"></view>
				</scroll-view>
				<view class="input-box">
					<sd-im-input ref="sdIminput" @send-envent="sendEvent"
					:memberId="toID"
					:showAction="false"
					:showBar="showBar"
					:keyboardheight="keyboardheight"
					:boardheightIng="boardheightIng"
					></sd-im-input>
				</view>
				
			</view>
		</view>
		<!-- 礼物动画 -->
		<view v-for="(ani, aindex) in animation_list" :key="aindex">
			<u-transition :show="ani.show" mode="slide-right" :custom-style="getAnimationStyle(aindex)">
				<view class="gift-tip-box">
					<view class="gift-msg-icon">
						<up-image :show-loading="true"
						:src="ani.gift_ico" 
						width="45px" height="45px"></up-image>
					</view>
					<view class="gift-text-box">
						<view style="font-size: 30rpx;color: #ffffff;">
							<u-parse :content="'送@ '+ani.nickname+'1个'+ani.gift_name"></u-parse>
						</view>
					</view>
				</view>
			</u-transition>
		</view>
		
		<!-- 金币充值 -->
		<u-popup :show="showRech" :round="10" :overlay="false" bgColor="transparent" closeable @close="closeCurrencyRech()">
			<view class="rech-box-win">
				<currency ref="currencyRech" @currency-back="currencyBack"></currency>
			</view>
		</u-popup>
		
		<!-- 红包详情 -->
		<u-popup :show="showBag" mode="center"  bgColor="transparent" @close="closeBagBox()">
			<view class="bag-data-box">
				<view class="top-box">
					<view class="micon icon-guanbi2" style="text-align: right;color: #ffffff;font-size: 24px;" @click="closeBagBox()"></view>
				</view>
				<view class="info-box">
					<view class="from-box">
						<view class="user-info-box">
							<view class="small-avatar">
								<up-image v-if="bagData.fromer" 
								:src="bagData.fromer.avatar" width="25px" height="25px" radius="5"></up-image>
							</view>
							<view class="bold-nickname" v-if="bagData.fromer">
								<u-parse :content="bagData.fromer.nickname"></u-parse>
							</view>
						</view>
						<view class="descs-box">
							{{bagData.extension || '大吉大利 恭喜发财'}}
						</view>
					</view>
					<view class="info-item">
						<view class="gig-avatar-box">
							<up-image v-if="bagData.toer" 
							:src="bagData.toer.avatar" width="45px" height="45px" radius="5"></up-image>
						</view>
						<view class="info-center">
							<view class="left-box">
								<view class="list-nickname" v-if="bagData.toer">
									<u-parse :content="bagData.toer.nickname"></u-parse>
								</view>
								<view class="time">{{bagData.date_time}}</view>
							</view>
							<view class="right-box">
								{{moneyFormat(bagData.description)}}元
							</view>
						</view>
					</view>
				</view>
				<view class="bag-footer-box">
					<text class="footer-text" 
					v-if="bagData.from == userData.userid"
					@click="appealBag()">申诉</text>
					<text class="footer-text" style="color: #606266;"
					v-if="bagData.to == userData.userid"
					>红包已存入零钱</text>
				</view>
			</view>
		</u-popup>
	</u-popup>
</template>

<script>
	var innerAudioContext = uni.createInnerAudioContext();
	import IM from '@/common/js/IM.js';
	export default{
		mixins: [IM],
		name:"sd-hi-box",
		props:{
			//是否有底部原生导航
			showBar:{
				type: Boolean,
				default: true
			},
			
			//键盘高度
			keyboardheight:{
				type: Number,
				default: 0
			},
			boardheightIng:{
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				toID:0, //用户id
				showHiBox: false,
				memberInfo:{
					userid:0,
					avatar:'',
					nickname:''
				},
				userData:{
					userid: 0,
					avatar: '',
					money: 0, 
					currency: 0
				},
				//列表渲染数据
				totalCount:0,//总数据量
				apiLoadingStatus:false,
				queryForm:{
					pageNo: 1,
					pageSize: 20,
				},
				scrollIng:false, //是否在滚动
				intoView:'intoView',//滚动标识
				
				//红包详情
				showBag: false,
				bagData:{},
				
				//礼物动画
				animation_list:[],
				
				//充值金币
				showRech: false,
				
				//播放音频相关
				AudioUUID: null, //播放当前音频的uuid
			}
		},
		watch: {
			//监听数据变化
		    userData(newValue) {
				if(this.userID == ''){
					this.userID = newValue.userid;
					let timSDK = this.$store.state.timSDK;
					if(Object.keys(timSDK).length == 0){
						this.timRegister();//注册TIM通讯
					}
				}
		    }
		},
		created() {
			//注册IM通讯
			if(this.isLogin({nav:false})){
				this.timRegister();//注册TIM通讯
			}
		},
		methods:{
			//播放语音
			playAudio(payload = {}){
				console.log('播放语音', payload)
				if (!payload.remoteAudioUrl) {
					return;
				}
				if(this.AudioUUID == payload.uuid){
					innerAudioContext.stop();
					this.AudioUUID = null;
					return;
				}
				this.AudioUUID = payload.uuid;
				innerAudioContext.src = payload.remoteAudioUrl;
				innerAudioContext.play();
				innerAudioContext.onPlay(() => {
					console.log('开始播放');
				});
				innerAudioContext.onStop(() => {
					console.log('停止播放');
					this.AudioUUID = null;
				});
				innerAudioContext.onEnded(() => {
					console.log('播放结束');
					this.AudioUUID = null;
				});
				innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
					this.AudioUUID = null;
				});
			},
			open(memberInfo){
				if(!this.isLogin()){
					return;
				}
				console.log('memberInfo', memberInfo)
				if(Object.keys(memberInfo).length){
					this.memberInfo = JSON.parse(JSON.stringify(memberInfo));
					this.getmemberInfo();
					//获取当前账户数据
					this.getUserData();
				}
			},
			closeBox(){
				this.showHiBox = false;
				this.memberInfo = {
					userid:0,
					avatar:'',
					nickname:''
				};
				innerAudioContext.stop();
				this.AudioUUID = null;
			},
			//滚动事件
			scroll(e){
				this.scrollIng = true;
				setTimeout(()=>{
					this.scrollIng = false;
				}, 2000);
			},
			touchstart(){
				this.showRech = false;
			},
			touchend(){
				//2秒后改变滚动标识
				setTimeout(()=>{
					this.scrollIng = false;
				}, 1000);
			},
			queryData() {
				this.queryForm.pageNo = 1;
				this.totalCount = 0;
				this.fetchData();
			},
			fetchData() {
				if(this.totalCount > 0 && this.totalCount <= this.Msglist.length){
					return;
				}
				const queryForm = this.queryForm;
				queryForm.member_id = this.memberInfo.userid;
				this.$request('getMsgList', queryForm,{
					showLoading: false
				}).then((res)=>{
					console.log('获取对话列表-------------------------', res)
					let list = res.data.data.list;
					if(this.queryForm.pageNo == 1){
						this.Msglist = [];
						this.addList(list, 1);
					}else{
						this.addList(list, 2);
					}
					this.totalCount = res.data.data.totalCount;
					if(res.data.data.totalCount > this.Msglist.length){
						this.queryForm.pageNo += 1;//还有数据 页面数增加1
					}
				})
			},
			//打开红包详情
			openBag(item){
				let time = item.time;
				let date_time = this.$util.timestampToTime(item.time, 2);
				let payload = item.payload;
				payload.ID = item.ID;
				payload.date_time = date_time;
				payload.time = time;
				payload.from = item.from;
				payload.to = item.to;
				if(item.from == this.userData.userid){
					payload.fromer = {
						nickname: this.userData.nickname,
						avatar: this.userData.avatar
					};
					payload.toer = {
						nickname: this.memberInfo.nickname,
						avatar: this.memberInfo.avatar
					};
				}else{
					payload.fromer = {
						nickname: this.memberInfo.nickname,
						avatar: this.memberInfo.avatar
					};
					payload.toer = {
						nickname: this.userData.nickname,
						avatar: this.userData.avatar
					};
				}
				this.bagData = JSON.parse(JSON.stringify(payload));
				this.showBag = true;
			},
			//关闭红包详情窗口
			closeBagBox(){
				this.showBag = false;
				this.bagData = {};
			},
			//红包申诉
			appealBag(){
				if(Object.keys(this.bagData).length == 0){
					this.msg('红包数据不能为空');return;
				}
				this.navTo('/pages_setting/feedback/feedback', {login:true}, {title:'红包申诉',params:{ID:this.bagData.ID,type:'complain'}})
			},
			//打开礼物发送
			openGift(){
				this.$refs['sdIminput'].showGiftBox = true;;
			},
			//使用余额金币支付
			moneyCurrencyPay(data = {}){
				if(Object.keys(data).length){
					this.$request('useMoneyCurrencyPay', data,{
						showLoading: false
					}).then((res)=>{
						console.log('使用余额金币支付', res);
						if(res.data.code == 200){
							this.getUserData(); 
						}
					})
				}
			},
			//获取动画样式
			getAnimationStyle(index){
				let animationStyle = {
				    position: "fixed",
				    top: `${uni.$u.sys().windowHeight / 2 - 50}px`,
					right:'20px',
				    height: "45px",
					lineHeight:'45px',
					padding: '0 10px',
				    backgroundColor: "rgba(0,0,0,.7)",
					borderRadius:'60px'
				};
				if(index){
					let sub_val = parseInt(index*20);
					animationStyle.top = `${uni.$u.sys().windowHeight / 2 + sub_val}px`;
				}
				return animationStyle;
			},
			//执行动画
			runAnimation(ani_id) {
				setTimeout(() => {
				    let index = this.animation_list.findIndex(n=>n.ani_id == ani_id);
					if(index > -1){
						this.animation_list[index].show = false;
						setTimeout(() => {
							this.animation_list.splice(index, 1);
						}, 200)
					}
				}, 1500);
			},
			//获取自身数据
			getUserData(){
				this.$store.dispatch('getUserInfo', (res)=>{
					if(Object.keys(res).length){
						this.userData = res;
					}
				})
			},
			//获取对方信息
			getmemberInfo(){
				const t = this;
				if(this.memberInfo.userid == 0){
					this.msg('参数错误');
					return;
				}
				this.$request('getSameUserInfo', {
					member_id: this.memberInfo.userid
				},{
					showLoading: false,
				}).then((res)=>{
					console.log('获取对方详情', res)
					if(res.data.data.memberInfo){
						let memberInfo = res.data.data.memberInfo;
						this.toID = memberInfo.userid;//设置对话对象ID
						//console.log('设置了this.toID', this.toID)
						let space = 0;
						let locationdata = this.locationdata;
						if(memberInfo.latitude && memberInfo.longitude && locationdata.latitude && locationdata.longitude){
							space = t.$util.getDistance(memberInfo.latitude,memberInfo.longitude,locationdata.latitude, locationdata.longitude);
						}
						memberInfo.space = space.toFixed(2);
						this.memberInfo = memberInfo;
						this.queryData();
						this.showHiBox = true;
					}
				})
			},
			////发送事件回调
			sendEvent(data){
				//console.log('发送事件回调---------------------', data)
				//console.log('发送消息前', this.memberInfo)
				//console.log('发送消息前@@@@@@@@@@@@@@@@@@@@@@@@@@@@', this.toID)
				if(Object.keys(this.memberInfo).length == 0){
					this.msg('对方信息错误');return;
				}
				if(this.userData.account_status == 0){
					this.msg('您的账户被禁用');return;
				}
				if(this.userData.speak == 0){
					this.msg('您被禁言中');return;
				}
				/*********************判断对方条件**********************/
				if(this.memberInfo.user_setting.messageSettings == 1){
					this.msg('对方设置了不接收对话消息');return;
				}
				if(this.memberInfo.f_relevance.is_black == 1){
					this.msg('对方将您拉入黑名单');return;
				}
				/*****************判断发送数据*****************/
				if(Object.keys(data).length == 0){
					this.msg('发送出错');return;
				}
				if(!data.MsgType){
					this.msg('消息类型不明确');return;
				}
				/************判断可否发消息*************/
				if(Object.keys(this.msgSetting).length == 0){
					this.msg('对话参数错误');return;
				}
				// #ifdef MP-WEIXIN
				if(this.dialogTerm.to_follow_wx == 1){
					let follow_text = JSON.parse(this.dialogTerm.follow_text);
					this.modal_data = follow_text;
					this.showModalPopup(follow_text, {})
					return;
				}
				// #endif
				if(data.MsgType != 'TIMGiftElem'){//非礼物消息限制发送
					if(this.msgSetting.limit_dialog > 0){
						if(this.dialogTerm.today_dialog_num >= this.msgSetting.limit_dialog){
							let modal_data = JSON.parse(this.dialogTerm.limit_dialog_text);
							this.showModalPopup(modal_data);
							return;
						}
					}
				}
				
				if(data.MsgType == 'TIMTextElem'){//文本消息
					//console.log('发送文本消息---------------------------')
					if(!data.text){
						this.msg('内容不能为空');return;
					}
					this.sendTextMsg('C2C', data.text, (result)=>{
						if(result.code == 0){
							this.addList([result.data.message]);
						}else if(result.code == 120003){
							let modal_data = JSON.parse(result.message);
							this.showModalPopup(modal_data);
						}
					});
				}else if(data.MsgType == 'TIMGiftElem'){//礼物消息
					if(!data.gift){
						this.msg('礼物数据错误');return;
					}
					//判断用户账户是否有足够金币
					if(data.gift.gift_price > 0){
						if(parseInt(this.userData.currency) < parseInt(data.gift.gift_price)){
							this.showModalEvent({
								title:'提示',
								content: '账户余额不足，请充值！',
								showCancel:true,
								cancelText: '取消',
								confirmText: '去充值',
							},{action:'showRecharge'});
							return;
						}else{
							let new_currency = parseInt(this.userData.currency) - parseInt(data.gift.gift_price);
							this.userData.currency = new_currency;
						}
					}
					//关闭礼物选择框
					this.$refs['sdIminput'].showGiftBox = false;
					//定义动画
					let ani_id = 'ani_' + this.animation_list.length;
					let ani_data = {
						ani_id: ani_id,
						show: true,
						nickname: this.memberInfo.nickname,
						gift_ico: data.gift.gift_ico,
						gift_name: data.gift.gift_name
					};
					this.$refs['sdIminput'].closeMore();
					//console.log('this.animation_list', this.animation_list)
					this.sendCustomMsg('C2C',{
						data: 'gift', // 用于标识该消息是礼物类型消息
						description: data.gift.gift_ico, // 礼物图标
						extension: JSON.stringify({gift_name:data.gift.gift_name,gift_price:data.gift.gift_price})
					}, (result)=>{
						if(result.code == 0){
							this.addList([result.data.message]);
							this.animation_list.push(ani_data);
							this.runAnimation(ani_id);
							if(data.gift.gift_price > 0){
								this.moneyCurrencyPay({
									account_type: 'currency',
									value: data.gift.gift_price,
									from_type:'pay',
									descs:'发送礼物'
								});
							}
						}else if(result.code == 120003){
							let modal_data = JSON.parse(result.message);
							this.showModalPopup(modal_data);
						}
					});
				}
			},
			
			popupCallback(v, options){
				const t = this;
				console.log('modal弹窗回调', v, options)
				this.$refs['guipage'].modalPopupClose();
				if(v == 1){
					if(options.path !== undefined && options.path != ''){
						uni.navigateTo({
							url: options.path
						});
						return;
					}else if(options.action){
						if(options.action == 'getDialogParams'){
							this.getDialogParams();
						}
					}
				}
				
				if(options.cancelParam){
					if(options.cancelParam == 'doloadCode'){
						// #ifdef MP-WEIXIN
						uni.authorize({
							scope: 'scope.writePhotosAlbum',
							success() {
								t.$util.downloadFile(t.System.wx_code, (res)=>{
									if(res){
										t.$util.saveAlbum(res, (e)=>{
											t.msg('保存成功');
										});
									}
								});
							}
						})
						// #endif
						// #ifndef MP-WEIXIN
						t.$util.downloadFile(t.System.wx_code, (res)=>{
							if(res){
								t.$util.saveAlbum(res, (e)=>{
									t.msg('保存成功');
								});
							}
						});
						// #endif
					}
				}
			},
			
			//弹窗返回
			modalEventBack(options, v){
				console.log('弹窗返回', options, v)
				if (v == 1) {
					if(options.action){
						if(options.action == 'showRecharge'){
							this.$refs.sdIminput.closeGiftBox();
							this.showRech = true
						}
					}
				}
			},
			
			//关闭金币充值窗口
			closeCurrencyRech(){
				this.showRech = false;
			},
			//金币充值回调
			currencyBack(e){
				if(e == 1){
					this.showRech = false;
					this.getUserData();
				}
			},
			//富文本连接点击
			linkTap(e){
				console.log('linkTap', e)
				if(e.href == 'sendGift'){//送礼物
					this.$refs.sdIminput.showGiftBox = true;
				}else{
					this.navTo(e.href, {login:true})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.rech-box-win{
		box-shadow: 0 0 10rpx 16rpx rgba(0,0,0,0.05);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		overflow: hidden;
	}
	//礼物动画
	.gift-tip-box{
		display: flex;
		.gift-msg-icon{
			margin-left: -10px;
		}
		.gift-text-box{
			flex: 1;
			padding-left: 2px;
			font-size: 30rpx;
			color: #ffffff;
			height: 90rpx;
			line-height: 90rpx;
			overflow: hidden;
		}
	}
	.hi-box{
		height: 80vh;
		// background-color: #ffffff;
		position: relative;
		.hi-top{
			background-color: #ffffff;
			padding: 10px 0;
			border-top-left-radius: 15px;
			border-top-right-radius: 15px;
			position: relative;
			.icon-guanbi1{
				position: absolute;
				top: 10px;
				right: 20px;
				font-weight: bold;
				color: #606266;
				font-size: 18px;
				width: 30px;
				height: 30px;
				line-height: 30px;
				text-align: center;
			}
			.avatar-box{
				width: 55px;
				height: 55px;
				border-radius: 100px;
				overflow: hidden;
				margin: auto;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.info-box{
				padding: 5px 10px;
				display: flex;
				justify-content: center;
				.nickname{
					padding: 0 5px 0 0;
					min-width: 0;
					overflow: hidden;
					font-size: 15px;
				}
				.sex-tag{
					margin-top: 2px;
					background-color: #fd7bb7;
					border-radius: 20rpx;
					font-size: 22rpx;
					color: #ffffff;
					display: flex;
					padding: 0 4px 0 2px;
					line-height: 13px;
					height: 13px;
					.sex-text{
						padding: 2px 0 0 1px;
						font-size: 10px;
					}
				}
			}
		}
		.hi-msg-box{
			.hi-msg-list{
				padding:30rpx;
				padding-top: 30px;
				.time-box{
					font-size: 10px;
					color: #c8c9cc;
					text-align: center;
					margin-bottom: 10px;
				}
				.msg-item{
					display: flex;
					flex-direction:row; 
					flex-wrap:nowrap;
					margin-bottom:28px;
					
					.avatar-box{
						width: 40px;
						height: 40px;
					}
					.msg-center{
						padding: 0 10px;
						position: relative;
						.status-box{
							position: absolute;
							left: 5px;
							bottom: 5px;
							font-size: 12px;
							color: #c8c9cc;
						}
						.content-txt{
							padding:15rpx 20rpx; 
							border-radius:6rpx; 
							min-width:100rpx; 
							word-break:break-all;
							line-height:38rpx; 
							font-size:30rpx; 
							color:#2B2E3D;
						}
						.member-bg{
							background-color: #ffffff;
						}
						.default-box{
							background-color:#e1e9fe; 
						}
						//系统提示
						.tip-content-txt{
							background-color: #e1e9fe;
							padding:10px;
							border-radius:6rpx; 
							min-width:100rpx; 
							word-break:break-all;
							line-height:20px; 
							font-size:14px; 
							color:#2B2E3D;
						}
						//地理位置
						.location-box{
							border-radius: 8px;
							overflow: hidden;
							width: 60vw;
							background-color: #ffffff;
							.location-title{
								background-color: #ffffff;
								padding: 10px 5px;
								white-space:nowrap;
								overflow: hidden;
								text-overflow:ellipsis;
								font-size: 15px;
								color: #303133;
							}
							.location-img-box{
								height: 100px;
								overflow: hidden;
								image{
									width: 100%;
								}
							}
						}
						//礼物
						.gift-msg-box{
							//border-radius: 8px;
							// overflow: hidden;
							width: 65vw;
							.gift-top-box{
								padding: 10px 10px 10px 10px;
								background-image: linear-gradient(to right, #6d2ff4, #0dadf7);
								border-top-left-radius: 8px;
								border-top-right-radius: 8px;
								display: flex;
								color: #ffffff;
								.gift-msg-icon{
									margin-left: -30px;
									//border: 1px solid red;
								}
								.gift-text-box{
									flex: 1;
									padding-left: 8px;
									padding-top: 5px;
								}
							}
							.gift-msg-footer{
								height: 35px;
								background-color: #ffffff;
								border-bottom-left-radius: 8px;
								border-bottom-right-radius: 8px;
								font-size: 15px;
								color: #909399;
								line-height: 35px;
								padding: 0 15px;
							}
						}
						//红包
						.bag-msg-box{
							border-radius: 8px;
							overflow: hidden;
							width: 65vw;
							background-color: #fb9f3c;
							.bag-box{
								padding: 8px 10px 0 10px;
								display: flex;
								color: #ffffff;
								.icon-box{
									border-radius: 5px;
									overflow: hidden;
									min-width: 55px;
								}
								.text-box{
									flex: 1;
									padding-left: 5px;
									padding-top: 5px;
									min-width: 0;
									.descs{
										font-size: 12px;
										color: #f0f0f0;
										padding-top: 5px;
										white-space:nowrap;
										overflow: hidden;
										text-overflow:ellipsis;
										height: 20px;
										line-height: 20px;
										padding: 0 3px;
									}
								}
							}
							.msg-footer{
								font-size: 10px;
								color: #f0f0f0;
								padding: 0 15px;
								height: 22px;
								line-height: 22px;
							}
						}
					}
				}
				.im-msg-right{
					flex-direction:row-reverse;
					.msg-center{
						padding-left: 40px;
					}
				}
				.im-msg-left{
					.msg-center{
						padding-right: 40px;
					}
				}
			}
			.input-box{
			}
		}
	}
	//红包详情
	.bag-data-box{
		height: 65vh;
		width: 85vw;
		background-color: #ffffff;
		border-radius: 10px;
		overflow: hidden;
		position: relative;
		.top-box{
			background-color: #f65646;
			position: absolute;
			height: 100px;
			width: 120%;
			left: -10%;
			top:0;
			padding: 10px calc( 10% + 10px);
			border-bottom-left-radius: 150%;
			border-bottom-right-radius: 150%;
			border-bottom:2px solid #f5c873;
		}
		.bag-footer-box{
			position: absolute;
			bottom: 15px;
			width: 100%;
			text-align: center;
			.footer-text{
				font-size: 12px;
				color: #909399;
			}
		}
		.info-box{
			padding: 10px;
			padding-top: 120px;
			.from-box{
				border-bottom: 1px solid #f0f0f0;
				padding-bottom: 20px;
				.descs-box{
					font-size: 14px;
					color: #909399;
					text-align: center;
					height: 25px;
					line-height: 25px;
					white-space:nowrap;
					overflow: hidden;
					text-overflow:ellipsis;
					margin-bottom: 5px;
				}
				.user-info-box{
					display: flex;
					justify-content: center;
					padding: 10px;
					
					.small-avatar{
						width: 30px;
						height: 30px;
						border-radius: 5px;
						padding-top: 2px;
						overflow: hidden;
						image{
							width: 100%;
						}
					}
					.bold-nickname{
						font-size: 17px;
						font-weight: bold;
						color: #303133;
						padding-left: 5px;
						height: 25px;
						line-height: 25px;
					}
				}
			}
			.info-item{
				display: flex;
				padding: 15px 0 15px 5px;
				.gig-avatar-box{
					width: 50px;
					height: 45px;
				}
				.info-center{
					flex: 1;
					padding: 0 10px 10px 5px;
					display: flex;
					border-bottom: 1px solid #f0f0f0;
					.left-box{
						flex: 1;
						.list-nickname{
							font-size: 15px;
							color: #303133;
						}
						.time{
							font-size: 12px;
							color: #909399;
							padding-top: 10px;
						}
					}
					.right-box{
						font-size: 15px;
						color: #303133;
						padding-top: 5px;
					}
				}
			}
		}
	}
</style>