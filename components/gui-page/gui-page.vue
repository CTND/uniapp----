<template>
	<view 
	:style="[{opacity : 1},bodyStyle()]" 
	class="gui-sbody gui-flex gui-column" 
	:class="[fullPage || set_refresh || loadmore ? 'gui-flex1' : '']"
	>
		<!-- 自定义头部 -->
		<view 
		class="gui-header gui-transition-all" 
		:class="headerClass" 
		v-if="customHeader" 
		id="guiPageHeader" 
		ref="guiPageHeader">
			<!-- <view 
			class="gui-page-status-bar" 
			:class="statusBarClass" 
			:style="{height:statusBarHeight+'px'}">
				<slot name="gStatusBar"></slot>
			</view> -->
			
			<view 
			class="gui-flex gui-column gui-justify-content-center" 
			@tap.stop.prevnet="headerTap">
				<slot name="gHeader"></slot>
			</view>
		</view>
		
		<!-- 自定义头部占位 -->
		<view 
		v-if="customHeader && isHeaderSized"
		:style="[{height:headerHeight+'px'},customHeaderStyle]"></view>
		
		
		<!-- 页面主体 -->
		<view 
		class="gui-flex gui-column gui-relative" 
		v-if="!set_refresh && !loadmore" 
		id="guiPageBody" 
		:class="[fullPage ? 'gui-flex1' : '']" 
		ref="guiPageBody">
			<slot name="gBody"></slot>
		</view>
		
		
		<!-- 刷新加载主体  非 nvue -->
		<!-- #ifndef APP-NVUE -->
		<view 
		class="gui-flex1 gui-relative" 
		v-if="set_refresh || loadmore" 
		id="guiPageBody" 
		ref="guiPageBody" 
		:style="{marginTop:fixedTopMargin+'px'}">
			<scroll-view 
			class="gui-absolute-full" 
			:scroll-y="true" 
			:show-scrollbar="false" 
			@touchstart="touchstart" 
			@touchmove="touchmove" 
			@touchend="touchend" 
			@scroll="scroll" 
			:scroll-into-view="topTagID" 
			:scroll-with-animation="false" 
			@scrolltolower="loadmorefun"
			>
				<view id="guiPageBodyTopTag">
					<gui-refresh 
					ref="guiPageRefresh" 
					@reload="reload"
					:refreshText="refreshText" 
					:customClass="refreshClasses" 
					:triggerHeight="reFreshTriggerHeight" 
					:refreshFontSize="refreshFontSize"></gui-refresh>
				</view>
				<slot name="gBody"></slot>
				<!-- <view :style="{minHeight:getMinHeight()}">
					
				</view> -->
				<view v-if="loadmore">
					<gui-loadmore
					ref="guipageloadmore" 
					:status="loadMoreStatus" 
					:loadMoreText="loadMoreText" 
					:customClass="loadMoreClass" 
					:loadMoreFontSize="loadMoreFontSize"></gui-loadmore>
				</view>
			</scroll-view>
		</view>
		<!-- #endif -->
		
		<!-- 刷新加载主体 nvue -->
		<!-- #ifdef APP-NVUE -->
		<view
		class="gui-flex gui-column gui-flex1" 
		v-if="set_refresh || loadmore" 
		id="guiPageBody" 
		ref="guiPageBody" 
		:style="{marginTop:fixedTopMargin+'px'}">
			<list 
			:show-scrollbar="false" 
			class="gui-flex1" 
			@loadmore="loadmorefun" 
			@scroll="scroll">
				<refresh 
				v-if="set_refresh" 
				:display="refreshing ? 'show' : 'hide'" 
				@refresh="onrefresh" 
				@pullingdown="onpullingdown"></refresh>
				<cell ref="guiPageBodyTopRef"></cell>
				<cell v-if="set_refresh">
					<gui-refresh 
					ref="guiPageRefresh" 
					:refreshText="refreshText" 
					:customClass="refreshClasses" 
					:triggerHeight="reFreshTriggerHeight" 
					:refreshFontSize="refreshFontSize"></gui-refresh>
				</cell>
				<slot name="gBody"></slot>
				<cell
				v-if="loadmore" 
				class="gui-page-loadmore">
					<gui-loadmore 
					ref="guipageloadmore" 
					:status="loadMoreStatus" 
					:loadMoreText="loadMoreText" 
					:customClass="loadMoreClass" 
					:loadMoreFontSize="loadMoreFontSize"></gui-loadmore>
				</cell>
			</list>
		</view>
		<!-- #endif -->
		
		<!-- 页面底部 -->
		<!-- 底部占位 -->
		
		<view 
		v-if="customFooter" 
		:style="{height:footerHeight+'px'}"></view>
		<view 
		v-if="customFooter" 
		class="gui-page-footer gui-border-box" 
		id="guiPageFooter" 
		ref="guiPageFooter" 
		:class="footerClass">
			
			<!-- <u-tabbar
				v-if="showFooterBar"
				:value="$store.state.tabbarData.value"
				@change="tabbarChange"
				:fixed="true"
				:border="true"
				:placeholder="true"
				:safeAreaInsetBottom="true"
				:inactiveColor="$store.state.tabbarData.options.textColor"
				:activeColor="$store.state.tabbarData.options.ActivetextColor"
			>
				<u-tabbar-item v-for="(tab, tindex) in $store.state.tabbarData.list" :key="tindex"
				:text="tab.text" :icon="getIcon(tindex)" 
				:options="$store.state.tabbarData.options" 
				:isDot="tab.is_dot"
				:customStyle="{backgroundColor:$store.state.tabbarData.options.bgColor}"
				></u-tabbar-item>
			</u-tabbar> -->
			
			<up-tabbar
				v-if="showFooterBar"
				:value="$store.state.tabbarData.value"
				@change="tabbarChange"
				:fixed="true"
				:border="true"
				:placeholder="true"
				:safeAreaInsetBottom="true"
				:inactiveColor="$store.state.tabbarData.options.textColor"
				:activeColor="$store.state.tabbarData.options.ActivetextColor"
			>
				<up-tabbar-item v-for="(tab, tindex) in $store.state.tabbarData.list" :key="tindex" 
				:text="tab.text" 
				:icon="getIcon(tindex)"
				:customStyle="{backgroundColor:$store.state.tabbarData.options.bgColor}"
				></up-tabbar-item>
			</up-tabbar>
			
			<!-- 普通模式 -->
			<!-- <view v-if="showFooterBar && $store.state.tabbarData.list.length > 1"
			:class="$store.state.tabbarData.options.dot == 1 ? 'gui-relative' : ''" 
			:style="{paddingTop:$store.state.tabbarData.options.dot == 1 ? '50rpx' : '0'}">
				<view class="gui-footer gui-footer-border" style="display: flex;"
				:style="{backgroundColor:$store.state.tabbarData.options.bgColor}"
				>
					<view class="gui-footer-icon-buttons"
					:style="{width: getTabbarItemWidth()}"
					v-for="(tab, tindex) in $store.state.tabbarData.list" :key="tindex"
					@click="tabbarChange(tindex)"
					>
						<u-icon
						    v-if="tab.iconPath"
						    :name="tab.iconPath"
						    :color="getTabColor(tindex, 'icon')"
						    :size="20"
							:customStyle="{display:'block'}"
						></u-icon>
						<text v-else
						:class="[
							'gui-footer-icon-buttons-icon', 
							'gui-block',
							'micon',
							getIcon(tindex)
						]" :style="[getTabColor(tindex, 'icon')]"></text> 
						<text :class="[ 
							'gui-icons', 
							'gui-footer-icon-buttons-text', 
							'gui-block'
						]" :style="[getTabColor(tindex, 'text')]">{{tab.text}}</text>
					</view>
				</view>
				
				<view class="gui-footer-buttons-ab" v-if="$store.state.tabbarData.options.dot == 1"
				@click="getDotCont('click')"
				>
					<text :class="[ 
						'gui-footer', 
						'gui-icons', 
						'gui-footer-buttons-ab-icon', 
						'gui-block',
						'gui-dark-bg-level-2',
						'micon',
						getDotCont('icon')
					]"></text>
					<text :class="[
						'gui-icons', 
						'gui-footer-icon-buttons-text', 
						'gui-block'
					]">{{getDotCont('text')}}</text>
				</view>
			</view> -->	
			<slot v-else name="gFooter"></slot>
			<gui-iphone-bottom 
			:need="!isSwitchPage" 
			:customClass="footerSpaceClass"></gui-iphone-bottom>
		</view>
		
		
		<!-- 右下角悬浮挂件 -->
		<view 
		class="gui-page-pendant" :class="pendantClass">
			<slot name="gPendant"></slot>
		</view>
		
		
		<!-- 吸顶元素 -->
		<view 
		class="gui-page-fixed-top" 
		ref="guiPageFixedTop" 
		id="guiPageFixedTop" 
		:style="{top:fixedTop+'px'}">
			<slot name="gFixedTop"></slot>
		</view>
		
		<!-- 引入全局事件 -->
		<!-- 分享 -->
		<sd-share ref="sdShare"></sd-share>
		<!-- 客服 -->
		<sd-kefu ref="sdKefu"></sd-kefu>
		<!-- 模态弹窗 -->
		<modal-popup ref="modalPopup" @modal-callback="modalCallback"></modal-popup>
		<!-- 全局加载 -->
		<mix-loading v-if="isLoading"></mix-loading>
		<loading-cover ref="loadingCover" v-if="fullLoading">
			<text class="gui-block gui-text-small gui-text-center gui-color-gray gui-italic" style="padding-top:10rpx;">
				加载中...
			</text>
		</loading-cover>
	</view>
</template>
<script>

// #ifdef APP-NVUE
const dom = weex.requireModule('dom');
// #endif
export default{
	name  : 'gui-page',
	props : {
		//自定义样式
		customStyle:{
			type:Object,
			default:function(){return {}}
		},
		// #ifndef APP-NVUE
		fullPage           : {type:Boolean, default:false},
		// #endif
		// #ifdef APP-NVUE
		fullPage           : {type:Boolean, default:true},
		// #endif
		
		// 自定义头部
		customHeader       : {type:Boolean, default:false},
		headerClass        : {type:Array ,  default:function(){return [];}},
		isHeaderSized      : {type:Boolean, default:true},
		statusBarClass     : {type:Array ,  default:function(){return [];}},
		customHeaderStyle:{
			type:Object,
			default:function(){return {}}
		},
		
		// 自定义底部
		customFooter       : {type:[Boolean, Number], default:false},
		showFooterBar      : {type:[Boolean, Number], default:true},//是否显示系统导航栏
		footerClass        : {type:Array ,  default:function(){return [];}},
		footerSpaceClass   : {type:Array,   default:function(){return ['gui-bg-gray', 'gui-dark-bg-level-2'];}},
		
		// 挂件
		pendantClass       : {type:Array , default:function(){return [];}},
		
		isSwitchPage       : {type:Boolean, default:false},
		
		// 吸顶插槽样式
		fixedTopClass      : {type:Array ,  default:function(){return [];}},
		
		/* 刷新 */
		refresh            : {type:Boolean, default:false},
		//set_refresh 	   : {type:Boolean, default:false},
		refreshText        : {type:Array,   default:function () {
			return ['继续下拉刷新','松开手指开始刷新','数据刷新中','数据已刷新'];
		}},
		refreshClasses     : {type:Array,   default:function () {
			return [
				['gui-color-gray'],
				['gui-color-gray'],
				['gui-primary-text'],
				['gui-color-green']
			];
		}},
		refreshFontSize    : {type:Number, default:26},
		
		/* 加载更多 */
		loadmore           : {type:Boolean, default:false},
		loadMoreText       : {type:Array, default:function () {
			return ['','数据加载中', '已加载全部数据', ''];
		}},
		loadMoreClass      : {type:Array,   default:function () {return ['gui-color-gray'];}},
		loadMoreFontSize   : {type:String,  default:'26rpx'},
		loadMoreStatus     : {type:Number,  default: 1},
		apiLoadingStatus   : {type:Boolean, default:false},
		reFreshTriggerHeight   : {type:Number, default:50},
		
	},
	data() {
		return {
			
			set_refresh 	   : false,
			pageStatus          : false,
			footerHeight        : 50,
			statusBarHeight     : 44,
			// #ifndef H5
			headerHeight        : 72,
			// #endif
			// #ifdef H5
			headerHeight        : 44,
			// #endif
			headerTapNumber     : 0,
			fixedTop            : 0,
			loadMoreTimer       : null,
			fixedTopMargin      : 0,
			scrollTop           : 0,
			srcollTimer         : null,
			refreshing          : false,
			pullingdownVal      : 0,
			topTagID            : 'no',
			
			isLoading: false, //全局Loading加载状态
			fullLoading:false,//全屏加载状态
		}
	},
	watch:{
		refresh: {
			handler (newValue, oldValue) {
				this.set_refresh = newValue
			},
			immediate: true,
			deep: true 
		},
	},
	mounted:function(){
		
		// 计算状态栏高度
		try {
			var system   = uni.getDeviceInfo();
			if(system.model){
				this.statusBarHeight = system.statusBarHeight;
			}
			// #ifdef APP-PLUS
			if(plus.navigator.isFullscreen()){
				this.statusBarHeight = 0;
			}
			// #endif			
		} catch(e){return null;}
		
		// 获取自定义底部高度
		if(this.customFooter){
			setTimeout(()=>{
				this.getDomSize('guiPageFooter', (res)=>{
					this.footerHeight = res.height;
				}, 0);
			}, 200);
		}
		
		// 获取自定义头部高度
		if(this.customHeader){
			setTimeout(()=>{
				this.getDomSize('guiPageHeader', (res)=>{
					this.headerHeight = res.height;
					this.$nextTick(()=>{
						this.pageStatus = true;
					});
				}, 0);
			}, 200);
		}else{
			this.pageStatus = true;
		}
		
		// 吸顶 top
		// #ifdef H5
		if(this.customHeader){
			setTimeout(()=>{
				this.getDomSize('guiPageHeader', (res)=>{
					this.fixedTop = res.height;
				}, 0);
			}, 200);
		}else{
			//this.fixedTop = 44;
		}
		// #endif
		
		//关闭下拉
		// #ifdef H5
		setTimeout(()=>{
			this.set_refresh = false;
		}, 500)
		// #endif
		
		// #ifndef H5
		if(this.customHeader){
			setTimeout(()=>{
				this.getDomSize('guiPageHeader', (res)=>{
					this.fixedTop = res.height;
				}, 0);
			}, 200);
		}
		// #endif
		
		// 全屏时适配吸顶插槽
		setTimeout(()=>{
			this.getDomSize('guiPageFixedTop', (res)=>{
				this.fixedTopMargin = res.height;
			}, 0);
		}, 200);
		
	},
	
	created() {
		this.$nextTick(()=>{
			if(this.$store.state.tabbarData.list.length==0){
				this.$request('Getsystem', {},{
					showLoading: false,
					cache: this.$store.state.tabbarData.list.length==0?0:10*60   
				}).then((res)=>{
					//console.log('res.data.data.System.tabbar', res)
					if(res.data.data.System.tabbar && res.data.data.System.tabbar.list &&  res.data.data.System.tabbar.list.length){
						this.$store.state.tabbarData.options = res.data.data.System.tabbar.options;
						this.$store.state.tabbarData.list = res.data.data.System.tabbar.list;
					}
				})
			}
		})
	},
	
	methods:{
		//获取页面主体高度
		getMinHeight(){
			var height = 'calc( 100vh - 50px)';
			var sub = this.headerHeight;
			if(this.customHeader){
				sub += this.headerHeight + 50;
			}
			if(this.customFooter){
				sub += this.footerHeight;
			}
			height = 'calc( 100vh - '+sub+'px)';
			if(this.loadmore){
				//height = 'auto';
			}
			//console.log('@@@@@@@@@@@@@@@111111111111111111111111111111111111111111', this.headerHeight, this.footerHeight, height, this.loadMoreStatus)
			return height;
		},
		//初始化全局点击事件
		inItial(){
			//console.log('初始化全局点击事件')
			const t = this;
			uni.$off('clickEvent');
			setTimeout(()=>{
				uni.$on('clickEvent',function(data){
					console.log('gui-page-clickEvent');
					t.clickOn(data);
					if(data.event){
						if(data.event == 'share_poster' || data.event == 'share_code'){
							// #ifndef H5
							t.$refs['sdShare'].show({
								page: 'pages/index/index',
								event:data.event,
								options: {}
							});
							// #endif
							// #ifdef H5
							var pages = getCurrentPages();
							var page = pages[pages.length - 1];
							var url = page.$page.fullPath;
							t.$refs['sdShare'].show({
								page: url,
								event:data.event,
								options: {}
							});
							// #endif
						}else if(data.event == 'kefu'){
							// #ifdef MP-WEIXIN
							t.$refs['sdKefu'].show();
							// #endif
							// #ifdef APP-PLUS || MP-TOUTIAO
							t.$util.callPhone(t.System.kefu_phone);
							// #endif
							// #ifdef H5
							t.$util.callPhone(t.System.kefu_phone);
							// #endif
						}else if(data.event == 'call_kefu'){
							t.$util.callPhone(t.System.kefu_phone);
						}
					}
				})
			}, 500)
		},
		//点击事件
		clickOn(data){
			this.$emit('clickCallback', data);
		},
		//修改加载状态
		loadingChange(newValue){
			this.isLoading = newValue;
		},
		//全屏加载处理
		openFullLoading(){
			this.fullLoading = true;
		},
		closeFullLoading(){
			this.fullLoading = false;
		},
		//底部导航事件
		tabbarChange(name){
			if(this.$store.state.tabbarData.list && 
			this.$store.state.tabbarData.list.length &&
			this.$store.state.tabbarData.list[name].link
			){
				//console.log('this.$store.state.tabbarData.list[name].link', this.$store.state.tabbarData.list[name].link)
				if(this.$store.state.tabbarData.value === name){
					return;  
				};
				if(this.$store.state.tabbarData.list[name].link.event){//事件
					this.clickEvent({
						event: this.$store.state.tabbarData.list[name].link.event,
						options:this.$store.state.tabbarData.list[name].link
					});
					return;
				}else if (this.$store.state.tabbarData.list[name].link.path){
					let url = this.$store.state.tabbarData.list[name].link.path;
					if(url.indexOf('https://') == 0){
						url = '/pages_public/webview/index?link='+encodeURIComponent(url);
						uni.navigateTo({
							url:url
						})
					}else{
						uni.reLaunch({// 关闭所有页面，打开到应用内的某个页面。
							url: this.$store.state.tabbarData.list[name].link.path
						});
					}
					
				}
				this.$store.state.tabbarData.value = name;
			}	
		},
		
		//获取导航栏图标
		getIcon(index){
			var str = '';
			if(this.$store.state.tabbarData.list){
				var item = this.$store.state.tabbarData.list[index];
				if(item.font_class){
					str = 'icon-'+ item.font_class
				}else{
					if(this.$store.state.tabbarData.value == index && item.iconPathSelect){
						str = item.iconPathSelect;
					}else{
						if(item.iconPath){
							str = item.iconPath;
						}
					}
				}
			}
			return str;
		},
		//获取导航栏子菜单宽度
		getTabbarItemWidth(){
			let width = '0';
			if(this.$store.state.tabbarData.list){
				let val = 100 / this.$store.state.tabbarData.list.length;
				width = val.toFixed(2) + '%';
			}
			return width;
		},
		//获取导航栏文字颜色
		getTabColor(index, e){
			let options = this.$store.state.tabbarData.options;
			let value = this.$store.state.tabbarData.value;
			let style = {};
			if(index == value){
				style.color = options.activeColor;
			}else{
				style.color = options.inactiveColor;
			}
			if(e == 'icon'){
				if(options.iconBold == 1){
					style['font-weight'] = 'bold';
				}
				style['font-size'] = options.iconSize + 'px';
			}else{
				style['padding-top'] = options.navmarginTop*2 + 'px';
				style['font-size'] = options.fontSize + 'px';
			}
			if(this.$store.state.tabbarData.list[index].is_dot == 1){
				style.display = 'none';
			}
			//console.log('xxxxxxxxxxxxxxxxxx', style)
			return style;
		},
		
		//获取底部凸起
		getDotCont(e){
			let str = '';
			if(this.$store.state.tabbarData.list.length){
				this.$store.state.tabbarData.list.map((item, index)=>{
					if(item.is_dot == 1){
						if(e == 'click'){
							this.tabbarChange(index);
							return;
						}else{
							if(e == 'icon'){
								str =  'icon-'+ item.font_class;
							}else{
								str =  item.text;
							}
						}
					}
				})
			}
			return str;
		},
		
		//设置页面背景
		bodyStyle(){
			let style = {}
			if(Object.keys(this.customStyle).length){
				let keys = Object.keys(this.customStyle);
				for(var i = 0; i < keys.length; i++){
					style[keys[i]] = this.customStyle[keys[i]];
				}
			}
			return style;
		},
		
		//模态弹窗操作
		modalPopupOpen:function(data = {}, options = {}){
			//console.log('模态弹窗操作11111111111111111111111111111111111111111', data, options)
			if(Object.keys(data).length){
				let modal_data = JSON.parse(JSON.stringify(data));
				this.$refs.modalPopup.open(modal_data, options);
			}
		},
		//关闭modal弹窗
		modalPopupClose: function(){
			this.$refs.modalPopup.close();
		},
		//模态返回
		modalCallback:function(v, options = {}){
			//console.log('gui-page模态返回', v, options )
			this.$emit('popup-callback', v, options);
		},
		
		onpullingdown : function(e){
			if(this.apiLoadingStatus){return false;}
			e.changedTouches = [{pageY:e.pullingDistance}];
			this.$refs.guiPageRefresh.touchmove(e);
		},
		onrefresh : function(){
			if(this.apiLoadingStatus){return false;}
			this.refreshing = true;
			this.$refs.guiPageRefresh.refreshStatus = 2;
			setTimeout(()=>{
				this.$refs.guiPageRefresh.rotate360();
			}, 200);
			this.$emit('reload');
		},
		
		
		// 下拉刷新相关
		touchstart : function (e){
			if(!this.set_refresh){return false;}
			if(this.apiLoadingStatus){return false;}
			this.$refs.guiPageRefresh.touchstart(e);
		},
		touchmove : function(e){
			if(!this.set_refresh){return false;}
			if(this.apiLoadingStatus){return false;}
			this.$refs.guiPageRefresh.touchmove(e);
		},
		touchend : function (e) {
			if(!this.set_refresh){return false;}
			if(this.apiLoadingStatus){return false;}
			this.$refs.guiPageRefresh.touchend(e);
		},
		scroll:function(e){
			if(this.srcollTimer != null){
				clearTimeout(this.srcollTimer);
			}
			this.srcollTimer = setTimeout(()=>{
				// #ifndef APP-NVUE
				this.$refs.guiPageRefresh.scroll(e);
				this.$emit('scroll', e);
				this.scrollTop = e.detail.scrollTop;
				// #endif
				
				// #ifdef APP-NVUE
				e.detail = {scrollTop : e.contentOffset.y * -1};
				this.$emit('scroll', e);
				this.scrollTop = e.detail.scrollTop;
				// #endif
			}, 500);
		},
		toTop : function (){
			// #ifndef APP-NVUE
			this.topTagID  = 'guiPageBodyTopTag';
			setTimeout(()=>{
				this.topTagID = 'no';
			}, 500);
			// #endif
			// #ifdef APP-NVUE
			const el = this.$refs.guiPageBodyTopRef;
			dom.scrollToElement(el, {});
			// #endif
		},
		endReload : function(){
			if(this.set_refresh && this.$refs.guiPageRefresh){
				this.$refs.guiPageRefresh.endReload();
			}
			this.refreshing = false; 
		},
		reload : function(){
			if(this.apiLoadingStatus){return false;}
			this.$emit('reload');
			if(this.loadmore){this.$refs.guipageloadmore.stoploadmore();}
		},
		// 获取元素尺寸
		getDomSize : function(domIDOrRef, fun, count){
			if(!count){count = 1;}
			if(count >= 50){
				fun({width:0, height:0});
				return false;
			}
			// #ifndef APP-NVUE
			uni.createSelectorQuery()
			.in(this)
			.select('#'+domIDOrRef)
			.boundingClientRect()
			.exec((res)=>{
				if(res[0] == null){
					count += 1;
					setTimeout(()=>{this.getDomSize(domIDOrRef, fun, count);}, 50);
					return ;
				}else{
					if(res[0].height == undefined){
						count += 1;
						setTimeout(()=>{this.getDomSize(domIDOrRef, fun, count);}, 50);
						return ;
					}
					fun(res[0]);
					return ;
				}
			});
			// #endif
			// #ifdef APP-NVUE
			var el = this.$refs[domIDOrRef];
			dom.getComponentRect(el, (res) => {
				if(res.result == false){
					count += 1;
					setTimeout(()=>{this.getDomSize(domIDOrRef, fun, count);}, 50);
					return ;
				}else{
					if(res.size.height < 1){
						count += 1;
						setTimeout(()=>{this.getDomSize(domIDOrRef, fun, count);}, 50);
						return ;
					}
					fun(res.size);
					return ;
				}
			});
			// #endif
		},
		stopfun   : function(e){e.stopPropagation(); return null;},
		headerTap : function(){
			this.headerTapNumber ++;
			if(this.headerTapNumber >= 2){
				this.$emit('gotoTop');
				this.headerTapNumber = 0;
			}else{
				setTimeout(()=>{this.headerTapNumber = 0;}, 1000);
			}
		},
		getRefs : function(ref, count, fun){
			if(count >= 50){
				fun(this.$refs[ref]);
				return false;
			}
			var refReturn = this.$refs[ref];
			if(refReturn){
				fun(refReturn);
			}else{
				count++;
				setTimeout(()=>{
					this.getRefs(ref, count, fun);
				}, 100);
			}
		},
		loadmorefun : function () {
			if(!this.loadmore){
				return false;
			}
			if(this.apiLoadingStatus){
				return false;
			}
			// 获取加载组件状态看一下是否还能继续加载
			// 保证触底只执行一次加载
			if(this.loadMoreTimer != null){clearTimeout(this.loadMoreTimer);}
			this.loadMoreTimer =  setTimeout(() => {
				if(this.$refs.guipageloadmore){
					var status = this.$refs.guipageloadmore.loadMoreStatus;
				}
				
				if(status != 0){
					return null;
				}
				if(this.$refs.guipageloadmore){
					this.$refs.guipageloadmore.loading();
				}
				
				this.$emit('loadmorefun');
			}, 80);
		},
		stopLoadmore : function(){
			if(this.$refs.guipageloadmore){
				this.$refs.guipageloadmore.stoploadmore();
			}
			
		},
		stoploadmore : function(){
			if(this.$refs.guipageloadmore){
				this.$refs.guipageloadmore.stoploadmore();
			}
			
		},
		hiddenloadmore:function(){
			if(this.$refs.guipageloadmore){
				this.$refs.guipageloadmore.hide();
			}
			
		},
		nomore : function () {
			if(this.$refs.guipageloadmore){
				this.$refs.guipageloadmore.nomore();
			}
		},
		//数据为空
		empty:function(){
			console.log('this.$refs.guipageloadmore@2')
			if(this.$refs.guipageloadmore){
				this.$refs.guipageloadmore.empty();
			}
		},
		toast : function(msg){
			uni.showToast({
				title:msg,
				icon:"none"
			})
		},
		resetFooterHeight : function(){
			if(this.customFooter){
				setTimeout(()=>{
					this.getDomSize('guiPageFooter', (res)=>{
						this.footerHeight = res.height;
					}, 0);
				}, 500);
			}
		}
	},
	emits:['scroll', 'reload', 'loadmorefun', 'gotoTop', 'popup-callback', 'clickCallback'],
	// @clickCallback="linkClick"
	// @popup-callback="popupCallback"
}
</script>
<style scoped>
/* #ifdef APP-VUE || H5 || MP-TOUTIAO */
.gui-sbody{min-height:100vh;}
/* #endif */
/* #ifdef MP-ALIPAY */
.gui-sbody{min-height:100vh;}
/* #endif */
.gui-sbody{
	flex: 1;
}
</style>