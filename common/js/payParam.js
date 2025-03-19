
export default {
	//支付接口
	pay(params = {}, callback = null) {
		//-1失败 1成功
		if(Object.keys(params).length == 0){
			uni.showToast({title: '参数错误',duration: 2000,icon:'none'});
			typeof callback == 'function' && callback(-1);
			return;
		}
		var payData = params;
		// #ifdef MP-WEIXIN
		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: payData.timeStamp,
			nonceStr: payData.nonceStr,
			package: payData.package,
			signType: payData.signType,
			paySign: payData.paySign,
			success: res => {
				typeof callback == 'function' && callback(1);
			},
			fail: res => {
				typeof callback == 'function' && callback(-1);
				if (res.errMsg == 'requestPayment:fail cancel') {
					uni.showToast({title: '您已取消支付',duration: 2000,icon:'none'});
				} else {
					uni.showModal({ title:'错误', content: '支付失败,失败原因: ' + res.errMsg, showCancel: false });
				}
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
				typeof callback == 'function' && callback(1);
			},
		    fail(res) {
				console.log('pay-err', res)
				typeof callback == 'function' && callback(-1);
				if (res.errMsg == 'requestPayment:fail cancel') {
					uni.showToast({title: '您已取消支付',duration: 2000,icon:'none'});
				} else {
					uni.showModal({ title:'错误', content: '支付失败,失败原因: ' + res.errMsg, showCancel: false });
				}
			}
		})
		// #endif
		
		//toutiao
		// #ifdef MP-TOUTIAO
		if(payData.order_id){
			tt.pay({
				orderInfo: payData,
				service: 5,
				success(res) {
					console.log('支付结束', res)
					if (res.code == 0) {
						typeof callback == 'function' && callback(1);
					}
				},
				fail(err) {
					typeof callback == 'function' && callback(-1);
					console.log('err', err)
				},
			});
		}
		// #endif
	}
}
