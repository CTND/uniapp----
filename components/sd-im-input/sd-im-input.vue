<template>
	<view class="footer-box" :style="[{bottom:footerHeight+'px'}]">
		<view style="display: flex;">
			<view v-if="giftmsg == 1" 
			@click="showGiftBox = true"
			class="micon icon-liwu1" 
			style="font-size: 28px;color: #fcc048;font-weight: bold;background-color: #ffffff;padding: 10px;border-radius: 35px;margin-right: 5px;"></view>
			<view class="input-box" style="flex: 1;">
				<view class="input">
					<up-input
					    placeholder="请输入内容"
					    v-model="inputText"
						border="none"
						:customStyle="{height:'40px'}"
						:adjustPosition="false"
						@focus="inputFocus"
						@blur="inputBlur"
					  ></up-input>
				</view>
				<view style="padding-left: 20rpx;padding-top: 5rpx;">
					<view class="send-but" @click="senMsg">发送</view>
				</view>
			</view>
		</view>
		<view class="action-box" v-if="showAction">
			<view class="action-block-box">
				<view class="action-block" v-if="audioinput==1">
					<view class="action-ico-box" @click="showRec">
						<sd-icon name="icon-yuyin2" size="28" color="#adadad"></sd-icon>
					</view>
				</view>
				
				<view class="action-block" v-if="useimg == 1">
					<view class="action-ico-box" @click="sendMedium('image')">
						<sd-icon name="icon-tupian3" size="28" color="#adadad"></sd-icon>
					</view>
				</view>
				
				<view class="action-block" v-if="usevideo == 1">
					<view class="action-ico-box" @click="sendMedium('video')">
						<sd-icon name="icon-shipin5" size="28" color="#adadad"></sd-icon>
					</view>
				</view>
				
				<view v-if="giftmsg == 1" class="action-block">
					<view class="action-ico-box" @click="showGiftBox = true">
						<sd-icon name="icon-liwu1" size="28" color="#adadad"></sd-icon>
					</view>
				</view>
				
				<view v-if="filemsg == 1" class="action-block">
					<view class="action-ico-box" @click="sendMedium('file')">
						<sd-icon name="icon-wenjianjia" size="28" color="#adadad"></sd-icon>
					</view>
				</view>
				
				<view class="action-block" v-if="useMore">
					<view class="action-bg-box micon" @click="doMore" :class="[showMore ? 'icon-jiantou_down' : 'icon-icon-test']"
					:style="{color:showMore ? '#2979ff' : '#adadad'}"
					>
					</view>
				</view>
				
			</view>
		</view>
		
		<view class="more-box" v-if="showMore">
			<view v-if="videomsg == 1" class="more-block" @click="tuiCall(2)">
				<view class="more-ico">
					<sd-icon name="icon-luzhishipin" size="26" color="#7197fc"></sd-icon>
				</view>
				<view class="more-text">视频通话</view>
			</view>
			<view v-if="audiomsg == 1" class="more-block" @click="tuiCall(1)">
				<view class="more-ico">
					<sd-icon name="icon-duihua" size="26" color="#35dbab"></sd-icon>
				</view>
				<view class="more-text">语音通话</view>
			</view>
			
			<view class="more-block" @click="locationMsg()">
				<view class="more-ico">
					<sd-icon name="icon-weizhi" size="26" color="#7395ff"></sd-icon>
				</view>
				<view class="more-text">位置</view>
			</view>
			
			<view v-if="bag == 1" class="more-block" @click="sendMoneyBag()">
				<view class="more-ico">
					<sd-icon name="icon-hongbao" size="26" color="#fb5352"></sd-icon>
				</view>
				<view class="more-text">红包</view>
			</view>
			
			<view v-if="vipmsg == 1" class="more-block">
				<view class="more-ico">
					<sd-icon name="icon-huiyuan" size="26" color="#ff9768"></sd-icon>
				</view>
				<view class="more-text">赠送会员</view>
			</view>
		</view>
	</view>
	<!-- 语音输入 -->
	<view class="gui-im-record gui-bg-gray gui-dark-bg-level-2" v-if="recShow">
		<!-- <view class="gui-im-record-txt">
			{{recTxt}}<text v-if="recing">已录音 : {{recLength}} s</text>
		</view> -->
		<view class="gui-im-record-btn" 
		@touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"
		:class="[recing ? 'gui-im-recording' : '']">
			<view class="micon icon-yuyin2"></view>
		</view>
		<!-- <view class="gui-im-send-voice" 
		v-if="tmpVoice != ''">
			<text @tap="sendVoiceMsg">发送语音</text>
		</view> -->
		<view class="gui-im-record-close gui-icons micon icon-guanbi1" 
		@tap="closeRec" v-if="!recing"
		style="font-weight: bold;"
		></view>
		<view class="gui-im-send-voice">
			<text style="font-size: 12px;">松开发送 上滑取消</text>
		</view>
	</view>
	
	<!-- 录音 -->
	<u-popup :show="recing" mode="center" bgColor="transparent">
		<view class="recing-box">
			<view class="icon" :style="{backgroundImage:'url(' +$util.img('images/system/loading.png')+ ')'}"></view>
			<view class="tit">录音中...{{recLength}}秒</view>
			<view class="tit" style="font-size: 14px;padding-top: 5px">松开发送 上滑取消</view>
		</view>
	</u-popup>
	
	<!-- 礼物选择 -->
	<u-popup :show="showGiftBox" mode="bottom" :round="10" closeable @close="closeGiftBox">
		<view class="gift-box">
			<view class="popup-title">礼物</view>
			<swiper class="swiper">
				<swiper-item class="swiper-item" v-for="(item, index) in gift_list" :key="index">
					<view class="gift-block" v-for="(gift, g) in item" :key="g" @click="sendGift(gift)">
						<view class="gift-icon">
							<image 
							v-if="gift.gift_ico"
							:src="gift.gift_ico"
							style="width: 45px;height: 45px"
							></image>
						</view>
						<view class="gift-name">{{gift.gift_name}}</view>
						<view class="gift-price-box">{{gift.gift_price}}陌币</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="money-box">
				<text style="font-size: 15px;color: #606266;">余额：</text>
				<text style="font-size: 16px;color: #4f7ffd;">{{userData.currency || 0}}</text>
			</view>
		</view>
	</u-popup>
	
	<!-- 发送红包 -->
	<u-popup :show="showBagBox" mode="bottom" :round="15" :overlay="false" bgColor="transparent" closeable @close="closeBagBox">
		<view class="bag-box">
			<view style="font-size: 16px;height: 50px;line-height: 50px;padding-left: 5px;font-weight: bold;">转账给Ta:</view>
			<view class="action-box">
				<view class="input-box">
					<view style="font-size: 32px;font-weight: bold;">￥</view>
					<input
						:value="bagForm.money"
						:focus="bagFocus"
						type="number"
						style="height: 35px;font-size: 28px;font-weight: bold"
						@input="bagInput"
					></input>
				</view>
				<view class="bag-desc-box">
					<up-input
						placeholder="转账说明"
						border="none"
						type="text"
						v-model="bagForm.descs"
						fontSize="32rpx"
						color="#606266"
					></up-input>
				</view>
				
				<view class="bonus-box">
					<text style="font-size: 14px;color:#606266;">红包余额:</text>
					<text style="font-size: 16px;color: #4f7ffd;"> ￥{{userData.bonus || 0}}</text>
				</view>
				<u-button
				text="转 账" 
				shape="circle" 
				size="large"
				:customStyle="{
					backgroundColor:'#18b566',
					color:'#ffffff',
					width:'80%',
					margin:'auto',
					marginTop:'30px',
					borderRadius:'5px',
					height:'48px',
					lineHeight:'48px',
				}"
				:disabled="bagForm.money==''?true:false"
				@click="saveBag()"
				></u-button>
			</view>
			
		</view>
	</u-popup>
	
	
</template>

<script>
	
	import payParam from '@/common/js/payParam.js'; 
	//var bgAudioMannager = uni.createInnerAudioContext();
	export default {
		emits: ['send-envent'],
		name:"sd-im-input",
		props:{
			//对方ID
			memberId:{
				type: [String,Number],
				default: 0
			},
			//当前账户数据
			userData:{
				type: [Object],
				default: {
					userid: 0,
					money: 0, 
					currency: 0,
					bonus: 0
				}
			},
			useimg: {//是否发送图片
				type:Number,
				default: 0
			},
			usevideo: {//是否发送视频
				type:Number,
				default: 0
			},
			videomsg:{
				type:Number,
				default: 0
			},
			audiomsg:{
				type:Number,
				default: 0
			},
			//语音消息
			audioinput:{
				type:Number,
				default: 0
			},
			bag:{
				type:Number,
				default: 0
			},
			giftmsg:{
				type:Number,
				default: 0
			},
			vipmsg:{
				type:Number,
				default: 0
			},
			filemsg:{
				type:Number,
				default: 0
			},
			//是否使用显示更多
			useMore:{
				type: Boolean,
				default: true
			},
			//是否显示基础更多
			showAction: {
				type: Boolean,
				default: true
			},
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
				inputText:'',//输入的内容
				footerHeight:0,//键盘高度
				//keyboardheight: 0, //键盘高度
				
				showMore:false,//更多显示
				
				//录音相关
				recShow         : false,
				recTxt          : "请点击绿色按钮开始录音",
				recorderManager : null,
				recing          : false, //是否正在录音
				recLength       : 1,
				recTimer        : null,
				tmpVoice        : '',
				voiceLen        : 0,
				voiceBtnShow    : false,
				initialX:0,
				initialY:0,
				sendAudio: true, //是否发送音频
				// 播放相关
				player          : null,
				playTxt         : "试听语音",
				
				//礼物相关
				showGiftBox:false,
				gift_list:[],
				
				//红包相关
				showBagBox: false,
				bagFocus:false,
				bagForm:{
					money: '',
					descs:''
				}, 
			};
		},
		watch: {
			//监听数据变化
		    boardheightIng(newValue) {
				let keyboardheight = this.keyboardheight;
				if(newValue == 0){
					this.footerHeight = 0;
				}else{
					if(this.showBar){
						if(this.showAction){
							this.footerHeight = keyboardheight;
						}else{
							this.footerHeight = keyboardheight - 50;
						}
					}else{
						if(this.showAction){
							this.footerHeight = keyboardheight-50;
						}else{
							this.footerHeight = keyboardheight;
						}
					}
				}
		    }
		},
		created() {
			const t = this;
			
			// #ifndef H5
			this.voiceBtnShow    = true;
			this.recorderManager = uni.getRecorderManager();
			this.recorderManager.onStop((res) => {
				console.log('监听录音结束事件', res)
				this.tmpVoice    = res.tempFilePath;
				this.recing      = false;
				this.recTxt       =  "... 已录音 "+this.recLength+
				"s, 点击绿色按钮重新录音 ...";
				clearInterval(this.recTimer);
			});
			this.recorderManager.onError((err) => {
				console.log('录音失败', err)
				this.recing = false;
				this.recTxt   = "请点击绿色按钮开始录音",
				clearInterval(this.recTimer);
			});
			// #endif
			this.giftList();
			//获取当前账户数据
			//this.getUserData();
		},
		
		methods:{
			//获取自身数据
			// getUserData(){
			// 	this.$store.dispatch('getUserInfo', (res)=>{
			// 		if(Object.keys(res).length){
			// 			this.userData = res;
			// 		}
			// 	})
			// },
			//更多操作
			doMore(){
				if(this.showMore){
					this.showMore = false;
				}else{
					this.showMore = true;
				}
			},
			//红包金额输入
			bagInput(e){
				this.bagForm.money = e.detail.value;
			},
			//关闭更多
			closeMore(){
				this.showMore = false;
			},
			//输入框获取焦点
			inputFocus(){
				this.closeMore();
			},
			//输入框失去焦点
			inputBlur(){
				
			},
			//发送文本
			senMsg(){
				this.$emit('send-envent', {
					MsgType:'TIMTextElem',
					text: this.inputText
				})
				this.inputText = '';
			},
			//发送图片 视频 音频
			sendMedium(r, params={}){
				let options = {
					MsgType:'sendMedium',
					mediumType: r
				}
				if(Object.keys(params).length){
					options = Object.assign({}, options, params);
				}
				this.$emit('send-envent',options);
			},
			//关闭礼物选择器
			closeGiftBox(){
				this.showGiftBox = false;
			},
			//发送礼物
			sendGift(gift){
				this.$emit('send-envent', {
					MsgType:'TIMGiftElem',
					gift: gift
				})
			},
			//发送红包
			sendMoneyBag(){
				this.showBagBox = true;
				setTimeout(() => {
					this.bagFocus = true;
				}, 300)
			},
			//关闭红包窗口
			closeBagBox(){
				this.showBagBox = false;
				uni.hideKeyboard();
				this.bagForm = {money: '',descs:''};
				setTimeout(() => {
					this.bagFocus = false;
				}, 300);
				this.closeMore();
			},
			//执行发送红包
			saveBag(){
				if(parseFloat(this.bagForm.money) > parseFloat(this.userData.bonus)){
					this.showModalEvent({
						title:'提示',//提示标题
						content: '您的红包账户余额不足，可修改红包金额或者通过微信支付发送！',
						showCancel:true,
						cancelText: '修改金额',
						confirmText: '微信支付',
					}, {})
					return false;
				}
				let data = JSON.parse(JSON.stringify(this.bagForm));
				data.member_id = this.memberId;
				this.$util.throttle(async ()=>{
					this.$request('transmitBonusBag', data,{
						showLoading: false
					}).then((res)=>{
						if(res.data.code == 200){
							this.$emit('send-envent', {
								MsgType:'TIMBagElem',
								money: this.bagForm.money,
								descs: this.bagForm.descs
							})
							let new_bonus = parseFloat(this.userData.bonus) - parseFloat(this.bagForm.money);
							this.userData.bonus = new_bonus.toFixed(2);
							this.closeBagBox();
						}
					})
				})
			},
			//红包模态弹窗回调
			modalEventBack(options, v){
				//console.log('红包模态弹窗回调', options, v)
				if(v == 1){
					if(this.isSubmit) return;
					this.isSubmit = true;
					uni.showLoading({
						title: '加载中...'
					});
					let data = JSON.parse(JSON.stringify(this.bagForm));
					data.member_id = this.memberId;
					this.$util.throttle(async ()=>{
						this.$request('createBagOrder', data,{
							showLoading: false
						}).then((res)=>{
							this.isSubmit = false;
							uni.hideLoading();
							if(res.data.data.payData){
								payParam.pay(res.data.data.payData, (result)=>{
									if(result == 1){
										this.$emit('send-envent', {
											MsgType:'TIMBagElem',
											money: this.bagForm.money,
											descs: this.bagForm.descs
										})
										this.closeBagBox();
									}
								});
							}
						})
					})
				}
			},
			//音视频通话
			tuiCall(e){
				this.$emit('send-envent', {
					MsgType:'TUICallElem',
					callMediaType: e
				})
			},
			//发送地理位置消息
			locationMsg(){
				this.$util.checkLocation(0,(res)=>{
					if(Object.keys(res).length){
						this.$emit('send-envent', {
							MsgType:'TIMLocationElem',
							locationData: res
						})
					}
				})
			},
			// 录音
			rec : function(){
				if (this.recing){
					this.recorderManager.stop();
					this.recing = false;
					this.recTxt   =  "已录音 "+this.recLength
					+"s, 点击绿色按钮重新录音";
					clearInterval(this.recTimer);
				} else {
					this.recorderManager.start({duration:60000, format:'mp3' });
					this.recing     = true;
					this.recTxt     =  "... 正在录音 ...";
					this.recLength  = 1;
					this.recTimer   = setInterval(()=>{this.recLength++;}, 1000);
				}
			},
			// 发送录音
			sendVoiceMsg : function(){
				console.log('this.tmpVoice', this.tmpVoice)
				if (this.tmpVoice == '') {
					uni.showToast({ title: "请先录制一段语音", icon: "none" });
					return;
				}
				// 关闭界面
				this.recShow = false;
				this.$emit('sendVoice', this.tmpVoice, this.recLength);
				this.tmpVoice  = '';
				this.recLength = 0;
				this.recTxt    = "请点击绿色按钮开始录音";
			},
			// 展示录音界面
			showRec : function(){
				this.recShow  = true;
				//console.log('展示录音界面')
			},
			// 关闭录音界面
			closeRec: function (){
				this.recShow = false;
			},
			handleTouchStart(event) {
				// 开始触摸时记录初始位置信息
				this.initialX = event.changedTouches[0].clientX;
				this.initialY = event.changedTouches[0].clientY;
			  
				// 设置标志位表示正在录音
				this.recorderManager.start({
					duration:60000*5, 
					sampleRate: 44100, // 采样率
					numberOfChannels: 1, // 录音通道数
					encodeBitRate: 192000, // 编码码率
					format: 'aac' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
				});
				this.recing     = true;
				this.recTxt     =  "... 正在录音 ...";
				this.recLength  = 1;
				this.recTimer   = setInterval(()=>{this.recLength++;}, 1000);
			},
			
			handleTouchMove(event) {
				if (this.recing && Math.abs(event.changedTouches[0].clientY - this.initialY) > 30) {
					// 如果手指向下移动超过了阈值（比如15像素）则取消录音操作
					// 清除之前的录音文件或者重新设置录音状态等操作...
					// 将标志位设置为false表示已经取消录音
					this.sendAudio = false;
				}
			},
			
			handleTouchEnd() {
				// 结束触摸时根据录音状态判断是否保存录音文件或者提交录音任务等操作...
				// 将标志位设置为false表示已经取消录音
				this.recorderManager.stop();
				this.recing = false;
				this.recTxt   =  "已录音 "+this.recLength +"s, 点击绿色按钮重新录音";
				clearInterval(this.recTimer);
				
				if(this.sendAudio === false){
					this.tmpVoice  = '';
					this.sendAudio = true;
					return;
				}
				if(this.recLength < 2){
					this.tmpVoice  = '';
					uni.showToast({ title: "录制时间太短", icon: "none" });
					return;
				}
				//直接发送本地录音零时文件地址
				setTimeout(()=>{
					this.sendMedium('audio', {tempFilePath:this.tmpVoice,recLength:this.recLength});
				},200)
				this.tmpVoice  = '';
				this.recLength = 0;
			},
			//获取礼物列表
			giftList(){
				this.$request('getGiftList', {},{
					showLoading: false,
				}).then((res)=>{
					console.log('礼物列表', res)
					if(res.data.data.list){
						this.gift_list = res.data.data.list;
					}
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.footer-box{
		padding: 30rpx;
		background-color: #f6f6f6;
		position: fixed;
		width: 100%;
		bottom: 0;
		.input-box{
			display: flex;
			background-color: #ffffff;
			border-radius: 20rpx;
			padding: 10rpx 20rpx;
			.input{
				flex: 1;
			}
			.send-but{
				width: 100rpx;
				height: 60rpx;
				line-height: 60rpx;
				background-color: #4f7ffd;
				border-radius: 60rpx;
				text-align: center;
				font-size: 28rpx;
				color: #ffffff;
			}
		}
		.action-box{
			padding-top: 40rpx;
			.action-block-box{
				display: flex;
				justify-content: space-around;
				.action-block{
					width: 20%;
					.action-ico-box{
						margin: auto;
						width: 50rpx;
					}
					.action-bg-box{
						margin: auto;
						width: 60rpx;
						height: 60rpx;
						text-align: center;
						line-height: 60rpx;
						border-radius: 60rpx;
						background-color: #ededed;
						font-size: 18px;
						font-weight: bold;
						text-align: center;
					}
				}
			}
		}
		
		.more-box{
			padding: 30px 20rpx;
			display: flex;
			justify-content: space-between;
			.more-block{
				padding: 0 10rpx;
				.more-ico{
					margin: auto;
					background-color: #ffffff;
					border-radius: 50rpx;
					padding: 20rpx 30rpx;
				}
				.more-text{
					font-size: 24rpx;
					color: #909399;
					text-align: center;
					padding-top: 10rpx;

				}
			}
		}
	}
	
	.gui-im-record{width:100%; position:fixed; left:0; bottom:0; padding:30px 0; padding-bottom:100rpx; z-index:11;border-top:2px solid #F1F2F3; }
	.gui-im-record-close{width:100rpx; height:100rpx; position:absolute; top:0px; right:0px; z-index:100; text-align:center; line-height:100rpx; font-size:38rpx !important;}
	.gui-im-record-txt{text-align:center; font-size:26rpx; line-height:30px; padding-bottom:10px;}
	.gui-im-record-btn{
		width:80px; 
		height:80px; 
		margin:0 auto; 
		border:5px solid #F1F2F3; 
		border-radius:100%; 
		background:#00B26A;
		box-sizing: border-box;
		.icon-yuyin2{
			text-align: center;
			line-height: 70px;
			color: #ffffff;
			font-size: 38px;
		}
	}
	.gui-im-recording{background:#FF0000; animation:fade linear 2s infinite;}
	@keyframes fade{from{opacity:0.1;} 50%{opacity:1;} to{opacity:0.1;}}
	.gui-im-record-txt text{color:#00B26A; padding:0 12px;}
	.gui-im-send-voice{margin-top:12px; font-size:28rpx; color:#00BA62; text-align:center;}
	.gui-im-send-voice text{margin:0 15px; color:#00BA62;}
	
	.gui-icons{font-size:50rpx;}
	
	//录音
	.recing-box{
		background-color: #19be6b;
		padding: 20px 10px;
		border-radius: 5px;
		overflow: hidden;
		width: 50vw;
		text-align: center;
		.icon{
			width: 40px;
			height: 40px;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			animation: mix-loading 1s steps(12) infinite;
			margin: auto;
		}
		.tit{
			margin: 10rpx 0 6rpx;
			font-size: 12px;
			color: #e9e9e9;
		}
	}
	@keyframes mix-loading{
		from {
			transform:rotate(0deg)
		}
		to {
			transform: rotate(1turn)
		}
	}
	// 礼物
	.gift-box{
		padding-bottom: 20px;
		.popup-title{
			line-height: 40px;
			text-align: center;
			font-size: 17px;
			color: #303133;
			border-bottom: 1px solid #f0f0f0;
			padding: 5px;
		}
		.swiper{
			height: 190px;
			padding: 10px;
			.swiper-item{
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;
				.gift-block{
					width: 25%;
					height: 90px;
					.gift-icon{
						display: flex;
						justify-content: center;
					}
					.gift-name{
						font-size: 13px;
						text-align: center;
						color: #606266;
						padding-top: 4px;
					}
					.gift-price-box{
						font-size: 10px;
						text-align: center;
						color: #909399;
						padding-top: 2px;
						overflow: hidden;
					}
				}
			}
		}
		.money-box{
			padding: 10px 30px;
			border-top: 1px solid #f0f0f0;
		}
	}
	
	//红包
	.bag-box{
		background-color: #f6f6f6;
		height: 75vh;
		overflow: hidden;
		box-shadow: 0px 0px 10px rgba(0,0,0,0.05);
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		padding: 0px 10px 10px 10px;
		.bonus-box{
			padding: 15px 0px;
			padding-top: 20px;
		}
		.action-box{
			border-radius: 8px;
			background-color: #ffffff;
			padding: 20px;
			.input-box{
				padding: 5px 0;
				display: flex;
				border-bottom: 1px solid #e4e7ed;
			}
			.bag-desc-box{
				padding-top: 10px;
			}
		}
	}
</style>