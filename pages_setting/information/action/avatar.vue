<template>
	<view class="gui-img-crop">
		<view class="avatar-box">
			<u--image v-if="avatar" :showLoading="true" :src="avatar" width="200px" height="200px"></u--image>
			<image v-else :src="userInfo.avatar || $util.img('images/system/none-avatar.png')" style="width: 100%;height: 100%"></image>
		</view>
		<view
		style="width:750rpx; z-index:99;"
		class="gui-flex gui-row gui-nowrap gui-space-between gui-bg-black gui-fixed-lb">
			<view class="gui-cropper-btn" @tap="selectImg">+ 选择图片</view>
			<view class="gui-cropper-btn" @tap="saveImg">保存头像</view>
		</view>
		
		<img-cropping selWidth="300" selHeight="300" @upload="Upload" ref="imgCropping"></img-cropping>
		
		 
	</view>
</template>
<script>
export default {
	data() {
		return {
			avatar:''
		}
	},
	onLoad:function(){
		this.isLogin();
		this.$store.dispatch('getUserInfo', (res)=>{
			if(Object.keys(res).length){
				this.userInfo = res;
			}
		})
	},
	methods:{
		selectImg : function () {
			if(this.userInfo.real_avatar == 1){
				this.showModalEvent({
					title:'提示',//提示标题
					content: '真人头像必须通过人像验证进行修改',
					showCancel:true,
					cancelText: '取消',
					confirmText: '去修改',
				}, {})
			}else{
				this.$refs.imgCropping.fSelect();
			}
		},
		//弹窗返回
		modalEventBack(e, v){
			if(v == 1){
				this.navTo('/pages_setting/information/face/index', { login: true }, {do_ref:'real_avatar'}, 'redirectTo');
			}
		},
		saveImg : function() {
			if(this.avatar == ''){
				uni.showToast({
					title:"请选择图片",
					icon:"none"
				});
				return ;
			}
			this.$util.throttle(async ()=>{
				this.$request('UserInfoUpdate', {
					ref:'avatar',
					val: this.avatar
				},{
					showLoading: true,
					cache: 0
				}).then((res)=>{
					this.msg(res.data.msg);
					if(res.data.code == 200){
						this.$store.dispatch('getUserInfo', (res)=>{})
					}
				})
			})
		},
		
		//上传返回图片
		Upload(rsp) {
			const t = this;
			this.isLoading = true;
			uni.uploadFile({
				url: t.$util.uploadUrl('image'),
				filePath: rsp.path,
				name: 'file[]',
				formData:{},
				success: (result) => {
					const resue = JSON.parse(result.data)
					if(resue.code == 200){
						this.avatar = resue.data.file_url;
						this.userInfo.avatar = resue.data.file_url;
						this.$forceUpdate();
					}else{
						uni.showModal({
							content: '上传错误',
							showCancel: false
						});
					}
				},
				fail: (err) => {
					uni.showModal({
						content: '上传错误',
						showCancel: false
					});
				},
				complete() {
					t.isLoading = false;
				}
			});
		},
	}
}
</script>
<style scoped lang="scss">

.gui-cropper-wrapper{overflow:hidden;}
.gui-cropper-btn{width:350rpx; text-align:center; line-height:50px; font-size:28rpx; color:#FFFFFF;}
.avatar-box{
	width: 200px;
	height: 200px;
	border-radius: 5px;
	overflow: hidden;
	margin: 30px auto;
	image{
		width: 100%;
		height: 100%;
	}
}
</style>