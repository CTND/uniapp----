<template>
	<view v-if="agree.id > 0" class="gui-bg-white gui-dark-bg-level-3">
		<view class="gui-padding">
			<view class="gui-h4 gui-bold" style="text-align: center;">{{agree.title}}</view>
			<view class="gui-text gui-text-small" style="color: #9E9E9E!important;padding-top: 10rpx;text-align: right;">
				{{$util.getDatestr(agree.create_time)}}
			</view>
		</view>
		<view style="padding: 10px;">
			<u-parse :content="agree.content"></u-parse>
		</view>
	</view>
</template>
<script>
//公共平台简介组件
export default {
	props:{
		id: {
			type: [String, Number],
			default: 0
		},
		type: {
			type: [String, Number],
			default: 0
		}
	},
	data() {
		return {
			agree:{
				id:0,
				content:''
			}
		}
	},
	created() {
		let data = {};
		if(this.id != 0){
			data.id = this.id;
		}
		if(this.type != 0){
			data.type = this.type;
		}
		this.$request('Getagree', data,{
			showLoading: false
		}).then((res)=>{
			if(res.data.data.agree_list.length){
				this.agree = res.data.data.agree_list[0];
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