<template>
	<!--数据块-->
	<view v-if="modelData.data.list.length" class="options-box" :style="[$util.getModelStyle(modelData.options)]">
		<view
		  v-for="(item, index) in modelData.data.list" :key="index"
		  class="userhome-data-block"
		>
		  <view
			class="data-num"
			:style="{
			  color: modelData.data.datanumberColor,
			  fontSize:modelData.data.datanumberSize+'px',
			  fontWeight:modelData.data.datanumberWeight
			}"
		  >
			{{item.data_number}}
		  </view>
		  <view
			class="data-text"
			:style="{
			  color: modelData.data.datanameColor,
			  fontSize: modelData.data.datanameSize + 'px',
			  marginTop:modelData.data.datanameMarginTop+'px'
			}"
		  >
			{{item.data_name}}
		  </view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'data-block',
	props: {
		modelData:{
			type:[Object],
			default:{
				data:{
					list:[]
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
	},
	methods: {
		
	}
};
</script>

<style lang="scss" scoped>
	.options-box{
		display: flex;
		justify-content: space-around;
		.userhome-data-block {
		  width: 25%;
		  text-align: center;
		  .data-num {
		    font-size: 16px;
		    font-weight: 800;
		    line-height: 20px;
		    color: #606266;
		  }
		  .data-text {
		    font-size: 12px;
		    color: #606266;
		  }
		}
	}

</style>
