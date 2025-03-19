<template>
	<view v-if="modelData.data.list.length" class="options-box" :style="[$util.getModelStyle(modelData.options)]">
		<view class="nav-box" 
		:class="[modelData.options.displayModel]"
		v-for="(item, index) in modelData.data.list" :key="index" @click.stop="navClick(index)"
		:style="[{
			width: 'calc( (100% - 0px) / ' + modelData.options.templateval + ')',
			marginBottom:modelData.options.iconMarginBottom+'px',
			backgroundColor: modelData.options.blockBackground,
			padding: modelData.options.blockPadding + 'px',
		}]"
		>
			<view class="image-box" 
			:style="{
				width:modelData.options.iconsize+'px',
				height:modelData.options.iconsize+'px'
			}">
				<image :src="item.src" mode="widthFix" style="width: 100%;height: 100%;"></image>
			</view>
			<view class="nav-text" :style="{
				fontSize:modelData.options.fontSize+'px',
				color:modelData.options.textColor,
				fontWeight: modelData.options.fontWeight,
				marginTop:modelData.options.navmarginTop+'px',
			}">{{item.title}}</view> 
		</view>
	</view>
</template>

<script>
	export default {
		name:"diy-nav",
		props:{
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
			//console.log('收到的页面参数-------------', this.modelData)
		},
		methods:{
			//点击事件
			navClick(e){
				if(typeof e === 'number'){
					let link = this.modelData.data.list[e].link;
					let params = {};
					if(link.event){
						params.event = link.event; 
					}
					this.navTo(link,{login: false}, params)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.options-box{
		margin: auto;
		overflow: hidden;
		display: flex;
		flex-wrap: wrap;
		.nav-box{
			width: 25%;
			text-align: center; 
			.image-box{
				overflow: hidden;
				border-radius: 100%;
			}
			.nav-text{
				text-align: center;
				font-weight: 400;
			}
		}
		.block{
			display: block;
			.image-box{
				margin: auto;
			}
		}
		.flex {
		    display: flex;
		    margin: 5px 5px;
		    padding: 15px;
		    border-radius: 10px;
			
		    .nav-text {
		       padding-left: 10px;
			   white-space:nowrap;
			   overflow: hidden;
			   text-overflow:ellipsis;
		    }
		}
	}
</style>