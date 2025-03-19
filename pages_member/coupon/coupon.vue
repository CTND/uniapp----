<template>
	<gui-page  
	:refresh="true"
	:loadmore="true"
	:customHeader="false" 
	:customFooter="custom_Footer"
	@reload="queryData"
	@loadmorefun="fetchData"
	:apiLoadingStatus="apiLoadingStatus" 
	:customStyle="{
		backgroundColor: '#f0f0f0'
	}"
	:customHeaderStyle="{height:'0px'}"
	@popup-callback="popupCallback"
	ref="guipage"
		>
		<!-- 吸顶插槽 -->
		<template v-slot:gFixedTop>
			<u-sticky bgColor="#fff" :customStyle="{padding:'0 10px'}">
				<view style="padding: 10rpx;">
					<up-tabs :list="tabs_list"
					:current="current"
					:scrollable="false"
					lineWidth="60"
					lineColor="#f56c6c"
					lineHeight="3px"
					:activeStyle="{
						color: '#303133',
						fontWeight: 'bold',
						transform: 'scale(1.05)',
						fontSize:'15px'
					}"
					:inactiveStyle="{
						color: '#606266',
						transform: 'scale(1)',
						fontSize:'15px'
					}"
					itemStyle="padding-left: 15px; padding-right: 15px; height: 40px;"
					@click="tabsClick"></up-tabs>
				</view>
			</u-sticky>
		</template>
		
		
		<template v-slot:gBody>
			
			<view class="list-body" >
				<view class="gui-coupons gui-flex gui-row gui-nowrap"
				v-for="(coupon, index) in list" :key="index" @click="openCode(coupon)">
					<view class="gui-coupons-left gui-flex1 gui-flex gui-row gui-nowrap gui-space-between gui-align-items-center gui-bg-white gui-dark-bg-level-3" 
					:style="{height:coupon.height}">
						<view class="gui-coupons-left-number">
							<view class="gui-flex gui-row gui-nowrap gui-justify-content-center gui-align-items-center">
								<text class="gui-color-gray gui-h4" style="color: #e60213!important;">￥</text>
								<text class="gui-h3 gui-bold" :style="{color:coupon.color}">{{coupon.money}}</text>
							</view>
							<text class="gui-text-small gui-block gui-text-center" :style="{paddingTop:'5px',paddingLeft:'5px'}">
								{{coupon.desc}}
							</text>
						</view>
						<view class="gui-coupons-left-body">
							<text class="gui-block gui-h5" style="color: #303133;">{{coupon.coupon_name}}</text>
							<text class="gui-block gui-text-small gui-color-gray" style="padding-top: 5px;font-size: 12px;">
								<template v-if="coupon.state == 1 || coupon.state == 3">
									有效期止: {{coupon.end_time}}
								</template>
								<template v-if="coupon.state == 2">
									使用时间: {{coupon.use_time}}
								</template>
							</text>
						</view>
					</view>
					<text class="gui-coupons-right gui-text-center gui-block"
					:style="{height:coupon.height, lineHeight:coupon.height,
					backgroundColor:coupon.state == 1 ? coupon.color : '#fab6b6',
					color:'#ffffff',fontSize:'14px'}">
						{{coupon.state == 1 ? '有效' : coupon.state == 2 ? '已使用' : '已过期'}}
					</text>
					
					<view class="gui-coupons-sawtooth"
					:style="{
						height:coupon.height,
						backgroundColor:coupon.state == 1 ? coupon.color : '#fab6b6'
					}">
						<view 
						class="gui-coupons-sawtooth-circular gui-bg-gray gui-dark-bg-level-3" 
						v-for="(item, index) in 10" 
						:key="index"></view>
					</view>
				</view>
			</view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" 
			text="暂无数据" 
			marginTop="20vh"
			textColor="#c0c4cc"
			></u-empty>
			
		</template>
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
			current:0,
			tabs_list:[
				{
					name:'未使用',
					status: 1
				},
				{
					name:'已使用',
					status: 2
				},
				{
					name:'已过期',
					status: 3
				},
			],
			
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
	watch: {
		//监听数据变化
	    citycode: {
	    	handler (newValue, value) {
	    		if(newValue != value){
	    			this.queryData();
	    		}
	    	},
			deep: true
	    },
	},
	onLoad: function() {
		
		this.queryData()
	},
	onShow() {
		
	},
	methods: {
		tabsClick(item) {
			this.current = item.index;
			this.queryData();
		},
		//打开二维码
		openCode(e){
			console.log('openCode', e)
			if(e.state == 3){
				this.showModalEvent({
					title:'提示',//提示标题
					content: '确定要删除改代金券吗？',
					showCancel:true,
					cancelText: '取消',
					confirmText: '确定',
					path:''
				},{id:e.id, ref: 'coupon'})
			}
			
		},
		//弹窗返回
		modalEventBack(options, v){
			if(v == 1){
				this.$request('memberCouponDelete', options,{
					showLoading: false,
				}).then((res)=>{
					this.queryData();
				})
			}
		},
		queryData() {
			this.queryForm.pageNo = 1;
			this.totalCount = 0;
			this.fetchData();
		},
		fetchData() {
			this.apiLoadingStatus = true;
			const post_data = JSON.parse(JSON.stringify(this.queryForm));
			post_data.status = this.tabs_list[this.current].status;
			let url = 'memberCouponList';
			if(this.current == 1){
				url = 'memberNumberCouponList';
			}
			this.$request('memberCouponList', post_data,{
				showLoading: false,
			}).then((res)=>{
				console.log('数据列表', res)
				if(this.queryForm.pageNo == 1) {
					this.list = [];
				}
				if(res.data.data.list.length){
					let list = res.data.data.list;
					this.list = this.list.concat(list); //追加新数据
				}
				this.dataListEvent(res.data.data, 1);
			})
		},
		
		
	}
}
</script>

<style lang="scss" scoped>
	
	.list-body{
		padding-top: 20rpx;
		.gui-coupons{padding: 5px 15px;background-color: #f0f0f0;}
		.gui-coupons-left{width:500rpx; height:150rpx; padding-right:10rpx;position:relative;border-top-left-radius: 10rpx;border-bottom-left-radius: 10rpx}
		.gui-coupons-left-number{width:200rpx; border-right:1px dashed #D2D2D2;}
		.gui-coupons-left-body{flex: 1;padding-left: 10px;}
		.gui-coupons-status{color:#FFFFFF; padding:0 10px; height:36rpx; line-height:36rpx; font-size:20rpx; position:absolute; z-index:1; right:6px; top:8px; border-radius:36rpx;}
		.gui-coupons-right{width:150rpx; height:150rpx; font-size:32rpx;}
		.gui-coupons-sawtooth{width:8px; height:150rpx; overflow:hidden; position:relative;}
		.gui-coupons-sawtooth-circular{width:10px; margin:3px 5px; height:10px; border-radius:10px;}
	}
</style>