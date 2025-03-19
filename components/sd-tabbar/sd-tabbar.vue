<template>
	<view class="gui-footer gui-footer-border" style="display: flex;"
	:style="{backgroundColor:'#f3f4f5'}"
	>
		<view class="gui-footer-icon-buttons"
		:style="{width: '33%'}"
		v-for="(tab, tindex) in tabbarList" :key="tindex"
		@click="tabbarChange(tindex)"
		>
			<text :class="[
				'gui-footer-icon-buttons-icon', 
				'gui-block',
				'micon',
				tab.icon
			]" :style="{color:tindex == tabIndex ? activeColor : inactiveColor}"></text>
			<text :class="[ 
				'gui-icons', 
				'gui-footer-icon-buttons-text', 
				'gui-block'
			]" :style="{color:tindex == tabIndex ? activeColor : inactiveColor}">{{tab.title}}</text>
		</view>
	</view>
</template>
<script>
export default {
	name: 'sd-tabbar',
	props:{
		tabbarList:{
			type: Array,
			default:function(){
				return []
			}
		},
		tabIndex:{
			type: Number,
			default:function(){
				return 0;
			}
		},
	},
	data() {
		return {
			inactiveColor: "#565555",
			activeColor: "#1989fa",
		}
	},
	methods:{
		//底部导航事件
		tabbarChange(index){
			if(this.tabIndex === index){
				return;
			};	
			let path = this.tabbarList[index].path;
			if(path){
				uni.redirectTo({
					url: path
				});
			}
		},
		
	}
}
</script>
<style>
</style>