<template>
	<gui-page 
		ref="guipage"
		
		:customStyle="{
			backgroundColor:System.full_bg_color
		}"
	>
		<template v-slot:gBody>
			<view class="form-box">
				<view class="title-text">收货地址</view>
				<view class="form-block">
					<view class="form-item">
						<view class="form-label">
							<view>
								真实姓名
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入真实姓名"
									v-model="ruleForm.realname"
									type='text'
									border="none"
									:maxlength="8"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
						</view>
					</view>
				</view>	
				<view class="form-block">
					<view class="form-item">
						<view class="form-label">
							<view>
								手机号码
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入手机号码"
									v-model="ruleForm.mobile"
									type='number'
									border="none"
									:maxlength="15"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
						</view>
					</view>
				</view>
				
				
				<!-- <view class="form-block">
					<view class="column-box">
						<view class="form-label">
							详细地址
							<text class="micon required"></text>
						</view>
						<view class="column-content">
							<up-textarea
							class="textarea"
							v-model="ruleForm.address" 
							placeholder="请输入详细地址 省份 城市 区/县 街道 小区 单元号" 
							height="40px"
							border="none"
							style="font-size: 17px;"
							:disableDefaultPadding="true"
							></up-textarea>
						</view>
					</view>
				</view> -->
				<view class="form-block">	
					<view class="form-item select-box" style="padding: 0;">
						<view class="form-label">
							<view>
								选择位置
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content" style="height: 60px;padding: 0;overflow: hidden;">
							<view class="content" style="display: block;padding: 0 5px;">
								<view class="data-box" @click="getLocation()" style="font-size: 15px;padding-left: 5px;line-height: 20px;"
								:style="{paddingTop:ruleForm.name == ''? '36rpx':'16rpx'}"
								>
									{{ruleForm.name || '选择位置'}}
								</view>
								<view class="address-box" v-if="ruleForm.name!=''">
									<up-input
										v-model="ruleForm.notes"
									    placeholder="请填写详细地址"
									    border="none"
										fontSize="14"
										color="#606266"
										inputAlign="right"
										:placeholderStyle="{fontSize:'14px',color:'#ceccca'}"
										:customStyle="{paddingRight:'5px',height:'25px'}"
									  ></up-input>
								</view>
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy" 
								size="14" color="#c0c4cc" top="20"></sd-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="form-block">	
					<view class="form-item select-box">
						<view class="form-label">
							设为默认
						</view>
						<view class="form-content">
							<view class="content" style="padding-top: 5px;">
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
				
				
				
				<u-button type="primary" text="提交"
				throttleTime="1000"
				size="large"
				:customStyle="$util.butStyle('primary',{margin:'20px auto', backgroundColor:System.big_but_color,width:'90%'})"
				@click="submit()"
				></u-button>
			</view>
		</template>
		
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				ruleForm: {
					id: 0,
					realname:'',
					mobile:'',
					notes:'',
					is_default: 1,
					latitude:'',
					longitude:'',
					adcode:'',
					city:'',
					citycode:'',
					district:'',
					province:'',
					address:'',
					name: ''
				},
			}
		},
		onLoad: function(options) {
			if(options.id){
				this.$request('memberAddressInfo', {id: options.id},{
					showLoading: false,
				}).then((res)=>{
					console.log('详情', res)
					if(res.data.data.address){
						this.ruleForm = res.data.data.address;
					}
				})
			}
		},
		onShow() {
			
		},
		methods:{
			
			submit(){
				if(this.ruleForm.realname == ''){
					this.msg('请填写姓名');
					return;
				}
				if(this.ruleForm.mobile == ''){
					this.msg('请填写电话');
					return;
				}
				if(this.ruleForm.name == ''){
					this.msg('请选择位置');
					return;
				}
				if(this.ruleForm.notes == ''){
					this.msg('请选备注详细地址');
					return;
				}
				if(this.ruleForm.city == ''){
					//this.ruleForm.name = this.ruleForm.address;
				}
				if(this.isSubmit) return;
				this.isSubmit = true;
				this.$request('memberAddressEdit', this.ruleForm,{
					showLoading: false,
				}).then((res)=>{
					this.msg(res.data.msg);
					this.isSubmit = false;
					this.goBack(1000);
				})
			},
			//打开选择位置
			getLocation(){
				this.$util.checkLocation(1, (res)=>{
					console.log('得到的位置数据', res)
					if(Object.keys(res).length){
						let location_data = JSON.parse(JSON.stringify(res));
						this.ruleForm = Object.assign({}, this.ruleForm, location_data);
					}else{
						this.msg('获取位置错误');
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
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
				padding: 0px 2px;
				box-sizing: border-box;
				vertical-align: middle;
				
				.form-label{
					font-size: 32rpx;
					color: #303133;
					line-height: 32px;
					display: flex;
					flex-direction: column;
					justify-content: center;
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
						font-size: 15px;
						color: #303133;
						display: flex;
						padding: 0 10px;
						padding-right: 5px;
						vertical-align: top;
						.data-box{
							flex: 1;
							line-height: 32px;
							text-align: right;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
						}
						.address-box{
							font-size: 14px;
							color: #909399;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
							height: 25px;
							line-height: 25px;
							padding-left: 10px;
						}
						.input-box{
							flex: 1;
							.input{
								// height: 32px;
								// line-height: 32px;
							}
						}
						.placeholder-box{
							text-align: right;
							font-size: 15px;
							color: #909399;
							line-height: 32px;
						}
					}
					.icon-box{
						padding-left: 0px;
					}
				}
			}
			.select-box{
				padding: 10px 0;
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