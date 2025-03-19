<template>
	<gui-page 
		ref="guipage"
		
		
		:customFooter="true"
		:showFooterBar="false"
		:customStyle="{
			backgroundColor:System.full_bg_color,
			padding:'5px 10px',
			paddingBottom:'30px'
		}"
	>
		
		<template v-slot:gBody>
			
			<view class="title-text">基础信息</view>
			<view class="data-box" v-if="orderData.id">
				<view class="item-box">
					<view class="cover-box">
						<up-image :show-loading="false"
						:src="orderData.cover_img" 
						width="120px" height="90px" radius="2"></up-image>
					</view>
					<view class="item-center-box">
						<view class="info-box">
							<view class="activity-title">{{orderData.title}}</view>
							<view class="desc">{{orderData.area_data.name + ' | '+orderData.area_data.street_name}}</view>
							<view class="tag-box">
								<view class="tag-flex">
									<view class="tag" v-for="(tag, i) in orderData.tag_list" :key="i">
										{{tag.name}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="data-item">
					<view class="label">店铺面积：</view>
					<view class="data-center">
						<view class="data-text">
							{{orderData.extent}}
							<text class="hotTxt">
								m<text class="hot-txt">2</text>
							</text>
						</view>
						<view class="icon-box">
						</view>
					</view>
				</view>
				<view class="data-item" v-if="orderData.nature == 1">
					<view class="label">店铺租金：</view>
					<view class="data-center">
						<view class="data-text">{{orderData.rent_money}}/月</view>
						<view class="icon-box">
						</view>
					</view>
				</view>
				<view class="data-item">
					<view class="label">{{orderData.nature == 1 ? '转\&nbsp;\&nbsp;让\&nbsp;\&nbsp;费' : '出售价格'}}：</view>
					<view class="data-center">
						<view class="data-text" v-if="orderData.show_mianyi==0">{{orderData.transfer_fee}}万</view>
						<view class="icon-box">
							<view v-if="orderData.show_mianyi==1" style="color: #fc3565;font-size: 15px;font-weight: bold;padding-right: 10px;">面议</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="title-text" v-if="ai_step.length">AI智能计算</view>
			<view class="data-box" v-if="ai_step.length">
				<view style="flex: 1;display: flex;">
					<view class="micon" style="width: 28px;height: 28px;padding-top: 1px;padding-left:2px ">
						<view :class="[ai_status==1?'resize-box':'ai-ico-box']">
							<image :src="$util.img('images/system/ai1.png')" style="width: 100%;height: 100%"></image>
						</view>
					</view>
					<view style="font-size: 16px;margin-left: 2px;line-height: 24px;">{{ai_text}}</view>
				</view>
				<view class="steep-box">
					<view class="step-item" v-for="(step, sindex) in ai_step" :key="sindex">
						<view class="step-text">{{step.title}}</view>
						<view class="step-icon" @click="showErr(step)">
							<image :src="step.status==1?$util.img('images/system/success3.png'):$util.img('images/system/error.png')" mode="widthFix"></image>
						</view>
					</view>
				</view>
			</view>
			
			<view class="title-text">支付方式</view>
			<view class="rech-item">
				<view class="item">
					<view style="flex: 1;display: flex;">
						<view class="micon icon-weixinzhifu" style="color: #05bf45;font-size: 24px;"></view>
						<view style="font-size: 15px;margin-left: 2px;line-height: 24px;">微信支付</view>
					</view>
					<view>
						<view class="micon icon-xuanzhong2" style="color: #fc3565;font-size: 24px;"></view>
					</view>
				</view>
			</view>
			<!--加载中-->
			 
			<!-- 全屏加载 -->
			
			
			
		</template>
		<template v-slot:gFooter v-if="System.cheat==2">
			<view class="footer-fixed-box">
				<view class="text-overflow" style="flex: 1;padding-top: 5px;height: 30px;line-height: 30px">
					<text style="color: #fc3565;font-size: 14px;">￥</text>
					<text style="color: #fc3565;font-size: 20px;font-weight: bold;">{{orderData.pay_price || 0}}</text>
				</view>
				<view>
					<u-button
					type="primary" 
					text="支付发布"
					shape="circle" 
					throttleTime="1000"
					size="large"
					:disabled="ai_status==1"
					:customStyle="{backgroundColor:System.big_but_color,color:'#ffffff',width:'110px',border:'none',height:'40px',lineHeight:'40px'}"
					@click="submitForm()"
					></u-button>
				</view>
			</view>
		</template>
		
	</gui-page>
</template>

<script>
	import payParam from '@/common/js/payParam.js'; 
	export default{
		data() {
			return {
				id: 0, //项目ID
				ai_text:'AI正在计算数据中...',
				//订单数据
				orderData:{
					id:0,
				},
				ai_status:1,
				ai_step:[]
			}
		},
		onLoad: function(options) {
			if(options.id){
				this.id = options.id;
				this.getOrderData();
			}
		},
		onShow() {
			
		},
		methods:{
			//显示错误信息
			showErr(e){
				if(e.error_msg){
					this.showModalEvent({
						title:'提示',//提示标题
						content: e.error_msg,
						confirmText: '我知道了',
						path:''
					},{})
				}
			},
			//获取订单详情
			getOrderData(){
				this.$request('transShopOrderInfo', {id: this.id},{
					showLoading: false,
				}).then((res)=>{
					console.log('获取订单数据', res)
					if(res.data.data.orderData){
						this.orderData = res.data.data.orderData;
						if(res.data.data.orderData.ai_step.length == 0){
							this.getAiStep();
						}else{
							this.ai_step = res.data.data.orderData.ai_step;
						}
					}
					if(res.data.data.ai_text){
						this.ai_text = res.data.data.ai_text;
					}
					if(res.data.data.ai_status){
						this.ai_status = res.data.data.ai_status;
					}
				})
			},
			getAiStep(){
				this.$request('transShopAiSteep', {id: this.id},{
					showLoading: false,
				}).then((res)=>{
					console.log('获取订单数据transShopAiSteep', res)
					if(res.data.data.step){
						this.ai_step.push(res.data.data.step);
					}
					if(res.data.data.count_step > 0 && res.data.data.count_step > this.ai_step.length){
						setTimeout(()=>{
							this.getAiStep();
						}, 3000)
					}
					if(res.data.data.ai_text){
						this.ai_text = res.data.data.ai_text;
					}
					if(res.data.data.ai_status){
						this.ai_status = res.data.data.ai_status;
					}
				})
			},
			//下单
			submitForm(){
				const t = this;
				this.$request('transShopOrderPay', {id: this.id},{
					showLoading: false,
				}).then((res)=>{
					console.log('订单付款', res)
					if(res.data.code == 200){
						if(!res.data.data.payData){ 
							this.msg('付款参数错误'); 
							return;
						}else{
							payParam.pay(res.data.data.payData, (result)=>{
								if(result == 1){
									if(res.data.data.modal_data){
										this.showModalPopup(modal_data);
									}else{
										//t.navTo('', {login: true})
										t.redirectTo('/pages_transfershop/order/list',{}, 'redirectTo');
									}
								}
							});
						}
					}
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes resize {
		from {
			width: 20px;
			height: 20px;
		}
		to {
			width: 22px;
			height: 22px;
		}
	}
	 
	/* 应用动画到class为box的元素 */
	.resize-box {
		animation: resize 1s infinite; /* 无限循环动画 */
	}
	.ai-ico-box{
		width: 20px;
		height: 20px;
	}
	.popup-img{
		width: 100px;
		height: 100px;
		overflow: hidden;
		margin: auto;
		margin-bottom: 20px;
		image{
			width: 100%;
			height: 100%;
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
	.steep-box{
		padding: 10px;
		.step-item{
			display: flex;
			padding: 10px 0;
			.step-text{
				font-size: 15px;
				color: #606266;
				flex: 1;
			}
			.step-icon{
				width: 20px;
				height: 20px;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.model-box{
		.model-icon{
			width: 80px;
			height: 80px;
			margin: 15px auto;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.model-content{
			font-size: 15px;
			color: #303133;
			line-height: 1.5;
		}
	}
	
	.location-box{
		background-color: #ffffff;
		border-radius: 8px;
		padding: 5px;
		display: flex;
		margin-bottom: 5px;
		height: 62px;
		overflow: hidden;
		.data-box{
			flex: 1;
			padding: 5px;
			min-width: 0;
			
			.add-text{
				font-size: 16px;
				color: #606266;
				height: 20px;
				line-height: 20px;
				white-space:nowrap;
				overflow: hidden;
				text-overflow:ellipsis;
			}
			.address-box{
				font-size: 14px;
				color: #909399;
				line-height: 18px;
				padding-top: 3px;
				white-space:nowrap;
				overflow: hidden;
				text-overflow:ellipsis;
			}
		}
		.location-tip{
			flex: 1;
			font-size: 14px;
			color: #909399;
			line-height: 50px;
			padding-left: 5px;
		}
		.icon-box{
			padding: 2px;
			text-align: center;
			min-width: 10px;
		}
	}
	.title-text{
		font-size: 15px;
		color: #909399;
		margin-bottom: 5px;
		padding: 2px 5px;
	}
	.rech-item{
		background-color: #ffffff;
		padding:5px 10px;
		border-radius:10px;
		overflow: hidden;
		margin-bottom: 10px;
		.item{
			display: flex;
			padding: 12px 0;
			overflow: hidden;
		}
	}
	
	//代金券标签
	.coupon-tag{
		height: 18px;
		line-height: 18px;
		background-color: #fc3565;
		border-radius: 5px;
		font-size: 10px;
		color: #ffffff;
		padding: 0 5px;
	}
	.data-box{
		padding: 10px;
		border-radius: 8px;
		background-color: #ffffff;
		margin-bottom: 5px;
		box-shadow: 0 0 5px #e7f3ff;
		.item-box{
			display: flex;
			flex-direction: row;
			border-bottom: 1px solid #f0f0f0;
			padding-bottom: 5px;
			margin-bottom: 5px;
			
			.cover-box{
				
			}
			.item-center-box{
				display: flex;
				flex: 1;
				padding-left: 10px;
				overflow: hidden;
				.info-box{
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					min-width: 0;
					.activity-title{
						font-size: 17px;
						color: #303133;
						padding-bottom: 5px;
						white-space:nowrap;
						overflow: hidden;
						text-overflow:ellipsis;
						min-width: 0; 
					}
					.desc{
						font-size: 14px;
						color: #909399;
					}
					.activity-item{
						display: flex;
						flex-direction: row;
						line-height: 25px;
						.item-label{
							font-size: 14px;
							color: #909399;
						}
					}
					.tag-box{
						flex: 1;
						padding-top: 5px;
						.tag-flex{
							display: flex;
							flex-wrap: wrap;
							.tag{
								padding: 3px 5px;
								border-radius: 2px;
								font-size: 13px;
								color: #606266;
								background-color: #f0f0f0;
								margin-right: 5px;
								margin-bottom: 5px;
							}
						}
					}
				}
			}
		}
		.data-item{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 8px 15px;
			.label{
				font-size: 14px;
				color: #606266;
			}
			.data-center{
				flex: 1;
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				font-size: 15px;
				color: #606266;
				text-align: right;
				.data-text{
					font-size: 14px;
					color: #606266;
					overflow: hidden;
				}
				.icon-box{
					padding-left: 4px;
					padding-top: 1px;
				}
			}
		}
	}
	
	.popup-box{
		height: 60vh;
		.popup-title-box{
			border-bottom: 1px solid #e7e6e4;
			height: 50px;
			line-height: 50px;
			text-align: center;
			font-size: 17px;
			color: #303133;
			font-weight: bold;
		}
		.popup-but-title{
			padding: 16px 15px 15px;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #e7e6e4;
			position: relative;
			.but-box{
				font-size: 17px;
			}
			.cancel{
				color: #909399;
				position: absolute;
				left: 15px;
				top: 15px;
			}
			.true{
				color: #287eef;
			}
		}
		.gui-coupons{padding: 5px 15px;background-color: #f0f0f0;}
		.gui-coupons-left{width:500rpx; height:150rpx; padding-right:10rpx;position:relative;border-top-left-radius: 10rpx;border-bottom-left-radius: 10rpx}
		.gui-coupons-left-number{width:200rpx; border-right:1px dashed #D2D2D2;}
		.gui-coupons-left-body{flex: 1;padding-left: 10px;}
		.gui-coupons-status{color:#FFFFFF; padding:0 10px; height:36rpx; line-height:36rpx; font-size:20rpx; position:absolute; z-index:1; right:6px; top:8px; border-radius:36rpx;}
		.gui-coupons-right{width:150rpx; height:150rpx; font-size:32rpx;border-top-right-radius: 10rpx;border-bottom-right-radius: 10rpx}
		.gui-coupons-sawtooth{width:8px; height:150rpx; overflow:hidden; position:relative;}
		.gui-coupons-sawtooth-circular{width:10px; margin:3px 5px; height:10px; border-radius:10px;}
	}
	
	.footer-fixed-box{
		display: flex;
		background-color: #ffffff;
		padding: 10px 15px;
		padding-bottom: 20px;
		width: 100%;
	}
	
	//时间选择器
	::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  color: transparent;
	}
	.date-popup {
		height: 83vh;
		background: #F8F8F8;
		.date-header{
			white-space: nowrap;
			overflow: hidden;
			padding: 10px 20rpx;
			background-color: #FFFFFF;
			height: 130rpx;
			.date-week-box{
				display: inline-block;
				margin: 0 20upx;
				.date-week-text{
					text-align: center;
					color: #606266;
					font-size: 28upx;
					line-height: 40upx;
					box-sizing: border-box;
				}
				.small{
					font-size: 26upx;
				}
			}
			.active{
				border-bottom: 3px solid #fc3565;
			}
		}
		.head-wrap {
			background-color: #FFFFFF;
			font-size: 14px;
			line-height: 100rpx;
			height: 100rpx;
			display: block;
			text-align: center;
			.iconfont {
				position: absolute;
				float: right;
				right: 22px;
				font-size: 18px;
			}
		}
		.popup-body {
			height: 55vh;
			.time-boxs{
				display: flex;
				flex-wrap: wrap;
				padding: 20upx 0;
				.time-item{
					background-color: #FFFFFF;
					padding: 8px 10upx;
					text-align: center;
					border-radius: 4px;
					width: calc((100% - 50rpx) / 4.2);
					margin: 10rpx;
					font-size: 32rpx;
					color: #606266;
				}
				.time-active{
					background-color: #fc3565;
					color: #FFFFFF;
				}
			}
		}
		.popup-footer {
			height: 120rpx;
			padding-top: 20upx;
			.confirm-btn {
				height: 80rpx;
				line-height: 80rpx;
				color: #fff;
				text-align: center;
				margin: 20rpx 40rpx 40rpx;
				border-radius: 40rpx;
				font-size: 16px;
			}
		
			&.bottom-safe-area {
				padding-bottom: constant(safe-area-inset-bottom);
				padding-bottom: env(safe-area-inset-bottom);
			}
		}
	}
</style>