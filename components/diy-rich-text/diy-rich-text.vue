<template>
	<view class="options-box" :style="[$util.getModelStyle(modelData.options)]">
		<up-parse :content="modelData.data.richtext"></up-parse>
	</view>
</template>

<script>
export default {
	name: 'diy-rich-text',
	props: {
		modelData: {
			type:[Object],
			default:{
				data:{
					richtext: ''
				},
				options:{}
			}
		}
	},
};
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
