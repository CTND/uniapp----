<template>
	<view class="gui-padding">
		<view class="gui-margin-top">
			<text class="gui-text gui-color-gray">身份证照片 ( 个人信息面 )</text>
		</view>
		<view class="gui-idcard-items gui-bg-white gui-dark-bg-level-3 gui-flex gui-row gui-justify-content-center">
			<view v-if="idcard_zurl==''" class="gui-idcard-items-image" 
			@click="uploadZ()">
				<gui-image :src="$util.img('images/system/idcard-z.png')" :width="640"></gui-image>
			</view>
			<view v-else class="idcard-box" @click="uploadZ()">
				<view style="border-radius: 10px;overflow: hidden;height: 190px;">
					<image :src="idcard_zurl?idcard_zurl:$util.img('images/system/idcard-z.png')" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="gui-margin-top">
			<text class="gui-text gui-color-gray">身份证照片 ( 国徽图案面 )</text>
		</view>
		<view class="gui-idcard-items gui-bg-white gui-dark-bg-level-3 gui-flex gui-row gui-justify-content-center">
			<view v-if="idcard_furl==''" class="gui-idcard-items-image" 
			@click="uploadF()">
				<gui-image 
				:src="idcard_furl?idcard_furl:$util.img('images/system/idcard-f.png')" 
				:width="640"></gui-image>
			</view>
			<view v-else class="idcard-box" @click="uploadF()">
				<view style="border-radius: 10px;overflow: hidden;height: 190px;">
					<image :src="idcard_furl?idcard_furl:$util.img('images/system/idcard-f.png')" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view style="margin-top:50rpx;">
			<u-button v-if="userInfo.idcard_zurl == '' || userInfo.idcard_furl == ''" type="primary" text="提交保存"
			shape="circle" throttleTime="1000"
			size="large"
			:customStyle="$util.butStyle('primary',{marginTop:'30px', backgroundColor:System.big_but_color,width:'80%'})"
			@click="save()"
			></u-button>
		</view>
	</view>
	
</template>

<script>
	export default{
		data() {
			return {
				userInfo:{
					idcard_zurl:'',
					idcard_furl:''
				},
				idcard_zurl:'',
				idcard_furl:''
			}
		},
		onLoad: function() {
			this.$store.dispatch('getUserInfo', (res)=>{
				if(Object.keys(res).length){
					this.userInfo = res;
					this.idcard_zurl = res.idcard_zurl;
					this.idcard_furl = res.idcard_furl;
				}
			})
		},
		onShow() {
			
		},
		methods:{
			
			uploadZ(){
				if(this.userInfo.idcard_zurl) return;
				this.$util.upload(1, {type:'image'}, (res)=>{
					if(res.length){
						this.idcard_zurl = res[0];
					}
				})
			},
			uploadF(){
				if(this.userInfo.idcard_furl) return;
				this.$util.upload(1, {type:'image'}, (res)=>{
					if(res.length){
						this.idcard_furl = res[0];
					}
				})
			},
			save(){
				if(this.idcard_zurl == ''){
					this.msg('请上传正面照片');
					return;
				}
				if(this.idcard_furl == ''){
					this.msg('请上传反面照片');
					return;
				}
				this.$request('UserInfoUpdate', {
					ref:'idcard_zurl',
					val:this.idcard_zurl
				},{
					showLoading: false,
					cache: 0
				}).then((res)=>{
				})
				this.$request('UserInfoUpdate', {
					ref:'idcard_furl',
					val:this.idcard_furl
				},{
					showLoading: false,
					cache: 0
				}).then((res)=>{
					this.msg(res.data.msg);
					this.$store.dispatch('getUserInfo', (res)=>{})
					setTimeout(()=>{
						uni.navigateBack();
					},500)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.gui-idcard-main{margin:25rpx;}
	.gui-idcard-desc{line-height:56rpx; font-size:26rpx; padding:20rpx; border-radius:10rpx;}
	.gui-idcard-text{line-height:1.8em; margin-top:30rpx;}
	.gui-idcard-items{padding:30rpx 0; border-radius:10rpx; margin-top:15rpx;}
	.gui-idcard-items-image{width:640rpx;}
	.idcard-box{
		height: 200px;
		width:640rpx;
		margin: auto;
		border-radius: 10px;
		padding: 5px;
		overflow: hidden;
		border: 1px dashed #008aff;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>