<template>
	
	<view 
	class="gui-page-refresh gui-flex gui-column gui-justify-content-center" 
	:style="{height:refreshHeight+'px'}">
		<view 
		:style="{height:refreshFontSize+'rpx'}" 
		class="gui-flex gui-row gui-justify-content-center gui-align-items-center">
			<view class="loading-wrap" v-if="showLoading == 1" :style="{top:moveY < 200 ? moveY+'px' : '200px'}">
				<image  class="loading-img" :src="$util.img('images/system/loading-'+refreshStatus+'.png')"></image>
			</view>
			<!-- <up-notify ref="uNotifyRef" message="Hi uview-plus"></up-notify> -->
			<text 
			style="margin-left:12rpx;" 
			class="gui-page-refresh-text gui-block" 
			:class="customClass[refreshStatus]" 
			:style="{fontSize:refreshFontSize+'rpx'}">{{refreshText[refreshStatus]}}</text>
		</view>
	</view>
</template>
<script>
// #ifdef APP-NVUE
var animation = weex.requireModule('animation');
const dom     = weex.requireModule('dom');
// #endif
export default{
	name  : "gui-refresh", 
	props : {
		refreshText    : {type:Array,   default:function () {
			return ['继续下拉刷新','松开手指开始刷新','数据刷新中','数据已刷新'];
		}},
		customClass : {type:Array,   default:function () {
			return [
				['gui-color-gray'],
				['gui-color-gray'],
				['gui-primary-text'],
				['gui-color-green'],
			];
		}},
		refreshFontSize : {type:Number, default:28},
		triggerHeight   : {type:Number, default:50},
		
		loadstyle:{
			type:Object,
			default:{}
		}
	},
	data() {
		return {
			reScrollTop         : 0,
			refreshHeight       : 0,
			refreshY            : 0,
			refreshStatus       : 0,
			refreshTimer        : 0,
			showLoading         :0,
			moveY: 0, //向下拉动的距离
		}
	},
	methods:{
		touchstart : function (e){
			if(this.reScrollTop > 10){return ;}
			this.refreshY = e.changedTouches[0].pageY;
		},
		touchmove : function(e){
			this.moveY = e.changedTouches[0].pageY - this.refreshY;
			if(this.refreshStatus >= 1){ return null;}
			if(this.reScrollTop > 10){return ;}
			var moveY = e.changedTouches[0].pageY - this.refreshY;
			//console.log('moveY', moveY)
			moveY     = moveY / 2;
			if(moveY >= this.triggerHeight){
				moveY = this.triggerHeight;
				this.refreshStatus = 1;
			}
			if(moveY > 15){
				this.refreshHeight = moveY;
				this.showLoading = 1;
			}
		},
		touchend : function (e) {
			if(this.reScrollTop > 10){return ;}
			if(this.refreshStatus < 1){
				this.showLoading = 0;
				return this.resetFresh();
			}else if(this.refreshStatus == 1){
				this.refreshStatus = 2;
				// #ifdef APP-NVUE
				setTimeout(()=>{
					this.rotate360();
				}, 200);
				// #endif
				this.$emit('reload');
				this.showLoading = 0;
				/*this.$refs.uNotifyRef.show({
					bgColor: '#19be6b',//this.System.default_color,
					//type: 'primary',   
					message: '数据已刷新',  
					duration: 1000 * 1,  
					fontSize: 14, 
					color:'#ffffff',
					safeAreaInsetTop: true  
				});*/
			}
		},
		scroll:function(e){
			this.reScrollTop = e.detail.scrollTop;
		},
		endReload : function(){
			this.refreshStatus = 3;
			setTimeout(()=>{this.resetFresh()}, 1000);
		},
		resetFresh : function () {
			this.refreshHeight = 0;
			this.refreshStatus = 0;
			return null;
		},
		rotate360 : function(){
			var el = this.$refs.loadingIcon;
			animation.transition(el, {
				styles     : {
					transform: 'rotate(7200deg)', 
					transformOrigin :'center'
				},
				duration   : 20000,
				timingFunction: 'linear',
				needLayout :false,
				delay: 0
			});
		}
	},
	emits : ['reload']
}
</script>
<style scoped>
.gui-page-refresh{overflow:hidden}
.gui-page-refresh-text{line-height:38rpx;height:38rpx;}
/* #ifndef APP-NVUE */
@keyframes gload-hide{0%{opacity:1; height:50px;} 70%{opacity:1; height:50px;} 100%{opacity:0; height:0px;}}
.gload-hide{animation:gload-hide 1s linear;}
/* #endif */

/* 新样式 */
.loading-wrap {
	position: fixed;
	width: 80rpx;
	height: 80rpx;
	padding: 10rpx;
	overflow: hidden;
	left: 50%;
	top: 10%;
	z-index: 99999;
	text-align: center;
	margin-left: -35rpx;
	border-radius: 80rpx;
	background-color: #ffffff;
	box-shadow: 0 0 2px 2px rgba(0,0,0,.1);
}
.loading-img {width: 60rpx;height: 60rpx;animation: loading 0.8s linear 0s infinite;}
@keyframes loading {0% {transform: rotate(0);}100% {transform: rotate(360deg);}}
@-webkit-keyframes loading {0% {transform: rotate(0);}100% {transform: rotate(360deg);}}
</style>