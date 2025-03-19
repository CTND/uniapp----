<template>
	<gui-page 
		ref="guipage"
		
		:customHeader="false"
		:customStyle="{padding:'20px 10px 0 10px'}"
	>
		
		<template v-slot:gBody>
			<view class="card-box">
				<image class="bg-img" :src="$util.img('images/member/home-info-bg.png')" style="width:100%;height:100%"></image>
				<view class="content-box">
					<view class="text-but" @click="rightClick()">账单</view>
					<view class="text-but-send" @click="showChange = true">转赠</view>
					<view class="content-title">积分余额</view>
					<view class="big-num-box">{{memberInfo.point || 0}}</view>
					<view class="money-desc">积分可以兑换积分商品</view>
				</view>
			</view>
			
			<view class="rech-box">
				<view class="rech-title">最新记录</view>
				<view class="list-body" v-if="list.length">
					<view class="list-item" v-for="(item, index) in list" :key="index">
						<view class="icon-box">
							<up-image :show-loading="false"
							:src="$util.img('images/system/currency.png')" 
							width="35px" height="35px" ></up-image>
						</view>
						<view class="item-content" :style="{borderBottom:index<list.length-1?'1px solid #e4e7ed':'none'}">
							<view class="item-data">
								<view class="title">{{item.descs}}</view>
								<view class="ftitle">{{item.create_time}}</view>
							</view>
							<view class="item-end-box">{{item.status==1?'+':'-'}}￥{{item.value}}</view>
						</view>
					</view>
				</view>
			</view>
			<!--加载中-->
			 
			 
			<!-- 全屏加载 -->
			
			
			<up-popup :show="showChange" mode="bottom" :round="10" closeable @close="closePopup">
				<view class="popup-box">
					<view class="popup-title-box">
						积分转赠
					</view>
					<view class="data-box" style="padding: 10px 20px;width: 95%;margin: auto;padding-bottom: 50px">
						<view class="data-item" style="0;justify-content: flex-start!important;">
							<view class="label" style="line-height: 30px;width: 100px;font-weight: bold;color: #303133;">接受方ID：</view>
							<view class="data-center">
								<up-input
								    placeholder="请输入对方ID"
								    border="bottom"
									type="number"
									v-model="changeForm.send_id"
									:customStyle="{paddingRight:'10px',height:'28px'}"
								></up-input>
							</view>
						</view>
						
						<view class="data-item" style="padding: 5px 0;justify-content: flex-start!important;">
							<view class="label" style="line-height: 30px;width: 100px;font-weight: bold;color: #303133;">转赠金额：</view>
							<view class="data-center">
								<up-input
								    placeholder="输入转赠金额"
								    border="none"
									type="number"
									v-model="changeForm.num"
									:customStyle="{paddingRight:'10px',height:'28px'}"
								  ></up-input>
							</view>
						</view>
					</view>
					<u-button
					text="确 定" 
					shape="circle" 
					:customStyle="{
						backgroundColor:System.big_but_color,
						color:'#ffffff',
						width:'80%',
						margin:'auto',
						marginTop:'15px'
					}"
					@click="send()"
					></u-button>
				</view>
			</up-popup>
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				showChange: false, 
				list:[],
				ruleForm:{
					input_value:'',
					recharge_id: 0,
					face_value: '',
				},
				memberInfo:{
					money:0
				},
				queryForm:{
					pageNo: 1,
					pageSize: 10,
					keyword: '',
					date:'',
					account_type: "point",
				},
				
				changeForm:{
					send_id: '',
					num: ''
				}
			}
		},
		onLoad: function() {
			this.getUserInfo();
		},
		onShow() {
			this.queryData();
		},
		methods:{
			rightClick() {
				this.navTo('/pages_member/money/moneyRecord', {login: true}, {account_type:'point'})
			},
			getUserInfo(){
				this.$store.dispatch('getUserInfo', (res)=>{
					if(Object.keys(res).length){
						this.memberInfo = res;
					}
				})
			},
			queryData() {
				this.queryForm.pageNo = 1;
				this.totalCount = 0;
				this.fetchData();
			},
			fetchData() {
				this.apiLoadingStatus = true;
				const post_data = JSON.parse(JSON.stringify(this.queryForm));
				this.$request('moneyRecord', post_data,{
					showLoading: false,
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
			closePopup() {
				this.showChange = false;
				this.changeForm = {
					send_id: '',
					num: ''
				}
			},
			send(){
				if(this.changeForm.send_id == ''){
					this.msg('请填写接收人ID');
					return;
				}
				if(!this.changeForm.num){
					this.msg('请填写转赠数量');
					return;
				}
				this.showChange = false;
				if(this.isSubmit) return;
				this.isSubmit = true;
				this.$util.throttle(async ()=>{
					this.$request('pointSendTo', this.changeForm,{
						showLoading: true,
					}).then((res)=>{
						this.isSubmit = false;
						this.msg(res.data.msg);
						if(res.data.code == 200){
							this.getUserInfo();
							this.queryData();
							this.closePopup();
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-right-box{
		display: flex;
		padding-right: 30rpx;
		/* #ifdef MP-WEIXIN */
		padding-right: 90px;
		/* #endif */
	}
	.card-box{
		height: 160px;
		border-radius: 10px;
		overflow: hidden;
		margin-bottom: 10px;
		position: relative;
		.bg-img{
			display: block;
			position: absolute;
			top: 0;
			left: 0;
		}
		.text-but{
			position: absolute;
			top: 20px;
			right: 20px;
			font-size: 14px;
			color: #ffffff;
		}
		.text-but-send{
			position: absolute;
			top: 50px;
			right: 20px;
			font-size: 14px;
			color: #ffffff;
		}
		.content-box{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			padding: 20px 15px;
			text-align: center;
			.content-title{
				font-size: 14px;
				color: #ffffff;
			}
			.big-num-box{
				padding-top: 20px;
				font-size: 28px;
				color: #ffffff;
				font-weight: bold;
				text-indent: -10px;
			}
			.money-desc{
				padding-top: 30px;
				font-size: 12px;
				color: #f8f8f8;
			}
		}
	}
	.rech-box{
		background-color: #ffffff;
		padding: 10px 5px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		.rech-title{
			font-size: 15px;
			color: #303133;
			font-weight: bold;
			padding: 5px 10px;
		}
		.list-body{
			background-color: #ffffff;
			padding: 0 5px;
			margin-top: 10px;
			.list-item{
				display: flex;
				.icon-box{
					padding: 10px 5px 0px 5px;
				}
				.item-content{
					flex: 1;
					display: flex;
					border-bottom: 1px solid #e4e7ed;
					padding: 5px 5px;
					.item-data{
						flex: 1;
						.title{
							font-size: 14px;
							color: #303133;
						}
						.ftitle{
							font-size: 12px;
							color: #909399;
							padding-top: 5px;
						}
					}
					.item-end-box{
						padding: 15px 10px 8px 10px;
						color: #fc3565;
						font-size: 14px;
					}
				}
				
			}
		}
	}
	
	.popup-box{
		height: 50vh;
		.popup-title-box{
			border-bottom: 1px solid #e7e6e4;
			height: 45px;
			line-height: 45px;
			text-align: center;
			font-size: 16px;
			color: #303133;
		}
		.sku-box{
			padding: 10px 15px;
			.sku-scroll{
				height: calc( 50vh - 160px);
				width: 100%;
			}
		}
	}
</style>