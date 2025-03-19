	// #ifndef MP-KUAISHOU
	import TIM from '@tencentcloud/chat';
	import TIMUploadPlugin from 'tim-upload-plugin';// 发送图片、文件等消息需要腾讯云即时通信 IM 上传插件 
	// #endif
	//npm install @tencentcloud/chat
	// 发送图片、文件等消息需要腾讯云即时通信 IM 上传插件
	//npm install tim-upload-plugin --save
	//import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin';// 拦截或替换敏感词需要本地审核插件
	// #ifdef APP-PLUS
	const TUICallKit = uni.requireNativePlugin('TencentCloud-TUICallKit');//音视频通话
	// #endif

	// #ifdef MP-WEIXIN
	// 导入 TUICallKitServer 模块，使您的应用具有全局呼叫的能力
	import { TUICallKitServer } from "@/TUICallKit/src/index";
	// 导入 CallManager 模块，使您的应用具有全局监听来电的能力
	import { CallManager } from "@/TUICallKit/src/TUICallService/serve/callManager";
	uni.CallManager = new CallManager();
	// #endif
	
	export default {
		data(){
			return {
				nextReqMessageID:'',//用于分页续拉的消息 ID。第一次拉取时不要传入 nextReqMessageID，续拉时填入上次调用 getMessageList 接口返回的该字段的值
				count:15,//需要拉取的消息数量，默认值和最大值为15
				Msglist:[],//消息列表
				dialogTerm:{
					today_dialog_num: 0,//限制每天对话人数
					limit_dialog_text: '', //限制时弹出的数据
					to_follow_wx: 0, //是否需要关注公众号
					follow_text:'', //关注公众号内容
				},
				readState:false,//读消息状态,
				userID:'', //当前登录用户的ID
				//toID:'', //对方ID 群组ID
				//对话设置
				msgSetting:{
					use_img: 1,
					use_location: 1,
					use_video: 1,
					use_gift: 0,
					use_video_msg: 0,
					use_audio_msg: 0,
					use_bag: 0,
					use_vip: 0,
					use_file: 0,
					limit_dialog: 0,
					use_more:0, //显示更多按钮
				},
			}
		},
		created() {
			const t = this;
			console.log('TIM created ...........................................')
			//获取对话设置
			this.$request('getMsgSetting', {},{
				showLoading: false,
			}).then((res)=>{
				console.log('IM获取对话设置@@@@@@@@', res)
				if(res.data.data.setting){
					let setting = res.data.data.setting;
					this.msgSetting = setting;
				}
			})
		},
		onLoad(){
			
		},
		onShow() {
			
		},
		onReady(){
			console.log('IM-onReady--------------')
			//监听消息
			/*const t = this;
			uni.$on('msgEvent',function(data){
				console.log('监听到事件来自 msgEvent 数据1', data, t.userData.userid, t.member_id);
				let index = t.Msglist.findIndex(n=>n.ID == data.ID);
				console.log('查找数据', index)
				if(data.to == t.userData.userid && data.from == t.member_id){ //发送过来的消息
					if(index == -1){
						t.addList([data]);
					}
				}
			})*/
			//如果IMsdk未初始化
			let timSDK = this.$store.state.timSDK;
			if(!Object.keys(timSDK).length){
				
			}
			this.timRegister();//注册TIM通讯
			console.log('IM-onReady-timSDK', timSDK)
			
		},
		onHide() {
			/*
			let timSDK = this.$store.state.timSDK;
			let promise = timSDK.logout();
			promise.then(function(imResponse) {
				console.log('登出成功',imResponse.data); // 登出成功
			}).catch(function(imError) {
				console.log('logout error:', imError);
			});
			*/
		},
		
		computed: {
			
		},
		methods:{
			//注册IM通讯
			timRegister(){
				const t = this;
				// #ifdef MP-KUAISHOU
				return
				// #endif
				if(!this.isLogin({nav:false})){
					console.log('未登录');
					return;
				}else{
					//t.userID = this.$store.state.userInfo.userid;
				}
				/*let timSDK = this.$store.state.timSDK;
				if(Object.keys(timSDK).length){
					console.log('timSDK已注册，请保证全局唯一')
					return;
				}*/
				//获取对话参数
				this.getDialogParams();
				
				this.$store.dispatch('getTim', (res)=>{
					if(Object.keys(res).length && res.sdkAppID && res.secretKey && res.userID){
						t.$store.state.timParam = res;//存储tim参数
						let sdkAppID = res.sdkAppID;
						let userID = res.userID;
						let userSig = res.userSig;
						t.userID = res.userID;
						console.log('getTim-------------------', res, 'userID：'+userID, 'userSig-'+userSig)
						//存储用户签名
						t.$store.commit('setStateAttr', {
							key: 'userSig',
							val: userSig
						})
						// 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
						let options = {
							SDKAppID: sdkAppID
						};
						let tim = TIM.create(options); // SDK 实例通常用 tim 表示
						
						// 设置 SDK 日志输出级别
						//tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
						tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
						
						// 注册腾讯云即时通信 IM 上传插件
						tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});
						
						// 注册腾讯云即时通信 IM 本地审核插件
						//tim.registerPlugin({'tim-profanity-filter-plugin': TIMProfanityFilterPlugin});
						
						// SDK 进入 ready 状态时触发，接入侧监听此事件，然后可调用 SDK 发送消息等 API，使用 SDK 的各项功能
						let onSdkReady = function(event) {
							console.log('SDK 进入 ready 状态时触发@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', event)
							t.modifyUserData();//更新自身资料
							//let message = tim.createTextMessage({ to: 'admin', conversationType: 'C2C', payload: { text: 'Hello world!' }});
							//tim.sendMessage(message);
						};
						tim.on(TIM.EVENT.SDK_READY, onSdkReady);
						
						// SDK 进入 not ready 状态时触发，此时接入侧将无法使用 SDK 发送消息等功能。如果想恢复使用，接入侧需调用 login 接口，驱动 SDK 进入 ready 状态
						let onSdkNotReady = function(event) {
							console.log('SDK 进入 not ready---------------------------------- 状态时触发')
						  // 如果想使用发送消息等功能，接入侧需驱动 SDK 进入 ready 状态，重新调用 login 接口即可，如下所示：
						  // tim.login({userID: 'your userID', userSig: 'your userSig'});
						};
						tim.on(TIM.EVENT.SDK_NOT_READY, onSdkNotReady);
						
						// SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息，接入侧可通过遍历 event.data 获取消息列表数据并渲染到页面
						let onMessageReceived = function(event) {
							console.log('收到推送的单聊、群聊、群提示、群系统通知的新消息', event.data)
							uni.$emit('msgEvent',event.data[0]);//触发消息监听事件
							// event.data - 存储 Message 对象的数组 - [Message]
							let data = event.data[0];
							console.log('data-----------', data)
							/*
							console.log('t.userID', t.userID)
							console.log('t.toID', t.toID)*/
							let index = t.Msglist.findIndex(n=>n.ID == data.ID);
							let userID = t.userID;
							let toID = t.toID;
							
							if(data.conversationType == 'C2C'){
								if(data.to == userID && data.from == toID){ //发送过来的消息
									if(index == -1){
										t.addList([data]);
									}
								}else if(data.from == userID && data.to == toID){ //我发出的消息
									if(index > -1){
										//更新消息状态
										t.list[index] = JSON.parse(JSON.stringify(data));
									}
								}
								t.getNotifyCount();
							}
							
						};
						tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
						
						// SDK 收到消息被修改的通知，消息发送方可通过遍历 event.data 获取消息列表数据并更新页面上同 ID 消息的内容。
						let onMessageModified = function(event) {
							console.log('收到消息被修改的通知', event.data)
						  // event.data - 存储被修改过的 Message 对象的数组 - [Message]
						};
						tim.on(TIM.EVENT.MESSAGE_MODIFIED, onMessageModified);
						
						// SDK 收到消息被撤回的通知，可通过遍历 event.data 获取被撤回的消息列表数据并渲染到页面，如单聊会话内可展示为 "对方撤回了一条消息"；群聊会话内可展示为 "XXX撤回了一条消息"。
						let onMessageRevoked = function(event) {
							console.log('收到消息被撤回的通知', event.data)
						  // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
						};
						tim.on(TIM.EVENT.MESSAGE_REVOKED, onMessageRevoked);
						
						// SDK 收到对端已读消息的通知，即已读回执。可通过遍历 event.data 获取对端已读的消息列表数据并渲染到页面，如单聊会话内可将己方发送的消息由“未读”状态改为“已读”。
						let onMessageReadByPeer = function(event) {
							console.log('收到对端已读消息的通知', event.data)
							uni.$emit('msgEvent',event.data[0]);//触发消息监听事件
						  // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
						};
						tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, onMessageReadByPeer);
						
						// SDK 收到了群消息的已读回执（v2.18.0起支持）
						let onMessageReadReceiptReceived = function(event) {
							// event.data - 存储消息已读回执信息的数组
							console.log('收到了群消息的已读回执', event)
							const readReceiptInfoList = event.data;
							readReceiptInfoList.forEach((item) => {
								const { groupID, messageID, readCount, unreadCount } = item;
								const message = tim.findMessage(messageID);
								if (message) {
									if (message.readReceiptInfo.unreadCount === 0) {
										// 全部已读
									} else {
										// message.readReceiptInfo.readCount - 消息最新的已读数
										// 如果想要查询哪些群成员已读了此消息，请使用 [getGroupMessageReadMemberList] 接口
									}
								}
							});
						};
						tim.on(TIM.EVENT.MESSAGE_READ_RECEIPT_RECEIVED, onMessageReadReceiptReceived);
						
						// 会话列表更新，event.data 是包含 Conversation 对象的数组
						let onConversationListUpdated = function(event) {
							console.log('会话列表更新',event.data); // 包含 Conversation 实例的数组
						};
						tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, onConversationListUpdated);
						
						// SDK 群组列表更新时触发，可通过遍历 event.data 获取群组列表数据并渲染到页面
						let onGroupListUpdated = function(event) {
							console.log('群组列表更新时触发',event.data);// 包含 Group 实例的数组
						};
						tim.on(TIM.EVENT.GROUP_LIST_UPDATED, onGroupListUpdated);
						
						// 群属性更新时触发，可通过 event.data 获取到更新后的群属性数据（v2.14.0起支持）
						let onGroupAttributesUpdated = function(event) {
							const groupID = event.data.groupID // 群组ID
							const groupAttributes = event.data.groupAttributes // 更新后的群属性
							console.log('群属性更新时触发',event.data);
						};
						tim.on(TIM.EVENT.GROUP_ATTRIBUTES_UPDATED, onGroupAttributesUpdated);
						
						// 创建话题时触发（v2.19.1起支持）
						let onTopicCreated = function(event) {
							const groupID = event.data.groupID // 话题所属社群 ID
							const topicID = event.data.topicID // 话题 ID
							console.log('创建话题时触发',event.data);
						};
						tim.on(TIM.EVENT.TOPIC_CREATED, onTopicCreated);
						
						// 删除话题时触发（v2.19.1起支持）
						let onTopicDeleted = function(event) {
							const groupID = event.data.groupID // 话题所属社群 ID
							const topicIDList = event.data.topicIDList // 删除的话题 ID 列表
							console.log('删除话题时触发',event.data);
						};
						tim.on(TIM.EVENT.TOPIC_DELETED, onTopicDeleted);
						
						// 话题资料更新时触发（v2.19.1起支持）
						let onTopicUpdated = function(event) {
							const groupID = event.data.groupID // 话题所属社群 ID
							const topic = event.data.topic // 话题资料
							console.log('话题资料更新时触发',event.data);
						};
						tim.on(TIM.EVENT.TOPIC_UPDATED, onTopicUpdated);
						
						// 自己或好友的资料发生变更时触发，event.data 是包含 Profile 对象的数组
						let onProfileUpdated = function(event) {
							console.log('自己或好友的资料发生变更时触发', event.data); // 包含 Profile 对象的数组
						};
						tim.on(TIM.EVENT.PROFILE_UPDATED, onProfileUpdated);
						
						// SDK 黑名单列表更新时触发
						let onBlacklistUpdated = function(event) {
							console.log('黑名单列表更新时触发', event.data); // 我的黑名单列表，结构为包含用户 userID 的数组
						};
						tim.on(TIM.EVENT.BLACKLIST_UPDATED, onBlacklistUpdated);
						
						// 好友列表更新时触发
						let onFriendListUpdated = function(event) {
							console.log('好友列表更新时触发', event.data);
						}
						tim.on(TIM.EVENT.FRIEND_LIST_UPDATED, onFriendListUpdated);
						
						// 好友分组列表更新时触发
						let onFriendGroupListUpdated = function(event) {
							console.log('好友分组列表更新时触发', event.data);
						}
						tim.on(TIM.EVENT.FRIEND_GROUP_LIST_UPDATED, onFriendGroupListUpdated);
						
						// FRIEND_APPLICATION_LIST_UPDATED
						let onFriendApplicationListUpdated = function(event) {
							console.log('申请加好友触发', event)
							// friendApplicationList - 好友申请列表 - [FriendApplication]
							// unreadCount - 好友申请的未读数
							const { friendApplicationList, unreadCount } = event.data;
							// 发送给我的好友申请（即别人申请加我为好友）
							const applicationSentToMe = friendApplicationList.filter((friendApplication) => friendApplication.type === TIM.TYPES.SNS_APPLICATION_SENT_TO_ME);
							// 我发送出去的好友申请（即我申请加别人为好友）
							const applicationSentByMe = friendApplicationList.filter((friendApplication) => friendApplication.type === TIM.TYPES.SNS_APPLICATION_SENT_BY_ME);
						};
						tim.on(TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED, onFriendApplicationListUpdated);
						
						// 用户被踢下线时触发
						let onKickedOut = function(event) {
							console.log('用户被踢下线时触发', event.data.type);
							// TIM.TYPES.KICKED_OUT_MULT_ACCOUNT(Web端，同一帐号，多页面登录被踢)
							// TIM.TYPES.KICKED_OUT_MULT_DEVICE(同一帐号，多端登录被踢)
							// TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED(签名过期)
							// TIM.TYPES.KICKED_OUT_REST_API(REST API kick 接口踢出。v2.20.0起支持)
						};
						tim.on(TIM.EVENT.KICKED_OUT, onKickedOut);
						
						// 网络状态发生改变
						let onNetStateChange = function(event) {
							// v2.5.0 起支持
							// event.data.state 当前网络状态，枚举值及说明如下：
							// TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
							// TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
							// TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
						};
						tim.on(TIM.EVENT.NET_STATE_CHANGE, onNetStateChange);
						
						//存储timSDK
						t.$store.commit('setStateAttr', {
							key: 'timSDK',
							val: tim
						})
						
						//登录TIM
						let promise = tim.login({userID: userID, userSig: userSig});
						promise.then(function(imResponse) {
							console.log('登录成功', imResponse.data); // 登录成功
							if (imResponse.data.repeatLogin === true) {
								// 标识帐号已登录，本次登录操作为重复登录。v2.5.1 起支持
								console.log('标识帐号已登录，本次登录操作为重复登录',imResponse.data.errorInfo);
							}
						}).catch(function(imError) {
							console.log('登录失败的相关信息:', imError); // 登录失败的相关信息
						});
						
						//注册音视频通话
						// #ifdef APP-PLUS
						const callOptions = {
							SDKAppID: sdkAppID,
							userID: userID,
							userSig: userSig,
						};
						TUICallKit.login(callOptions, (c) => {
							console.log('登录TUI', c)
							if (c.code === 0) {
								console.log('login success');
							} else {
								console.log(`login failed, error message = ${c.msg}`);
							}
						});
						// #endif
						// #ifdef MP-WEIXIN
						uni.CallManager.init({
						    sdkAppID: sdkAppID,
						    userID: userID,
						    userSig: userSig,
						    globalCallPagePath: "TUICallKit/src/Components/TUICallKit",
						});
						// #endif
					}else{
						console.log('TIM获取tim参数错误', res)
					}
				})
			},
			
			//修改个人资料
			modifyUserData(){
				const t = this;
				let timSDK = this.$store.state.timSDK;
				let userInfo = this.$store.state.userInfo;
				if(userInfo.nickname && userInfo.avatar){
					let promise = timSDK.updateMyProfile({
						nick: userInfo.nickname,
						avatar: userInfo.avatar,
						gender: userInfo.sex == 1 ? TIM.TYPES.GENDER_MALE : userInfo.sex == 2 ? TIM.TYPES.GENDER_FEMALE : TIM.TYPES.GENDER_UNKNOWN,
						selfSignature: userInfo.sign,//签名
						allowType: userInfo.allowType == 1 ? TIM.TYPES.ALLOW_TYPE_ALLOW_ANY : TIM.TYPES.ALLOW_TYPE_NEED_CONFIRM,
						messageSettings: userInfo.messageSettings,//消息设置 0：接收消息，1：不接收消息
					});
					promise.then(function(imResponse) {
						console.log('更新资料成功-------------------------',imResponse.data); // 更新资料成功
					}).catch(function(imError) {
						console.log('updateMyProfile error--------------------:', imError); // 更新资料失败的相关信息
					});
				}
			},
			
			//获取对话参数
			getDialogParams(){
				//统计今日对话总计
				this.$request('getTodayMsgNum', {},{
					showLoading: false
				}).then((res)=>{
					//console.log('统计今日对话总计', res)
					this.dialogTerm = res.data.data.dialogTerm;
				})
			},
			//向Msglist添加数据
			addList(arr = [], sort = 1){
				//let Msglist = JSON.parse(JSON.stringify(this.Msglist));
				console.log('向Msglist添加数据前：arr.length'+arr.length+',this.Msglist:'+this.Msglist.length)
				if(arr.length){
					for(var i = 0; i < arr.length; i++){
						if(arr[i].cloudCustomData){
							arr[i].cloudCustomData = JSON.parse(arr[i].cloudCustomData);
						}
						arr[i].showAvatar = true;
						if(arr[i].type == 'TIMCustomElem'){
							if(arr[i].payload.data !== undefined && arr[i].payload.data == 'tip'){
								arr[i].showAvatar = false;
							}
						}
						if(sort == 1){
							this.Msglist.push(JSON.parse(JSON.stringify(arr[i])));
						}else{
							this.Msglist.unshift(JSON.parse(JSON.stringify(arr[i])));
						}
					}
					if(this.scrollIng === false){
						this.intoView = 'into_atart';
						setTimeout(()=>{
							this.intoView = 'into_end_' + new Date().getTime();
						}, 300)
					}
				}
				console.log('添加消息后'+this.Msglist.length)
			},
			
			//发起音视频通话
			async TUICall(options = {}){
				//console.log('IM-发起音视频通话', options)
				if(Object.keys(options).length == 0){
					this.msg('通话参数错误');
					console.log('options', options)
					return;
				}
				if(options.callMediaType === undefined){
					this.msg('通话类型错误');return;
				}
				if(this.userID ==''){
					this.msg('userID不能为空');return;
				}
				if(this.toID ==''){
					this.msg('toID不能为空');return;
				}
				let userID = this.userID.toString();
				let toID = this.toID.toString();
				console.log('发起音视频通话', userID, toID)
				// #ifdef APP-PLUS
				options.userID = toID;
				TUICallKit.call(options, (res) => {
					if (res.code === 0) {
						console.log('call success');
					} else {
						console.log(`call failed, error message = ${res.msg}`);
					}
				});
				// #endif
				// #ifdef MP-WEIXIN
				/*
				this.msg('小程序暂不支持音视频通话');
				return;
				*/
				if(Object.keys(this.$store.state.timParam).length && this.$store.state.userSig){
					let sdkAppID = this.$store.state.timParam.sdkAppID;
					
					// await uni.CallManager.init({
					// 	sdkAppID: sdkAppID,
					//     userID: toID,
					//     userSig: this.$store.state.userSig,
					//     globalCallPagePath: "TUICallKit/src/Components/TUICallKit",
					// });
					await TUICallKitServer.call({
						userID: toID,
						type: options.callMediaType,
					});
				}else{
					this.msg('通讯参数错误');
					console.log('this.$store.state', this.$store.state)
				}
				// #endif
			},
			
			//发送地理位置消息
			sendLocationMsg(type='', payload = {}, callback = null){
				const t = this;
				let timSDK = this.$store.state.timSDK;
				if(!Object.keys(timSDK).length){
					this.msg('timSDK注册失败');return;
				}
				if(type == ''){
					this.msg('消息类型错误');return;
				}
				if(Object.keys(payload).length == 0){
					this.msg('消息数据错误');return;
				}
				if(!payload.longitude || !payload.latitude){
					this.msg('消息数据错误');return;
				}
				if(this.userID == ''){
					this.msg('userID不能为空');return;
				}
				if(this.toID ==''){
					this.msg('toID不能为空');return;
				}
				let userID = this.userID.toString();
				let toID = this.toID.toString();
				
				let msgType = TIM.TYPES.CONV_C2C;// 默认单聊
				if(type == 'GROUP'){
					msgType = TIM.TYPES.CONV_GROUP; //群聊
				}
				let message = timSDK.createLocationMessage({
					to: toID,
					conversationType: msgType,
					payload: payload,
					// v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
					needReadReceipt: true,
					// 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
					cloudCustomData: JSON.stringify({
						event: 'msg',
						to: t.toID,
						from: t.$store.state.userInfo.userid
					})
				});
				// 2. 发送消息
				let promise = timSDK.sendMessage(message);
				promise.then(function(imResponse) {
					// 发送成功
					typeof callback == 'function' && callback(imResponse);
					t.sendNotify(imResponse.data.message);
					console.log('发送成功', imResponse);
				}).catch(function(imError) {
					typeof callback == 'function' && callback(JSON.parse(JSON.stringify(imError)));
					//发送失败
					console.log('发送失败sendMessage error:', JSON.stringify(imError));
				});
			},
			
			/*
				发送文本消息  单聊 群聊 
				type:单聊 C2C  群组 GROUP
				toID: 用户USERID 群组id
				Text: 文本内容
			*/
			sendTextMsg(type='', Text = '', callback = null){
				const t = this;
				let timSDK = this.$store.state.timSDK;
				console.log('IM-发送---------------------------', type, Text, timSDK)
				console.log('this.userID-this.toID', this.userID, this.toID)
				if(!Object.keys(timSDK).length){
					this.msg('timSDK注册失败');
					return;
				}
				if(type == ''){
					this.msg('消息类型错误');
					return;
				}
				if(Text == ''){
					this.msg('内容不能为空');
					return;
				}
				if(this.userID ==''){
					this.msg('userID不能为空');return;
				}
				
				if(this.toID ==''){
					this.msg('toID不能为空');return;
				}
				console.log('对话双方', this.userID, this.toID)
				let userID = this.userID.toString();
				let toID = this.toID.toString();
				
				let msgType = TIM.TYPES.CONV_C2C;// 默认单聊
				if(type == 'GROUP'){
					msgType = TIM.TYPES.CONV_GROUP; //群聊
				}
				let message = timSDK.createTextMessage({
					to: toID,
					conversationType: msgType,
					payload: {
						text: Text
					},
					// v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
					needReadReceipt: true,
					// 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
					cloudCustomData: JSON.stringify({
						event: 'msg',
						to: t.toID,
						from: t.$store.state.userInfo.userid
					})
				});
				// 2. 发送消息
				let promise = timSDK.sendMessage(message);
				promise.then(function(imResponse) {
					// 发送成功
					typeof callback == 'function' && callback(imResponse);
					t.sendNotify(imResponse.data.message);
					console.log('发送成功', imResponse);
				}).catch(function(imError) {
					typeof callback == 'function' && callback(JSON.parse(JSON.stringify(imError)));
					//发送失败
					console.log('发送失败sendMessage error:', JSON.stringify(imError), imError);
				});
			},
			
			//发送媒体消息
			sendMediumMsg(type='', params = {}, callback = null){
				const t = this;
				let timSDK = this.$store.state.timSDK;
				console.log('发送媒体消息', type, t.toID, params)
				if(Object.keys(params).length == 0){
					this.msg('参数不能为空');return;
				}
				if(!Object.keys(timSDK).length){
					this.msg('timSDK注册失败');return;
				}
				if(type == ''){
					this.msg('消息类型错误');return;
				}
				
				if(this.userID ==''){
					this.msg('userID不能为空');return;
				}
				if(this.toID ==''){
					this.msg('toID不能为空');return;
				}
				let userID = this.userID.toString();
				let toID = this.toID.toString();
				
				let mediumType = params.mediumType;
				if(!mediumType){
					this.msg('媒体类型错误');return;
				}
				let msgType = TIM.TYPES.CONV_C2C;// 默认单聊
				if(type == 'GROUP'){
					msgType = TIM.TYPES.CONV_GROUP; //群聊
				}
				
				// 1. 选择媒体 图片 视频 音频
				if(mediumType == 'image'){
					uni.chooseImage({
						count: 1,
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], //从相册选择
						success: function (res) {
							uni.showLoading({
								title: '发送中...'
							});
							let message = timSDK.createImageMessage({
								to: toID,
								conversationType: msgType,
								payload: { file: res },
								onProgress: function(event){ 
									//console.log('file uploading:', event) 
								},
								needReadReceipt: true,
								cloudCustomData: JSON.stringify({
									event: 'msg',
									to: t.toID,
									from: t.$store.state.userInfo.userid
								})
							});
							// 2. 发送消息
							let promise = timSDK.sendMessage(message);
							promise.then(function(imResponse) {
								// 发送成功
								typeof callback == 'function' && callback(imResponse);
								t.sendNotify(imResponse.data.message);
								uni.hideLoading();
								console.log(imResponse);
							}).catch(function(imError) {
								uni.hideLoading();
								// 发送失败
								typeof callback == 'function' && callback(JSON.parse(JSON.stringify(imError)));
								console.log('sendMessage error:', imError);
							});
						},
						fail(err) {
							console.log('选择图片错误', err)
						}
					});
				}else if(mediumType == 'video'){ //视频
					// 1. 选择视频
					uni.chooseVideo({
						count: 1,
						sourceType: ['camera', 'album'], // album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera']
						maxDuration: 60, // 设置最长时间60s
						camera: 'back', // 后置摄像头
						success: function(res) {
							uni.showLoading({
								title: '上传中...'
							});
							let message = timSDK.createVideoMessage({
								to: toID,
								conversationType: msgType,
								payload: { file: res },
								onProgress: function(event){ 
									//console.log('file uploading:', event) 
								},
								needReadReceipt: true,
								cloudCustomData: JSON.stringify({
									event: 'msg',
									to: t.toID,
									from: t.$store.state.userInfo.userid
								})
							});
							// 2. 发送消息
							let promise = timSDK.sendMessage(message);
							promise.then(function(imResponse) {
								// 发送成功
								uni.hideLoading();
								typeof callback == 'function' && callback(imResponse);
								t.sendNotify(imResponse.data.message);
								console.log(imResponse);
							}).catch(function(imError) {
								// 发送失败
								uni.hideLoading();
								typeof callback == 'function' && callback(JSON.parse(JSON.stringify(imError)));
								console.log('sendMessage error:', imError);
							});
						}
					})
				}else if(mediumType == 'audio'){
					if(!params.tempFilePath){
						this.msg('语音文件错误');return;
					}
					let message = timSDK.createAudioMessage({
						to: toID,
						conversationType: msgType,
						payload: { 
							file: {tempFilePath:params.tempFilePath}
						},
						onProgress: function(event){
							//console.log('file uploading:', event) 
						},
						needReadReceipt: true,
						cloudCustomData: JSON.stringify({
							recLength:params.recLength,
							event: 'msg',
							to: t.toID,
							from: t.$store.state.userInfo.userid
						})
					});
					// 2. 发送消息
					let promise = timSDK.sendMessage(message);
					promise.then(function(imResponse) {
						// 发送成功
						typeof callback == 'function' && callback(imResponse);
						t.sendNotify(imResponse.data.message);
						uni.hideLoading();
						console.log(imResponse);
					}).catch(function(imError) {
						uni.hideLoading();
						// 发送失败
						typeof callback == 'function' && callback(JSON.parse(JSON.stringify(imError)));
						console.log('sendMessage error:', imError);
					});
				}
			},
			
			//发送自定义消息(包含：礼物、错误提示)
			sendCustomMsg(type='', payload = {}, callback = null){
				const t = this;
				let timSDK = this.$store.state.timSDK;
				//console.log('IM-发送自定义消息---------------------------', type, t.toID, payload, timSDK)
				if(!Object.keys(timSDK).length){
					this.msg('timSDK注册失败');
					return;
				}
				if(type == ''){
					this.msg('消息类型错误');
					return;
				}
				if(Object.keys(payload).length == 0){
					this.msg('自定义结构错误');
					return;
				}
				
				if(this.userID ==''){
					this.msg('userID不能为空');return;
				}
				if(this.toID ==''){
					this.msg('toID不能为空');return;
				}
				let userID = this.userID.toString();
				let toID = this.toID.toString();
				console.log('对话方', userID, toID)
				
				let msgType = TIM.TYPES.CONV_C2C;// 默认单聊
				if(type == 'GROUP'){
					msgType = TIM.TYPES.CONV_GROUP; //群聊
				}
				let message = timSDK.createCustomMessage({
					to: toID,
					conversationType: msgType,
					payload: payload,
					// v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
					needReadReceipt: true,
					// 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
					cloudCustomData: JSON.stringify({
						event: 'msg',
						to: t.toID,
						from: t.$store.state.userInfo.userid
					})
				});
				// 2. 发送消息
				let promise = timSDK.sendMessage(message);
				promise.then(function(imResponse) {
					// 发送成功
					typeof callback == 'function' && callback(imResponse);
					t.sendNotify(imResponse.data.message);
					console.log('发送成功', imResponse);
				}).catch(function(imError) {
					typeof callback == 'function' && callback(JSON.parse(JSON.stringify(imError)));
					//发送失败
					console.log('发送失败sendMessage error:', JSON.stringify(imError));
				});
			},
			
			//发送消息通知
			sendNotify(data = {}){
				if(Object.keys(data).length == 0){
					return;
				}
				this.$request('createDialogNotify', {
					notify_data: data
				},{
					showLoading: false
				}).then((res)=>{
					console.log('发送消息通知', res)
				})
			},
			
			//获取消息样式
			getContentStyle(item){
				let style = {};
				if(item.type == 'TIMImageElem' || item.type == 'TIMVideoFileElem'){
					style.padding = '0px';
					style['background-color'] = '#f6f6f6';
				}else if(item.type == 'TIMCustomElem'){//自定义消息
					if(item.payload.data == 'tip'){ //系统提示
						style['background-color'] = '#c8c9cc';
						style.color = '#ffffff';
					}
				}
				return style;
			},
			//获取金额样式
			moneyFormat(money = ''){
				let val = 0;
				if(money){
					val = parseFloat(money);
				}
				return val.toFixed(2);
			},
			//解析消息体
			getMsgContent(item){
				let str = '';
				if(item.type == 'TIMTextElem'){ //文本
					str = item.payload.text;
				}else if(item.type == 'TIMImageElem'){ //图片
					str = '<img src="' + item.payload.imageInfoArray[0].imageUrl + '" style="width:160px"/>';
				}else if(item.type == 'TIMVideoFileElem'){ //视频
					let videoUrl = item.payload.videoUrl;
					str = '<video width="200px" controls="false" src="' + videoUrl + '"></video>';
				}else if(item.type == 'TIMCustomElem'){ //自定义消息
					if(item.payload.data == 'tip'){ //系统提示
						str = item.payload.description;
					}
				}
				return str;
			},
			//获取文件名称
			getFileName(payload){
				let str = '';
				if(payload.description){
					let arr = payload.description.split("/");
					if(arr.length){
						str = arr[arr.length - 1];
					}
				}
				return str;
			},
			//获取payload中的Extension字段
			getExtension(payload = {}, e){
				let str = '';
				if(Object.keys(payload).length && e){
					if(payload.extension){
						let obj = JSON.parse(payload.extension);
						if(obj[e] !== undefined){
							str = obj[e];
						}
					}
				}
				return str;
			},
			
			/*以下为废弃功能*/
			//获取会话列表 单聊 群聊
			/*C2C${userID}（单聊）
			GROUP${groupID}（群聊）
			GROUP${topicID}（话题）v2.19.1 起支持
			@TIM#SYSTEM（系统通知会话）*/
			getMessageList(role){
				const t = this;
				let tim = this.$store.state.tim;
				let TIM = this.TIM;
				let param = {
					conversationID: role +  this.toID.toString(), 
					count: this.count,
				};
				let promise = tim.getMessageList(param);
				promise.then(function(imResponse) {
					const messageList = imResponse.data.messageList; // 消息列表。
					const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
					const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。isCompleted 为 true 时，nextReqMessageID 为 ""。
					t.nextReqMessageID = nextReqMessageID;
					
					console.log('第一次获取消息messageList',messageList)
				});
			},
			
			//上拉查看更多消息
			downgetMessageList(role){
				uni.showLoading({
					title: '加载中...'
				});
				const t = this;
				let tim = this.$store.state.tim;
				let TIM = this.TIM;
				let param = {
					conversationID: role +  this.toID.toString(), 
					nextReqMessageID: this.nextReqMessageID,
					count: this.count,
				};
				let promise = tim.getMessageList(param);
				promise.then(function(imResponse) {
					uni.hideLoading();
					const messageList = imResponse.data.messageList; // 消息列表。
					const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
					const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。isCompleted 为 true 时，nextReqMessageID 为 ""。
					t.nextReqMessageID = nextReqMessageID;
					
				});
			},
			
			//设置消息已读
			/*C2C${userID}（单聊）
			GROUP${groupID}（群聊）
			@TIM#SYSTEM（系统通知会话）
			GROUP${topicID}（话题) v2.19.1 起支持
			*/
			setMessageRead(role){
				const t = this;
				let tim = this.$store.state.tim;
				let TIM = this.TIM;
				// 将某会话下所有未读消息已读上报
				let param = {
					conversationID: role +  this.toID.toString()
				};
				let promise = tim.setMessageRead(param);
				promise.then(function(imResponse) {
					// 已读上报成功，指定 ID 的会话的 unreadCount 属性值被置为0
					console.log('已读上报成功')
					t.$store.state.waitRead = 0;
					t.monitorWaitMsg();
				}).catch(function(imError) {
					// 已读上报失败
					console.log('setMessageRead error:', imError);
				});
			},
			
			//监听未读消息
			monitorWaitMsg(){
				if(this.$store.state.waitRead){
					uni.showTabBarRedDot({//设置底部菜单红点
						index: 1,
					})
				}else{
					// #ifndef H5
					uni.hideTabBarRedDot({
						index: 1
					})
					// #endif
				}
			},
			
			
			//提示消息被点击
			Msglinkpress(e){
				console.log('提示消息被点击', e)
			},
			
			
			
			
			
			
			
			
			
			
			
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
	}