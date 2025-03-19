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
		
		
	</view>
</template>

<script>
	
	export default{
		data() {
			return {
				settingList:[
					[
						{
							title:'手机号码',
							path:'/pages_setting/information/mobile/index',
							content_text: ''
						},
						{
							title:'登录密码',
							path:'/pages_setting/information/password/index',
							content_text:'修改密码'
						},
					],
					/*
					[
						{
							title:'实名认证',
							path:'/pages_setting/information/real_name/index',
							content_text:'去认证'
						},
						{
							title:'身份基本信息',
							path:'/pages_setting/information/base_data/index',
							content_text:'待完善'
						},
						{
							title:'证件照片',
							path:'/pages_setting/information/photo/index',
							content_text:'未上传'
						},
						
					]*/
				],
				content:'',
			}
		},
		onLoad: function() {
			if(this.System.cheat == 2){
				this.settingList[1].push({
					title:'人像验证',
					path:'/pages_setting/information/face/index',
					content_text:'未验证'
				})
			}
		},
		onShow() {
			if(!this.isLogin()){
				return;
			}
			this.$store.dispatch('getUserInfo', (res)=>{
				if(Object.keys(res).length){
					this.userInfo = res;
					this.settingList[0][0].content_text = res.mobile;
					if(res.is_auth == 1){
						this.settingList[1][0].content_text = '已实名';
					}
					if(res.realname && res.sex && res.idcard){
						this.settingList[1][1].content_text = '已完善';
					}
					if(res.idcard_zurl && res.idcard_furl){
						this.settingList[1][2].content_text = '已上传';
					}
					if(res.face_auth == 1){
						this.settingList[1][3].content_text = '已验证';
					}
				}
			})
		},
		methods:{
			cellEvent(path){
				if(path == '/pages_setting/information/real_name/index' && this.userInfo.is_auth == 1){
					this.msg('已实名认证');
					return;
				}
				if(path == '/pages_setting/information/face/index' && this.userInfo.is_auth == 0){
					this.msg('请先完成实名认证');
					return
				}
				if(path == '/pages_setting/information/face/index' && this.userInfo.face_auth == 1){
					this.msg('已通过验证');
					return
				}
				this.navTo(path, {login:true});
			},
			
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