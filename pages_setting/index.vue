<template>
	<view class="vue-box">
		<view class="group-box" v-for="(group, gindex) in settingList" :key="gindex">
			<view class="cell-item" :class="[index == group.length - 1 ? 'none-border' : '']"
			v-for="(item, index) in group" :key="index"
			@click="cellEvent(item.path)"
			>
				<view class="title">{{item.title}}</view>
				<view class="content">
					{{item.content_text || ''}}
				</view>
				<view class="cell-icon-box">
					<sd-icon name="icon-jiantou1" size="16" top="1" color="#909399"></sd-icon>
				</view>
			</view>
		</view>
		
		<view class="action-box" @click="out()">退出登录</view>
		
	</view>
</template>

<script>
	import cache from '@/common/js/cache.js'
	export default{
		data() {
			return {
				settingList:[
					[
						{
							title:'账号与安全',
							path:'/pages_setting/account_and_security/index',
							content_text:''
						},
						{
							title:'资料管理',
							path:'/pages_setting/information/index',
							content_text:''
						},
					],
					[
						// {
						// 	title:'个性设置',
						// 	path:'/pages_setting/notify/index',
						// 	content_text:''
						// },
						{
							title:'帮助与反馈',
							path:'/pages_setting/feedback/index',
							content_text:''
						},
					],
					[
						{
							title:'隐私',
							path:'/pages_setting/privacy/index',
							content_text:''
						},
						{
							title:'关于',
							path:'/pages_setting/about/index',
							content_text:'版本号 ' + this.$store.state.systemInfo.appVersion
						},
					],
					[
						{
							title:'在线客服',
							path:'kefu',
							content_text:''
						},
					],
					[
						{
							title:'清理缓存',
							path:'clear',
							content_text:''
						},
						{
							title:'注销账户',
							path:'cancel',
							content_text:''
						},
					]
				],
				content:'',
			}
		},
		onLoad: function() {
			
		},
		onShow() {
			
		},
		methods:{
			cellEvent(path){
				if(path == 'clear'){
					this.msg('清理成功')
					const postfix = '_aszapp'; // 缓存前缀  
					uni.removeStorageSync('Getsystem');
					uni.removeStorageSync('Getsystem' + postfix);
					uni.removeStorageSync('color_list');
					uni.removeStorageSync('color_list' + postfix);
					this.$store.state.System = {};
				}else if(path == 'cancel'){
					this.showModalEvent({
						title:'提示',//提示标题
						content: '确定要注销当前账户吗？注销后账户所有信息将被清空，请谨慎操作！！！',
						showCancel:true,
						cancelText: '取消',
						confirmText: '确认注销',
						path:''
					},{ref:'cancel'})
				}else if(path == 'kefu'){
					this.clickEvent({
						event: "kefu",
						options: {
						    event: "kefu",
						    popup: "0",
						    name: "在线客服",
						    path: ""
						}
					});
				}else{
					this.navTo(path, {login:true});
				}
			},
			//模态弹窗回调
			modalEventBack(options, v){
				const t = this;
				if(options.ref == 'cancel'){
					if(v == 1){
						this.msg('注销成功！');
						setTimeout((res)=>{
							this.$store.commit('logout', 2);
						}, 1000)
					}
				}else if(options.ref == 'out'){
					if(v == 1){
						this.msg('退出成功！');
						const postfix = '_aszapp'; // 缓存前缀
						uni.removeStorageSync('Getsystem');
						uni.removeStorageSync('Getsystem' + postfix);
						setTimeout((res)=>{
							this.$store.commit('logout', 2);
						}, 500)
					}
				}
			},
			
			//退出
			out(){
				this.showModalEvent({
					title:'提示',//提示标题
					content: '确定退出当前账户吗？',
					showCancel:true,
					cancelText: '取消',
					confirmText: '退出',
					path:''
				},{ref:'out'})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.vue-box{
		padding: 10px;
		.none-border{
			border-bottom: none!important;
		}
		.group-box{
			background-color: #ffffff;
			padding: 0px 10px;
			margin-bottom: 12px;
			border-radius: 5px;
			overflow: hidden;
			.cell-item {
				display: flex;
				padding: 0 5px;
				border-bottom: 1px solid #f0f0f0;
				box-sizing: border-box;
				height: 52px;
				line-height: 52px;
				.title{
					font-size: 17px;
				}
				.content{
					flex: 1;
					font-size: 15px;
					text-align: right;
					color: #909399;
					padding-right: 5px;
				}
				.cell-icon-box{
					padding-top: 17px;
				}
			}
			/*
			.cell-item {
				display: flex;
				padding: 15px 5px;
				border-bottom: 1px solid #f0f0f0;
				.title{
					font-size: 17px;
				}
				.content{
					flex: 1;
					font-size: 15px;
					text-align: right;
					color: #909399;
					padding-right: 5px;
				}
				.cell-icon-box{
					
				}
			}*/
		}
	}
	
	.action-box{
		background-color: #ffffff;
		border-radius: 5px;
		text-align: center;
		padding: 15px;
		font-size: 16px;
		margin-top: 20px;
	}
	
</style>