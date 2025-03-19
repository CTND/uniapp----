<template>
	<view class="options-box"
	:style="{
		width:modelData.options.width+'%',
	}"
	>
		<u-swiper
			v-if="modelData.data && modelData.data.list.length" 
			:list="modelData.data.list"
			keyName="src"
			indicator
			circular
			imgMode="widthFix" 
			:interval="modelData.options.interval*1000" 
			:height="modelData.options.height+'px'"
			:previousMargin="modelData.options.effect3d == '0' ? 0 : 30"
			:nextMargin="modelData.options.effect3d == '0' ? 0 : 30"
			:bgColor="modelData.options.background"
			:radius="modelData.options.borderRadius+'px'" 
			@click="bannerClick"
		></u-swiper>
	</view>
</template>

<script>
	export default {
		name:"diy-banner",
		props:{
			modelData:{
				type:[Object],
				default:{
					data:{
						list:[]
					}
				}
			}
		},
		data() {
			return {
			};
		},
		methods:{
			bannerClick(e){
				if(typeof e === 'number'){
					let link = this.modelData.data.list[e].link;
					let params = {};
					if(link.event){
						params.event = link.event; 
					}
					this.navTo(link.path,{login: false}, params)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.options-box{
		margin: auto;
		overflow: hidden;
	}
</style>