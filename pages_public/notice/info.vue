<template>
	<gui-page  
	
	ref="guipage"
		>
		<template v-slot:gBody>
			<view v-if="notice.id" class="gui-bg-white gui-dark-bg-level-3">
				<!-- 文章标题 -->
				<view class="gui-padding">
					<view class="gui-h4 gui-bold">{{notice.noticename}}</view>
					<view class="gui-text gui-text-small" style="color: #9E9E9E!important;padding-top: 10rpx;">
						{{$util.getDatestr(notice.create_time)}}
					</view>
				</view>
				<!-- 文章内容 -->
				<view style="font-size: 15px;color: #606266;line-height: 1.5;padding: 0 15px;">
					<u-parse :content="notice.noticecontent"></u-parse>
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
			notice:{
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
				this.$request('NoticeInfo', {
					id:this.id
				},{
					showLoading: false,
					cache: 0
				}).then((res)=>{
					if(res.data.data.notice){
						this.notice = res.data.data.notice;
					}
				})
			})
			
		},
		
		
	}
}
</script>

<style lang="scss" scoped>
	
</style>