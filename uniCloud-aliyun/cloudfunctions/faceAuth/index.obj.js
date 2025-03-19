// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器
		this.frvManager = uniCloud.getFacialRecognitionVerifyManager({
			requestId: this.getUniCloudRequestId(),
			appId: "__UNI__B9D8DDC"
		})
	},
	async getCertifyId(event) {
		try{
			const result = await this.frvManager.getCertifyId({
				realName: event.realName,
				idCard: event.idCard,
				metaInfo: event.metaInfo,
				needPicture: true
			})
			return result
		}catch(e){
			if(e.errCode !== 0) {
				throw new Error('缺少参数或参数不正确')
			}
			throw e
		}
	    
	},
	async getAuthResult(certifyId = '') {
	    try {
			const result = await this.frvManager.getAuthResult({
				certifyId: certifyId
			})
			return result
	    } catch (e) {
			if(e.errCode === 50001 || e.errCode === 50002) {
				throw new Error('缺少参数或参数不正确')
			}
			throw e
	    }
	}
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	/* 
	method1(param1) {
		// 参数校验，如无参数则不需要
		if (!param1) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		
		// 返回结果
		return {
			param1 //请根据实际需要返回值
		}
	}
	*/
}
