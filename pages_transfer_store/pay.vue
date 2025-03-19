<template>
	<gui-page ref="guipage"
		>
		<template v-slot:gHeader>
			
		</template>
		<template v-slot:gBody>
			<view style="padding: 10px;" v-if="orderData.id>0">
				<view class="block-box">
					<view class="block-item">
						<view class="cover-box">
							<image :src="orderData.img ? orderData.img : setting.default_img" mode="widthFix"></image>
						</view>
						<view class="item-content" style="min-width: 0;">
							<view class="item-data-box" style="font-size: 16px;font-weight: bold">
								{{orderData.title}}
							</view>
							<view style="font-size:14px;color: #606266;padding-top:5px;">
								{{orderData.address}}
							</view>
						</view>
					</view>
					
					<view class="data-box">
						<view class="data-info" style="font-size: 15px;line-height: 1.5;">
							面&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;积：
							<text style="padding-left: 20px;">{{orderData.extent}}</text>
							<text class="hotTxt">
								m<text class="hot-txt">2</text>
							</text>
						</view>
						<view v-if="orderData.type == 'buy'" class="data-info" style="font-size: 15px;">
							租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金：
							<text style="color: #ff5123;padding-left: 20px;">￥{{orderData.rent}}/{{orderData.unit}}</text>
						</view>
						<view v-if="orderData.type == 'buy'" class="data-info" style="font-size: 15px;">
							转&nbsp;&nbsp;让&nbsp;&nbsp;费：
							<text style="color: #ff5123;padding-left: 20px;">￥{{orderData.money}}</text>
						</view>
					</view>
					<view class="block-item">
						<view class="item-lable">提交时间</view>
						<view class="item-content">
							<view class="item-data-box">{{orderData.create_time}}</view>
						</view>
					</view>
					<view class="block-item" style="border-bottom: none;">
						<view class="item-lable">支付金额</view>
						<view class="item-content">
							<view class="item-data-box" style="color: #ff5123;font-size: 18px;">
								￥{{getPayMoney()}}
							</view>
						</view>
					</view>
				</view>
				
				<view class="pay-item">
					<view class="micon icon-weixinzhifu"></view>
					<view class="pay-title">微信支付</view>
					<view class="micon icon-xuanzhong1"></view>
				</view>
				
				<view v-if="setting.pay_desc" class="push-desc-box">
					<view style="font-size: 16px;color: #303133;font-weight: bold;padding: 10px;">
						支付说明：
					</view>
					<view class="desc">
						<text>{{setting.pay_desc}}</text>
					</view>
				</view>
				
				<u-button v-if="orderData.pay_status == 0" 
				type="primary" :text="'微信支付'+'（' + '￥'+getPayMoney()+'）'"
				throttleTime="1000"
				size="large"
				:customStyle="$util.butStyle('primary',{marginTop:'30px', backgroundColor:System.big_but_color,width:'90%'})"
				@click="submit()"
				></u-button>
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
				setting:{
					default_img:''
				},
				orderData:{
					id:0,
					pay_status:0
				}
			}
		},
		onLoad: function(options) {
			this.getSetting();
			if(options.order_id){
				this.order_id = options.order_id;
			}else if(options.id){
				this.id = options.id;
			}
			if(options.order_id || options.id){
				this.$request('transferStoreOrderPayData', {
					order_id:options.order_id,
					id:this.id
				},{
					showLoading: false,
				}).then((res)=>{
					console.log('获取支付订单详情', res)
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
						}
					}else{
						this.msg('订单不存在');
						setTimeout(()=>{
							this.goBack();
						}, 1000)
					}
				})
			}
		},
		onShow() {
			this.$store.dispatch('getUserInfo', (res)=>{
				console.log('获取的用户信息', res)
				if(Object.keys(res).length){
					this.userInfo = res;
				}
			})
		},
		methods:{
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
			//获取付款参数
			getPayMoney(){
				var price = 0;
				if(this.userInfo.userid == this.orderData.userid){
					price = this.setting.money;
				}else{
					price = this.setting.get_money;
				}
				return price;
			},
			submit(){
				if(this.flag){
					return;
				}
				this.flag = true;
				this.$util.throttle(async ()=>{
					this.$request('transferStoreGetPayParams', {
						order_id: this.order_id
					},{
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
	.pay-item{
		background-color: #ffffff;
		display: flex;
		padding: 20upx;
		border-radius: 10upx;
		margin-bottom: 20upx;
		.micon{
			font-size: 48rpx;
			line-height: 30px;
			color: #18b566;
		}
		.pay-title{
			font-size: 30upx;
			color:#303133;
			font-weight: bold;
			flex: 1;
			line-height: 60upx;
			padding-left: 10px;
		}
	}
	.block-box{
		padding: 0 10px;
		background-color: #ffffff;
		margin-bottom: 8px;
		border-radius: 5px;
		.block-item{
			display: flex;
			padding: 15px 10px;
			border-bottom: 1px solid #f0f0f0;
			.item-lable{
				width: 90px;
				font-size: 16px;
				color: #909399;
				text-align: justify;
			}
			.cover-box{
				width: 70px;
				height: 70px;
				border-radius: 5px;
				overflow: hidden;
				image{
					width: 100%;
				}
			}
			.item-content{
				flex: 1;
				padding-left: 10px;
				.item-data-box{
					font-size: 15px;
					color: #303133;
				}
			}
		}
		.data-box{
			padding: 10px;
			padding-top: 0px;
			background-color: #ffffff;
			border-bottom: 1px solid #f0f0f0;
			.data-info{
				font-size: 16px;
				color: #606266;
				padding-top: 12px;
			}
		}
	}
</style>