<template>
	<u-popup
		:show="show" 
		mode="top"
		bgColor="transparent"
		:overlayStyle="{background: 'rgba(0, 0, 0, 0.1)'}"
		@close="close"
	>
		<view class="popup-box">
			<view class="action-box" :style="[getStyle()]">
				<view class="action-boday">
					<view v-if="show" class="micon icon-sanjiaodown-copy" :style="[getIconStyle()]"></view>
					<view class="list" 
						hover-class="list-hover" 
						hover-stay-time="100" 
						v-for="(item, index) in actionList" :key="index"
						@click="listClick(item)"
					>
						<view class="micon icon-box" :class="[item.icon]"></view>
						<view class="text-box">{{item.title}}</view>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	props:{
		position:{
			type: String,
			default: 'right'
		}
	},
	data() {
		return {
			show:false,
			actionList:[]
		}
	},
	methods: {
		open(row){
			if(row){
				this.actionList = JSON.parse(JSON.stringify(row));
			}
			this.show = true;
		},
		close(){
			this.show = false;
			this.actionList = []
		},
		//点击事件返回
		listClick(item){
			this.$emit('more-back', item);
		},
		getStyle(){
			let style = {};
			style[this.position] = '20px';
			return style;
		},
		getIconStyle(){
			let style = {};
			style[this.position] = '10px';
			return style;
		}
	}
}
</script>

<style lang="scss" scoped>
	.popup-box{
		position: relative;
		.action-box{
			position: absolute;
			top: 100px;
			//right: 20px;
			.action-boday{
				position: relative;
				background-color: #ffffff;
				border-radius: 5px;
				padding: 10px 0;
				.icon-sanjiaodown-copy{
					position: absolute;
					top: -13px;
					//right: 10px;
					font-size: 20px;
					color: #ffffff;
				}
				.list{
					display: flex;
					padding: 10px 20px; 
					line-height: 30px;
					.icon-box{
						color: #303133;
						font-size: 20px!important;
						font-weight: bold;
					}
					.text-box{
						font-size: 16px;
						color: #303133;
						padding-left: 5px;
					}
				}
			}
		}
	}
</style>