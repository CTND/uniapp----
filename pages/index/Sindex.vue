<template>
	<gui-page
	:refresh="true"
	:loadmore="true" 
	:customHeader="true" 
	:customFooter="custom_Footer"
	@reload="reload" 
	@loadmorefun="loadmorefun" 
	:apiLoadingStatus="apiLoadingStatus" 
	:customStyle="getBodyStyle()"
	:customHeaderStyle="{height:'90px',}"
	@popup-callback="popupCallback"
	ref="guipage"
	>
		<template v-slot:gHeader>
			<up-navbar height="48px">
				<template #left>
					<up-tabs
					v-if="tablist.length"
					:list="tablist"
					:current="tabcurrent"
					:scrollable="false"
					lineWidth="15px"
					lineColor="#f56c6c"
					lineHeight="8rpx"
					:activeStyle="{
						color: '#303133',
						fontWeight: 'bold',
						transform: 'scale(1.05)',
						fontSize:'18px'
					}"
					:inactiveStyle="{
						color: '#606266',
						transform: 'scale(1)',
						fontSize:'16px',
						fontWeight: 'bold',
					}"
					itemStyle="padding-left: 10px; padding-right: 10px; height: 90rpx;"
					@click="tabsClick"></up-tabs>
				</template>
				<template #right>
					<view class="nav-right-box" v-if="tablist.length">
						<view v-if="tablist[tabcurrent].value == 'action' && System.cheat == 2"
						:style="{background:System.small_but_color}" 
						class="nav-right-but micon icon-icon_fabu" @click="navTo('/pages_same/home/action/push', {login:true})"></view>
						<view class="more-box" v-if="tablist[tabcurrent].value == 'nearby' && System.cheat == 2" @click="moreAction()">
							<view class="micon icon-shaixuan"></view>
							<view class="more-text">筛选</view>
						</view>
					</view>
				</template>
			</up-navbar>
		</template>
		
		<template v-slot:gBody>
			<view class="list-body" v-if="tablist.length">
					<!-- 广场 -->
					<view v-show="tablist[tabcurrent].value == 'plaza'" class="plaza-box">
						<view class="plaza-flex">
							<view class="plaza-block" 
							v-for="(plaza, pindex) in plaza_list" :key="pindex"
							:style="{backgroundImage:'url(' +plaza.img+ ')'}"
							>
								<view class="plaza-title">{{plaza.title}}</view>
								<view class="plaza-desc">{{plaza.desc}}</view>
							</view>
						</view>
						<view style="display: flex;padding-top: 10rpx;">
							<up-tabs
								:list="plaza_tabs"
								:current="plaza_tabs_current"
								:scrollable="false"
								lineWidth="10px"
								lineColor="#f56c6c"
								lineHeight="3px"
								:activeStyle="{
									color: '#303133',
									fontWeight: 'bold',
									transform: 'scale(1.05)',
									fontSize:'16px'
								}"
								:inactiveStyle="{
									color: '#606266',
									transform: 'scale(1)',
									fontSize:'16px'
								}"
								itemStyle="padding-left: 10px; padding-right: 10px; height: 40px;"
								@change="plazatabbarChange"
							>
							</up-tabs>
						</view>
						<view class="user-item" v-for="(user,uindex) in cahter_list" :key="uindex">
							<view class="item-flex">
								<view class="user-avatar">
									<u-avatar :src="user.avatar" shape="circle" size="65"></u-avatar>
									<text class="line-point"></text>
								</view>
								<view class="user-content">
									<view class="user-nickname">
										<u-parse :content="user.nickname || ''"></u-parse>
									</view>
									<view style="display: flex;">
										<view class="sex-tag" style="padding: 0 8rpx;height: 30rpx;margin-top: 4rpx;"
										:style="{
											backgroundColor:user.sex == 1 ? '#47d4ea' : '#fe456a',
										}"
										>
											<view class="micon" :class="[user.sex == 1 ? 'icon-nan1' : 'icon-nv2']"
											style="font-size: 14px;line-height: 38rpx"
											:style="{lineHeight:user.sex == 1 ? '36rpx' : '38rpx',color:'#ffffff'}"
											></view> 
											<view class="sex-text">
												{{user.age}}
											</view>
										</view>
										<view class="border-tag" v-for="i in user.tag_list" :key="i.tag_id" 
										style="line-height: 38rpx"
										:style="{borderColor:user.sex == 1 ? '#47d4ea' : '#fe456a'}"
										>
											{{i.tag_title}}
										</view>	
									</view>
									<view v-if="user.sign" class="desc-box">
										{{user.sign}}
									</view>
								</view>
								<view class="flex-end" style="display: flex;flex-direction: column;justify-content: center;">
									<view class="hollow-but"
									:style="{borderColor:'#fe456a'}"
									@click="navTo('/pages_same/conversation/index', {login:true}, {toID:user.userid})"
									>
										<view style="padding: 0 4rpx;padding-left: 10rpx;">搭讪</view>
										<view style="width: 36rpx;height: 32rpx;margin-top: 12rpx;">
											<image :src="$util.img('images/modules/same/dashan.png')" style="width: 100%;height: 100%;"></image>
										</view>
									</view> 
								</view>
							</view>
						</view>
					</view>
					<!-- 附近人 -->
					<view v-show="tablist[tabcurrent].value == 'nearby'">
						<view class="list-item" v-for="(item,index) in nearby_list" :key="index"
						@click="navTo('/pages_same/member/info',{login:true},{member_id:item.userid})">
							<view class="avatar-box">
								<u-avatar :src="item.avatar" shape="circle" size="65"></u-avatar>
								<text class="line-point" v-if="item.line_state==1"></text>
							</view>
							
							<view class="center-box">
								<view class="name-box">
									<view class="nickname">
										<u-parse :content="item.nickname || ''"></u-parse>
									</view>
									<!-- <view class="specs-text" v-if="item.space>0">{{item.space}}km</view> -->
								</view>
								<view class="sex-box">
									<view class="sex-tag" :style="{backgroundColor:item.sex == 1 ? '#47d4ea' : '#fd7bb7'}">
										<sd-icon :name="item.sex == 1 ? 'icon-nan1' : 'icon-nv2'" size="12" color="#ffffff" top="1"></sd-icon>
										<text class="sex-text">{{item.age}}</text>
									</view>
									<view v-if="item.on_live==1" class="live-text">
										<view class="container">
											<view class="live-animation-box">
												<view class="left"></view>
												<view class="center"></view>
												<view class="right"></view>
											</view>
											<view class="container-text">直播中</view>
										</view>
									</view>
								</view>
								<view v-if="item.desc" class="desc-box">
									{{item.desc}}
								</view>
								<view class="photo_list" v-if="item.photo_list.length" 
								@click.stop="navTo('/pages_same/live/room',{login:true},{room_id:item.room_id})">
									<view class="photo-item" v-for="(photo, pindex) in item.photo_list" :key="pindex">
										<image :src="photo" mode="aspectFill"></image>
									</view>
								</view>
							</view>
							<view class="end-box">
								<view class="specs-text" v-if="item.space>0">{{item.space}}km</view>
								<view class="hi-box" @click.stop="openHiBox(item)"
								:style="{
									backgroundImage:'linear-gradient(to right, '+System.big_but_color+', '+$util.colorToRgba(System.big_but_color, 0.8)+')'
								}"
								>
									<view class="micon icon-dazhaohu3"></view>
									<view class="hi-text">打招呼</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 动态 -->
					<view v-show="tablist[tabcurrent].value == 'action'" class="action-box">
						<template v-if="action_list.length">
							<view class="action-item" v-for="(item,index) in action_list" :key="index">
								<view class="head-box" @click="navTo('/pages_same/member/info',{login:true},{member_id:item.userid})">
									<view class="head-left-box">
										<view class="head-avater-box">
											<u-avatar :src="item.avatar" shape="circle" size="40"></u-avatar>
										</view>
										<view class="head-left-center">
											<u-parse :content="item.nickname || ''"></u-parse>
											<view class="head-sex-box">
												<view class="head-sex-tag" :style="{backgroundColor:item.sex == 1 ? '#47d4ea' : '#fd7bb7'}">
													<sd-icon :name="item.sex == 1 ? 'icon-nan1' : 'icon-nv2'" size="12" color="#ffffff" top="1"></sd-icon>
													<view class="head-sex-text">{{item.age}}</view>
												</view>
											</view>
										</view>
									</view>
									<view style="padding-top: 5px;">
										<u-text :text="$util.getDateLen(item.create_time)"  color="#909399" size="12" block></u-text>
									</view>
								</view>
								
								<view style="padding-left: 20px;">
									<view class="action-text-box" v-if="item.content">
										<u-text :text="item.content"  block  lineHeight="22" color="#5a5a5a"></u-text>
									</view>
									<!-- <view style="padding-top: 10px;" v-if="item.images.length">
										<up-album :urls="item.images" :multipleSize="getImgbox(item.images.length).width"></up-album>
									</view> -->
									<view class="action-image-box" v-if="item.images.length">
										<view class="action-img-item" v-for="(img, aindex) in item.images" :key="aindex"
										:style="[getImgbox(item.images.length)]"
										@click="$util.previewImage(aindex, item.images)"
										>
											<image :src="img" mode="aspectFill"></image>
										</view>
									</view>
									<view class="location-box">
										{{getLocationTxt(item)}}
									</view>
									<view class="action-but-box">
										<view class="but-block" @click="Fabulous(item)">
											<sd-icon :name="item.is_fabulous?'icon-dianzan_kuai':'icon-tuijian'" size="20" top="-1"
											:color="item.is_fabulous?'#4f7ffd':'#adadad'"></sd-icon>
											<view class="data-text" >{{item.count_fabulous || 0}}</view>
										</view>
										
										<view class="but-block" @click="navTo('/pages_same/comment/comment',{login:true},{
											new_id:item.new_id,
											member_id: item.userid
										})">
											<sd-icon name="icon-pinglun2" size="20" color="#adadad"></sd-icon>
											<view class="data-text">{{item.count_plugin || '评论'}}</view>
										</view>
										
										<view class="but-block" @click="openHiBox(item)">
											<sd-icon name="icon-dazhaohu" size="20" color="#adadad"></sd-icon>
											<view class="data-text">打招呼</view>
										</view>
									</view>
								</view>
								
							</view>
						</template>
						<template v-else>
							<u-empty :icon="$util.img('images/empty/favorite.png')"
							marginTop="25vh"
							text="暂无动态数据!"
							textColor="#303133"
							></u-empty>
						</template>
					</view>	
			</view>
			
			<!-- 附近人条件筛选 -->
			<u-popup :show="showTerm" :round="15" @close="hideTerm" >
				<view class="popup-box">
					<view class="popup-title-box">
						<view @click="hideTerm">
							<sd-icon name="icon-guanbi1" size="18" color="#606266"></sd-icon>
						</view>
						<view class="title">筛选</view>
						<view class="search" :style="{color:'#13ce65'}" @click="nearbyConfirm">完成</view>
					</view>
					<view class="popup-center">
						<view class="popup-item">
							<view class="item-title">想看到的用户</view>
							<view class="item-content" style="display: flex;justify-content: space-between;">
								<view class="item-but" :class="[nearbyForm.sex == 0 ? 'but-active' : '']"
								@click="setNearbyTerm(0)"
								>
									<view class="micon icon-iconfontquanzi"></view>
									<view>全部</view>
								</view>
								<view class="item-but" :class="[nearbyForm.sex == 2 ? 'but-active' : '']"
								@click="setNearbyTerm(2)"
								>
									<view class="micon icon-nv2"></view>
									<view>女生</view>
								</view>
								<view class="item-but" :class="[nearbyForm.sex == 1 ? 'but-active' : '']"
								@click="setNearbyTerm(1)"
								>
									<view class="micon icon-nan1"></view>
									<view>男生</view>
								</view>
							</view>
						</view>
						
						<view class="popup-item">
							<view class="item-title">年龄<text style="color: #13ce65;font-weight: 400;padding-left: 5px;">{{nearbyForm.age1}}-{{nearbyForm.age2}}</text></view>
							<view class="item-content">
								<view style="display: flex;">
									<view style="font-size: 14px;color: #606266;line-height: 35px;padding-left: 5px;">最小年龄</view>
									<view style="flex: 1;">
										<u-slider :value="nearbyForm.age1" 
										:min="18" :max="nearbyForm.age2" 
										activeColor="#13ce65"
										@input="slider1"
										></u-slider>
									</view>
								</view>
								<view style="display: flex;">
									<view style="font-size: 14px;color: #606266;line-height: 35px;padding-left: 5px;">最大年龄</view>
									<view style="flex: 1;">
										<u-slider :value="nearbyForm.age2" 
										:min="nearbyForm.age1" 
										:max="48" @input="slider2"
										activeColor="#13ce65"
										></u-slider>
									</view> 
								</view>
							</view>
						</view>
						
						<view class="popup-item">
							<view class="item-content" style="display: flex;">
								<view style="font-size: 16px;color: #303133;flex: 1;line-height: 28px;padding-left: 5px;">只看在线用户</view>
								<view style="padding-right: 5px;">
									<u-switch v-model="nearbyForm.line_state" size="22" 
									:activeValue="1"
									:inactiveValue="0"
									activeColor="#13ce65"
									style="border: 1px solid #e4e7ed;"
									@change="onLineChange"
									></u-switch>
								</view>
							</view>
						</view>
						
						<view class="popup-item">
							<view class="item-title">只看实名认证用户</view>
							<view class="item-content" style="display: flex;justify-content: space-between;">
								<view style="flex: 1;display: flex;">
									<view style="font-size: 16px;color: #303133;line-height: 28px;padding-left: 5px;">
										只看 "真人头像认证用户"
									</view>
									<view style="padding: 8px;"><u-badge :isDot="true" type="error"></u-badge></view>
								</view>
								<view style="padding-right: 5px;">
									<u-switch v-model="nearbyForm.real_user" size="22" 
									:activeValue="1"
									:inactiveValue="0"
									style="border: 1px solid #e4e7ed;"
									activeColor="#13ce65"
									asyncChange
									@change="realUserChange"
									></u-switch>
								</view>
							</view>
						</view>
						
					</view>
				</view>
			</u-popup>
			<sd-hi-box ref="hiSend" :keyboardheight="keyboardheight" :boardheightIng="boardheightIng"></sd-hi-box>
		</template>
		
	</gui-page>
</template>
<script setup>

import IM from '@/common/js/IM.js'; 
export default {
	mixins: [IM], // 使用mixin
	data() {
		return {
			keyboardheight: 0, //键盘高度
			boardheightIng: 0, //键盘实时高度
			
			apiLoadingStatus:false,
			modal_content:'',
			//附近人
			nearbyCount:0,
			nearby_list:[],
			nearbypageNo:1,
			nearbyForm:{
				age1:18,
				age2:48,
				sex:0,
				line_state:0,
				real_user:0 
			},
			
			//动态
			actionCount:0,
			action_list:[],
			actionpageNo:1,
			
			//顶部tablist
			tabcurrent:0,
			tablist:[],
			
			//广场
			cahter_list: [],//聊手
			plaza_list:[],
			plaza_tabs_current:0,
			plaza_tabs:[
				{
					name:'全部',
					value:0
				},
				{
					name:'附近',
					value:1
				}
			],
			
			//位置数据
			locationdata:{},
			cityname:'',
			citycode:'',
			
			//附近人条件筛选
			showTerm: false,
			
		}
	},
	watch: {
		//监听数据变化
	    citycode(newValue, value) {
			//console.log('Sindex监听数据变化', newValue, value)
	    	if(newValue != value){
	    		this.queryData();
	    	}
	    }
	},
	onLoad: function() {
		const t = this;
		var nearbyForm = uni.getStorageSync('nearbyForm');
		if(nearbyForm){
			var nearby_params = JSON.parse(nearbyForm);
			this.nearbyForm = nearby_params;
		}
		if(this.nearby_list.length == 0){
			this.nearbyData();
		}
	},
	onShow() {
		
		//注册IM通讯
		if(this.isLogin({nav:false})){
			this.timRegister();//注册TIM通讯
		}
		//获取位置
		if(this.citycode == ''){
			this.$util.getLocationData((res)=>{
				if(res.citycode && res.city != ''){
					this.cityname = res.city;
					this.citycode = res.citycode;
					this.locationdata = res;
				}else{
					//this.navTo('/pages_public/cityList/index', {login:false})
				}
			})
		}
		//获取弹窗数据
		this.getPopupData();
		//获取基础参数
		this.getBase();
		this.getChaterList();
	},
	onReady() {
		const t = this;
		// #ifndef H5
		//监听键盘高度
		uni.onKeyboardHeightChange(res => {
			if(t.keyboardheight == 0){
				t.keyboardheight = res.height;
			}
			t.boardheightIng = res.height;
		})
		// #endif
	},
	methods: {
		//获取页面样式
		getBodyStyle(){
			let style = {};
			if(this.tablist.length){
				let value = this.tablist[this.tabcurrent].value;
				if(value == 'nearby'){
					style['backgroundImage'] = 'linear-gradient(to bottom, '+this.System.default_color+', rgb(255,255,255) 15%)';
				}else{
					style['backgroundImage'] = 'linear-gradient(to bottom, '+this.System.default_color+', #f3f4f6 15%)';
				}
			}
			return style;
		},
		
		tabsClick(item) {
			if(this.tabcurrent == item.index) return;
			this.tabcurrent = item.index;
			this.queryData();
		},
		plazatabbarChange(e){
			this.plaza_tabs_curren = e.index;
			console.log('plaza_tabs_curren', e)
			this.getChaterList(e.index);
		},
		//下拉加载结束
		reloadEnd(){
			this.$refs.guipage.endReload();//停止刷新
			this.$refs.guipage.nomore();//没有更多数据
		},
		
		//富文本连接点击
		linkTap(e){
			console.log('linkTap', e)
		},
		//获取首页弹窗数据
		getPopupData(){
			this.$request('getIndexPopupData', {},{
				showLoading: false,
			}).then((res)=>{
				console.log('获取首页弹窗数据', res)
				if(res.data.data.modal_data){
					this.showModalPopup(res.data.data.modal_data)
				}
			})
		},
		//modal弹窗回调
		popupCallback(v, options){
			const t = this;
			if(this.$refs['guipage']){
				this.$refs['guipage'].modalPopupClose();
			}
			console.log('mixin---modal-popup弹窗回调', v, options)
			if(v == 1){
				if(options.path){
					this.navTo(options.path, {login: true});
					return;
				}else if(options.action){
					//事件操作
					this.isLogin();
				}
				this.getPopupData();
			}else if(v == -1){ //富文本返回
				if(options.href == 'getBag'){
					t.toGetBag();
				}
			}
		},
		
		//领取红包
		toGetBag(){
			if(this.isSubmit) return;
			this.isSubmit = true;
			this.$util.throttle(async ()=>{
				const res = await this.$request('getBag', {}, {
					showLoading: false,
				})
				this.isSubmit = false;
				console.log('请求数据', res)
				if(res.data.code == 200){
					this.msg(res.data.msg);
					this.getPopupData();
				}
			})
		},
		//打招呼
		openHiBox(item){
			//console.log('sd-hi-box', item)
			if(!this.isLogin()){
				return;
			}
			this.$refs['hiSend'].open(item);
		},
		//地理位置转换
		getLocationTxt(item){
			let text = '';
			if(item.city){
				text = item.city;
			}
			if(item.district){
				text = text + '•' + item.district;
			}
			if(item.space){
				text = text + '•' + item.space+'km';
			}
			if(item.name){
				text = text + '•' + item.name;
			}else{
				//text = '';
			}
			return text;
		},
		//打开条件筛选
		moreAction(){
			this.showTerm = true;
		},
		hideTerm(){
			this.showTerm = false;
		},
		slider1(e){
			this.nearbyForm.age1 = e;
			uni.setStorageSync('nearbyForm', JSON.stringify(this.nearbyForm));
		},
		slider2(e){
			this.nearbyForm.age2 = e;
			uni.setStorageSync('nearbyForm', JSON.stringify(this.nearbyForm));
		},
		//附近人条件筛选
		setNearbyTerm(e){
			this.nearbyForm.sex = e;
		},
		onLineChange(e){
			uni.setStorageSync('nearbyForm', JSON.stringify(this.nearbyForm));
		},
		realUserChange(e){
			if(!this.isLogin()){
				return;
			}
			if(e == 1){
				if(this.$store.state.userInfo.real_avatar == 0){
					this.hideTerm();
					this.showModalEvent({
						title:'用户特权提示',//提示标题
						content: '完成真人头像认证，即可查看认证用户',
						showCancel:true,
						cancelText: '取消',
						confirmText: '去认证',
					}, {ref:'lock_real_user'})
				}else{
					this.nearbyForm.real_user = 1;
					uni.setStorageSync('nearbyForm', JSON.stringify(this.nearbyForm));
				}
			}else{
				this.nearbyForm.real_user = 0;
				uni.setStorageSync('nearbyForm', JSON.stringify(this.nearbyForm));
			}
		},
		nearbyConfirm(){
			uni.setStorageSync('nearbyForm', JSON.stringify(this.nearbyForm));
			this.hideTerm();
			this.queryData();
		},
		//弹窗返回
		modalEventBack(e, v){
			if(e.ref == 'lock_real_user'){
				if(v == 1){
					this.navTo('/pages_setting/information/face/index', { login: true }, {do_ref:'real_avatar'});
				}
			}
		},
		getBase(){
			this.$request('getSameBase', {},{
				showLoading: false,
			}).then((res)=>{
				console.log('获取基本设置', res)
				if(res.data.data.tablist.length){
					this.tablist = res.data.data.tablist;
				}
				if(res.data.data.plaza_list){
					this.plaza_list = res.data.data.plaza_list;
				}
				this.queryData();
			})
		},
		
		//下拉刷新
		reload(){
			this.queryData();
		},
		//上拉加载
		loadmorefun(){
			let value = this.tablist[this.tabcurrent].value;
			console.log('上拉加载', value)
			if(value == 'action'){
				this.actionData();
			}else if(value == 'nearby'){
				this.nearbyData();
			}
		},
		queryData() {
			const t = this;
			if(this.tablist.length == 0){
				this.apiLoadingStatus = false;
				return;
			}
			let value = this.tablist[this.tabcurrent].value;
			if(value == 'action'){
				this.actionCount = 0;
				this.actionpageNo = 1;
				this.actionData();
			}else if(value == 'nearby'){
				this.nearbyCount = 0;
				this.nearbypageNo = 1;
				this.nearbyData();
			}else{
				setTimeout(function(){
					t.$refs.guipage.endReload();
				}, 500);
			}
			
		},
		//动态数据
		actionData(){
			const t = this;
			if(this.actionCount > 0 && this.actionCount <= this.action_list.length){
				return;
			}
			this.apiLoadingStatus = true;
			var post_data = {pageNo:this.actionpageNo};
			if(this.isLogin({nav:false})){
				post_data.userid = this.$store.state.userInfo.userid;
			}
			this.$request('getSameActionList', post_data,{
				showLoading: true
			}).then((res)=>{
				console.log('获取动态数据', res)
				
				this.$refs.guipage.stopLoadmore();
				this.$refs.guipage.endReload();
				if(this.actionpageNo == 1) this.action_list = []; //如果是第一页需手动制空列表
				if(res.data.data.list.length){
					//let list = res.data.data.list;
					let list = res.data.data.list.map((item)=>{
						let space = 0;
						if(item.latitude && item.longitude && t.locationdata.latitude && t.locationdata.longitude){
							space = t.$util.getDistance(item.latitude,item.longitude,t.locationdata.latitude, t.locationdata.longitude);
						}
						item.space = space.toFixed(2);
						item.sortval = space.toFixed(2);//排序字段
						return item;
					})
					this.action_list = this.action_list.concat(list); //追加新数据
				}
				this.actionCount = res.data.data.totalCount;
				console.log('this.action_list.length', this.action_list.length)
				if(res.data.data.totalCount > this.action_list.length){
					this.actionpageNo += 1;//还有数据 页面数增加1
				}else{
					this.$refs.guipage.nomore();
					this.$refs.guipage.hiddenloadmore();
				}
				this.apiLoadingStatus = false;
			})
		},
		//附近人数据
		nearbyData() {
			const t = this;
			if(this.nearbyCount > 0 && this.nearbyCount <= this.nearby_list.length){
				return;
			}
			this.apiLoadingStatus = true;
			var post_data = JSON.parse(JSON.stringify(this.nearbyForm));
			post_data.citycode = this.citycode;
			post_data.pageNo = this.nearbypageNo;
			if(this.isLogin({nav:false})){
				post_data.userid = this.$store.state.userInfo.userid;
			}
			this.$request('getSameNearbyList', post_data,{
				showLoading: true
			}).then((res)=>{
				console.log('附近人', res) 
				
				this.$refs.guipage.stopLoadmore();
				this.$refs.guipage.endReload();
				if(this.nearbypageNo == 1) this.nearby_list = []; //如果是第一页需手动制空列表
				if(res.data.data.list.length){
					let arr1 = [];
					let arr2 = [];
					for(var i = 0; i < res.data.data.list.length; i++){
						var item = res.data.data.list[i];
						let space = 0;
						if(item.latitude && item.longitude && t.locationdata.latitude && t.locationdata.longitude){
							space = t.$util.getDistance(item.latitude,item.longitude,t.locationdata.latitude, t.locationdata.longitude);
						}
						item.space = space.toFixed(2);
						item.sortval = space.toFixed(2);//排序字段
						if(space > 0){
							arr1.push(item);
						}else{
							arr2.push(item);
						}
					}
					this.nearby_list = this.nearby_list.concat(arr1); //追加新数据
					this.nearby_list.sort(this.$util.Arrsort);
					this.nearby_list = this.nearby_list.concat(arr2); //追加新数据
				}
				this.nearbyCount = res.data.data.totalCount;
				if(res.data.data.totalCount > this.nearby_list.length){
					this.nearbypageNo += 1;//还有数据 页面数增加1
				}else{
					this.$refs.guipage.nomore();//没有更多数据
					this.$refs.guipage.hiddenloadmore();
				}
				this.apiLoadingStatus = false;
			})
		},
		//获取聊手
		async getChaterList(ref = 0){
			let post_data = {ref: ref}
			post_data.citycode = this.citycode;
			const res = await this.$request('getSameChaterList', post_data,{
				showLoading: false,
			})
			this.cahter_list = res.data.data.cahter_list;
		},
		//根据图片数量计算盒子高宽
		getImgbox(e){
			let style = {};
			let width = 150;
			let systemInfo = this.$store.state.systemInfo;
			let windowWidth = systemInfo.windowWidth - 35;
			if(e == 1){
				width = windowWidth * 0.6;
			}else if(e == 2){
				width = windowWidth * 0.45;
			}else{
				width = windowWidth * 0.3;
			}
			style.width = width + 'px';
			style.height = width + 'px';
			return style;
		},
		//消息点赞
		Fabulous(item){
			if(!this.isLogin()){
				return;
			}
			this.$request('sameNewsFabulous', {
				new_id:item.new_id
			},{
				showLoading: true,
				login:true
			}).then((res)=>{
				console.log('请求数据', res)
				if(res.data.code == 200){
					let index = this.action_list.findIndex(n=>n.new_id == item.new_id);
					if(res.data.data.result){
						this.action_list[index].is_fabulous = 1;
						this.action_list[index].count_fabulous += 1;
					}else{
						this.action_list[index].is_fabulous = 0;
						this.action_list[index].count_fabulous -= 1;
					}
				}
			})
		},
		//打开分享
		openShare(item){
			item.report_id = item.new_id;
			item.report_type = 1;
			this.$store.state.ShareData.path = '/pages_same/comment/comment';
			this.$store.state.shareParams = {
				new_id:item.new_id
			};
			if(this.isLogin()){
				this.$refs['sdShare'].open(item);
			}
		},
		shareBack(news){
			if(Object.keys(news).length){
				let index = this.action_list.findIndex(n=>n.new_id == news.id);
				if(index > -1){
					this.action_list.splice(index,1);
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	
	.popup-box{
		height: 85vh;
		.popup-title-box{
			border-bottom: 1px solid $u-border-color;
			display: flex;
			padding: 15px 20px;
			.title{
				flex: 1;
				text-align: center;
				font-size: 17px;
				color: #303133;
				font-weight: bold;
			}
			.search{
				font-size: 16px;
				color: #303133;
				font-weight: bold;
			}
		}
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
		
		.popup-center{
			padding: 10px;
			.popup-item{
				padding: 10px 0;
				border-bottom: 1px solid #f0f0f0;
				.item-title{
					font-size: 14px;
					color: #303133;
					font-weight: bold;
					padding: 10px 15px;
				}
				.item-content{
					padding: 10px;
					.item-but{
						width: 28%;
						height: 35px;
						line-height: 35px;
						text-align: center;
						font-size: 14px;
						color: #606266;
						font-weight: bold;
						border-radius: 40px;
						border: 1px solid $u-border-color;
						display: flex;
						justify-content: center;
					}
					.but-active{
						background-color: #13ce65;
						color: #ffffff;
						border-color: #13ce65;
					}
				}
			}
		}
	}
	
	
	.nav-right-box{
		display: flex;
		padding-right: 30rpx;
		/* #ifdef MP-WEIXIN */
		padding-right: 90px;
		/* #endif */
		.nav-right-but{
			width: 60rpx;
			height: 60rpx;
			border-radius: 60rpx;
			line-height: 60rpx;
			background-color: #4f7ffd;
			text-align: center;
			color: #ffffff;
			font-size: 18px;
		}
		.more-box{
			display: flex;
			.more-text{
				font-size: 14px;
				color: #606266;
				padding-left: 2px;
			}
		}
	}
	.list-body{
		//广场
		.plaza-box{
			padding: 10px;
			.plaza-flex{
				display: flex;
				flex-wrap: wrap;
				.plaza-block{
					width: calc((100% - 20px) / 2);
					margin: 10rpx;
					height: 80px;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					border-radius: 20rpx;
					padding: 10px;
					padding-top: 20px;
					color: #ffffff;
					.plaza-title{
						font-size: 32rpx;
						font-weight: bold;
						letter-spacing: 1px;
					}
					.plaza-desc{
						font-size: 14px;
						padding-top: 16rpx;
					}
				}
			}
			
			//用户列表
			.user-item{
				padding: 30rpx 20rpx;
				background-color: #ffffff;
				margin-bottom: 20rpx;
				border-radius: 20rpx;
				.item-flex{
					display: flex;
					.user-avatar{
						position: relative;
						width: 65px;
						height: 65px;
					}
					.user-content{
						flex: 1;
						padding: 0 20rpx;
						min-width: 0;
						.user-nickname{
							font-size: 16px;
						}
					}
					.flex-end{
						
					}
				}
			}
		}
		.swiper{
			background-color: #ffffff;
		}
		.desc-box{
			padding-top: 8px;
			color: #909399;
			font-size: 13px;
			white-space:nowrap;
			overflow: hidden;
			text-overflow:ellipsis;
		}
		.hollow-but{
			height: 30px;
			line-height: 30px;
			border-radius: 30px;
			text-align: center;
			font-size: 14px;
			border: 1px solid #fd7bb7;
			display: flex;
			justify-content: center;
			padding: 0 6rpx;
		}
		.border-tag{
			border: 1px solid #fd7bb7;
			border-radius: 30rpx;
			height: 38rpx;
			// line-height: 35rpx;
			display: flex;
			justify-content: center;
			padding: 0 12rpx;
			font-size: 24rpx;
			color: #606266;
			margin-left: 6rpx;
			overflow: hidden;
		}
		.line-point{
			width: 26rpx;
			height: 26rpx;
			border-radius: 20rpx;
			position: absolute;
			right: -4rpx;
			top: 16rpx;
			z-index: 1;
			background-color: #31d57c;
			border: 2rpx solid #ffffff;
		}
		.sex-tag{
			background-color: #fd7bb7;
			border-radius: 20rpx;
			font-size: 20rpx;
			color: #ffffff;
			display: flex;
			padding: 0 4px 0 2px;
			line-height: 13px;
			height: 13px;
			.sex-text{
				padding: 2px 0 0 1px;
				font-size: 10px;
			}
		}
		.list-item{
			// background-color: #ffffff;
			display: flex;
			flex-direction: row;
			padding: 15px 30rpx;
			//border: 1px solid #909399;
			// min-width: 0;
			.avatar-box{
				position: relative;
				width: 65px;
				height: 65px;
			}
			.center-box{
				flex: 1;
				padding-top: 2px;
				padding-left: 10px;
				min-width: 0;
				overflow: hidden;
				.name-box{
					display: flex;
					justify-content: space-between;
					.nickname{
						flex: 1;
						padding: 0 10px 0 0;
						min-width: 0;
						overflow: hidden;
						font-size: 16px;
					}
					.specs-text{
						font-size: 24rpx;
						color: #909399;
						padding: 0px 10px;
						overflow: hidden;
						height: 25px;
						line-height: 25px;
					}
				}
				.sex-box{
					display: flex;
					flex-direction: row;
					
					.live-text{
						color: #fd7bb7;
						font-size: 12px;
						padding-left: 10px;
						.container {
							display: flex;
							align-items: center;
							.container-text{
								height: 14px;
								line-height: 14px;
							}
						}
						/* 三个柱条的父级容器样式 */
						.live-animation-box {
							display: flex;
							align-items: flex-end;
							gap: 2px;
							height: 14px;
							width: 16px;
							padding-bottom: 3px;
						}
				 
						/* 左侧柱条样式 */
						.left {
							width: 3px;
							height: 6px;
							background-color: #46c37b;
							border-radius: 2px;
							/* 绑定创建的动画名称 规定动画以1s为一个周期 动画变化速度匀速 动画播放无限次 */
							animation: left-animation 1s linear infinite;
						}
				 
						/* 中间柱条样式 */
						.center {
							width: 3px;
							height: 9px;
							background-color: #46c37b;
							border-radius: 2px;
							animation: center-animation 1s linear infinite;
						}
				 
						/* 右侧柱条样式 */
						.right {
							width: 3px;
							height: 3px;
							background-color: #46c37b;
							border-radius: 2px;
							animation: right-animation 1s linear infinite;
						}
				 
						/* 左侧柱条动画规则 */
						@keyframes left-animation {
							0%{height: 6px;}
							25%{height: 9px;}
							50%{height: 6px;}
							75%{height: 3px;}
							100%{height: 6px;}
						}
				 
						/* 中间柱条动画规则 */
						@keyframes center-animation {
							0%{height: 9px;}
							25%{height: 6px;}
							50%{height: 3px;}
							75%{height: 6px;}
							100%{height: 9px;}
						}
				 
						/* 右侧柱条动画规则 */
						@keyframes right-animation {
							0%{height: 3px;}
							25%{height: 6px;}
							50%{height: 9px;}
							75%{height: 6px;}
							100%{height: 3px;}
						}
					}
				}
				
				.photo_list{
					padding-top: 20rpx;
					display: flex;
					.photo-item{
						width: 33%;
						margin-right: 10rpx;
						height: calc((100vw - 120px) / 3);
						border-radius: 10rpx;
						overflow: hidden;

						image{
							width: 100%;
							height: 100%;
						}
					}
				}
			}
			.end-box{
				padding-top: 5px;
				.specs-text{
					font-size: 24rpx;
					color: #909399;
					padding: 0px 10px;
					overflow: hidden;
					height: 25px;
					line-height: 25px;
				}
				.hi-box{
					display: flex;
					//background-color: #e1fbeb;
					background-image: linear-gradient(to right, #fc7056, #ffa08e);
					padding: 4px 0px;
					border-radius: 30px;
					width: 70px;
					justify-content: center;
					.micon{
						color:#ffffff;
						font-size: 18px;
					}
					.hi-text{
						font-size: 12px;
						color: #ffffff;
						padding-top: 2px;
					}
				}
			}
		}
		
		// 动态
		.action-box{
			padding-bottom: 10px;
			.action-item{
				// background-color: #ffffff;
				border-bottom: 10rpx solid #f8f8f8;
				padding: 15px;
				margin-bottom: 5px;
				.head-box{
					display: flex;
					.head-left-box{
						flex: 1;
						display: flex;
						.head-avater-box{
							width: 90rpx;
						}
						.head-left-center{
							flex: 1;
							padding-top: 2px;
							padding-left: 10rpx;
							.head-sex-box{
								padding-top: 2px;
								display: flex;
								.head-sex-tag{
									background-color: #fd7bb7;
									border-radius: 20rpx;
									font-size: 20rpx;
									color: #ffffff;
									display: flex;
									padding: 0 4px 0 2px;
									line-height: 13px;
									height: 13px;
									.sex-text{
										padding: 2px 0 0 1px;
										font-size: 10px;
									}
									.head-sex-text{
										padding: 1rpx 0 0 1px;
										font-size: 10px;
									}
								}
							}
						}
					}
				}
				
				.action-text-box{
					padding: 8px 0;
				}
				.action-image-box{
					padding-top: 10rpx;
					display: flex;
					flex-wrap: wrap;
					.action-img-item{
						border-radius: 10rpx;
						overflow: hidden;
						height: 150px;
						width: 150px;
						margin-right: 10rpx;
						margin-bottom: 10rpx;
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
				.location-box{
					line-height: 25px;
					height: 25px;
					color: #909399;
					font-size: 13px;
					overflow: hidden;
				}
				.action-but-box{
					border-top: 1px solid #f0f0f0;
					padding-top: 10px;
					display: flex;
					justify-content: space-between;
					.but-block{
						display: flex;
						width: 33%;
						.data-text{
							padding-left: 10rpx;
							font-size: 14px;
							color: #adadad;
							line-height: 50rpx
						}
					}
				}
			}
		}
		
		
	}
</style>