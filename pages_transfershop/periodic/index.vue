<template>
	<gui-page 
		ref="guipage"
		
		:customFooter="custom_Footer"
		:customStyle="{
			backgroundColor:System.full_bg_color,
			paddingBottom:'80px'
		}"
	>
		
		<template v-slot:gBody>
			<view style="font-size: 16px;color: #606266;line-height: 1.75;padding: 10px 15px;background-color: #ffffff;">
				<u-parse :content="periodic_text"></u-parse>
			</view>
			<view class="form-box">
				<view class="form-block">
					<!-- <view class="form-item select-box border-b" style="display: flex;">
						<view class="form-label">
							<view>
								订阅类型
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<up-radio-group v-model="ruleForm.nature" placement="row">
									<up-radio shape="circle" label="转让信息" :name="1" style="margin-left: 10px;"></up-radio>
									<up-radio shape="circle" label="出售信息" :name="2" style="margin-left: 30px;"></up-radio>
								</up-radio-group>
							</view>
						</view>
					</view> -->
					
					<view class="form-item select-box border-b" style="display: flex;">
						<view class="form-label">
							<view>
								订阅区域
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="data-box" style="padding-right: 10px;" @click="navTo('/pages_public/cityList/index', {login:false})">
									{{ruleForm.cityname || '选择城市'}}
								</view>
								<view class="placeholder-box" 
								v-if="ruleForm.cityname != '' && ruleForm.citycode != ''"
								@click="showAreaBox = true">
									{{ruleForm.area_data.name || ''}}{{ruleForm.area_data.street_name?' | ' + ruleForm.area_data.street_name: '选择区域'}}
								</view>
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy" 
								size="14" color="#c0c4cc" top="9"></sd-icon>
							</view>
						</view>
					</view>
					
					<view class="form-item border-b" style="padding: 10px 0 20px 0;">
						<view class="form-label">
							<view>
								店铺面积：(平米)
							</view>
						</view>
						<view class="form-content">
							<view class="content" style="padding-top: 10px;">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="最小面积"
									v-model="ruleForm.extent_min"
									type='digit'
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'40px'}"
									inputAlign="left"
									:disableDefaultPadding="true"
									/>
								</view> 
								<view style="width: 40px;text-align: center;line-height: 40px;">至</view>
								<view class="input-box">
									<u--input
									class="input"
									placeholder="最大面积"
									v-model="ruleForm.extent_max"
									type='digit'
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'40px'}"
									inputAlign="left"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
						</view>
					</view>
					
					<view class="form-item border-b" style="padding: 10px 0 20px 0;" v-if="ruleForm.nature==1">
						<view class="form-label">
							<view>
								月租金：(元)
							</view>
						</view>
						<view class="form-content" style="padding-top: 10px;">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="最少租金"
									v-model="ruleForm.rent_money_min"
									type='digit'
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'40px'}"
									inputAlign="left"
									:disableDefaultPadding="true"
									/>
								</view> 
								<view style="width: 40px;text-align: center;line-height: 40px;">至</view>
								<view class="input-box">
									<u--input
									class="input"
									placeholder="最大租金"
									v-model="ruleForm.rent_money_max"
									type='digit'
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'40px'}"
									inputAlign="left"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
						</view>
					</view>
					
					<view class="form-item" style="padding: 10px 0 20px 0;">
						<view class="form-label">
							<view>
								{{ruleForm.nature==1?'转让费':'出售价格'}}：(万元)
							</view>
						</view>
						<view class="form-content" style="padding-top: 10px;">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="最小金额"
									v-model="ruleForm.transfer_fee_min"
									type='digit'
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'40px'}"
									inputAlign="left"
									:disableDefaultPadding="true"
									/>
								</view> 
								<view style="width: 40px;text-align: center;line-height: 40px;">至</view>
								<view class="input-box">
									<u--input
									class="input"
									placeholder="最大金额"
									v-model="ruleForm.transfer_fee_max"
									type='digit'
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'40px'}"
									inputAlign="left"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-button type="primary" text="提 交"
			throttleTime="1000"
			size="large"
			shape="circle" 
			:customStyle="$util.butStyle('primary',{margin:'20px auto', backgroundColor:System.big_but_color,width:'90%'})"
			@click="submit()"
			></u-button>
			<!-- 区域选择 -->
			<u-popup
			:show="showAreaBox"
			:round="10" 
			:closeOnClickOverlay="false"
			@close="showAreaBox = false"
			>
				<view class="popup-mini-box" style="height: 90vh;">
					<view class="popup-but-title">
						<view class="but-box cancel" @click="showAreaBox = false">取消</view>
						<view class="but-box true" @click="showAreaBox = false">确定</view>
					</view>
					<view style="display: flex;">
						<view style="width: 150px;">
							<scroll-view scroll-y="true" class="scroll-Y" :style="{height: 'calc(100vh  - 50px )'}">
								<view class="list-box">
									<view class="list" hover-class="list-hover" hover-stay-time="100"
									v-for="(item, aindex) in areaList" :key="aindex"
									@click="checkArea(aindex)"
									:class="[aindex == areaIndex ? 'list-active' : '']"
									>
										<view class="list-item">
											<view class="list-title">
												{{item.name}}
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
						<view style="flex: 1;">
							<scroll-view scroll-y="true" class="scroll-Y" :style="{height: 'calc(100vh  - 50px )'}">
								<view class="list-box"  v-if="areaList.length && areaList[areaIndex].street_list">
									<view class="list" hover-class="list-hover" hover-stay-time="100"
									v-for="(item, sindex) in areaList[areaIndex].street_list" :key="sindex"
									@click="checkStreet(item)"
									>
										<view class="list-item">
											<view class="list-title">
												{{item.name}}
											</view>
											<view class="action-box">
												<sd-icon 
												v-if="ruleForm.area_data.street_name == item.name"
												name="icon-xuanzhong"
												size="20" color="#287eef" top="0" :customStyle="{textAlign:'center', display:'block'}"></sd-icon>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
			</u-popup>
			
			<!--加载中-->
			 
			<!-- 全屏加载 -->
			
		</template>
		
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				showTypeBox:false,
				showAreaBox: false,
				
				cityname:'',
				citycode:'',
				//区域列表
				areaIndex:0,
				areaList:[],
				aloneChecked:false,
				ruleForm: {
					id: 0,
					nature: 1, 
					cityname:'',
					citycode:'',
					area_data:{
						street_name:''
					},
				},
				
				periodic_text: '',
			}
		},
		watch: {
			citycode(newValue) {
				this.ruleForm.citycode = newValue;
				this.getArea();
			},
			cityname(newValue){
				this.ruleForm.cityname = newValue;
			}
		},
		onLoad: function(options) {
			if(options.id){
				this.$request('transShopPeriodicDetail', {id: options.id},{
					showLoading: false,
				}).then((res)=>{
					console.log('详情', res)
					if(res.data.data.info){
						this.ruleForm = res.data.data.info;
					}
				})
			}
			this.getParams();
		},
		onShow() {
			this.isLogin();
		},
		methods:{
			//获取配置参数
			getParams(){
				this.$request('transShopSendParam', {},{
					showLoading: false,
				}).then((res)=>{
					let data = res.data.data;
					if(data.type_list){
						this.type_list = data.type_list;
					}
					if(data.tagList){
						this.tagList = data.tagList;
					}
					if(data.suitList){
						this.suitList = data.suitList;
					}
					if(data.periodic_text){
						this.periodic_text = data.periodic_text;
					}
				})
			},
			//获取区域
			getArea(){
				this.$request('getAreaList', {
					citycode: this.citycode,
					street:1
				},{
					showLoading: true,
				}).then((res)=>{
					//console.log('获取区域', res)
					let data = res.data.data;
					this.areaList = [];
					this.areaIndex = 0;
					this.ruleForm.area_data = {
						street_name:''
					};
					if(data.list.length){
						this.areaList = data.list;
						this.showAreaBox = true;
					}
				})
			},
			//选择区域
			checkArea(aindex){
				this.areaIndex = aindex;
			},
			//选择街道
			checkStreet(item){
				let areaIndex = this.areaIndex;
				let area = {
					name: this.areaList[areaIndex].name,
					citycode: this.areaList[areaIndex].citycode,
					adcode: this.areaList[areaIndex].adcode,
					street_name: item.name
				}
				this.ruleForm.area_data = area;
				this.showAreaBox = false;
			},
			
			submit(){
				console.log(this.ruleForm)
				const t = this;
				if(this.ruleForm.citycode == ''){
					this.msg('请选择城市');
					return false;
				}
				if(this.ruleForm.area_data.street_name == ''){
					this.msg('请选择区域');
					return false;
				}
				
				this.$util.throttle(async ()=>{
					this.$request('transShopSubmitPeriodic', {
						post_data: this.ruleForm
					},{
						showLoading: true,
					}).then((res)=>{
						this.msg(res.data.msg);
						console.log('发布', res)
						if(res.data.code == 200 ){
							setTimeout(()=>{
								if(!res.data.data.id){ //编辑
									this.navTo('/pages_transfershop/periodic/list', {login: true}, {id:'1'}, 'redirectTo');
								}else{
									//调用上一个页面的方法 或者 设置数据
									let pages = getCurrentPages();
									let prePage = pages[pages.length - 2];
									prePage.$vm.queryData();
									this.goBack();
								}
							}, 1500)
						}
					})
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.hotTxt{
		font-size: 16px;
		position: relative; 
	}
	.hot-txt{
		position: relative;
		top: -3px; 
		font-size: 10px;
	}
	.imgs-box{
		border: 1px dashed #e4e7ed;
		border-radius: 10px;
		height: 180px;
	}
	.photos-box{
		// background-color: #ffffff;
		padding: 10px 0;
		display: flex;
		flex-wrap: wrap;
		.img-box{
			width:30%;
			height: calc((100vw - 60px) / 3);
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
		width:30%;
		height: calc((100vw - 60px) / 3);
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
	.form-box{
		padding: 0 10px;
		margin-top: 10px;
		background-color: #ffffff;
		.title-text{
			padding: 0 5px;
			font-size: 15px;
			color: #909399;
			margin-bottom: 5px;
		}
		.form-block{
			background-color: #ffffff;
			padding: 0 15px;
			.form-item{
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
							font-size: 16px;
							color: #303133;
							flex: 1;
							max-height: 30px;
							line-height: 20px;
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
				.list-active{
					background-color: #f6f6f6;
				}
				
			}
		}
	}
</style>