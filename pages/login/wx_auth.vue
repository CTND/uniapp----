<template>
	<view class="view_body" v-if="show">
		<!-- #ifdef MP-WEIXIN -->
		<web-view :src="System.siteroot+'app/auth/index?id='+System.weid"></web-view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
			};
		},
		onLoad() {
			const t = this;
			t.show = true;
		},
		onUnload(){
			
		},
		onHide(){
			
		},
		onShow(){
			const t = this;
		},
		
		methods:{
			
		}
	}
</script>

<style>
</style>
