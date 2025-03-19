<template>
	<gui-page  
	
	ref="guipage"
		>
		<template v-slot:gBody>
			<view v-if="agree.id" class="gui-bg-white gui-dark-bg-level-3">
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
		var data = {
			type:2
		};
		this.$request('Getagree', data,{
			showLoading: true
		}).then((res)=>{
			if(res.data.data.agree_list.length){
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