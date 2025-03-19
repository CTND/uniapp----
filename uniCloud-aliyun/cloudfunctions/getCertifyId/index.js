'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const frvManager = uniCloud.getFacialRecognitionVerifyManager({
		requestId: context.requestId,
		appId: "__UNI__B9D8DDC"
	})
	const result = await frvManager.getCertifyId({
	    realName: '闪电科技',
	    idCard: '',
	    metaInfo: event.metaInfo,
		needPicture: true
	})
	
	return result
};

		/*
		const metaInfo = uni.getFacialRecognitionMetaInfo();
		uniCloud.callFunction({
			name:'getCertifyId',
			data: { metaInfo: metaInfo }
		}).then((res)=>{
			console.log('云函数获取', res)
			if(res.result.errCode == 0 && res.result.certifyId){
				let certifyId = res.result.certifyId;
				uni.startFacialRecognitionVerify({
				    certifyId:certifyId,
				    progressBarColor: "#CC0000", //刷脸圈的颜色
				    screenOrientation: "port", //认证界面UI朝向
				    success:(e)=>{
				        console.log('success', JSON.stringify(e))
				    },
				    fail:(e)=>{
				        console.log('fail', JSON.stringify(e))
				    },
				    complete:(e)=>{
				        console.log(JSON.stringify(e))
				    }
				})
			}
		})
		*/