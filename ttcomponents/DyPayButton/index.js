// 可以调用到app.vue里的方法
const app = getApp();

Component({


	properties: {
		mode: Number,
		openId: {
			type: [String, Number],
		},
		orderStatus:{
			type: [String, Number],
		},
		orderData: {
			type: Object,
		},
		goodsId: {
			type: String,
			value: "",
		},
		promoterShareId: Number,
	},
	data: {

	},

	methods: {
		// 提交商品信息 这个函数一进页面就会调用的
		getGoodsInfo(event) {
			const that = this
			return new Promise(resolve => {
				// 定时器是为解决 优惠卷id获取不到问题
				setTimeout(()=>{
					tt.getSystemInfo({
						success: (resPlatform)=> {
							
							let pay = that.data.orderData.price * 100 // 价格单位是分
							let promoterShareId = that.data.promoterShareId // 分销员id
							let required = that.data.orderData.giveEntityIsNeedPhone // 是否强制获取手机号
							let CouponId = that.data.orderData.receiveCouponId // 优惠卷id
							// 用不到的值就不用传
							let data = {
								currentPrice: pay,
								GoodsLabel: [{
										type: 'NON_REFUNDABLE'
									}
								],
								minLimits: 1,
								maxLimits: 1,
								dateRule: '周一至周日可用',
								extra: {
									promoterId: promoterShareId,
									receiveCouponId: CouponId
								},
								validation: {
									phoneNumber: {
										required: required // 手机号是否必填
									}
								},
								marketingVersion: 1,
							}
							// im客服需要提前开通
							// 判断如果用户手机是ios就走客服支付， 把imId传上就自动跳转im客服页面了，安卓不要传这个id，否则可能会导致支付不了
							if(resPlatform.platform == 'ios'){
								data.imId = '3xxxxxxxx42'
							}	
							// 然后将商品信息传入 resolve 函数
							resolve(data);
						}
					});
				},600)
			})
		},
		onError(e) {
			const {
				errNo,
				errMsg
			} = e.detail;
			if (errNo === 21514) {
				tt.showToast({
					title: "失败", // 内容
					icon: "none", // 图标
				});
			} else if (errNo === 21513) {
				tt.showToast({
					title: "获取中", // 内容
					icon: "none", // 图标
				});
			}
		},
		
		userLogin(event) {
			const {
				goodsId,
				goodsType
			} = event.detail
			return new Promise((resolve, reject) => {
				tt.login({
					success(e) {
						// 用户登录成功并获取信息，则调用 resolve 函数，跳转至提单页
						resolve();
					},
					fail() {
						// 用户登录失败，则跳转提单页失败
						_this.showTost("登录失败")
					}
				});
			});
		},
		payError(event) {
			this.showTost(event.errMsg)
		},
		// 继续支付
		handleContinutePay(event) {
		    const { status, outOrderNo, result } = event.detail;
		    if (status === 'success') {
		        const { code } = result;
		        if (code === 0) {
		            // 继续支付成功
		            // 刷新页面
					this.triggerEvent("refreshData")
					tt.showToast({
						title: "支付成功",
					});
		        }
		    } else {
		        // 继续支付失败
				tt.showToast({
					title: "继续支付失败",
					icon: "none"
				});
		    }
		},
		// 正式支付
		newButtonPay(event) {
			const {
				status,
				orderId,
				outOrderNo,
				result
			} = event.detail;
			if (status === 'success') {
				const {
					code
				} = result;
				if (code === 0) {
					tt.showLoading({
						title: "订单确认中...",
					}); 
					this.getOrderIsHaveData(outOrderNo)
				} else {
					// 支付失败（超时、取消、关闭）
					this.showTost('支付失败（超时、取消、关闭）')
				}
			} else {
				const {
					errMsg
				} = result;
				this.showTost(errMsg)
			}
		},
		showTost(tit, timeMs) {
			let time = timeMs > 0 ? timeMs : 1500;
			tt.showToast({
				title: tit,
				icon: "none",
				duration: time,
			});
		},
		// 重新订单
		getOrderIsHaveData(orderId) {
			let data = {
				openid: this.data.openId,
				orderId,
			}
			tt.request({
				url: app.baseUrl() + "/order/order_success",
				method: 'POST',
				data,
				success: (res) => {
					this.setOrderIsHaveData(res.data.orderStatus, orderId)
				}
			})
		},
		setOrderIsHaveData(data, orderId) {
			if (data == 0) {
				setTimeout(() => {
					_this.getOrderIsHaveData(orderId)
				}, 1000);
			} else {
				tt.hideLoading();
				tt.navigateBack(-1);
				this.triggerEvent("refreshData")
			}
		},

		// 退款
		onApplyrefund(event) {
			console.log('onApplyrefund', event)

			const {
				orderId
			} = event.detail;
			const extra = {
				orderId
			}; // 开发者需要透传的参数，可自定义内容
			return new Promise(resolve => {
				console.log('发者需要透传的参数，可自定义内容', resolve)
				resolve(extra);
			});
		},
		onRefund(event) {
			console.log('onRefund', event)
			const {
				status,
				result
			} = event.detail;
			if (status === 'success') {
				const {
					refundId,
					outRefundNo
				} = result;
			} else {
				const {
					errMsg
				} = result;
				tt.showToast({
					title: '失败',
					icon: "none"
				});
			}
		},
		refundError(e) {
			console.log('refundError', e)
			if (e.detail.errNo == 21531) {
				tt.showToast({
					title: "不符合退款要求",
					icon: "none"
				});
			} else {
				tt.showToast({
					title: '失败',
					icon: "none"
				});
			}
		},
	},
});
