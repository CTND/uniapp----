<template>
	<gui-page  
	
	:refresh="true"
	:loadmore="true" 
	
	:customHeader="false"
	:customFooter="custom_Footer"
	:apiLoadingStatus="apiLoadingStatus" 
	@reload="reload" 
	@loadmorefun="loadmorefun" 
	@popup-callback="popupCallback"
	ref="guipage"
		>
		<template v-slot:gBody>
			<view class="list-body">
				<view class="list-item" v-for="(item, index) in list" :key="index">
					<view class="cover-box">
						<image :src="item.img ? item.img : setting.default_img" mode="aspectFill"></image>
					</view>
					<view class="list-content">
						<view style="font-size: 14px;color: #909399">{{item.realname}} {{item.mobile}}</view>
						<view class="list-title text-overflow">
							{{item.title}}
						</view>
						<view class="list-desc-box">
							{{item.city}} {{item.area}}
						</view>
						<view class="list-desc-box">
							面积：{{item.extent}}
							<text class="hotTxt">
								m<text class="hot-txt">2</text>
							</text>
						</view>
						<view class="list-desc-box" v-if="item.type == 'buy'">
							租金：<text :style="{color:'#e45656',}">{{item.rent}}/{{item.unit}}</text>
						</view>
					</view>
					<view class="icon-box">
						<template v-if="item.status == 2">
							<!-- <view style="border-radius: 5px;width: 80px;font-size: 14px;color: #ffffff;text-align: center;
							margin-bottom: 5px;padding: 1px;
							"
							:style="{backgroundColor: setting.default_color}"
							@click="hanldDo({apply_title:'加急服务',order_id: item.order_id, ref:'jj'})"
							>
								加急服务
							</view> -->
							<view style="border-radius: 5px;width: 80px;font-size: 14px;color: #ffffff;text-align: center;
							margin-bottom: 5px;padding: 1px;
							"
							:style="{backgroundColor: setting.default_color}"
							@click="hanldDo({apply_title:'延期服务',order_id: item.order_id, ref:'yq'})"
							>
								延期服务
							</view>
							<view style="border-radius: 5px;width: 80px;font-size: 14px;color: #ffffff;text-align: center;
							margin-bottom: 5px;padding: 1px;
							"
							:style="{backgroundColor: setting.default_color}"
							@click="hanldDo({apply_title:'申请退款',order_id: item.order_id, ref:'refund'})"
							>
								申请退款
								<view style="font-size: 10px;line-height: 12px">参考推广协议</view>
							</view>
						</template>
						<template v-if="item.status == -1">
							<view style="height: 25px;line-height: 25px;border-radius: 5px;width: 80px;font-size: 14px;color: #ffffff;text-align: center;
							margin-bottom: 5px;margin-top: 30px;
							"
							:style="{backgroundColor: setting.default_color}">
								处理中
							</view>
						</template>
						<template v-if="item.status == -2">
							<view style="height: 25px;line-height: 25px;border-radius: 5px;width: 80px;font-size: 14px;color: #ffffff;text-align: center;
							margin-bottom: 5px;margin-top: 30px;
							"
							:style="{backgroundColor: setting.default_color}">
								已处理
							</view>
						</template>
					</view>
				</view>
			</view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" text="暂无数据" marginTop="25vh"></u-empty>
			
			<!-- 全屏加载 -->
			
			
			<!--加载中-->
			 
			 
			<up-popup :show="showPopup" mode="bottom" :round="10" closeable  @close="closePopup">
				<view class="popup-box">
					<view class="form-box">
						<view class="form-block">
							<view class="form-item">
								<view class="form-content">
									<view class="content" style="border: 1px solid #f0f0f0;">
										<u-textarea
										class="textarea border-color1"
										v-model="ruleForm.desc" 
										placeholder="请输入申请原因" 
										height="80px"
										border="none"
										:disableDefaultPadding="true"
										></u-textarea>
									</view>
								</view>
							</view>
						</view>
					</view>
					<u-button
					type="primary" 
					text="提 交"
					shape="circle" 
					throttleTime="1000"
					size="large"
					:customStyle="$util.butStyle('primary',{marginTop:'60px', backgroundColor:System.big_but_color,width:'80%'})"
					@click="save"
					></u-button>
				</view>
			</up-popup>
		</template>
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
			list:[],
			//列表渲染数据
			totalCount:0,//总数据量
			apiLoadingStatus:false,
			queryForm:{
				pageNo: 1,
				pageSize: 10,
				keyword: '',
				is_sales: 1
			},
			setting:{
				default_color:''
			},
			ruleForm:{
				desc:''
			},
			showPopup: false
		}
	},
	onLoad: function() {
		this.getSetting();
	},
	onShow() {
		this.queryData();
	},
	methods: {
		//操作
		hanldDo(e){
			this.showModalPopup({
				title:e.apply_title,//提示标题
				content:'确认操作吗',
				showSlot:true, //是否显示slot/
				confirmText:'确认',//确认按钮文字
				cancelText:'取消',//取消按钮文字
				showConfirmButton: true, //是否显示确认按钮
				showCancelButton:true,//是否显示取消按钮
			}, e)
		},
		//模态弹窗回调
		popupCallback(v, options){
			const t = this;
			this.$refs['guipage'].modalPopupClose();
			if(v == 1){
				this.showPopup = true;
				this.ruleForm = Object.assign({}, this.ruleForm, options)
				/*
				
				*/
			}
		},
		closePopup() {
			this.showPopup = false
		},
		save(){
			if(this.ruleForm.desc == ''){
				this.msg('请输入问题');return;
			}
			if(this.isSubmit) return;
			this.isSubmit = true;
			let post_data = this.ruleForm;
			this.$util.throttle(async ()=>{
				this.$request('transferStoreOrderApply', {post_data:post_data},{
					showLoading: false,
				}).then((res)=>{
					this.isSubmit = false;
					this.queryData();
					this.closePopup();
					this.ruleForm = {
						desc:''
					}
				})
			})
		},
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
		
		
		//下拉刷新
		reload(){
			this.queryData();
		},
		//上拉加载
		loadmorefun(){
			this.fetchData();
		},
		queryData() {
			this.queryForm.pageNo = 1;
			this.totalCount = 0;
			this.fetchData();
		},
		fetchData() {
			 
			this.apiLoadingStatus = true;
			const queryForm = JSON.parse(JSON.stringify(this.queryForm));
			queryForm.current = this.current;
			queryForm.ref = 'shouhou';
			this.$request('transferStoreOrderList', queryForm,{
				showLoading: true
			}).then((res)=>{
				if(this.queryForm.pageNo == 1){
					this.list = [];
				} 
				if(res.data.data.list.length){
					let list = res.data.data.list;
					this.list = this.list.concat(list);
				}
				this.dataListEvent(res.data.data);
			})
		},
		
		
	}
}
</script>

<style lang="scss" scoped>
	.popup-box{
		height: 65vh;
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
								.input{
									height: 32px;
									line-height: 32px;
								}
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
	.list-body{
		padding: 10px;
		.list-item{
			margin-bottom: 20rpx;
			background-color: #ffffff;
			padding: 5px;
			border-radius: 10px;
			display: flex;
			.cover-box{
				position: relative;
				width: 100px;
				height: 100px;
				border-radius: 5px;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
				.top-tag{
					position: absolute;
					top: 0;
					left: 0;
					background-color: #e45656;
					color: #ffffff;
					font-size: 12px;
					padding: 2px 5px;
				}
			}
			.list-content{
				flex: 1;
				min-width: 0;
				padding-left: 10px;
				.list-title{
					font-size: 15px;
					color: #303133;
					font-weight: bold;
					padding: 2px 0;
				}
				.list-desc-box{
					font-size: 14px;
					color: #909399;
				}
			}
			.icon-box{
				padding-top: 10px;
			}
		}
	}
</style>