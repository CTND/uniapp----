<template>
	<gui-page ref="guipage"
		>
		<template v-slot:gBody>
			<view class="form-box" v-if="System.cheat==2">
				<view class="form-block">
					<view class="form-item item-b">
						<view class="form-label">
							联系人
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入姓名"
									v-model="ruleForm.realname"
									type='text'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy" 
								size="14" color="#c0c4cc" top="10"></sd-icon>
							</view>
						</view>
					</view>
					
					<view class="form-item item-b">
						<view class="form-label">
							联系电话
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入"
									v-model="ruleForm.mobile"
									type='text'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy" 
								size="14" color="#c0c4cc" top="10"></sd-icon>
							</view>
						</view>
					</view>
					
					<view class="form-item item-b">
						<view class="form-label">
							微信
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入微信号"
									v-model="ruleForm.wx"
									type='text'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy" 
								size="14" color="#c0c4cc" top="10"></sd-icon>
							</view>
						</view>
					</view>
					
					<view class="form-block">
						<view class="column-box">
							<view class="form-label">
								申请说明
								<text class="micon required"></text>
							</view>
							<view class="column-content">
								<u--textarea
								class="textarea"
								v-model="ruleForm.desc" 
								placeholder="请输入内容" 
								height="100px"
								border="none"
								style="font-size: 17px;"
								:disableDefaultPadding="true"
								></u--textarea>
							</view>
						</view>
					</view>
					
					
				</view>	
				<u-button type="primary" text="提交申请"
				throttleTime="1000"
				size="large"
				:customStyle="$util.butStyle('primary',{marginTop:'60px', backgroundColor:System.big_but_color,width:'90%'})"
				@click="submit()"
				></u-button>
			</view>
			<!--加载中-->
			 
			 
			
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				ruleForm:{
					id: 0,
					realname:'',
					mobile:'',
					wx:'',
					desc:''
				},
			}
		},
		onLoad: function(options) {
			console.log('options', options)
			if(options.id){
				this.ruleForm.id = options.id;
			}
		},
		onShow() {
			
		},
		methods:{
			submit() {
				if(this.ruleForm.realname == ''){
					this.msg('请填写姓名');
					return;
				}
				if(this.ruleForm.mobile == ''){
					this.msg('请填写电话');
					return;
				}
				this.$util.throttle(async ()=>{
					this.$request('transferStoreApply', this.ruleForm,{
						showLoading: false,
					}).then((res)=>{
						console.log('请求数据', res)
						this.msg('提交成功');
						setTimeout(()=>{
							this.goBack();
						}, 2000)
					})
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
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
</style>