<template>
	<view class="vue-box">
		<view class="group-box">
			<view class="cell-item">
				<view class="title">系统通知</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<u-switch v-model="userInfo.system_notify" size="20"
					:activeValue="1"
					:inactiveValue="0"
					inactiveColor="#c8c9cc"
					space="5"
					@change="systemChange"
					></u-switch>
				</view>
			</view>
			
			<view class="cell-item">
				<view class="title">服务通知</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<u-switch v-model="userInfo.serve_notify" size="20"
					:activeValue="1"
					:inactiveValue="0"
					inactiveColor="#c8c9cc"
					space="5"
					@change="serveChange"
					></u-switch>
				</view>
			</view>
			
			<view class="cell-item none-border">
				<view class="title">对话消息通知</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<u-switch v-model="userInfo.dialog_notify" size="20"
					:activeValue="1"
					:inactiveValue="0"
					inactiveColor="#c8c9cc"
					space="5"
					@change="dialogChange"
					></u-switch>
				</view>
			</view>
		</view>
		
		<view class="group-box">
			<view class="cell-item">
				<view class="title">容许陌生人加好友</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<u-switch v-model="userInfo.allowType" size="20"
					:activeValue="1"
					:inactiveValue="0"
					inactiveColor="#c8c9cc"
					space="5"
					@change="allowChange"
					></u-switch>
				</view>
			</view>
			
			<view class="cell-item">
				<view class="title">接受对话消息</view>
				<view class="content"></view>
				<view class="cell-icon-box">
					<u-switch v-model="userInfo.messageSettings" size="20"
					:activeValue="0"
					:inactiveValue="1"
					inactiveColor="#c8c9cc"
					space="5"
					@change="messageChange"
					></u-switch>
				</view>
			</view>
		</view>
		
	
	</view>
</template>

<script>
	
	export default{
		data() {
			return {
				
			}
		},
		onLoad: function() {
			
		},
		onShow() {
			this.isLogin();
			this.$store.dispatch('getUserInfo', (res)=>{
				if(Object.keys(res).length){
					//this.userInfo = res;
				}
			})
		},
		computed: {
			
		},
		methods:{
			systemChange(e){
				this.$util.throttle(async ()=>{
					this.$request('UserSettingUpdate', {
						ref:'system_notify',
						val: e
					},{
						showLoading: false,
						cache: 0
					}).then((res)=>{
						this.msg(res.data.msg);
						this.$store.dispatch('getUserInfo', (res)=>{
							if(Object.keys(res).length){
								this.userInfo = res;
							}
						})
					})
				})
			},
			serveChange(e){
				this.$util.throttle(async ()=>{
					this.$request('UserSettingUpdate', {
						ref:'serve_notify',
						val: e
					},{
						showLoading: false,
						cache: 0
					}).then((res)=>{
						this.msg(res.data.msg);
						this.$store.dispatch('getUserInfo', (res)=>{
							if(Object.keys(res).length){
								this.userInfo = res;
							}
						})
					})
				})
			},
			dialogChange(e){
				this.$util.throttle(async ()=>{
					this.$request('UserSettingUpdate', {
						ref:'dialog_notify',
						val: e
					},{
						showLoading: false,
						cache: 0
					}).then((res)=>{
						this.msg(res.data.msg);
						this.$store.dispatch('getUserInfo', (res)=>{
							if(Object.keys(res).length){
								this.userInfo = res;
							}
						})
					})
				})
			},
			allowChange(e){
				this.$util.throttle(async ()=>{
					this.$request('UserSettingUpdate', {
						ref:'allowType',
						val: e
					},{
						showLoading: false,
						cache: 0
					}).then((res)=>{
						this.msg(res.data.msg);
						this.$store.dispatch('getUserInfo', (res)=>{
							if(Object.keys(res).length){
								this.userInfo = res;
							}
						})
					})
				})
			},
			messageChange(e){
				this.$util.throttle(async ()=>{
					this.$request('UserSettingUpdate', {
						ref:'messageSettings',
						val: e
					},{
						showLoading: false,
						cache: 0
					}).then((res)=>{
						this.msg(res.data.msg);
						this.$store.dispatch('getUserInfo', (res)=>{
							if(Object.keys(res).length){
								this.userInfo = res;
							}
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.none-border{
		border: none!important;
	}
	.vue-box{
		padding: 10px;
		.none-border{
			border: none!important;
		}
		.group-box{
			background-color: #ffffff;
			padding: 0px 10px;
			margin-bottom: 12px;
			border-radius: 10px;
			overflow: hidden;
		}
		.cell-item {
			display: flex;
			padding: 18px 15px 15px 5px;
			border-bottom: 1px solid #f0f0f0;
			.title{
				color: #303133;
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
		}
	}
	
	
</style>