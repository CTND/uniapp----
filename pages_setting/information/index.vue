<template>
	<view class="vue-box">
		
		<view class="group-box">
			<view class="cell-item" @click="navTo('/pages_setting/information/action/avatar',{login:true})">
				<view class="title" style="line-height: 35px;">头像</view>
				<view class="content"></view>
				<view class="avatar-box">
					<image :src="userInfo.avatar || $util.img('images/system/avatar.png')"></image>
				</view>
			</view>
			
			<view class="cell-item" @click="openpopup('nickname')">
				<view class="title">昵称</view>
				<view class="content">
					<u-parse :content="userInfo.nickname || ''" :tagStyle="{
						div: 'white-space:nowrap;text-overflow:ellipsis;overflow: hidden;'
					}"></u-parse>
				</view>
				<view class="cell-icon-box">
					<sd-icon name="icon-iconfonticonfonti2copycopy"
					:size="iconSize" color="#c8c9cc" top="1"></sd-icon>
				</view>
			</view>
			<view class="cell-item" @click="openpopup('sex')">
				<view class="title">性别</view>
				<view class="content">
					{{userInfo.sex == 1 ? '男' : userInfo.sex == 2 ? '女' : '未知'}}
				</view>
				<view class="cell-icon-box">
					<sd-icon name="icon-iconfonticonfonti2copycopy"
					:size="iconSize" color="#c8c9cc" top="1"></sd-icon>
				</view>
			</view>
			<view class="cell-item" @click="openpopup('birthday')">
				<view class="title">生日</view>
				<view class="content">
					{{userInfo.birthday || ''}}
				</view>
				<view class="cell-icon-box">
					<sd-icon name="icon-iconfonticonfonti2copycopy"
					:size="iconSize" color="#c8c9cc" top="0"></sd-icon>
				</view>
			</view>
			<view class="cell-item none-border" @click="openpopup('height')">
				<view class="title">身高</view>
				<view class="content">
					{{userInfo.height || ''}}
				</view>
				<view class="cell-icon-box">
					<sd-icon name="icon-iconfonticonfonti2copycopy"
					:size="iconSize" color="#c8c9cc" top="1"></sd-icon>
				</view>
			</view>
		</view>
		
		<view class="group-box" style="padding-top: 5px;">
			<view class="cell-item" @click="openpopup('sign')">
				<view class="title">个性签名</view>
				<view class="content text-overflow" style="padding-left: 20px;">
					{{userInfo.sign || '请填写你的个性签名'}}
				</view>
				<view class="cell-icon-box">
					<sd-icon name="icon-iconfonticonfonti2copycopy"
					:size="iconSize" color="#c8c9cc" top="0"></sd-icon>
				</view>
			</view>
			
			<view class="cell-item" style="border-bottom: none;" @click="navTo('/pages_member/photos/index', {login:true})">
				<view class="title">相册管理</view>
				<view class="content">
					管理你的个性相册
				</view>
				<view class="cell-icon-box">
					<sd-icon name="icon-iconfonticonfonti2copycopy"
					:size="iconSize" color="#c8c9cc" top="0"></sd-icon>
				</view>
			</view>
		</view>
		
		<!-- 编辑器 -->
		<u-popup mode="bottom" :show="showPopup" closeable round="15" @close="close">
			<view class="popup-box">
				<view class="popup-top">
					编辑资料
				</view>
				<!-- 修改昵称 -->
				<view v-if="ref == 'nickname'" class="edit-info-box">
					<view class="edit-title">您的昵称是？</view>
					<view class="edit-desc">独特的昵称更容易让对方记住你</view>
					<view class="input-box none-border">
						<u--input
							v-model="value"
						    placeholder="请输入昵称"
						    border="bottom"
						    clearable
							:maxlength="10"
							:customStyle="{fontSize:'16px', color:'#909399'}"
						></u--input>
					</view>
				</view>
				<!-- 修改生日 -->
				<view v-if="ref == 'birthday'" class="edit-info-box">
					<view class="edit-title">您的生日是？</view>
					<view class="edit-desc">出生日期我们会为您保密</view>
					<view class="input-box">
						<picker mode="date" :value="value" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{ value ? value : '请选择生日' }}</view>
						</picker>
					</view>
				</view>
				
				<!-- 修改性别 -->
				<view v-if="ref == 'sex'" class="edit-info-box">
					<view class="edit-title">您的性别是？</view>
					<view class="edit-desc">展示给伙伴以便更好的沟通交流</view>
					<view class="input-box">
						<u-radio-group v-model="value" @change="radioGroupChange" size="20" width="25%" placement="row">
							<u-radio :name="1" label="男" ></u-radio>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<u-radio  :name="2" label="女"></u-radio>
						</u-radio-group>
					</view>
				</view>
				
				<!-- 修改身高 -->
				<view v-if="ref == 'height'" class="edit-info-box">
					<view class="edit-title">您的身高是？</view>
					<view class="edit-desc">填写身高信息</view>
					<view class="input-box">
						<picker :value="height_value" mode="selector" :range="height_list" @change="heightChange">
							<view class="uni-input">{{ height_list[height_value] || '请选择' }}</view>
						</picker>
					</view>
				</view>
				
				<!-- 修改签名 -->
				<view v-if="ref == 'sign'" class="edit-info-box">
					<view class="edit-title">您的个性签名是？</view>
					<view class="edit-desc">写下关于你自己的一句话</view>
					<view class="input-box none-border">
						<u--textarea v-model="value" placeholder="请输入签名内容" autoHeight :maxlength="50" style="height: 100px;"></u--textarea>
					</view>
				</view>
				
				<view class="big-button" :style="{backgroundColor:System.big_but_color}" @click="save">保存</view>
			</view>
		</u-popup>
		
		
	</view>
</template>

<script>
	
	export default{
		data() {
			return {
				iconSize:16,
				showPopup:false,
				ref:'',
				value:'',
				height_value:0,//身高下标
				height_list:['160cm','165cm','170cm','175cm','180cm','185cm','190cm']
			}
		},
		onLoad: function() {
			
		},
		onShow() {
			this.isLogin();
			this.$store.dispatch('getUserInfo', (res)=>{
				if(Object.keys(res).length){
					this.userInfo = res;
				}
			})
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods:{
			openpopup(e){
				if(e == 'sex'){
					this.msg('该信息需要通过实名认证修改');
					return;
				}
				this.ref = e;
				this.value = this.$util.removeHTMLTag(this.userInfo[e]);
				this.showPopup = true;
				if(e == 'birthday'){
					if(this.userInfo['birthday'] == '0000-00-00'){
						this.value = '1990-01-01'
					}
				}
				if(e == 'height' && this.userInfo.height){
					let height_value = this.height_list.indexOf(this.userInfo.height);
					if(height_value > -1){
						this.height_value = height_value;
					}
				}
				//console.log('this.value', this.value)
			},
			close(){
				this.showPopup = false;
				this.ref = '';
				this.value = '';
			},
			//获取日期
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					year = year - 30;
				} else if (type === 'end') {
					year = year + 0;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			
			//生日改变
			bindDateChange: function(e) {
				this.value = e.detail.value
			},
			
			//性别变化
			radioGroupChange(e){
				console.log(e)
			},
			
			//选择身高返回
			heightChange(e){
				this.height_value = parseInt(e.detail.value)
				this.value = this.height_list[parseInt(e.detail.value)];
			},
			
			save(){
				if(this.value == ''){
					this.msg('请填写内容');
					return;
				}
				this.$request('UserInfoUpdate', {
					ref: this.ref,
					val: this.value
				},{
					showLoading: true
				}).then((res)=>{
					this.msg(res.data.msg);
					if (res.data.code==200) {
						this.$store.dispatch('getUserInfo', (res)=>{
							if(Object.keys(res).length){
								this.userInfo = res;
							}
						})
						this.close();
					}
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
			padding-top: 15px;
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
				min-width: 0;
				.title{
					font-size: 17px;
				}
				.content{
					flex: 1;
					font-size: 15px;
					text-align: right;
					color: #606266;
					padding: 0 10px;
					white-space:nowrap;
					overflow: hidden;
					text-overflow:ellipsis;
				}
				.cell-icon-box{
					padding-top: 17px;
				}
			}
			/*.cell-item {
				display: flex;
				padding: 18px 5px;
				border-bottom: 1px solid #f0f0f0;
				.title{
					color: #303133;
					font-size: 16px;
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
	
	.avatar-box{
		width: 40px;
		height: 40px;
		border-radius: 5px;
		overflow: hidden;
		margin-right: 15px;
		image{
			width: 100%;
			height: 100%;
		}
	}
	
	.popup-box{
		background-color: #ffffff;
		height: 80vh;
		border-top-left-radius: 20upx;
		border-top-right-radius: 20upx;
		padding: 20upx;
		position: relative;
		.big-button{
			position: absolute;
			bottom: 30px;
			left: 5%;
		}
		.popup-top{
			position: relative;
			text-align: center;
			font-size: 32upx;
			font-weight: bold;
			border-bottom: 2upx solid #f0f0f0;
			padding-bottom: 30upx;
			padding-top: 10rpx;
		}
		.edit-info-box {
			padding: 20upx;
			.edit-title{
				font-size: 36upx;
				color: #303133;
				font-weight: bold;
			}
			.edit-desc{
				font-size: 14px;
				color: #909399;
				line-height: 60upx;
			}
			.input-box{
				padding-top: 60upx;
				border-bottom: 1px solid #f8f8f8;
				padding-bottom: 10rpx;
				.uni-input{
					font-size: 32upx;
					color: #909399;
					line-height: 60upx;
				}
			}
		}
	}
</style>