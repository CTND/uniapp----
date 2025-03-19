<template>
	<gui-page 
	ref="guipage"
		
	:customFooter="true"
	:showFooterBar="false"
	:customStyle="{
		backgroundColor:System.full_bg_color,
		padding:'10px',
		height:'100vh'
	}"
	>
		<template v-slot:gBody>
			<view>
				<view style="font-size: 18px;color: #303133;font-weight: bold;padding: 10px">{{formData.form_name || ''}}</view>
				<view class="form-box">
					<view v-for="(item, index) in formData.item_list" :key="index"
					class="form-block">
						<view :class="[item.ref == 'textarea'?'column-box':'form-item']">
							<view class="form-label" v-if="item.ref != 'imageupload'">
								{{item.lable || ''}}
								<text class="micon required" v-if="item.must == '1'"></text>
							</view>
							<view class="form-content">
								<view class="content">
									<template v-if="item.ref == 'text' || item.ref == 'idcard'">
										<up-input
										class="input"
										v-model="item.value"
										:name="item.ref == 'idcard'?'idcard':'name'+index" 
										:type="item.ref == 'idcard'?'idcard':'text'"
										placeholderStyle="font-size:16px;color:#ceccca;line-height:60rpx"
										:customStyle="{paddingRight:'10px',height:'60rpx',lineHeight:'60rpx'}"
										:placeholder="'请输入'+item.lable"
										clearable
										border="none"
										:disableDefaultPadding="true"
										></up-input>
									</template>
									<template v-if="item.ref == 'textarea'">
										<up-textarea 
										v-model="item.value"
										:name="'name'+index"  
										:placeholder="'请输入'+item.lable"
										autoHeight 
										style="padding: 5px;"
										:maxlength="50"
										border="none"
										height="100"
										></up-textarea>
									</template>
									<template v-if="item.ref == 'imageupload'">
										<view class="img-box" v-if="item.value">
											<image :src="item.value" 
											:lazy-load="true"
											mode="aspectFill"
											></image>
											<view class="micon icon-guanbi1" @click.stop="deleteImg(index)"></view>
										</view>
										<view v-if="item.value==''" class="add-box" @click="addImage(index)">
											<view class="micon icon-tianjia"></view>
											<view class="add-text">{{item.lable}}</view>
										</view>
									</template>
								</view>
								<!-- <view class="icon-box" v-if="item.ref != 'textarea'">
									<sd-icon name="icon-iconfonticonfonti2copycopy" 
									size="14" color="#c0c4cc" top="10"></sd-icon>
								</view> -->
							</view>
						</view>
					</view>
					
					<view class="desc-box" v-if="formData.form_desc">
						{{formData.form_desc}}
					</view>
					<view v-if="formData.agree.id" class="agree-box" :style="{color:System.big_but_color}" >
						<text @click="showAgreeCard = true">请阅读并签署【{{formData.agree.title}}】</text> 
						<text @click="showCard = true">->签署</text>
					</view>
				</view>
				
				<!-- 付款部分 -->
				<view class="form-box" style="margin-top: 10px;padding: 0 10px;" v-if="formData.money>0">
					<view class="form-item">
						<view class="form-label">
							报名金额：
						</view>
						<view class="form-content">
							<view class="content">
								<view class="data-box" style="text-align: left;color: red;">
									￥{{formData.money}}
								</view>
							</view>
							<view class="icon-box small-but" @click="toPay">
								去付款
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 全屏加载 -->
			
			<u-popup mode="bottom" :show="showAgreeCard" closeable :round="10" @close="AgreeCardClose">
				<view class="popup-box">
					<view class="popup-top">
						{{formData.agree.title}}
					</view>
					<scroll-view scroll-y="true" class="scroll-y">
						<view style="padding: 10px;">
							<u-parse :content="formData.agree.content"></u-parse>
						</view>
					</scroll-view>
				</view>
			</u-popup>
			<u-popup mode="bottom" :show="showCard" closeable :round="10" @close="cardClose">
				<view class="sign-box">
					<view style="font-size: 12px;color: #909399;">
						请在下方签字：
					</view>
					<view class="gui-margin-top gui-bg-white gui-dark-bg-level-3"
					:style="{height:canvas.height+'rpx', overflow:'hidden'}">
						<canvas id="graceSign" 
						canvas-id="graceSign" 
						@touchstart="tstart" 
						@touchmove="tmove" 
						:style="{width:canvas.width+'rpx', height:canvas.height+'rpx'}">
						</canvas>
					</view>
					<view class="gui-margin-top gui-flex gui-rows gui-space-between" style="border-top: 1px solid #f0f0f0;">
						<text 
						class="sign-btn gui-text gui-color-gray gui-block" 
						@tap="canvasInit">重新签名</text>
						<text 
						class="sign-btn gui-text gui-primary-color gui-block" 
						@tap="saveSign()">提交签名</text>
					</view>
				</view>
			</u-popup>
			
		</template>
		<template v-slot:gFooter>
			<u-button type="primary" text="提交保存"
			shape="circle" throttleTime="1000"
			size="large"
			:customStyle="$util.butStyle('primary',{gra:2,margin:'10px auto',width:'80%'})"
			@click="submit"
			></u-button>
		</template>
	</gui-page>
</template>

<script>
	import payParam from '@/common/js/payParam.js'; 
	import graceChecker from "@/common/js/checker.js";
	export default{
		data() {
			return {
				form_id:0,
				showCard:false,
				showAgreeCard:false,
				formData:{
					form_id: 0,
					form_name: '',
					item_list: [],
					limit_allnum: 0,
					limit_age: 0,
					limit_num: 1,
					start_date: '',
					end_date: '',
					sign:0,
					agree_id:0,
					agree:{id:0},
					form_desc:''
				},
				is_pay: 0, //是否付款
				sign_url:'',//上传后的图片地址
				canvas : {
					width     : 690, // 画布宽度，单位 rpx
					height    : 380, // 画布高度, 单位 rpx
					bgColor   : '#FFFFFF', // 画布演示
					textColor : '#000000', // 画笔颜色
					widthIn   : 300,   // 自动计算转换为 px
					heightIn  : 300,  // 自动计算转换为 px
					size      : 3,    // 画笔粗细
				},
				ctx           : null, // 画布对象,
				drawTimer     : null, // 演示存储计算器,
				isNew         : true  ,// 画布是否是空白的
				tempFilePath:'',//临时文件
				img_url:'',
				file_source:'',
			}
		},
		onLoad: function(options) {
			const t = this;
			console.log('options', options)
			if(options.scene){
				var scene = decodeURIComponent(options.scene);
				var str = t.$util.base64_decode(scene);
				var form_id = t.$util.geturlParam(str,'form_id');
				if(form_id){
					this.form_id = form_id;
					this.getFormData();
				}else{
					this.goBack()
				}
			}else{
				//console.log('scene不存在')
				if(options.form_id){
					this.form_id = options.form_id;
					this.getFormData();
				}else{
					this.goBack()
				}
			}
		},
		onShow() {
			this.isLogin();
		},
		mounted : function(){
			this.canvasInit();
		},
		methods:{
			AgreeCardClose(){
				this.showAgreeCard = false;
			},
			cardClose(){
				this.showCard = false;
			},
			//签名
			canvasInit(){
				setTimeout(()=>{
					this.ctx             = uni.createCanvasContext('graceSign');
					this.canvas.widthIn  = uni.upx2px(this.canvas.width);
					this.canvas.heightIn = uni.upx2px(this.canvas.height);
					this.ctx.setFillStyle(this.canvas.bgColor);
					this.ctx.fillRect(0,0,this.canvas.widthIn, this.canvas.heightIn);
					this.ctx.draw(true);
					this.ctx.setStrokeStyle(this.canvas.textColor);
					this.ctx.setLineWidth(this.canvas.size);
					this.isNew = true;
				}, 500);
			},
			tstart (e) {
				var x = e.touches[0].x;
				var y = e.touches[0].y;
				this.ctx.moveTo(x,y);
				this.isNew = false;
			},
			tmove (e){
				var x = e.touches[0].x;
				var y = e.touches[0].y;
				this.ctx.lineTo(x, y);
				this.ctx.stroke();
				this.ctx.draw(true, this.saveImg);
				this.ctx.moveTo(x, y);
			},
			// 手写完毕后自动生成一个临时图片文件
			// 您可以利用临时图片完成后续的上传等工作
			saveImg(){
				const t = this;
				if(this.drawTimer != null){clearTimeout(this.drawTimer);}
				this.drawTimer = setTimeout(()=>{
					uni.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: this.widthIn,
						height: this.heightIn,
						destWidth: this.widthIn,
						destHeight: this.heightIn,
						canvasId: 'graceSign',
						success:(res)=>{
							// 在H5平台下，tempFilePath 为 base64
							console.log(res.tempFilePath);
							t.tempFilePath = res.tempFilePath;
						} 
					});
				}, 200);
			},
			//提交签名
			saveSign(){
				const t = this;
				if(this.tempFilePath == ''){
					uni.showToast({ title: '签名内容不能为空', icon: "none" });
					return;
				}
				uni.uploadFile({
					url: t.$util.uploadUrl('image'),
					filePath: this.tempFilePath,
					name: 'file[]',
					formData: {},
					success: function(res) {
						var path_str = JSON.parse(res.data);
						if (path_str.code == 200) {
							//console.log('path_str', path_str)
							t.sign_url = path_str.data.file_url;
							t.showCard = false;
							t.msg('签名成功');
						}
					}
				});
			},
			getFormData(){
				this.$util.throttle(async ()=>{
					this.$request('getFormData', {form_id:this.form_id},{
						showLoading: false,
						cache: 0
					}).then((res)=>{ 
						if(res.data.data.formData){
							this.formData = res.data.data.formData;
							uni.setNavigationBarTitle({
								title: res.data.data.formData.form_name
							});
						}
					})
				})
				
			},
			submit(){
				this.isLogin();
				//定义表单规则
				var rule = [];
				var formData = {};
				let item_list = this.formData.item_list;
				for(var i = 0; i < item_list.length; i++){
					if(item_list[i].must == '1' && item_list[i].value == ''){
						this.msg(item_list[i].lable+'不能为空')
						return;
					}
					if(item_list[i].ref == 'idcard'){
						this.formData.idcard = item_list[i].value;
					}
				}
				
				//判断签署协议
				if(this.formData.sign == 1 && this.sign_url == ''){
					uni.showToast({ title: '请签署协议', icon: "none" });
					return;
				}
				if(this.formData.money > 0 && this.is_pay == 0){
					uni.showToast({ title: '请先支付费用', icon: "none" });
					return;
				}
				this.$util.throttle(async ()=>{
					this.formData.sign_url = this.sign_url;
					this.$request('enrollSubmitForm', this.formData,{
						showLoading: false,
						cache: 0
					}).then((res)=>{
						if(res.data.code == 200){
							this.msg(res.data.msg)
							setTimeout(()=>{
								uni.navigateBack();
							},1000)
						}else{
							this.msg(res.data.msg)
						}
					})
				})
			},
			toPay(){
				this.isLogin();
				//定义表单规则
				var rule = [];
				var formData = {};
				let item_list = this.formData.item_list;
				for(var i = 0; i < item_list.length; i++){
					if(item_list[i].must == '1' && item_list[i].value == ''){
						this.msg(item_list[i].lable+'不能为空')
						return;
					}
					if(item_list[i].ref == 'idcard'){
						this.formData.idcard = item_list[i].value;
					}
				}
				
				//判断签署协议
				if(this.formData.sign == 1 && this.sign_url == ''){
					uni.showToast({ title: '请签署协议', icon: "none" });
					return;
				}
				if(this.isSubmit) return;
				this.isSubmit = true;
				this.$util.throttle(async ()=>{
					this.$request('enrollGetParam', this.formData,{
						showLoading: true,
					}).then((res)=>{
						this.isSubmit = false;
						console.log('请求数据', res)
						if(res.data.data.out_trade_no){
							this.formData.out_trade_no = res.data.data.out_trade_no;
						}
						if(res.data.code == 200){
							if(!res.data.data.payData){
								this.msg('付款参数错误'); 
								return;
							}else{
								payParam.pay(res.data.data.payData, (result)=>{
									if(result == 1){
										this.is_pay = 1;
										this.submit();
									}
								});
							}
						}
					})
				})
			},
			deleteImg(index){
				const t = this;
				t.formData.item_list[index].value = ''
			},
			addImage(index){
				const t = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册或者拍照
					success: async function(res) {
						const tempFilePaths = res.tempFilePaths[0];
						uni.uploadFile({
							url: t.$util.uploadUrl('image'),
							filePath: res.tempFilePaths[0],
							name: 'file[]',
							formData: {},
							success: function(res) {
								var path_str = JSON.parse(res.data);
								if (path_str.code == 200) {
									t.formData.item_list[index].value = path_str.data.file_url;
								}
							}
						});
					}
				});
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
					font-size: 16px;
					color: #303133;
					line-height: 32px;
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
							line-height: 32px;
							text-align: right;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
						}
						.input-box{
							flex: 1;
							padding: 0 5px;
							padding-top: 24rpx;
							white-space:nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
							min-width: 0;
							vertical-align: bottom;
						}
						.placeholder-box{
							flex: 1;
							text-align: right;
							font-size: 16px;
							color: #909399;
							line-height: 32px;
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
					font-size: 16px;
					color: #303133;
					padding-bottom: 20rpx;
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
	
	.agree-box{
		font-size: 14px;
		text-align: center;
		padding: 10px 0;
		color: #606266;
	}
	
	.desc-box{
		padding: 10px;
		font-size: 14px;
		color: #909399;
		line-height: 1.5;
	}
	.popup-box{
		background-color: #ffffff;
		height: 90vh;
		border-top-left-radius: 20upx;
		border-top-right-radius: 20upx;
		padding: 20upx;
		position: relative;
		.popup-top{
			position: relative;
			text-align: center;
			font-size: 32upx;
			font-weight: bold;
			border-bottom: 2upx solid #f8f8f8;
			padding-bottom: 30upx;
			padding-top: 10rpx;
		}
		.scroll-y{
			display: flex;
			flex-wrap: wrap;
			height: calc(100% - 50px);
			margin-bottom: 10px;
			.card-lable{
				width: 76upx;
				height: 65upx;
				text-align: center;
				border: 2upx solid #34afff;
				margin: 5px 6px;
				border-radius: 4upx;
				display: inline-block;
				overflow: hidden;
				color: #ffffff;
				.lable-text{
					font-size: 28upx;
				}
				.lable-small-text{
					font-size: 22upx;
					line-height: 30upx;
				}
			}
		}
		.ser-box{
			background-color: #FFFFFF;
			padding: 20upx;
			z-index: 1;
			padding-bottom: 200upx;
		}
	}
	
	.sign-btn{width:250rpx; margin:25rx; line-height:80rpx; text-align:center;}
	.sign-box{
		
		padding: 10px;
	}
	.gui-form-item{
		padding: 12rpx; 
	}
	.gui-form-label{
		width: 90px;
		font-size: 30rpx;
	}
	.sd-must:after{
		content: "\e69b";
		color: red;
		font-size: 20rpx;
		line-height: 10px!important;
	}
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
	.add-box{
		width:calc((100vw - 55px) / 3);
		height: calc((100vw - 50px) / 3);
		margin: 5px;
		border-radius: 5px;
		overflow: hidden;
		background-color: #f0f0f0;
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