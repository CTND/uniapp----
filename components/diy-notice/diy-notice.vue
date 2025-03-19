<template>
	<view v-if="list.length" class="options-box gui-bg-white gui-dark-bg-level-3 gui-padding-x gui-margin-top" 
	:style="[$util.getModelStyle(modelData.options)]">
		<view class="gui-flex gui-row gui-nowrap gui-align-items-center">
			<view>
				<template v-if="modelData.options.mode == 'vertical'">
					<text class="gui-block gui-primary-color micon icon-tongzhi1" 
					:style="{
						fontSize:modelData.options.fontSize*1.5+'px',
						width:modelData.options.fontSize*1.5+'px'
					}"></text>
				</template>
				<template v-else>
					<text class="gui-block gui-primary-color micon icon-tongzhi1"
					:style="{
						fontSize:modelData.options.fontSize*1.5+'px',
						width:modelData.options.fontSize*1.5+'px'
					}"
					></text>
				</template>
			</view>
			<view class="gui-flex1">
				<swiper 
					:vertical="modelData.options.mode == 'vertical'?true:false"
					autoplay="true" 
					:circular="true" 
					:interval="interval" 
					:current="current" 
					:style="{height:height+'rpx'}"
				>
					<swiper-item  v-for="(item, index) in list" :key="index">
						<navigator 
							:url="'/pages_public/notice/info?id='+item.id" 
							open-type="navigate"
							hover-class="none"
						>
							<text 
							:style="{
								height:height+'rpx', lineHeight:height+'rpx',
								color:modelData.options.textColor,
								fontSize:modelData.options.fontSize+'px',
							}" 
							class="gui-block gui-ellipsis itemsIn" 
							:class="itemClass">{{item.noticename}}</text>
						</navigator>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"diy-notice",
		props:{
			modelData:{
				type:[Object],
				default:{
					data:{
						list:[]
					},
					options:{}
				}
			},
			items     : {type:Array,   default:function () {return [];}},
			current   : {type:Number,  default:0},
			vertical  : {type:Boolean, default:false},
			interval  : {type:Number,  default:5000},
			itemClass : {type:Array,   default:function(){
				return ['gui-text', 'gui-primary-text']
			}},
			height    : {type:Number,  default : 66} 
		},
		data() {
			return {
				list:[],
				speakerMsgs : [
					{ title: "GraceUI 更快、更好的前端更好的前端更好的前端更好的前端UI", url:"../index/index", opentype: "navigate"},
					{ title: "lesscode.work - 精品 IT 课程中心", url: "../index/index", opentype: "switchTab"}
				]
			};
		},
		created() {
			this.$request('NoticeList', {
				pageNo: 1,
				pageSize:10
			},{
				showLoading: false,
				cache: 0
			}).then((res)=>{
				console.log('公告', res)
				if(res.data.code == 200 && res.data.data.list.length){
					this.list = res.data.data.list;
				}
			})
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.options-box{
		margin: auto;
		overflow: hidden;
	}
	.itemsIn{line-height:66rpx; height:66rpx; overflow:hidden;}
	.demo-icon{width:60rpx; line-height:90rpx; font-size:32rpx;}
</style>