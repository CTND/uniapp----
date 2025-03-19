<template>
	<view class="gui-flex1">
		<!-- 背景图片 -->
		<image :src="$util.img('images/member/point-bg.png')" class="bgimg"></image>
		<!-- 列表主体 -->
		<view class="ranking-list gui-absolute-lt gui-bg-gray gui-dark-bg-level-3" 
		:style="{
			top:'50px', 
			left:'30rpx', 
			height:'calc(100vh - 100px)',
		}">
			<view style="background-color: #2979ff;padding: 2px 10px">
				<up-subsection bgColor="#2979ff" inactiveColor="#fff" :list="['今日排行', '本月排行', '总排行']" 
				:current="curNow"
				@change="subsectionChnage"
				></up-subsection>
			</view>
			<!-- 头部个人信息 -->
			<view v-if="head.userid > 0" class="gui-flex gui-row gui-justify-content-center" 
			style="margin-top:38rpx;border-bottom: 1px solid #f0f0f0;padding-bottom: 5px;">
				<view class="header-msg-item gui-flex">
					<text class="header-msg-text">{{head.num || 0}}</text>
					<text class="header-msg-text-small"></text>
				</view>
				<view class="header-msg-item gui-flex">
					<image 
					class="header-msg-face" 
					:src="head.avatar" 
					mode="aspectFill"></image>
				</view>
				<view class="header-msg-item gui-flex">
					<text class="header-msg-text-small">第</text>
					<text class="header-msg-text">{{head.sort_val || 1}}</text>
					<text class="header-msg-text-small">名</text>
				</view>
			</view>
			<view class="ranking-lists">
				<scroll-view :scroll-y="true" :style="{height : 'calc( 100vh - 230px)',}">
					<view class="ranking-lists-item gui-flex" 
					v-for="(item,index) in list" 
					:key="index">
						<text
						class="ranking-lists-num gui-block" 
						:style="{color:item.color?item.color:''}">{{index+1}}</text>
						<image class="ranking-lists-image" 
						mode="aspectFill" 
						:src="item.avatar"></image>
						<view class="ranking-lists-content">
							<view class="ranking-lists-content-name">
								<u-parse :content="item.nickname || ''"></u-parse>
							</view>
							<view class="ranking-lists-content-desc gui-block gui-color-gray" v-if="item.num">{{item.num || ''}}</view>
						</view>
						<view class="ranking-lists-zan">
							<!-- <text 
							:class="[
								'gui-icons', 'gui-block', 
								'ranking-lists-zan-icon', 
								item.iszan ? 'zan-active':''
							]">&#xe605;</text> -->
							<text class="ranking-lists-zan-num gui-block">{{item.puty_num || ''}}</text>
						</view>
					</view>
					<view class="" style="height:60rpx;"></view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>
<script>
	// 用法：<ranking-list :head="head" :list="list"></ranking-list>
export default {
	props:{
		list:{
			type: Array,
			default: []
		},
		head:{
			type: Object,
			default: {
				userid:0,
				avatar:'',
				nickname:'',
				num:'',//主数据
				puty_num: '', //副数据
				sort_val:0, //当前名次
			}
		}
	},
	data() {
		return {
			curNow: 0
		}
	},
	created() {
		
	},
	onLoad:function () {
		
	},
	methods: {
		subsectionChnage(e){
			this.curNow = e;
			this.$emit('ranking-change', e);
		}
	}
}
</script>
<style scoped>
.bgimg{width:100%; height:750rpx;}
.ranking-list{width:690rpx; border-radius:20rpx; overflow:hidden;}
.header-msg-item{width:200rpx; flex-direction:row; justify-content:center; align-items:center;}
.header-msg-text{font-size:22px; font-weight:bold;}
.header-msg-text-small{font-size:22rpx; margin:10rpx;}
.header-msg-face{width:138rpx; height:138rpx; border-radius:120rpx;}
.ranking-lists{padding:25rpx;}
.ranking-lists-item{margin-bottom:28rpx; flex-direction:row; justify-content:space-between; flex-wrap:nowrap; align-items:center;}
.ranking-lists-num{width:60rpx; line-height:80rpx; font-size:50rpx; font-weight:bold; font-style:italic; text-align:center;}
.ranking-lists-image{width:100rpx; height:100rpx; border-radius:80rpx; margin:0 20rpx;}
.ranking-lists-content{width:200rpx; margin:0 10rpx; flex:1;}
.ranking-lists-content-name{font-size:15px; line-height:25px;}
.ranking-lists-content-desc{font-size:24rpx; line-height:36rpx}
.ranking-lists-zan{width:80rpx;}
.ranking-lists-zan-icon{font-size:50rpx; line-height:60rpx; text-align:center;}
.ranking-lists-zan-num{font-size:14px; text-align:center;color: #909399;}
.zan-active{color:#FF0036;}
</style>