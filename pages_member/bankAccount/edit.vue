<template>
	<gui-page 
		ref="guipage"
		
		:customStyle="{
			backgroundColor:System.full_bg_color,
		}"
	>
		<template v-slot:gBody>
			<view v-if="System.cheat==2" class="form-box">
				<view class="title-text">基础信息</view>
				<view class="form-block">
					<view class="form-item" @click="openAction()">
						<view class="form-label">
							账户类型
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									{{ruleForm.type_data.label || ''}}
								</view>
								<view v-if="ruleForm.type_data.label==''" class="placeholder-box">请选择</view>
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy"
								size="14" color="#c0c4cc" top="18"></sd-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="form-block" v-if="ruleForm.type_data.type =='zfb' || ruleForm.type_data.type =='bank'">
					<view class="form-item border-b">
						<view class="form-label">
							账户名称
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									:placeholder="ruleForm.type_data.type =='zfb'?'请输入支付宝名称':'请输入银行名称'"
									v-model="ruleForm.account_name"
									type='text'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
						</view>
					</view>
					
					<view class="form-item border-b" v-if="ruleForm.type_data.type =='bank'">
						<view class="form-label">
							分行名称
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请填写分行名称"
									v-model="ruleForm.account_fname"
									type='text'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
						</view>
					</view>
					
					<view class="form-item">
						<view class="form-label">
							账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									:placeholder="ruleForm.type_data.type =='zfb'?'请输入支付宝账号':'请输入银行卡号'"
									v-model="ruleForm.account_number"
									type='number'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
						</view>
					</view>
				</view>
				
				<view class="title-text" v-if="ruleForm.type_data.type =='wx' ">收款二维码</view>
				<view class="form-block" v-if="ruleForm.type_data.type =='wx' ">
					<view class="form-content" style="padding-bottom: 5px;padding-top: 10px;">
						<view class="cover-img-box" @click="addImage">
							<image v-if="ruleForm.account_code" :src="ruleForm.account_code" mode="widthFix"></image>
							<text v-else class="micon icon-tianjia" style="font-size: 24px;color: #606266"></text>
						</view>
					</view>
				</view>
				
				
				<view class="form-block" v-if="ruleForm.type_data.type !=''">
					<view class="form-item">
						<view class="form-label">
							设为默认
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content" style="padding: 15px 5px;">
								<view style="flex: 1;"></view>
								<u-switch v-model="ruleForm.is_default" size="20"
								:activeValue="1"
								:inactiveValue="0"
								inactiveColor="#c8c9cc"
								space="5"
								></u-switch>
							</view>
						</view>
					</view>
				</view>
				
				
				
				<u-button type="primary" text="发 布"
				throttleTime="1000"
				size="large"
				:customStyle="$util.butStyle('primary',{margin:'100px auto 10px auto', backgroundColor:System.big_but_color,width:'90%'})"
				@click="submit()"
				></u-button>
			</view>
			
			 
			 
			<!-- 全屏加载 -->
			
			<up-picker :show="showAction" :columns="columns" keyName="label" @confirm="actionConfirm" @cancel="showAction = false"
			 closeOnClickOverlay @close="showAction = false"></up-picker>
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				showAction:false,
				columns:[
					[
						{
							label: '微信',
							type: 'wx'
						},
						{
							label: '支付宝',
							type: 'zfb'
						},
						{
							label: '银行卡',
							type: 'bank'
						}
					]
				],
				ruleForm: {
					id: 0,
					is_default:0,
					type_data: {
						label: '',
						type: ''
					},
					account_name:'',
					account_fname:'',
					account_number: '',
					account_code:''
				},
				
			}
		},
		onLoad: function(options) {
			if(options.id){
				this.ruleForm.id = options.id;
				//获取账户详情
				this.$request('getUserBankAccountDetail', {id: options.id},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.account){
						this.ruleForm = res.data.data.account;
					}
				})
			}
		},
		onReady() {
			
		},
		methods:{
			//状态操作
			openAction(){
				this.showAction = true;
			},
			actionConfirm(e){
				this.ruleForm.account_name = '';
				this.ruleForm.account_fname = '';
				this.ruleForm.account_number = '';
				this.ruleForm.account_code = '';
				this.ruleForm.type_data = e.value[0];
				this.showAction = false;
			},
			//提交发布
			submit(){
				let ruleForm = JSON.parse(JSON.stringify(this.ruleForm));
				if(ruleForm.type_data.type ==''){
					this.msg('请选择账户类型')
					return;
				}else if(ruleForm.type_data.type =='wx'){
					if(this.ruleForm.account_code == ''){
						this.msg('请上传收款二维码')
						return;
					}
				}else if(ruleForm.type_data.type =='zfb'){
					if(this.ruleForm.account_name == ''){
						this.msg('请填写支付宝账号名称')
						return;
					}
					if(this.ruleForm.account_number == ''){
						this.msg('请填写支付宝账号')
						return;
					}
				}else if(ruleForm.type_data.type =='bank'){
					if(this.ruleForm.account_name == ''){
						this.msg('请填写银行名称')
						return;
					}
					if(this.ruleForm.account_fname == ''){
						this.msg('请填写支行名称')
						return;
					}
					if(this.ruleForm.account_number == ''){
						this.msg('请填写银行账号')
						return;
					}
				}
				
				if(this.isSubmit) return;
				this.isSubmit = true;
				let post_data = JSON.parse(JSON.stringify(this.ruleForm));
				this.$util.throttle(async ()=>{
					this.$request('userBankAccountEdit', post_data,{
						showLoading: true,
					}).then((res)=>{
						this.isSubmit = false;
						if(res.data.code == 200){
							this.msg('操作成功')
							this.goBack(1000);
						}
					})
				})
			},
			
			addImage(){
				this.$util.upload(1, {type:'image', sourceType:['album']}, (res)=>{
					if(res.length){
						this.ruleForm.account_code = res[0];
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.model-box{
		.model-icon{
			width: 80px;
			height: 80px;
			margin: 15px auto;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.model-content{
			font-size: 15px;
			color: #303133;
			line-height: 1.5;
		}
	}
	.address-box{
		font-size: 14px;
		color: #909399;
		line-height: 18px;
		white-space:nowrap;
		overflow: hidden;
		text-overflow:ellipsis;
	}
	.textarea{
		font-size: 17px;
		line-height: 1.3;
	}
	.cover-img-box{
		width: 120px;
		height: 120px;
		line-height: 120px;
		text-align: center;
		font-size: 18px;
		color: #606266;
		border-radius: 2px;
		overflow: hidden;
		border: 1px solid #f0f0f0;
		margin-bottom: 10px;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.form-box{
		padding: 0 10px;
		margin-top: 10px;
		.title-text{
			padding: 0 5px;
			font-size: 15px;
			color: #909399;
			margin-bottom: 5px;
		}
		.form-block{
			background-color: #ffffff;
			border-radius: 5px;
			padding: 0 15px;
			margin-bottom: 10px;
			.form-item{
				display: flex;
				box-sizing: border-box;
				vertical-align: middle;
				flex-direction: row;
				line-height: 50px;
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
				.form-content{
					flex: 1;
					display: flex;
					padding-right: 5px;
					.content{
						flex: 1;
						min-width: 0;
						text-align: right;
						font-size: 16px;
						color: #303133;
						display: flex;
						vertical-align: top;
						.data-box{
							flex: 1;
							line-height: 32px;
							text-align: right;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
						}
						.input-box{
							flex: 1;
							
							.input{
								height: 50px;
							}
						}
						.placeholder-box{
							flex: 1;
							text-align: right;
							font-size: 15px;
							color: #606266;
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
	
	.photos-box{
		// background-color: #ffffff;
		padding: 10px;
		display: flex;
		flex-wrap: wrap;
		.img-box{
			width:calc((100vw - 55px) / 3);
			height: calc((100vw - 50px) / 3);
			margin: 5px;
			border-radius: 5px;
			overflow: hidden;
			position: relative;
			.icon-guanbi1{
				position: absolute;
				top: 5px;
				right: 5px;
				color: red;
			}
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.add-box{
		width:calc((100vw - 55px) / 3);
		height: calc((100vw - 50px) / 3);
		margin: 5px;
		border-radius: 5px;
		overflow: hidden;
		background-color: #f8f8f8;
		text-align: center;
		padding-top: 30px;
		.icon-tianjia{
			font-size: 24px;
			line-height: 30px;
		}
		.add-text{
			font-size: 14px;
			color: #909399;
			padding-top: 10px;
		}
	}
	
	.popup-mini-box{
		height: 50vh;
		.popup-but-title{
			padding: 15px 20px;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #e7e6e4;
			.but-box{
				font-size: 17px;
			}
			.cancel{
				color: #909399;
			}
			.true{
				color: #287eef;
			}
		}
		.scroll-Y{
			height: 100%;
			padding-bottom: 60px;
			.list-box{
				.list{
					padding: 0 15px 0 20px;
					.list-item{
						padding: 15px 0;
						display: flex;
						justify-content: space-between;
						border-bottom: 1px solid #f4f4f5;
						.list-title{
							font-size: 17px;
							color: #303133;
							flex: 1;
							max-height: 30px;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
							min-width: 0;
						}
						.action-box{
							padding-right: 10px;
						}
					}
				}
				
			}
		}
	}
</style>