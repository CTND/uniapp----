	
export default {
	getApis(name = ''){
		let apilist = [
			//公共模块
			{
				getOpenid: 'app/System/getOpenid',//code 换取用户OPENID
				GetPhoneNumber: 'app/System/GetPhoneNumber',//获取微信手机号
				Getsystem: 'app/System/Getsystem',//获取系统设置
				getWxappCode: 'app/System/getWxappCode',//获取微信小程序二维码 接受参数
				getAccess_token: 'app/Wxopen/getAccess_token',//开放平台 access_token
				getLocationInfo:'app/System/getLocationInfo',//地理位置信息
				getSpace:'app/System/getSpace',//获取驾车模式路线规划距离-高德
				getCityData: 'app/Common/getCityData', //获取城市列表数据
				getAreaList: 'app/System/getAreaList',//获取指定城市区域列表
				getStreetList: 'app/System/getStreetList',//获取指定区域的街道列表
				loginConfig: 'app/System/loginConfig',//登录配置参数
				GetDiyPage: 'app/System/GetDiyPage',//根据页面id获取DIY数据
				GetDateWeek: 'app/System/GetDateWeek',//获取日期 星期数据
				NoticeList: 'app/System/NoticeList',//获取系统公告
				NoticeInfo: 'app/System/NoticeInfo',//公告详情
				Searchkeywords: 'app/System/Searchkeywords',//搜索关键词
				GetPhoneCode: 'app/System/GetPhoneCode',//手机验证码
				JoinIn: 'app/System/JoinIn',//加盟
				Getagree: 'app/System/Getagree',//获取协议
				agreeList: 'app/System/agreeList',//根据ID获取协议列表
				Problemlist: 'app/System/Problemlist',//常见问题
				
				authAttestation: 'app/Attestation/authAttestation',//银行卡实名认证
				bankList: 'app/Attestation/bankList',//银行列表
				writeLog: 'app/System/writeLog',//向后台写错误日志
				
				//消息相关
				notifyList: 'core/Notify/notifyList',//获取消息列表
				queryNotifyList: 'core/Notify/queryNotifyList',//按照条件查询消息列表
				notifyOperate: 'core/Notify/notifyOperate',//消息操作
				notifySend: 'core/Notify/notifySend',//发布消息
				sameCallList: 'core/Notify/sameCallList',//我发起的招呼
				notifyInfo: 'core/Notify/notifyInfo',//消息详情
				createDialogNotify: 'core/Notify/createDialogNotify', //创建对话消息通知
				getNotifyCount: 'core/Notify/getNotifyCount', //获取未读消息
				
				//会员卡
				getCardList: 'app/System/getCardList',//系统会员卡列表
				createCardOrder: 'app/Market/createCardOrder', //创建会员开卡订单
				
				//其他
				departmentList: 'app/System/departmentList',//获取部门列表
			},
			//公共登录 注册
			{
				Login: 'app/Login/Login',//公共登录入口
				wxOpenIdLogin: 'app/Login/wxOpenIdLogin',//微信openid登录 获取用户信息
				Register: 'app/Login/Register',//公共注册入口
			},
			//用户相关
			{
				userInfo: 'app/user/userInfo',//获取用户数据
				searchUser: 'app/user/searchUser',//搜索用户数据
				CancelAccount: 'app/user/CancelAccount',//注销账户
				VideoFaceAuth: 'app/user/VideoFaceAuth',//视频活体检测
				ImageFaceAuth: 'app/user/ImageFaceAuth',//图片人脸检测
				appFaceAuthUpdata: 'app/user/appFaceAuthUpdata', //app人脸验证后更新用户数据
				UserInfoUpdate: 'app/user/UserInfoUpdate',//逐项更新用户数据
				UpdateUserInfo: 'app/user/UpdateUserInfo',//批量更新用户资料数据
				UserSettingUpdate: 'app/user/UserSettingUpdate',//逐项更新用户设置数据
				UpdateUserLocation: 'app/user/UpdateUserLocation',//更新用户位置信息
				Modifymobile: 'app/user/Modifymobile',//修改手机号
				Modifypassword: 'app/user/Modifypassword',//修改密码
				UpdateUserPhoto: 'app/user/UpdateUserPhoto',//更新用户相册
				getUserPhotoData: 'app/user/getUserPhotoData',//获取用户相册数据
				feedBank: 'app/User/feedBank',//用户反馈
				
				//用户账户相关
				useMoneyCurrencyPay: 'app/User/useMoneyCurrencyPay',//使用余额/虚拟币消费
				transmitBonusBag: 'app/User/transmitBonusBag',//使用余提现账户发送红包
				getUserBankAccount: 'app/user/getUserBankAccount',//用户账户列表
				getUserBankAccountDetail: 'app/user/getUserBankAccountDetail',//用户账户详情
				getUserBankAccountDefault: 'app/user/getUserBankAccountDefault',//获取默认提现账户
				userBankAccountDelete: 'app/user/userBankAccountDelete',//用户账户删除
				userBankAccountEdit: 'app/user/userBankAccountEdit',//用户账户新增 编辑
				memberAddress: 'app/user/memberAddress', //用户收货地址列表
				memberAddressEdit: 'app/user/memberAddressEdit', //用户收货地址新增 编辑
				memberAddressInfo: 'app/user/memberAddressInfo', //用户收货地址详情
				memberAddressDelete: 'app/user/memberAddressDelete', //删除收货地址
				memberCouponList: 'app/user/memberCouponList', //获取用户优惠券
				memberNumberCouponList: 'app/user/memberNumberCouponList', //获取用户卡券
				memberCouponDelete: 'app/user/memberCouponDelete', //删除优惠券 卡券
				
				getPoster: 'app/user/getPoster',//获取海报
			},
			{
				//营销模块
				CouponList: 'app/user/CouponList',//获取系统代金券列表
				GetCoupon: 'app/user/GetCoupon',//用户领取代金券
			},
			{
				//分销模块
				resellerSetting: 'sd_reseller/ResellerApp/resellerSetting', //分销设置
				resellerJoin: 'sd_reseller/ResellerApp/resellerJoin', //分销申请
				getResellerAgree: 'sd_reseller/ResellerApp/getResellerAgree', //获取分销协议
				getResellerInfo: 'sd_reseller/ResellerApp/getResellerInfo', //获取分销详情 +数据
				getResellerPayment: 'sd_reseller/ResellerApp/getResellerPayment', //分销商付款
				getResellerPushList: 'sd_reseller/ResellerApp/getResellerPushList', //获取分销列表 用户+下级分销
				getResellerPushWorker: 'sd_reseller/ResellerApp/getResellerPushWorker', //获取分销推广的技师
				clearPushAbout: 'sd_reseller/ResellerApp/clearPushAbout', //解除推广关系
				resellerRanking: 'sd_reseller/ResellerApp/resellerRanking', //推广排名
			},
			{
				//提现相关
				moneyApplyCash: 'sd_money/AppController/moneyApplyCash',//申请提现
				moneyRecord: 'sd_money/AppController/moneyRecord',//佣金明细
				moneyCashRecord: 'sd_money/AppController/moneyCashRecord',//提现记录
				moneyCashDetail: 'sd_money/AppController/moneyCashDetail',//提现详情
				pointSendTo: 'sd_money/AppController/pointSendTo',//积分转赠
			},
			{
				//用户视频相关
				publishVideo: 'app/MemberVideo/publishVideo', //发布视频
				getMemberVideoList: 'app/MemberVideo/getMemberVideoList', //获取用户视频列表
				delMemberVideo: 'app/MemberVideo/delMemberVideo', //删除用户视频列表
				getMemberVideoPlugin: 'app/MemberVideo/getMemberVideoPlugin', //获取用户视频评论列表
				delMemberVideoPlugin: 'app/MemberVideo/delMemberVideoPlugin', //删除用户视频评论
				publishVideoPlugin: 'app/MemberVideo/publishVideoPlugin', //发表视频评论
				memberVideoPluginLike: 'app/MemberVideo/memberVideoPluginLike', //视频评论点赞
				memberVideoLike: 'app/MemberVideo/memberVideoLike', //视频点赞
			},
			//营销接口
			{
				rechargeList: 'app/MarketApi/rechargeList', //余额充值列表
				createRechOrder: 'app/Market/createRechOrder', //创建充值订单 余额|金币
				currencyRechList: 'app/MarketApi/currencyRechList', //金币充值列表
				createBagOrder: 'app/Market/createBagOrder', //创建红包订单
				getBag: 'app/Market/getBag', //用户主动领取红包
			},
			{
				//抖音接口
				code2Session: 'app/Douyin/code2Session',//获取openid
			},
			//门店接口
			{
				storeList: 'sd_stores/StoreApi/storeList', //门店列表
				storeInfo: 'sd_stores/StoreApi/storeInfo', //门店详情
			},
			//其他接口
			{
				getEmojis: 'app/Common/getEmojis', //获取表情文件列表
				getGifList: 'app/Common/getGifList', //获取gif动图文件
				getPlayInfo: 'core/AliKey/getPlayInfo', //获取音视频播放地址
			},
			//文章接口
			{
				derTypeList: 'sd_essay/Filebase/derTypeList', //文件分类
				derList: 'sd_essay/Filebase/Derlist', //文件夹列表
				fileList: 'sd_essay/Filebase/Filelist', //文件列表
				Diyessaylist: 'sd_essay/app.Essay/Diyessaylist', //DIY获取文章列表
				getEssayInfo: 'sd_essay/app.Essay/Getessay',//获取文章详情
			},
			/***************其他模块接口*****************************/
			{
				//全局师傅接口
				workerCollect: 'sd_worker/AppController/workerCollect', //收藏师傅
				workerAssess: 'sd_worker/AppController/workerAssess', //对师傅评价
				workBriefData: 'sd_worker/AppController/workBriefData', //师傅简单数据 姓名 头像
				noticeWorker: 'sd_worker/Notice/noticeWorker', //向师傅发送接单通知
				
				workerSetting:'sd_worker/AppController/workerSetting',//获取技师设置
				workerJoin:'sd_worker/AppController/workerJoin',//技师入住
				workerData:'sd_worker/AppController/workerData', //获取技师数据 信息
				workerChangeStatus:'sd_worker/AppController/workerChangeStatus', //技师上下线
				workerUpdateLocation:'sd_worker/AppController/workerUpdateLocation', //技师更新位置数据
				workerAwaitOrder:'sd_worker/AppController/workerAwaitOrder', //技师订单广场
				workerGetOrder:'sd_worker/AppController/workerGetOrder', //技师接单
				workerChangeOrder:'sd_worker/AppController/workerChangeOrder', //技师操作订单 完成 放弃
				workerOrderInfo: 'sd_worker/AppController/workerOrderInfo', //订单详情
				workerOrderList: 'sd_worker/AppController/workerOrderList', //订单列表
				workerIncomeList: 'sd_worker/AppController/workerIncomeList', //订单佣金列表
			},
			
			//个人名片
			{
				callingSetting: 'sd_calling_card/Api/getSetting',
				callingGetCard: 'sd_calling_card/Api/getCard',
				callingSetZan: 'sd_calling_card/Api/callingSetZan', //标签点赞
				callingCardList: 'sd_calling_card/Api/cardList', //h5获取名片列表
				
				callingGetMyCard: 'sd_calling_card/AppController/getMyCard', //获取我的名片
				callingCardGet: 'sd_calling_card/AppController/cardGet', //领取名称
				callingMyCard: 'sd_calling_card/AppController/myCard',
				callingCardEdit: 'sd_calling_card/AppController/cardEdit',
				callingCollecrCard: 'sd_calling_card/AppController/collectCard',
				callingMyCollect: 'sd_calling_card/AppController/myCollect',
				callingDeleteCollect: 'sd_calling_card/AppController/deleteCollect',
				//助手
				callingAddressList: 'sd_calling_card/AppController/addressList',
				callingStroketype: 'sd_calling_card/AppController/strokeType',//宣传类型
				callingRouterList: 'sd_calling_card/AppController/routerList',
				callingCardRouter: 'sd_calling_card/AppController/cardRouter',//名片行程
				callingRouterDetail: 'sd_calling_card/AppController/routerDetail',
				callingRouterEdit: 'sd_calling_card/AppController/routerEdit',
				callingRouterFinish: 'sd_calling_card/AppController/routerFinish',
				callingPointRanking: 'sd_calling_card/AppController/pointRanking',//积分排名
				callingHistoryList: 'sd_calling_card/AppController/historyList',//历史数据
				callingGoodsList: 'sd_calling_card/AppController/goodsList',//物料管理
				callingGoodsApply: 'sd_calling_card/AppController/goodsApply',//申请物料
				callingGoodsRecord: 'sd_calling_card/AppController/goodsRecord',//物料记录
				callingGetCardList: 'sd_calling_card/AppController/getCardList',//查找本学院全部名片
			},
			
			{
				//预约就诊
				getVisitSetting: 'sd_enroll/Visit/getVisitSetting', //获取就诊设置
				visitSettingEdit: 'sd_enroll/Visit/visitSettingEdit', //就诊设置
				getVisitFormParams: 'sd_enroll/Visit/getVisitFormParams', //获取预约时间
				visitSubmitForm: 'sd_enroll/Visit/visitSubmitForm', //提交预约
				visitOrderList: 'sd_enroll/Visit/visitOrderList', //预约记录
				visitOrderChange: 'sd_enroll/Visit/visitOrderChange', //处理预约信息
			},
			
			//上门按摩
			{
				doorItemList: 'sd_serve_door/Api/doorItemList', //获取项目列表
				getDoorSetting: 'sd_serve_door/Api/getSetting', //获取参数设置
				doorWorkerList: 'sd_serve_door/Api/workerList', //附近技师
				
				doorWorkerInfo: 'sd_serve_door/AppController/workerInfo', //技师详情
				doorItemInfo: 'sd_serve_door/ServeController/itemInfo', //项目详情
				doorCreateOrderData: 'sd_serve_door/AppController/doorCreateOrderData', //获取创建订单数据
				doorCreateOrder: 'sd_serve_door/AppController/doorCreateOrder', //创建订单
				
				doorOrderList: 'sd_serve_door/AppController/doorOrderList', //订单列表
				doorOrderAction: 'sd_serve_door/AppController/doorOrderAction', //关闭|删除|取消|退款订单
				doorOrderPay: 'sd_serve_door/AppController/doorOrderPay', //订单二次付款
				doorOrderInfo: 'sd_serve_door/AppController/doorOrderInfo', //订单详情
				
			},
			
			{
				//同城交友
				getTimParam: 'sd_same/Tim/getTimParam',//获取TIM参数
				getSameBase: 'sd_same/Api/getSameBase',//基础参数
				getSameModels: 'sd_same/Api/getSameModels',//获取陌约功能模块
				activityTypeList: 'sd_same/AppController/activityTypeList',//获取陌约分类
				sameActivityEdit: 'sd_same/AppController/sameActivityEdit', //发布陌约活动
				getSameActivityInfo: 'sd_same/AppController/getSameActivityInfo',//活动详情
				sameActivityEnroll: 'sd_same/AppController/sameActivityEnroll',//活动报名
				sameActivityList: 'sd_same/AppController/sameActivityList',//活动|需求列表
				sameMyActivity: 'sd_same/AppController/sameMyActivity',//我发起的 我参与的
				sameMyDemand: 'sd_same/AppController/sameMyDemand',//我的需求 
				sameActivityManage: 'sd_same/AppController/sameActivityManage',//处理我的活动
				sameDemandManage: 'sd_same/AppController/sameDemandManage',//处理我的参与
				
				getSameActivityList: 'sd_same/Api/getSameActivityList',//附近活动数据-无鉴权
				
				getSameActionList: 'sd_same/Api/getSameActionList',//动态列表数据-不验证登录
				getSameNearbyList: 'sd_same/Api/getSameNearbyList',//附近人数据
				getSameChaterList: 'sd_same/Api/getSameChaterList',//获取聊手
				getIndexPopupData: 'sd_same/Api/getIndexPopupData',//获取首页弹窗数据 招呼 公告  红包
				sameActionList: 'sd_same/AppController/sameActionList',//动态列表数据-验证登录
				
				getSameUserInfo: 'sd_same/AppController/getSameUserInfo',//获取指定用户详情 包括自身和对方
				sameRelevanceChange: 'sd_same/AppController/sameRelevanceChange',//改变粉丝关系 关注 取关
				samePublishNews: 'sd_same/AppController/samePublishNews',//发布圈子消息
				sameDeleteNews: 'sd_same/AppController/sameDeleteNews',//删除圈子消息
				
				getNewsInfo: 'sd_same/AppController/getNewsInfo',//获取指定消息详情
				sameCommentList: 'sd_same/AppController/sameCommentList',//获取消息评论列表
				samePublishNewsComment: 'sd_same/AppController/samePublishNewsComment',//发布消息评论
				
				sameNewsFabulous: 'sd_same/AppController/sameNewsFabulous',//点赞消息
				sameCommentFabulous: 'sd_same/AppController/sameCommentFabulous',//点赞评论
				
				sameMemberRelevance: 'sd_same/AppController/sameMemberRelevance',//粉丝关系  关注 看动态 朋友 拉黑
				sameMemberReport: 'sd_same/AppController/sameMemberReport',//投诉举报
				applyAddFriend: 'sd_same/AppController/applyAddFriend',//申请加好友
				appFriendChange: 'sd_same/AppController/appFriendChange',//好友申请处理 通过 拒绝  删除
				appFriendList: 'sd_same/AppController/appFriendList', //好友申请表
				newsBook: 'sd_same/AppController/newsBook', //通讯录
				friendList: 'sd_same/AppController/friendList', //获取好友列表 查询好友
				
				getGiftList: 'sd_same/Api/getGiftList',//礼物列表
				/**********对话类********/
				getMsgSetting: 'sd_same/Api/getSetting',//获取对话设置
				getTodayMsgNum: 'sd_same/Tim/getTodayMsgNum',//获取今日对话人数
				getMsgList: 'sd_same/Tim/getMsgList',//对话消息列表
				sendTipMsg: 'sd_same/Tim/sendTipMsg',//发送系统提示类消息
			},
			
			{
				//转店宝
				transShopSetting: 'sd_transfershop/Api/getSetting', //获取参数设置
				transShopTypeList: 'sd_transfershop/Api/getTypeList',//获取信息查询页分类 标签列表
				transShopNoticeList: 'sd_transfershop/Api/noticeList', //获取滚动公告
				transShopInfoList: 'sd_transfershop/Api/infoList',
				transShopWindowList: 'sd_transfershop/Api/transShopWindowList',
				transShopApiInfoDetail: 'sd_transfershop/Api/infoDetail',//获取信息详情
				transShopApiInfoPushStoreList: 'sd_transfershop/Api/pushStoreList',//获取推荐店铺列表
				transShopOtherList: 'sd_transfershop/Api/otherList',//热门店铺和成功案例
				transShopfindList: 'sd_transfershop/Api/findList',//找店信息
				
				transShopSendParam: 'sd_transfershop/AppController/sendParam',//获取发布参数
				transShopInfoDetail: 'sd_transfershop/AppController/infoDetail',//获取信息详情
				transShopInfoData: 'sd_transfershop/AppController/infoData',//获取信息数据报表
				transShopInfoCollect: 'sd_transfershop/AppController/infoCollect',//收藏
				transShopInfoPush: 'sd_transfershop/AppController/infoPush', //发布转店信息
				transShopOrderList: 'sd_transfershop/AppController/orderList', //我发布的转让信息
				transShopOrderChange: 'sd_transfershop/AppController/orderChange', //订单操作
				transShopOrderInfo: 'sd_transfershop/AppController/orderInfo',//获取订单详情
				transShopAiSteep: 'sd_transfershop/AppController/aiSteep',//获取订单AiSteep
				transShopCollectList: 'sd_transfershop/AppController/collectList', //我的收藏
				transShopOrderPay: 'sd_transfershop/AppController/orderPay',//获取订单付款参数
				transShopSubmitPeriodic: 'sd_transfershop/AppController/submitPeriodic', //提交订阅消息
				transShopPeriodicList: 'sd_transfershop/AppController/periodicList', //订阅消息列表
				transShopPeriodicChange: 'sd_transfershop/AppController/periodicChange', //订阅消息操作
				transShopPeriodicDetail: 'sd_transfershop/AppController/periodicDetail', //获取订阅详情
				
			},
			
			{
				//店铺转让
				transferStoreGetSetting: 'sd_transfer_store/Api/getSetting',
				transferStoreTypeList: 'sd_transfer_store/Api/typeList',
				transferStoreGetIndex: 'sd_transfer_store/Api/getIndex',
				transferStoreInfoList: 'sd_transfer_store/Api/InfoList',
				transferStoreFindInfoList: 'sd_transfer_store/Api/findInfoList',
				transferStoreDealList: 'sd_transfer_store/Api/dealList',//虚拟成交榜
				transferStoreLookInfo: 'sd_transfer_store/Api/lookInfo',
				
				transferStoreInfoDetail: 'sd_transfer_store/AppController/infoDetail',
				
				transferStoreList: 'sd_transfer_store/AppController/infoList',
				transferStorePush: 'sd_transfer_store/AppController/infoPush',
				
				transferStoreApply: 'sd_transfer_store/AppController/Apply',
				
				transferStoreOrderList: 'sd_transfer_store/AppController/orderList',//订单
				transferStoreOrderPayData: 'sd_transfer_store/AppController/orderPayData',//付款订单数据
				transferStoreGetPayParams: 'sd_transfer_store/AppController/getPayParams',//获取付款参数
				transferStoreOrderDo: 'sd_transfer_store/AppController/orderDo',//订单操作
				transferStoreOrderApply: 'sd_transfer_store/AppController/transferStoreOrderApply',//订单售后申请
				transferStorePayCallBack: 'sd_transfer_store/Payment/paymentSuccessCallback',//支付成功回调
				transferStoreMyPush: 'sd_transfer_store/AppController/myPush',//我的发布
			},
			
			{
				//商城模块
				getShopSetting: 'sd_shop/ShopApi/getShopSetting',//获取商城设置
				getDiyShopGoods: 'sd_shop/ShopApi/getDiyShopGoods',//Diy商品列表
				goodList: 'sd_shop/ShopApi/goodsList',//商品列表
				shopClassList: 'sd_shop/ShopApi/shopClassList',//分类列表
				shopClassGoodsList: 'sd_shop/ShopApi/shopClassGoodsList',//分类获取商品列表
				
				goodDetail: 'sd_shop/AppController/goodDetail',//商品详情
				goodsSkuInfo: 'sd_shop/AppController/goodsSkuInfo',//商品规格详情
				shopAddCart: 'sd_shop/AppController/shopAddCart',//商品添加购物车
				shopCartGoods: 'sd_shop/AppController/shopCartGoods',//获取用户购物车商品
				shopCartEdit: 'sd_shop/AppController/shopCartEdit', //编辑购物车 更新数量
				deleteShopCartGoods: 'sd_shop/AppController/deleteShopCartGoods', //删除购物车商品
				
				getShopOrderData: 'sd_shop/AppController/getShopOrderData',//获取创建商城订单数据
				shopCreateOrder: 'sd_shop/AppController/shopCreateOrder',//创建订单
				shopOrderPay: 'sd_shop/AppController/shopOrderPay',//订单二次付款
				shopOrderList: 'sd_shop/AppController/shopOrderList',//我的订单
				shopOrderChange: 'sd_shop/ShopController/orderChange',//订单操作
				shopOrderInfo: 'sd_shop/AppController/shopOrderInfo',//订单详情
				
			},
			
			{
				//报名模块
				getFormList: 'sd_enroll/Api/getFormList',//获取表单列表
				getFormData:'sd_enroll/Api/getFormData',//获取表单数据
				enrollSubmitForm: 'sd_enroll/app.appController/submitForm',//用户提交数据
				enrollGetParam: 'sd_enroll/app.appController/enrollGetParam',// 获取表单付款参数
				
				getMyEnrollList: 'sd_enroll/app.appController/getMyEnrollList',//我的报名列表
				checkManage:'sd_enroll/app.appController/checkManage',//判断是不是管理员
				getManageEnrollList:'sd_enroll/app.appController/getManageEnrollList',//管理员获取表单报名数据
				getEnrollInfo: 'sd_enroll/app.appController/getEnrollInfo',//获取报名详情
				changeEnrollStatus: 'sd_enroll/app.appController/changeEnrollStatus',
				enrollDelete: 'sd_enroll/app.appController/enrollDelete',
			},
			
			{
				//教育培训
				schoolClassList: 'sd_school/app.SchoolApi/schoolClassList', //获取课程分类
				courseList: 'sd_school/app.SchoolApi/courseList',//课程列表
				schoolBankList: 'sd_school/app.SchoolApi/schoolBankList',//题库列表
				
				writeStudentRecord:'sd_school/app.AppController/writeStudentRecord',//写入学习记录
				schoolExamList: 'sd_school/app.AppController/schoolExamList',//考试列表
				schoolBankInfo: 'sd_school/app.AppController/schoolBankInfo',//题库详情
				schoolExamInfo: 'sd_school/app.AppController/schoolExamInfo',//考试详情
				courseInfo: 'sd_school/app.AppController/courseInfo',//课程详情
				playEvent: 'sd_school/app.AppController/playEvent',//播放视频
				createSchoolBankOrder: 'sd_school/app.AppController/createSchoolBankOrder', //创建题库订单
				createSchoolCourseOrder: 'sd_school/app.AppController/createSchoolCourseOrder', //创建课程订单
				createCodeOrder: 'sd_school/app.AppController/createCodeOrder', //创建兑换码订单
				getSchoolTopics: 'sd_school/app.AppController/getSchoolTopics', // 获取答题题库
				schoolSubmitAnswer: 'sd_school/app.AppController/schoolSubmitAnswer', // 用户提交答案
				schoolCollectTopic:'sd_school/app.AppController/schoolCollectTopic', //用户收藏题目
				schoolSubmitExam: 'sd_school/app.AppController/schoolSubmitExam', //提交考试
				schoolExamResult: 'sd_school/app.AppController/schoolExamResult',//获取考试结果
				schoolExamTopics: 'sd_school/app.AppController/schoolExamTopics',//获取考试答案解析
				schoolExamRecord: 'sd_school/app.AppController/schoolExamRecord',//获取考试记录
				schoolMyCourse: 'sd_school/app.AppController/schoolMyCourse',//我的课程
				schoolMyBank: 'sd_school/app.AppController/schoolMyBank',//我的题库
				schoolMyError: 'sd_school/app.AppController/schoolMyError',//我的错题库
				schoolMyCollect: 'sd_school/app.AppController/schoolMyCollect',//我的收藏
				schoolClearCollect: 'sd_school/app.AppController/schoolClearCollect',//清除收藏
				schoolDeleteError: 'sd_school/app.AppController/schoolDeleteError',//删除错题
				schoolClearError: 'sd_school/app.AppController/schoolClearError',//清除错题
				schoolTextList: 'sd_school/app.AppController/schoolTextList',//文件列表
				schoolTextChapList: 'sd_school/app.AppController/schoolTextChapList',//文件列表
				schoolTextInfo: 'sd_school/app.AppController/schoolTextInfo',//文件详情
			},
			{
				//来访
				visitSubmit: 'sd_visit/AppController/visitSubmit', //提交访问申请
				visitRecord: 'sd_visit/AppController/visitRecord', //访问申请记录
				visitAction: 'sd_visit/AppController/visitAction', //操作
			},
			{
				//充电
				chargingSetting: 'sd_charging/ChargingApi/getSetting',//获取设置
				chargingDeviceInfo: 'sd_charging/AppController/deviceInfo',//获取设备详情 端口状态
				chargingCreateOrder: 'sd_charging/AppController/createOrder',// 充电下单
				chargingOrderCoupon: 'sd_charging/AppController/chargingOrderCoupon',// 充电下单
				chargingOrderList: 'sd_charging/AppController/orderList',// 充电订单
				chargingOrderChange: 'sd_charging/AppController/OrderChange',// 充电订单
				chargingOrderInfo: 'sd_charging/AppController/OrderInfo',// 订单详情
				chargingCardRech: 'sd_charging/AppController/CardRech',// 创建卡包充值
			},
			//插件
			{
				/************抽奖*************/
				raffleSetting: 'sd_plugins/raffle.AppController/getSetting',
				raffleGoods: 'sd_plugins/raffle.AppController/goodsList',
				raffleGetGood: 'sd_plugins/raffle.AppController/getGood',
				raffleOrder: 'sd_plugins/raffle.AppController/raffleOrder',
				raffleOrderChange: 'sd_plugins/raffle.AppController/raffleOrderChange',
				/****************************/
				/************积分签到*************/
				pluginsSignSetting: 'sd_plugins/sign.SignController/getSetting',
				pluginsSignAction: 'sd_plugins/sign.SignController/signAction',
				/************抽奖*************/
			}
			
			
		];
		
		return apilist;
	}
	
	
	
	
	
	
	
	
	
	
	
}
	
	