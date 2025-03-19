<template>
	<gui-page  
	
	:refresh="true"
	:loadmore="true" 
	
	:customHeader="false"
	:customFooter="true"
	:showFooterBar="false"
	:apiLoadingStatus="apiLoadingStatus" 
	@reload="reload" 
	@loadmorefun="loadmorefun" 
	:customStyle="{
		backgroundColor:System.full_bg_color
	}"
	ref="guipage"
		>
		<template v-slot:gBody>
			<view class="list-body">
				<view class="list-item" v-for="(item, index) in list" :key="index">
					<view class="order-header">
						<view class="status-box">
							<view class="status-name"
							:style="{
								color:'#606266',
								borderColor:'#909399',
							}"
							>{{item.type_data.label}}</view> 
						</view>
						<view class="on-box">
							<text class="micon icon-bianji11" style="font-size: 18px;" 
							@click="navTo('/pages_member/bankAccount/edit', {login: true}, {id: item.id})"></text>
							<text class="micon icon-shanchu2" style="font-size: 18px;margin-left: 10px"
							@click="delAccount(item)"
							></text>
						</view> 
					</view>
					<view class="list-content">
						<view style="flex: 1;">
							<template v-if="item.type_data.type == 'wx'">
								<view class="list-desc-box">
									<text style="color: #303133;font-size: 13px;">微信收款二维码</text>
								</view>
							</template>
							<template v-else>
								<view class="list-desc-box">
									账户名称：<text style="color: #303133;font-size: 13px;">{{item.account_name}}</text>
								</view>
								<view class="list-desc-box">
									账户号码：<text style="color: #303133;font-size: 13px;">{{item.account_number}}</text>
								</view>
							</template>
						</view>
						<view class="icon-box">
							<view v-if="ref == 'check'" class="small-but" style="height: 25px;line-height: 25px;font-size: 12px;" 
							@click="checkAccount(item)">选择</view>
						</view>
					</view>
					
				</view>
			</view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" 
			text="暂无数据" 
			marginTop="25vh"
			textColor="#c0c4cc"
			></u-empty>
			
			<!-- 全屏加载 -->
			
			
			<!--加载中-->
			 
			 
			
			
		</template>
		<template v-slot:gFooter>
			<u-button
			text="新增账户" 
			shape="circle" 
			:customStyle="{
				backgroundColor:'#2979ff',
				color:'#ffffff',
				width:'80%',
				margin:'auto',
				marginBottom: '30px',
				height:'50px'
			}"
			@click="navTo('/pages_member/bankAccount/edit', {login: true})"
			></u-button>
		</template>
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
			ref:'list',
			list:[],
			//列表渲染数据
			totalCount:0,//总数据量
			apiLoadingStatus:false,
			queryForm:{
				pageNo: 1,
				pageSize: 10,
				keyword: '',
			}
		}
	},
	
	onLoad: function(options) {
		if(options.ref){
			this.ref = options.ref;
		}
	},
	onShow() {
		this.queryData();
	},
	methods: {
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
			let post_data = JSON.parse(JSON.stringify(this.queryForm));
			this.$request('getUserBankAccount', post_data,{
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
		
		//选择
		checkAccount(item){
			let pages = getCurrentPages();
			let prePage = pages[pages.length - 2];
			//设置数据
			let post_data = {
				type_data: item.type_data,
				account_name: item.account_name,
				account_fname: item.account_fname,
				account_number: item.account_number,
				account_code: item.account_code
			};
			prePage.$vm.ruleForm = Object.assign({}, prePage.$vm.ruleForm, post_data);
			this.goBack();
		},
		delAccount(item){
			this.showModalEvent({
				title:'提示',//提示标题
				content: '确定要删除该账户吗？',
				showCancel:true,
				cancelText: '取消',
				confirmText: '确认删除',
			}, item)
		},
		
		//弹窗返回
		modalEventBack(options, v){
			if(v == 1){
				if(this.isSubmit) return;
				this.isSubmit = true;
				this.$request('userBankAccountDelete', options,{
					showLoading: true,
				}).then((res)=>{
					this.isSubmit = false;
					if(res.data.code == 200){
						this.msg('操作成功')
						this.queryData();
					}
				})
			}
		},
	}
}
</script>

<style lang="scss" scoped>
	.add-button{
		position: fixed;
		bottom: 15px;
		left: 10%;
	}
	.list-body{
		padding: 10px 15px;
		padding-bottom: 50px;
		.list-item{
			margin-bottom: 30rpx;
			background-color: #ffffff;
			border-radius: 8px;
			box-shadow: 0 0 5px #e7f3ff;
			.order-header{
				display: flex;
				border-bottom: 1px solid #f0f0f0;
				padding: 8px 5px 6px 5px; 
				.on-box{
					color: #303133;
					padding-top: 3px;
				}
				.status-box{
					padding: 0 5px;
					flex: 1;
					display: flex;
					.status-name{
						padding: 0px 5px;
						border: 1px solid #f0f0f0;
						border-radius: 2px;
						font-size: 13px;
						color: #606266;
						height: 20px;
						line-height: 20px;
					}
				}
			}
			.list-content{
				display: flex;
				padding: 10px;
				.list-desc-box{
					font-size: 14px;
					color: #606266;
					line-height: 30px;
				}
				.icon-box{
					line-height: 60px;
					font-size: 15px;
					color: #909399;
					font-weight: bold;
				}
			}
			
		}
	}
</style>