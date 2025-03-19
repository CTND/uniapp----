<template>
	<gui-page 
	:customFooter="custom_Footer"
	ref="guipage"
		>
		<template v-slot:gBody>
			
			<view class="form-box" v-if="System.cheat==2">
				<view class="form-block">
					<view class="form-item item-b" @click="openLocation()">
						<view class="form-label">
							店铺位置
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="data-box" v-if="ruleForm.address">{{ruleForm.address || ''}}</view>
								<view class="placeholder-box" v-if="ruleForm.address == ''">请选择</view>
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy" 
								size="14" color="#c0c4cc" top="10"></sd-icon>
							</view>
						</view>
					</view>
					<view class="form-item item-b" style="padding: 0;">
						<up-textarea
						v-model="ruleForm.address" 
						placeholder="请输入内容" 
						height="40px"
						border="none"
						placeholderStyle="color:#ceccca;font-size:16px;"
						:disableDefaultPadding="true"
						></up-textarea>
					</view>
					<view class="form-item item-b">
						<view class="form-label">
							信息标题
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入标题"
									v-model="ruleForm.title"
									type='text'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box">
								
							</view>
						</view>
					</view>
					
					<view class="form-item item-b" @click="typePopup = true">
						<view class="form-label">
							选择分类
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="data-box" v-if="ruleForm.type_title">{{ruleForm.type_title || ''}}</view>
								<view class="placeholder-box" v-if="ruleForm.type_title == ''">请选择</view>
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy" 
								size="14" color="#c0c4cc" top="10"></sd-icon>
							</view>
						</view>
					</view>
					
					<view class="form-item item-b">
						<view class="form-label">
							店铺面积
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入面积"
									v-model="ruleForm.extent"
									type='digit'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box" style="padding-top: 8px;">
								<text class="hotTxt">
									m<text class="hot-txt">2</text>
								</text>
							</view>
						</view>
					</view>
					
					<template v-if="ruleForm.type == 'buy'">
						<view class="form-item item-b" >
							<view class="form-label">
								转&nbsp;&nbsp;让&nbsp;&nbsp;费
								<text class="micon required"></text>
							</view>
							<view class="form-content">
								<view class="content">
									<view class="input-box">
										<u--input
										class="input"
										placeholder="请输入转让费"
										v-model="ruleForm.money"
										type='digit'
										border="none"
										:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
										inputAlign="right"
										:disableDefaultPadding="true"
										/>
									</view> 
								</view>
								<view class="icon-box" style="padding-top: 8px;">
									元
								</view>
							</view>
						</view>
						<view class="form-item item-b" >
							<view class="form-label">
								租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
								<text class="micon required"></text>
							</view>
							<view class="form-content">
								<view class="content">
									<view class="input-box">
										<u--input
										class="input"
										placeholder="请输入租金"
										v-model="ruleForm.rent"
										type='digit'
										border="none"
										:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
										inputAlign="right"
										:disableDefaultPadding="true"
										/>
									</view> 
								</view>
								<view class="icon-box" style="padding-top: 8px;">
									元/月
								</view>
							</view>
						</view>
					</template>
					
					
					<view class="form-item item-b">
						<view class="form-label">
							联&nbsp;&nbsp;系&nbsp;&nbsp;人
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入联系人"
									v-model="ruleForm.realname"
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
							联系电话
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入联系电话"
									v-model="ruleForm.mobile"
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
					
					<view v-if="ruleForm.type == 'buy'" class="form-item" style="border-top: 1px solid #f0f0f0;">
						<view class="form-label">
							店铺照片
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="photos-box">
								<view class="img-box" v-for="(item, index) in ruleForm.files_list" :key="index" 
								@click="$util.previewImage(index, this.ruleForm.files_list)">
									<image :src="item" 
									:lazy-load="true"
									mode="aspectFill"
									></image>
									<view class="micon icon-guanbi1" @click.stop="deleteImg(index)"></view>
								</view>
								<view v-if="this.ruleForm.files_list < 9" class="add-box" @click="addImage()">
									<view class="micon icon-tianjia"></view>
									<view class="add-text">添加照片</view>
								</view>
							</view>
						</view>
					</view>
					
					
					
				</view>
				
				<view class="form-block">
					<view class="column-box">
						<view class="form-label">
							店铺说明
							<text class="micon required"></text>
						</view>
						<view class="column-content">
							<up-textarea
							class="textarea"
							v-model="ruleForm.store_desc" 
							placeholder="请输入内容" 
							height="100px"
							border="none"
							placeholderStyle="color:#ceccca;font-size:16px;"
							:disableDefaultPadding="true"
							></up-textarea>
						</view>
					</view>
				</view>
				
				<sd-agree-link v-if="setting.id" :ids="setting.agrees" @agree-change="agreeChange"></sd-agree-link>
				
				<u-button type="primary" text="确 定"
				throttleTime="1000"
				size="large"
				:customStyle="$util.butStyle('primary',{marginTop:'60px', backgroundColor:System.big_but_color,width:'90%'})"
				@click="submit()"
				></u-button>
			</view>
			<view v-else>
				<view class="push-desc-box">
					<view style="font-size: 16px;color: #303133;font-weight: bold;padding: 10px;">
						发布须知：
					</view>
					<view class="desc">
						<text>{{setting.push_desc}}</text>
					</view>
				</view>
			</view>
			<!-- 全屏加载 -->
			
			
			<u-popup
			:show="typePopup" 
			mode="bottom"
			:round="10"
			@close="closeTypePopup()"
			>
				<view class="popup-mini-box" >
					<scroll-view  scroll-y="true" class="scroll-Y" >
						<view class="list-box">
							<view class="list" hover-class="list-hover" hover-stay-time="100"
							v-for="(item, index) in type_list" :key="index"
							@click="checkClass(item)"
							>
								<view class="list-item" >
									<view class="list-title">
										{{item.title}}
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</u-popup>
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				setting:{
					alter_text: '支付后才可查看联系方式哦！', 
					default_color:'#2b85e4',
					template_ids:''
				},
				agree_checked:0,
				type_list:[],
				typePopup:false,
				
				//form
				ruleForm:{
					id:0,
					type:'',
					title: '',
					province: '',
					city: '',
					area: '',
					address: '',
					provincecode: '',
					citycode: '',
					adcode: '',
					tid: 0,
					type_title:'',
					money: '',
					unit: '月',
					rent: '',
					extent: '',
					realname: '',
					mobile: '',
					store_desc: '',
					files_list: [],
				},
			}
		},
		onLoad: function(options) {
			if(options.type){
				this.ruleForm.type = options.type;
				if(options.type == 'find'){
					this.ruleForm.title = '诚心找店'
				}else{
					this.ruleForm.title = '诚心转让'
					this.ruleForm.store_desc = '地理位置优越，采光好，通风通透，格局正，人流量大。现个人原因诚心出让。'
				}
			}
			this.getSetting();
			
		},
		onShow() {
			this.getTypes();
		},
		methods:{
			checkClass(data){
				this.ruleForm.tid = data.id;
				this.ruleForm.type_title = data.title;
				this.closeTypePopup();
			},
			//关闭分类选择器
			closeTypePopup(){
				console.log('closeTypePopup')
				this.typePopup = false;
			},
			getTypes(){
				this.type_list = [];
				let columns = [];
				this.$request('transferStoreTypeList', {},{
					showLoading: false
				}).then((res)=>{
					console.log('获取分类', res)
					if(res.data.data.list){
						this.type_list = res.data.data.list;
					}
					this.$forceUpdate();
				})
				
				
			},
			agreeChange(e){
				this.agree_checked = e;
			},
			//获取设置
			getSetting(){
				this.$request('transferStoreGetSetting', {},{
					showLoading: false,
				}).then((res)=>{
					console.log('setting', res)
					if(res.data.data.setting){
						this.setting = res.data.data.setting;
					}
				})
			},
			addImage(){
				const t = this;
				uni.chooseImage({
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册或者拍照
					success: async function(res) {
						const tempFilePaths = res.tempFilePaths;
						for(var i = 0; i < res.tempFilePaths.length; i++){
							if(t.ruleForm.files_list.length < 9){
								uni.uploadFile({
									url: t.$util.uploadUrl('image'),
									filePath: res.tempFilePaths[i],
									name: 'file[]',
									formData: {},
									success: function(res) {
										var path_str = JSON.parse(res.data);
										if (path_str.code == 200) {
											t.ruleForm.files_list.push(path_str.data.file_url)
										}
									}
								});
							}
						}
					}
				});
			},
			deleteImg(index){
				const t = this;
				uni.showModal({
					title: '提示',
					content: '确定要删除该照片吗？',
					success: function (res) {
						if (res.confirm) {
							t.ruleForm.files_list.splice(index, 1);
						}
					}
				});
			},
			submit(){
				const t = this;
				if(this.ruleForm.title == ''){
					this.msg('标题不能为空');
					return false;
				}
				if(this.ruleForm.tid == 0){
					this.msg('分类不能为空');
					return false;
				}
				if(this.ruleForm.address == ''){
					this.msg('位置不能为空');
					return false;
				}
				if(this.ruleForm.extent == ''){
					this.msg('面积不能为空');
					return false;
				}
				if(this.ruleForm.realname == ''){
					this.msg('联系人不能为空');
					return false;
				}
				if(this.ruleForm.mobile == ''){
					this.msg('联系电话不能为空');
					return false;
				}
				if(this.agree_checked == 0){
					this.msg('请阅读并同意协议');
					return false;
				}
				var myreg = /^[1][0-9]{10}$/;
				if (!myreg.test(this.ruleForm.mobile)){
					uni.showToast({ title: '请正确填写手机号码', icon : "none"});
					return false;
				}
				if(this.ruleForm.type == 'buy'){
					if(this.ruleForm.money == ''){
						this.msg('转让费不能为空');
						return false;
					}
					if(this.ruleForm.rent == ''){
						this.msg('租金不能为空');
						return false;
					}
					if(this.ruleForm.files_list.length == 0){
						this.msg('店铺照片不能为空');
						return false;
					}
				}
				t.submitForm();
			},
			
			submitForm(){
				this.$util.throttle(async ()=>{
					this.$request('transferStorePush', this.ruleForm,{
						showLoading: true,
					}).then((res)=>{
						this.msg(res.data.msg);
						setTimeout(()=>{
							if(this.ruleForm.type == 'buy'){
								this.navTo('/pages_transfer_store/infoPipei',{login:true},{id:res.data.data.id, showPay:1}, 'redirectTo');
							}else{
								this.navTo('/pages_transfer_store/infoList',{login:true},{type:'find',use_city:'1',showType:'1'}, 'redirectTo');
							}
							
						}, 1000)
						/*if(res.data.code == 200){
							setTimeout(()=>{
								this.navTo('/pages_transfer_store/pay',{login:true},{order_id:res.data.data.order_id}, 'redirectTo');
							}, 1000)
						}else if(res.data.code == 201){
							setTimeout(()=>{
								this.navTo('/pages_transfer_store/infoDetail',{login:true},{id:res.data.data.id}, 'redirectTo');
							}, 1000)
						}*/
					})
				})
			},
			//选择位置
			openLocation(){
				this.$util.checkLocation(1, (res)=>{
					console.log('选择位置', res)
					if(Object.keys(res)){
						this.ruleForm.province = res.province;
						this.ruleForm.provincecode = res.provincecode;
						
						this.ruleForm.city = res.city;
						this.ruleForm.citycode = res.citycode;
						
						this.ruleForm.area = res.district;
						this.ruleForm.adcode = res.adcode;
						
						this.ruleForm.address = res.address;
					}else{
						this.msg('获取位置错误');
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-mini-box{
		height: 50vh;
		.popup-but-title{
			padding: 16px 15px 15px;
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
			height: 50vh;
			.list-box{
				.list{
					padding: 0 15px 0 20px;
					.list-item{
						padding: 5px 0;
						display: flex;
						justify-content: space-between;
						border-bottom: 1px solid #f4f4f5;
						.list-title{
							font-size: 15px;
							color: #303133;
							flex: 1;
							max-height: 30px;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
							min-width: 0;
							padding: 2px 0;
						}
						.action-box{
							padding-right: 10px;
						}
					}
				}
				
			}
		}
	}
	.select-box{
		padding: 30px 15px;
		width: 90vw;
		.block-box{
			background-color: #ffffff;
			padding: 15px;
			border-radius: 10px;
			display: flex;
			border: 1px dashed #faebde;
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
							padding-top: 4px;
							.input{
								height: 30px;
								line-height: 30px;
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
						min-width: 30px;
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