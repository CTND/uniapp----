<template>
	<gui-page  
	
	ref="guipage"
		>
		<template v-slot:gBody>
			<view v-if="notify.id" class="gui-bg-white gui-dark-bg-level-3">
				<!-- 通知标题 -->
				<view class="gui-padding">
					<view class="gui-h4 gui-bold">{{notify.title}}</view>
					<view class="gui-text gui-text-small" style="color: #9E9E9E!important;padding-top: 10rpx;">
						{{$util.getDatestr(notify.create_time)}}
					</view>
				</view>
				<!-- 通知内容 -->
				<view>
					<u-parse :content="notice.notify.content"></u-parse>
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
			notify:{
				id:0
			}
		}
	},
	onLoad: function(options) {
		if(options.id){
			this.id = options.id;
			this.getInfo();
		}
	},
	onShow() {
		
	},
	methods: {
		getInfo(){
			this.$util.throttle(async ()=>{
				this.$request('notifyInfo', {
					id:this.id
				},{
					showLoading: false,
					cache: 0
				}).then((res)=>{
					if(res.data.data.notify){
						this.notify = res.data.data.notify; 
					}
				})
			})
			
		},
		
		
	}
}
</script>

<style lang="scss" scoped>
	
</style>