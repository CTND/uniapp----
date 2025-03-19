<template>
	<gui-page  
	
	ref="guipage"
		>
		<template v-slot:gBody>
			<view v-if="agree.id" class="gui-bg-white gui-dark-bg-level-3">
				<!-- 文章标题 -->
				<view class="gui-padding">
					<view class="gui-h4 gui-bold" style="text-align: center;">{{agree.title}}</view>
					<view class="gui-text gui-text-small" style="color: #9E9E9E!important;padding-top: 10rpx;text-align: right;">
						{{$util.getDatestr(agree.create_time)}}
					</view>
				</view>
				<!-- 文章内容 -->
				<view style="padding: 10px;">
					<u-parse :content="agree.content"></u-parse>
				</view>
			</view>
			<!-- 全屏加载 -->
			
		</template>
		
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
			id:0,
			agree:{
				id:0,
				content:''
			}
		}
	},
	onLoad(options) {
		const t = this;
		var data = {};
		console.log('options', options)
		if(options.type){
			data.type = options.type;
		}
		if(options.id){
			data.id = options.id;
		}
		this.$request('Getagree', data,{
			showLoading: true
		}).then((res)=>{
			console.log('ccccccccccccccccc', res)
			if(res.data.data.agree_list.length){
				uni.setNavigationBarTitle({
				    title: res.data.data.agree_list[0].title
				});
				t.agree = res.data.data.agree_list[0];
			}else{
				uni.showToast({
					title:'获取协议不存在',
					icon:'none'
				})
				setTimeout(()=>{
					this.goBack();
				},1000)
			}
		})
	},
	onShow() {
		
	},
	methods: {
		
	}
}
</script>

<style lang="scss" scoped>
	
</style>