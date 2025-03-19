<template>
	<gui-page  
	
	ref="guipage"
		>
		<template v-slot:gBody>
			<view v-if="essay.essay_id" class="gui-bg-white gui-dark-bg-level-3">
				<!-- 文章标题 -->
				<view class="gui-padding">
					<view class="gui-h4 gui-bold">{{essay.essay_name}}</view>
					<view style="display: flex;padding: 10rpx;border-bottom: 1px solid #f0f0f0;">
						<view style="flex: 1;padding-top: 5rpx;">
							<sd-icon name="icon-icon-" size="20" color="#adadad">
								<template v-slot:icoContent>
									<text class="gui-text" style="color: #adadad;font-size: 12px;">浏览量: {{essay.essay_count}} 次</text>
								</template>
							</sd-icon>
						 </view>
						<view class="gui-text gui-text-small" style="color: #9E9E9E!important;padding-top: 10rpx;">
							{{$util.getDatestr(essay.create_time)}}
						</view>
					</view>
				</view>
				<!-- 文章内容 -->
				<view style="padding: 10px;">
					<u-parse :content="essay.essay_content"></u-parse>
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
			essay_id:0,
			essay:{
				essay_id:0
			}
		}
	},
	onLoad: function(options) {
		if(options.essay_id){
			this.essay_id = options.essay_id;
			this.getInfo();
		}
	},
	onShow() {
		
	},
	methods: {
		getInfo(){
			this.$util.throttle(async ()=>{
				this.$request('getEssayInfo', {
					essay_id:this.essay_id
				},{
					showLoading: false,
					cache: 0
				}).then((res)=>{
					if(res.data.data.essay){
						this.essay = res.data.data.essay;
					}
				})
			})
			
		},
		
		
	}
}
</script>

<style lang="scss" scoped>
	
</style>