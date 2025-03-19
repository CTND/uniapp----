<template>
	<gui-page 
		ref="guipage"
		
		:customStyle="{
			backgroundColor:System.full_bg_color
		}"
	>
		<template v-slot:gBody>
			<view class="data-box" style="display: flex;padding-top: 10px;height: 100px;overflow: hidden">
				<view style="width: 80px;height: 80px;border-radius: 5px;overflow: hidden;min-width: 80px;">
					<image :src="infoData.img" mode="widthFix" style="width: 100%;"></image>
				</view>
				<view style="color: #303133;padding-left: 10px;">
					<view style="font-size: 16px;color: #303133">
						{{infoData.title}}
					</view>
					<view class="item-content" style="font-size: 14px;color: #909399;padding-top: 10px;">
						<template v-if="infoData.type == 'find'">
							{{infoData.province}} {{infoData.city}} {{infoData.area}}
						</template>
						<template v-if="infoData.type == 'buy'">
							{{infoData.province}} {{infoData.city}} {{infoData.area}}
						</template>
					</view>
				</view>
			</view>
			<!-- <view v-if="infoData.is_get == 0" style="font-size: 16px;color: #303133;padding: 5px 0;text-align: center">
				经系统评估此店铺预计成交时间<text :style="{color: setting.default_color}">{{infoData.day_len}}</text>天
			</view>
			<view v-if="infoData.is_get == 0" style="font-size: 16px;color: #303133;padding: 5px 0;text-align: center;display: flex;justify-content: center;">
				匹配看店倒计时：还剩
				<u-count-down
				ref="countDown"
				:time="20 * 1000" format="ss" 
				:customStyle="{color: setting.default_color}"
				@change="onChange"
				>
				</u-count-down>
				秒
			</view> -->
			
			<!-- <view style="padding: 0 10px;" v-if="infoData.is_get == 0">
				<view style="border-radius: 5px;overflow: hidden;background-color: #ffffff;">
					<view style="height: 20px;line-height: 20px;;color: #ffffff;text-align: center;font-size: 14px;background-color: #767ebe;">
					已筛选出<text :style="{color: setting.default_color}">{{infoData.mate_num}}</text>位客户
					</view>
					<view class="data-box" v-if="scrollItems1.length || scrollItems2.length" style="display: flex;">
						<view style="flex: 1;">
							<gui-scrollitems-y
							ref="guiscrollitemsy" 
							v-if="scrollItems1.length" 
							:items="scrollItems1" 
							:customStyle="{borderBottom:'1px solid #f0f0f0',lineHeight:'30px',overflow:'hidden',padding:'5px 0'}"
							imgStyle="height:30px,width:30px,border-radius:30px"
							textStyle="padding-left:10px,font-size:15px,color:#303133"
							></gui-scrollitems-y>
						</view>
						<view style="flex: 1;">
							<gui-scrollitems-y
							ref="guiscrollitemsy" 
							v-if="scrollItems2.length" 
							:items="scrollItems2" 
							:customStyle="{borderBottom:'1px solid #f0f0f0',lineHeight:'30px',overflow:'hidden',padding:'5px 0'}"
							imgStyle="height:30px,width:30px,border-radius:30px"
							textStyle="padding-left:10px,font-size:15px,color:#303133"
							></gui-scrollitems-y>
						</view>
					</view>
					<view style="height: 20px;line-height: 20px;;color: #ffffff;text-align: center;font-size: 14px;background-color: #767ebe;">
					支付后平台立即匹配所有合适的找店客户
					</view>
				</view>
			</view> -->
			
			<view style="padding: 10px 5px;">
				<u-notice-bar
				direction='row'
				text="尊敬的用户您好！平台的信息都是经过平台工作人员核实，可放心联系人工客服咨询" 
				:bgColor="'#f3f4f6'"
				fontSize="16px"
				color="#606266"
				></u-notice-bar>
			</view>
			<!-- <view class="data-box">
				<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;">
					店铺信息
				</view>
				<view class="data-item">
					<view class="item-label">
						商铺地址：
					</view>
					<view class="item-content">
						<template v-if="infoData.type == 'find'">
							{{infoData.province}} {{infoData.city}} {{infoData.area}}
						</template>
						<template v-if="infoData.type == 'buy'">
							{{infoData.province}} {{infoData.city}} {{infoData.area}} {{infoData.address}}
						</template>
					</view>
				</view>
				<view class="data-item">
					<view class="item-label">
						商铺行业：
					</view>
					<view class="item-content">
						{{infoData.class_name}}
					</view>
				</view>
				<view class="data-item">
					<view class="item-label">
						商铺描述：
					</view>
					<view class="item-content">
						{{infoData.store_desc}}
					</view>
				</view>
			</view> -->
			
			<view class="data-box" v-if="infoData.is_get == 1">
				<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;">
					联系信息
				</view>
				<view class="data-item">
					<view class="item-label">
						联系人：
					</view>
					<view class="item-content">
						{{infoData.realname}}
					</view>
				</view>
				<view class="data-item">
					<view class="item-label">
						联系电话：
					</view>
					<view class="item-content" style="position: relative;">
						{{infoData.is_get == 0 ? infoData.phone_on : infoData.mobile}}
					</view>
				</view>
			</view>
			
			<view class="data-box">
				<view class="data-info" style="font-size: 16px;color: #767ebe;">
					推广邀约服务内容
				</view>
				<view class="data-item">
					<view class="item-icon-box" :style="{color:System.big_but_color}">
						曝
					</view>
					<view class="item-content-pu">
						六大平台全曝光推广
					</view>
				</view>
				
				<view class="data-item">
					<view class="item-icon-box" :style="{color:System.big_but_color}">
						推
					</view>
					<view class="item-content-pu">
						邀约咨询中的意向客户
					</view>
				</view>
				
				
				<view class="data-item">
					<view class="item-icon-box" :style="{color:System.big_but_color}">
						展
					</view>
					<view class="item-content-pu">
						平台首页展示30天
					</view>
				</view>
				
				<view class="data-item">
					<view class="item-icon-box" :style="{color:System.big_but_color}">
						助
					</view>
					<view class="item-content-pu">
						协助跟进找店客户
					</view>
				</view>
				
				<view class="data-item">
					<view class="item-icon-box" :style="{color:System.big_but_color}">
						询
					</view>
					<view class="item-content-pu">
						客服全程回复咨询客户
					</view>
				</view>
				
				<view class="data-item">
					<view class="item-icon-box" :style="{color:System.big_but_color}">
						全
					</view>
					<view class="item-content-pu">
						全程服务直至转成功为止
					</view>
				</view>
			</view>
			
			<!-- <view class="data-box" v-if="userList.length">
				<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;padding-bottom: 15px;">
					精准匹配
				</view>
				<view class="data-item" v-for="(item, index) in userList" :key="index" >
					<view v-if="item.avatar" class="item-icon-box" style="background-color: none;border-radius: 100%;overflow: hidden">
						<image
						:src="item.avatar" 
						mode="widthFix"
						style="width: 100%;"
						></image>
					</view>
					<view class="item-content-pu" style="font-size: 14px;">
						{{item.text}}
						<text style="padding-left: 15px;color: #909399">{{item.do_text}}</text>
					</view>
				</view>
			</view> -->
			
			
			<!-- <view v-if="setting.pay_desc" class="push-desc-box">
				<view style="font-size: 16px;color: #303133;font-weight: bold;padding: 10px;">
					支付说明：
				</view>
				<view class="desc">
					<text>{{setting.pay_desc}}</text>
				</view>
			</view> -->
			<view v-if="System.cheat==2 && infoData.is_get == 0" style="padding: 10px;font-size: 16px;color: #131;">
				实际支付金额： ￥{{getPayMoney()}}元
			</view>
			<view style="height: 100px;"></view>
			<view 
			v-if="System.cheat==2 && infoData.is_get == 0 && infoData.apply == 1"
			style="position: fixed;bottom: 0;width: 100%;padding: 10px 0;background-color: #ffffff;">
				<u-button type="primary" text=""
				throttleTime="1000"
				size="large"
				:customStyle="$util.butStyle('primary',{margin:'10px auto', backgroundColor:System.big_but_color,width:'90%',height:'100px',lineHeight:'100px'})"
				@click="createOrder"
				>
					<text style="font-size: 32px;">下一步立即推广邀约</text>
				</u-button>
			</view>
			<view
			v-else-if="showPay == 1"
			style="position: fixed;bottom: 0;width: 100%;padding: 10px 0;background-color: #ffffff;">
				<u-button type="primary" 
				throttleTime="1000"
				size="large"
				:customStyle="$util.butStyle('primary',{margin:'10px auto', backgroundColor:System.big_but_color,width:'90%',height:'60px',lineHeight:'60px'})"
				@click="createOrder"
				>
					<text style="font-size: 32px;">下一步立即推广邀约</text>
				</u-button>
			</view>
			<!--加载中-->
			 
			 
			<!-- 全屏加载 -->
			
		</template>
	</gui-page>
		
</template>

<script>
	export default{
		data() {
			return {
				order_id:0,
				id:0,
				flag:false,//支付标识
				id:0,
				infoData:{
					files_list:[],
					mate_num:0,
					is_get: 0
				},
				mate_num:0, //匹配人数
				scrollItems1 : [],
				scrollItems2 : [],
				userList:[],
				
				setting:{
					alter_text: '支付后才可查看联系方式哦！'
				},
				orderData:{
					id:0,
					pay_status:0
				},
				day:Math.round(Math.random()*10+10),
				timeData: {},
				notice_list:[],
				call : '',
				
				showPay:0
			}
		},
		
		onLoad: function(options) {
			if(options.showPay == 1){
				this.showPay = 1;
			}
			if(options.id){
				this.id = options.id;
			}
			this.getSetting();
		},
		onShow() {
			this.getInfo()
			this.getDealList();
		},
		methods:{
			getInfo(){
				this.$request('transferStoreInfoDetail', {id:this.id},{
					showLoading: false,
				}).then((res)=>{
					console.log('请求数据', res)
					if(res.data.data.infoData){
						this.infoData = res.data.data.infoData;
						if(res.data.data.infoData.is_get == 1){
							uni.setNavigationBarTitle({
								title: '详细信息'
							});
						}
					}
					this.notice_list = res.data.data.notice_list
				})
			},
			//开始
			start() {
				this.$refs.countDown.start();
			},
			// 暂停
			pause() {
				this.$refs.countDown.pause();
			},
			// 重置
			reset() {
				this.$refs.countDown.reset();
			},
			onChange(e) {
				this.timeData = JSON.parse(JSON.stringify(e))
				if(e.seconds == 0){
					setTimeout(()=>{
						this.$refs.countDown.reset();
					}, 1500)
				}
			},
			//获取付款参数
			getPayMoney(){
				var price = 0;
				price = this.setting.get_money;
				return price;
			},
			createOrder(){
				const t = this;
				// #ifdef MP-WEIXIN
				if(this.setting.template_ids != ''){
					uni.requestSubscribeMessage({
						tmplIds: [t.setting.template_ids],
						success (res) {
							t.submitForm();
						},
						fail(error){
							console.log('error', error)
						}
					})
				}else{
					t.submitForm();
				}
				// #endif
				// #ifndef MP-WEIXIN
				t.submitForm();
				// #endif
			},
			submitForm(){
				this.$request('transferStoreOrderPayData', {
					order_id:this.order_id,
					id:this.infoData.id
				},{
					showLoading: true,
				}).then((res)=>{
					console.log('获取支付订单详情1', res)
					if(res.data.data.order_id){
						this.order_id = res.data.data.order_id;
					}
					if(res.data.data.orderData){
						if(res.data.data.orderData.pay_status && res.data.data.orderData.pay_status == 1){
							this.msg('订单已支付');
							setTimeout(()=>{
								this.goBack();
							}, 1000)
						}else{
							this.orderData = res.data.data.orderData;
							this.submit()
						}
					}else{
						this.msg('订单不存在');
						setTimeout(()=>{
							this.goBack();
						}, 1000)
					}
				})
			},
			submit(){
				if(this.flag){
					return;
				}
				this.flag = true;
				let post_data = {
					order_id: this.order_id
				};
				let shareid = uni.getStorageSync('shareid');
				console.log('shareid', shareid)
				if(shareid){
					post_data.shareid = shareid;
				}
				this.$util.throttle(async ()=>{
					this.$request('transferStoreGetPayParams', post_data,{
						showLoading: true
					}).then((res)=>{
						if(res.data.code == 200){
							if(res.data.data.payData){
								var payData = res.data.data.payData;
								this.orderPay(payData);
							}else{
								this.msg('支付参数错误');
							}
						}else{
							this.msg(res.data.msg);
						}
						this.flag = false;
					})
				})
			},
			//付款
			orderPay(payData = {}){
				const t = this;
				if(Object.keys(payData).length){
					// #ifdef MP-WEIXIN
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: payData.timeStamp,
						nonceStr: payData.nonceStr,
						package: payData.package,
						signType: payData.signType,
						paySign: payData.paySign,
						success: res => {
							t.msg('支付成功');
							t.payCallBack();
							setTimeout(() => {
								uni.redirectTo({
								    url: '/pages_transfer_store/orderList'
								});
							}, 1000);
						},
						fail: res => {
							t.flag = false;
							if (res.errMsg == 'requestPayment:fail cancel') {
								t.msg('您已取消支付');
							} else {
								uni.showModal({ content: '支付失败,失败原因: ' + res.errMsg, showCancel: false });
							}
							console.log('失败', res)
						}
					});
					// #endif
					
					// #ifdef APP-PLUS
					uni.requestPayment({
					    provider: "wxpay", 
					    orderInfo: {
							appid: payData.appid,
					        noncestr: payData.noncestr,
					        package: payData.package,        // 固定值
					        partnerid: payData.partnerid,      // 微信支付商户号
					        prepayid: payData.prepayid, // 统一下单订单号 
					        timestamp: payData.timestamp,        // 时间戳（单位：秒）
					        sign: payData.sign // 签名，这里用的 MD5/RSA 签名
					    },
					    success(res) {
							//console.log('cuccess', res)
							t.msg('支付成功');
							t.payCallBack();
							setTimeout(() => {
								uni.redirectTo({
								    url: '/pages_transfer_store/orderList'
								});
							}, 1000);
						},
					    fail(e) {
							//console.log('err', e)
							t.flag = false;
							t.msg('支付错误');
						},
						complete() {
							t.flag = false;
						}
					})
					// #endif
				}else{
					this.msg('支付参数不能为空');
				}
			},
			//调用模块支付成功回调
			payCallBack(){
				this.$request('transferStorePayCallBack', {
					id: this.id
				},{
					showLoading: false,
				}).then((res)=>{})
			},
			//获取设置
			getSetting(){
				this.$request('transferStoreGetSetting', {},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.setting){
						this.setting = res.data.data.setting;
					}
				})
			},
			getDealList(){
				this.$request('transferStoreDealList', {id:this.id},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.list1){
						this.scrollItems1 = res.data.data.list1;
					}
					if(res.data.data.list2){
						this.scrollItems2 = res.data.data.list2;
					}
					if(res.data.data.userList){
						this.userList = res.data.data.userList;
					}
				})
			},
			
			//模态弹窗回调
			popupCallback(v, options){
				const t = this;
				this.$refs['guipage'].modalPopupClose();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.push-desc-box{
		padding-bottom: 5px;
		.desc{
			background-color: #ffffff;
			padding: 15px;
			font-size: 14px;
			line-height: 1.75;
			color: #606266;
		}
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
	.data-box{
		padding: 15px;
		padding-top: 0px;
		background-color: #ffffff;
		margin-bottom: 10px;
		.data-info{
			font-size: 16px;
			color: #606266;
			padding-top: 15px;
		}
		.data-item{
			display: flex;
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
</style>