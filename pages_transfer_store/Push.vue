<template>
	<gui-page 
	:customFooter="custom_Footer"
	ref="guipage"
		>
		<template v-slot:gBody>
			<view v-if="setting.push_desc" class="push-desc-box">
				<view style="font-size: 16px;color: #303133;font-weight: bold;padding: 10px;">
					发布须知：
				</view>
				<view class="desc">
					<text>{{setting.push_desc}}</text>
				</view>
			</view>
			<view class="select-box" v-if="System.cheat==2">
				<view class="block-box" style="margin-bottom: 30px;">
					<view class="icon-box">
						<view class="micon icon-mendian2" 
						style="font-size: 36px;"
						:style="{color:setting.default_color}"
						></view>
					</view>
					<view class="content-box">
						<u-button type="primary" text="我要找店"
						throttleTime="1000"
						size="large"
						:customStyle="$util.butStyle('primary',{margin:'auto', backgroundColor:setting.default_color,width:'80%'})"
						@click="setPush('find')"
						></u-button>
					</view>
				</view>
				<view class="block-box">
					<view class="icon-box">
						<view class="micon icon-zhuanfafenxiang" 
						style="font-size: 36px;"
						:style="{color:setting.default_color}"
						></view>
					</view>
					<view class="content-box">
						<u-button type="primary" text="店铺转让/转租"
						throttleTime="1000"
						size="large"
						:customStyle="$util.butStyle('primary',{margin:'auto', backgroundColor:setting.default_color,width:'80%'})"
						@click="setPush('buy')"
						></u-button>
					</view>
				</view>
			</view>
			<!-- 全屏加载 -->
			
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				showPopup:true,
				setting:{
					alter_text: '支付后才可查看联系方式哦！',
					default_color:'#2b85e4',
					push_desc:''
				},
			}
		},
		onLoad: function() {
			this.getSetting();
		},
		onShow() {
			
		},
		methods:{
			//获取设置
			getSetting(){
				this.$request('transferStoreGetSetting', {},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.setting){
						this.setting = res.data.data.setting;
					}
				})
			},
			setPush(e){
				this.type = e;
				this.showPopup = false;
				this.navTo('/pages_transfer_store/Form',{login:true}, {type: e})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.push-desc-box{
		padding: 15px;
		padding-bottom: 5px;
		.desc{
			background-color: #ffffff;
			padding: 15px;
			font-size: 15px;
			line-height: 1.75;
			color: #303133;
		}
	}
	.select-box{
		padding: 30px 15px;
		.block-box{
			background-color: #ffffff;
			padding: 15px;
			
			border-radius: 10px;
			display: flex;
			.icon-box{
				width: 60px;
				height: 60px;
				line-height: 60px;
				text-align: center;
				border-radius: 8px;
				background-color: #faebde;
			}
			.content-box{
				flex: 1;
				padding: 5px 0;
			}
		}
	}
	.hotTxt{
		font-size: 16px;
		position: relative; 
	}
	.hot-txt{
		position: relative;
		top: -3px; 
		font-size: 10px;
	}
	.form-box{
		padding: 10px 0;
		.form-block{
			background-color: #ffffff;
			padding: 0 15px;
			margin-bottom: 10px;
			.form-item{
				display: flex;
				padding: 10px 2px;
				box-sizing: border-box;
				vertical-align: middle;
				
				.form-label{
					font-size: 17px;
					color: #303133;
					line-height: 36px;
				}
				.required::after{
					content: "\e69b";
					color: red;
					font-size: 10px;
					vertical-align:text-top;
				}
				.form-content{
					flex: 1;
					display: flex;
					min-width: 0;
					.content{
						flex: 1;
						min-width: 0;
						text-align: right;
						font-size: 16px;
						color: #303133;
						display: flex;
						padding: 0 10px;
						vertical-align: top;
						.data-box{
							flex: 1;
							line-height: 35px;
							text-align: right;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
						}
						.input-box{
							flex: 1;
							padding-top: 2px;
							.input{
								height: 32px;
								line-height: 35px;
							}
						}
						.placeholder-box{
							flex: 1;
							text-align: right;
							font-size: 16px;
							color: #909399;
							line-height: 35px;
						}
					}
					.icon-box{
						padding-left: 5px;
					}
				}
			}
			.item-b{
				border-bottom: 1px solid #e7e6e4;
			}
			//纵向布局
			.column-box{
				padding: 10px 0;
				.form-label{
					font-size: 17px;
					color: #303133;
				}
				.required::after{
					content: "\e69b";
					color: red;
					font-size: 10px;
					vertical-align:text-top;
				}
				.column-content{
					font-size: 17px;
					color: red;
					.textarea{
						font-size: 17px;
						color: red;
						line-height: 1.3;
					}
				}
			}
		}
	}
</style>