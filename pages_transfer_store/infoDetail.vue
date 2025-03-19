<template>
	<gui-page ref="guipage"
		>
		<template v-slot:gBody>
			<u-swiper
			v-if="infoData.files_list.length"
			:list="infoData.files_list"
			:height="'300px'"
			indicator
			radius="0px"
			style="width: 100%;"
			></u-swiper>
			<view class="data-box">
				<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;">
					{{infoData.title}}
				</view>
				<view class="data-info">
					<!-- 今日成功推荐<text style="color: #ff5123;font-size: 24px">{{infoData.mate_num}}</text>人 -->
					店铺信息审核通过
				</view>
				<view class="data-info" style="font-size: 15px;line-height: 1.5;">
					面&nbsp;&nbsp;&nbsp;&nbsp;积：
					{{infoData.extent}}
					<text class="hotTxt">
						m<text class="hot-txt">2</text>
					</text>
				</view>
				<view v-if="infoData.type == 'buy'" class="data-info" style="font-size: 15px;">
					租&nbsp;&nbsp;&nbsp;&nbsp;金：<text style="color: #ff5123;">{{infoData.rent}}/{{infoData.unit}}</text>
				</view>
				<view v-if="infoData.type == 'buy'" class="data-info" style="font-size: 15px;">
					转让费：<text style="color: #ff5123;">￥{{infoData.money}}</text>
				</view>
			</view>
			
			<view class="data-box">
				<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;">
					店铺信息
				</view>
				<view class="data-item">
					<view class="item-label">
						商铺地址：
					</view>
					<view class="item-content">
						<template v-if="infoData.type == 'find'">
							{{infoData.province}} {{infoData.city}} {{infoData.area}}
						</template>
						<template v-if="infoData.type == 'buy'">
							{{infoData.province}} {{infoData.city}} {{infoData.area}} {{infoData.address}}
						</template>
					</view>
				</view>
				<view class="data-item">
					<view class="item-label">
						商铺行业：
					</view>
					<view class="item-content">
						{{infoData.class_name}}
					</view>
				</view>
				<view class="data-item">
					<view class="item-label">
						商铺描述：
					</view>
					<view class="item-content">
						{{infoData.store_desc}}
					</view>
				</view>
			</view>
			
			<!-- <view class="data-box">
				<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;">
					联系信息
				</view>
				<view class="data-item">
					<view class="item-label">
						联系人：
					</view>
					<view class="item-content">
						{{infoData.realname}}
					</view>
				</view>
				<view class="data-item">
					<view class="item-label">
						联系电话：
					</view>
					<view class="item-content" style="position: relative;">
						{{infoData.phone_on}}
						<view class="micon icon-dianhua1" 
						style="font-size: 30px;position: absolute;left: 120px;top: -6px;"
						@click="callPhone()"
						></view>
					</view>
				</view>
			</view> -->
			
			<!-- <view class="data-box">
				<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;">
					智能推荐
				</view>
				<view class="data-item">
					<view class="item-icon-box">
						<text class="micon icon-guanggao"></text>
					</view>
					<view class="item-content-pu">
						全时24小时不断刷新曝光
					</view>
				</view>
				
				<view class="data-item">
					<view class="item-icon-box">
						<text class="micon icon-quanzi2"></text>
					</view>
					<view class="item-content-pu">
						精准意向客户推荐
					</view>
				</view>
				
				<view class="data-item">
					<view class="item-icon-box">
						<text class="micon icon-guanggaogongguan"></text>
					</view>
					<view class="item-content-pu" >
						平台首页七天展示
					</view>
				</view>
				
				<view class="data-item">
					<view class="item-icon-box">
						<text class="micon icon-service"></text>
					</view>
					<view class="item-content-pu">
						客户24小时咨询回复
					</view>
				</view>
				
				<view class="data-item">
					<view class="item-icon-box">
						<text class="micon icon-hezuo"></text>
					</view>
					<view class="item-content-pu">
						全程服务直至转成功为止
					</view>
				</view>
			</view> -->
			
			<!-- <view class="data-box" v-if="userList.length">
				<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;padding-bottom: 15px;">
					精准匹配
				</view>
				<view class="data-item" v-for="(item, index) in userList" :key="index" >
					<view v-if="item.avatar" class="item-icon-box" style="background-color: none;border-radius: 100%;overflow: hidden">
						<image
						:src="item.avatar" 
						mode="widthFix"
						style="width: 100%;"
						></image>
					</view>
					<view class="item-content-pu" style="font-size: 14px;">
						{{item.text}}
						<text style="padding-left: 15px;color: #909399">{{item.do_text}}</text>
					</view>
				</view>
			</view> -->
			
			<!-- <view class="data-box" v-if="scrollItems.length">
				<view class="data-info" style="font-weight: bold;font-size: 18px;color: #303133;">
					成交榜
				</view>
				<view style="height: 20px;"></view>
				<gui-scrollitems-y 
				ref="guiscrollitemsy" 
				v-if="scrollItems.length" 
				:items="scrollItems" 
				:customStyle="{borderBottom:'1px solid #f0f0f0',lineHeight:'30px',overflow:'hidden',padding:'5px 0'}"
				:imgStyle="{height:'30px',width:'30px',borderRadius:'30px'}"
				:textStyle="{paddingLeft:'10px',fontSize:'15px',color:'#303133'}"
				></gui-scrollitems-y>
			</view> -->
			<view style="height: 100px;"></view>
			<view 
			style="position: fixed;bottom: 0;width: 100%;padding: 10px 0;background-color: #ffffff;">
				<!-- <u-button type="primary" text="下一步"
				throttleTime="1000"
				size="large"
				:customStyle="$util.butStyle('primary',{margin:'10px auto', backgroundColor:System.big_but_color,width:'90%'})"
				@click="navTo('/pages_transfer_store/infoPipei', {login: true}, {id:infoData.id, mate_num:infoData.mate_num})"
				></u-button> -->
				<u-button 
				v-if="infoData.type == 'buy'"
				type="primary" text="点击咨询人工客服"
				throttleTime="1000"
				size="large"
				:customStyle="$util.butStyle('primary',{margin:'10px auto', backgroundColor:System.big_but_color,width:'90%'})"
				open-type="contact"
				></u-button>
			</view>
			<!--加载中-->
			 
			 
			<!-- 全屏加载 -->
			
			
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				id:0,
				infoData:{
					files_list:[],
					mate_num:0
				},
				scrollItems : [],
				userList:[],
				
				setting:{
					alter_text: '支付后才可查看联系方式哦！'
				}
			}
		},
		onLoad: function(options) {
			if(options.id){
				this.id = options.id;
			}
			this.getSetting();
		},
		onShow() {
			
			this.getDealList();
			this.getInfo();
		},
		methods:{
			getInfo(){
				let url = '';
				if(this.isLogin({nav:false})){
					url = 'transferStoreInfoDetail'
				}else{
					url = 'transferStoreLookInfo'
				}
				this.$request(url, {id:this.id},{
					showLoading: false,
				}).then((res)=>{
					console.log('请求数据', res)
					if(res.data.data.infoData){
						this.infoData = res.data.data.infoData;
					}
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
			getDealList(){
				this.$request('transferStoreDealList', {id:this.id},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.list){
						this.scrollItems = res.data.data.list;
					}
					if(res.data.data.userList){
						this.userList = res.data.data.userList;
					}
				})
			},
			callPhone(){
				/*if(this.infoData.is_get == 0){
					this.showModalPopup({
						title:'提示',//提示标题
						confirmText:'我知道了',
						showConfirmButton: true, 
						closeOnClickOverlay:true, 
						showSlot:true,
					}, {})
				}else{
					this.$util.callPhone(this.infoData.mobile);
				}*/
			},
			//模态弹窗回调
			popupCallback(v, options){
				const t = this;
				this.$refs['guipage'].modalPopupClose();
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
	.data-box{
		padding: 15px;
		padding-top: 0px;
		background-color: #ffffff;
		margin-bottom: 10px;
		.data-info{
			font-size: 16px;
			color: #606266;
			padding-top: 15px;
		}
		.data-item{
			display: flex;
			padding: 15px 0 0 0;
			.item-label{
				font-size: 15px;
				color: #909399;
			}
			.item-content{
				flex: 1;
				font-size: 15px;
				color: #606266;
			}
			.item-icon-box{
				width: 30px;
				height: 30px;
				background-color: #faebde;
				border-radius: 2px;
				line-height: 30px;
				text-align: center;
				
				.micon{
					font-size: 24px;
					color: #ff5123;
					display: block;
					line-height: 30px;
				}
			}
			.item-content-pu{
				flex: 1;
				font-size: 16px;
				color: #303133;
				line-height: 30px;
				padding-left: 10px;
			}
		}
	}
</style>