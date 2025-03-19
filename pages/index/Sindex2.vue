<template>
	<gui-page 
		ref="guipage"
		
		:customHeader="true" 
		:customStyle="{
			backgroundImage:'linear-gradient(to bottom, #ffdddb, #ffffff 50%)',
		}"
	>
		<template v-slot:gHeader>
			<up-navbar height="50px"
			:customStyle="{background:'red'}">
				<template #left>
					<view class="micon icon-jiantou-copy" style="color: #ffffff;font-weight: bold;"></view>
				</template>
				<template #center>
					<view>同城陌约</view>
				</template>
				<template #right>
					<view class="nav-right-box" >
						
					</view>
				</template>
			</up-navbar>
		</template>
		<template v-slot:gBody>
			<view class="model-box">
				<view class="flex-box">
					<view class="block-box">
						<view class="big-box">
							<image :src="model_list[0].img"></image>
						</view>
						<view class="small-box">
							<image :src="model_list[1].img"></image>
						</view>
						<view class="small-box">
							<image :src="model_list[2].img"></image>
						</view>
					</view>
					<view class="block-box">
						<view class="big-box">
							<image :src="model_list[3].img"></image>
						</view>
						<view class="small-box">
							<image :src="model_list[4].img"></image>
						</view>
						<view class="small-box">
							<image :src="model_list[5].img"></image>
						</view>
					</view>
				</view>
			</view>
		</template>
		<template v-slot:gFooter>
			
		</template>
		
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				model_list:[
					{
						img:'https://test.yunzxun.com/addons/public_serve/uploads/2351/images/672b7d83b94f4.jpg',
						title: '灵魂匹配',
						desc:'今日剩余17次',
						path:'',
						but:'开始匹配'
					},
					{
						img:'https://test.yunzxun.com/addons/public_serve/uploads/2351/images/672b7d83e3af1.jpg',
						title: '酒馆',
						desc:'今日剩余17次',
						path:'',
						but:'开始匹配'
					},
					{
						img:'https://test.yunzxun.com/addons/public_serve/uploads/2351/images/672b7d83e33dd.jpg',
						title: '',
						desc:'今日剩余17次',
						path:'',
						but:'开始匹配'
					},
					
					{
						img:'https://test.yunzxun.com/addons/public_serve/uploads/2351/images/672b7d83cb221.jpg',
						title: '灵魂匹配',
						desc:'今日剩余17次',
						path:'',
						but:'开始匹配'
					},
					{
						img:'https://test.yunzxun.com/addons/public_serve/uploads/2351/images/672b7d83c161a.jpg',
						title: '灵魂匹配',
						desc:'今日剩余17次',
						path:'',
						but:'开始匹配'
					},
					{
						img:'https://test.yunzxun.com/addons/public_serve/uploads/2351/images/672b7d83e4f1c.jpg',
						title: '灵魂匹配',
						desc:'今日剩余17次',
						path:'',
						but:'开始匹配'
					}
				]
			}
		},
		onLoad: function() {
			
		},
		onShow() {
			
		},
		methods:{
			getBase(){
				this.$util.throttle(async ()=>{
					this.$request('getSameBase', {},{
						showLoading: false,
						cache: 10*60
					}).then((res)=>{
						console.log('请求数据', res)
					})
				})
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	.model-box{
		padding: 100px 15px;
		.flex-box{
			display: flex;
			justify-content: space-between;
			.block-box{
				width: 50%;
				border: 1px solid red;
				margin-right: 10rpx;
				.big-box{
					height: 120px;
					border-radius: 10px;
					overflow: hidden;
					margin-bottom: 20rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.small-box{
					height: 55px;
					border-radius: 10px;
					overflow: hidden;
					margin-bottom: 20rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
</style>