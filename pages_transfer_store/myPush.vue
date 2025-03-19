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
				<view class="item-block" v-for="(item, index) in list" :key="index">
					<!-- <view class="head">
						<view class="order-on-box">
							发布时间: {{item.create_time}}
						</view>
						<view class="status-box"
						:style="{
							color:item.order_status == 1 ? '#19be6b' : '#dd6161',
							borderColor:item.order_status == 1 ? '#19be6b' :'#dd6161',
						}">
							{{item.status_name}}
						</view>
					</view> -->
					<view class="list-item" >
						<view class="cover-box">
							<image :src="item.img ? item.img : setting.default_img" mode="aspectFill"></image>
						</view>
						<view class="list-content">
							<view class="title-box">
								<view class="list-title text-overflow">
									{{item.title}}
								</view>
							</view>
							
							<view class="list-desc-box">
								{{item.province}} {{item.city}} {{item.area}}
							</view>
							<view class="list-desc-box">
								面积：{{item.extent}}
								<text class="hotTxt">
									m<text class="hot-txt">2</text>
								</text>
							</view>
							<view v-if="item.type == 'buy'" class="list-desc-box">
								租金：<text :style="{color:'#e45656',fontSize:'14px'}">{{item.rent}}/{{item.unit}}</text>
							</view>
							<view v-if="item.type == 'buy'" class="list-desc-box">
								转让费：<text :style="{color:'#e45656',fontSize:'14px'}">{{item.money}}</text>
							</view>
						</view>
						<view class="end-but" v-if="item.over_status == 0"
						@click="overDo(item)" :style="{backgroundColor:setting.default_color}">
							<view>确认收货</view>
						</view>
						<view class="end-but" v-else :style="{backgroundColor:setting.default_color}">
							<view>已收货</view>
						</view>
					</view>
				</view>
				
			</view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" text="暂无数据" marginTop="25vh"></u-empty>
			
			<!-- 全屏加载 -->
			
			
			<!--加载中-->
			 
			 
			
			
			
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
			},
			setting:{
				default_color:''
			},
			current:0,
			tabsList:['全部订单','未完成订单','已完成订单'],
			
			modal_content:''
		}
	},
	onLoad: function() {
		this.getSetting();
		this.queryData()
	},
	onShow() {
		
	},
	methods: {
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
		sectionChange(e) {
			this.current = e;
			this.queryData();
		},
		//操作
		hanldDo(item, action){
			if(action.path){
				this.navTo(action.path, {login: true});
				return;
			}else{
				var text = '';
				if(action.action_title){
					text = '确定要' + action.action_title + '吗？'
				}
				this.modal_content = text;
				this.showModalPopup({
					title:'提示',
					confirmText:'确认',
					cancelText:'取消',
					showConfirmButton: true, 
					showCancelButton:true,//是否显示取消按钮
					buttonReverse:false,//对调确认和取消的位置
					closeOnClickOverlay:true, //是否允许点击遮罩关闭Modal
					showSlot:true, //是否显示slot/
				}, {order_id:item.order_id,ref:action.do})
			}
			
		},
		overDo(item){
			this.modal_content = '确认要收货操作吗？';
			this.showModalPopup({
				title:'提示',
				content:'确认要收货操作吗',
				confirmText:'确认',
				cancelText:'取消',
				showConfirmButton: true, 
				showCancelButton:true,//是否显示取消按钮
				buttonReverse:false,//对调确认和取消的位置
				closeOnClickOverlay:true, //是否允许点击遮罩关闭Modal
				showSlot:false, //是否显示slot/
			}, {id:item.id,ref:'over'})
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
			this.$request('transferStoreMyPush', queryForm,{
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
		
		//模态弹窗回调
		popupCallback(v, options){
			const t = this;
			this.$refs['guipage'].modalPopupClose();
			if(v == 1){
				this.$util.throttle(async ()=>{
					this.$request('transferStoreOrderDo', {
						id: options.id,
						ref: options.ref
					},{
						showLoading: true,
					}).then((res)=>{
						this.msg(res.data.msg);
						this.reload();
					})
				})
			}
		}
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
	.list-body{
		padding: 10px;
		.item-block{
			margin-bottom: 15px;
			background-color: #ffffff;
			border-radius: 5px;
			padding: 0 10px;
			.head{
				display: flex;
				border-bottom: 1px solid #e4e7ed;
				padding: 12px 5px 10px 5px;
				.order-on-box{
					flex: 1;
					font-size: 15px;
					color: #909399;
				}
				.status-box{
					font-size: 12px;
					color: #606266;
					border: 1px solid #909399;
					padding: 0 5px;
					border-radius: 2px;
					height: 20px;
					line-height: 20px;
				}
			}
			.list-item{
				display: flex;
				padding: 5px 0;
				.cover-box{
					width: 90px;
					height: 90px;
					border-radius: 5px;
					overflow: hidden;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.list-content{
					flex: 1;
					min-width: 0;
					padding-left: 10px;
					.title-box{
						display: flex;
						.list-title{
							flex: 1;
							font-size: 17px;
							font-weight: bold;
							color: #303166;
						}
					}
					.list-desc-box{
						font-size: 10px;
						color: #909399;
						padding-top: 2px;
					}
				}
				.end-but{
					width: 60px;
					text-align: center;
					border-radius: 5px;
					background-color: #909399;
					font-size: 14px;
					color: #ffffff;
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
			}
		}
		
		.item-footer-box{
			border-top: 1px solid #f0f0f0;
			padding: 8px;
			.err-box{
				font-size: 12px;
				color: orangered;
				height: 20px;
				line-height: 20px;
				overflow: hidden;
			}
			.but-box{
				display: flex;
				justify-content: flex-end;
				.footer-but{
					padding: 5px 10px;
					border-radius: 25px;
					border: 1px solid #e4e7ed;
					margin: auto 5px;
					font-size: 14px;
					color: #606266;
				}
			}
		}
	}
</style>