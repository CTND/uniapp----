
export default {
	// --- 导航条设置 ---
	setNavBar: function(sets) {
		if (sets.title) {
			uni.setNavigationBarTitle({
				title: sets.title
			});
		}
		if (sets.color) {
			uni.setNavigationBarColor({
				frontColor: sets.color.frontColor,
				backgroundColor: sets.color.backgroundColor,
			 animation: {
					duration: 400,
			  timingFunc: 'easeIn'
				}
			});
		}
		if (sets.loading) {
			uni.showNavigationBarLoading();
		} else {
			uni.hideNavigationBarLoading();
		}
	},

	// --- 元素选择 ---
	// 单个元素选择
	select: function(selector, callBack) {
		uni.createSelectorQuery().select(selector).boundingClientRect().exec((res) => {
			callBack(res[0]);
		});
	},
	// 多个元素获取
	selectAll: function(selector, callBack) {
		uni.createSelectorQuery().selectAll(selector).boundingClientRect().exec((res) => {
			callBack(res[0]);
		});
	},

	// 获取ref ( 循环获取，直到 组件创建完成并获取成功 )
	getRefs: function(ref, _this, count, fun) {
		if (count >= 50) {
			fun(_this.$refs[ref]);
			return false;
		}
		var refReturn = _this.$refs[ref];
		if (refReturn) {
			fun(refReturn);
		} else {
			count++;
			setTimeout(() => {
				this.getRefs(ref, _this, count, fun);
			}, 100);
		}
	},

	// md5
	md5 : function(str){
		return '';
	}
}
