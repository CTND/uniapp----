<template>
	<view v-if="modelData.data.src" class="options-box" :style="[$util.getModelStyle(modelData.options)]">
		<image :src="modelData.data.src" @click="navTo(modelData.data.link.path)" width="100%" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		name:"diy-image",
		props:{
			modelData:{
				type:[Object],
				default:{
					data:{
						link: "",
						src: ""
					},
					options:{}
				}
			}
		},
		data() {
			return {
			};
		},
		created() {
			//console.log('收到的页面参数-------------', this.modelData)
		},
		methods:{
			
		}
	}
</script>

<style scoped lang="scss">
	.options-box{
		margin: auto;
		overflow: hidden;
		image{
			width: 100%;
		}
	}
</style>