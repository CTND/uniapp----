<template>
	<view v-if="diyData.length" 
	:style="{
		padding:diyData[0].options.padding,
		position:'relative'
	}">
		<!-- <up-navbar 
		v-if="diyData[0].options.show_tabbar == '1'" 
		height="50px" 
		:autoBack="diyData[0].options.is_bank == '1'?true:false" 
		:customStyle="{background:diyData[0].options.tabbarbackground}"
		:bgColor="diyData[0].options.tabbarbackground"
		>
			<template #left>
				{{diyData[0].options.is_bank == '1' ? '' : '&nbsp;'}}
			</template>
			<template #center>
				<view>{{diyData[0].data.pageName}}</view>
			</template>
			<template #right>
				<view class="nav-right-box" >
					
				</view>
			</template>
		</up-navbar> -->
		<!--背景头部-->
		<view class="head-box"
			:style="{
				backgroundColor: diyData[0].head.background ? diyData[0].head.background : '',
				
				borderBottomLeftRadius:diyData[0].head.borderRadius + 'px',
				borderBottomRightRadius:diyData[0].head.borderRadius + 'px',
				paddingTop: diyData[0].head.PaddingTop + 'px',
			}"
		>
			<template v-if="diyData[0].head.imagelist">
				<template v-if="diyData[0].head.imagelist.length > 1">
					<up-swiper
						:list="diyData[0].head.imagelist"
						keyName="src"
						:autoplay="true"
						circular
						radius="0"
						:height="diyData[0].head.height + 'px'"
					></up-swiper>
				</template>
				<template v-if="diyData[0].head.imagelist.length == 1">
					<image v-if="diyData[0].head.imagelist.length > 0" :src="diyData[0].head.imagelist[0].src" mode="widthFix" style="width: 100%;"/>
				</template>
			</template>
		</view>
		
		<view class="model-list-box">
			<block v-for="(item, index) in diyData" :key="index">
				<!-- 图片 -->
				<template v-if="item.name=='image'">
					<diy-image ref="diyImage" :modelData="item"></diy-image>
				</template>
				
				<!-- 图片魔方 -->
				<template v-if="item.name=='images'">
					<diy-rubik-cube :modelData="item"></diy-rubik-cube>
				</template>
				
				<!--轮播图-->
				<template v-if="item.name == 'banner'">
					<diy-banner ref="diyBanner" :modelData="item"></diy-banner>
				</template>
				
				<!--辅助空白-->
				<template v-if="item.name == 'kongbai'">
					<view :style="{
						height:item.options.height+'px',
						background:item.options.background
					}"
					></view>
				</template>
				
				<!-- 搜索 -->
				<template v-if="item.name=='search'">
					<view :style="{
						width: item.options.width+'%',
						marginLeft: item.options.marginLeft=='0'?'auto':item.options.marginLeft+'px',
						marginTop: item.options.marginTop=='0'?'auto':item.options.marginTop+'px',
						marginRight: item.options.marginRight=='0'?'auto':item.options.marginRight+'px',
						marginBottom: item.options.marginBottom=='0'?'auto':item.options.marginBottom+'px',
						paddingLeft: item.options.paddingLeft+'px',
						paddingRight: item.options.paddingRight+'px',
						paddingTop: item.options.paddingTop+'px',
						paddingBottom: item.options.paddingBottom+'px',
						background: item.options.searchbackground,
					}">
						<u-search input-align="left"
						:shape="item.options.shape"
						:clearabled="true"
						:show-action="false"
						:disabled="true"
						:placeholder="item.data.title"
						:input-style="{backgroundColor: 'none'}"
						:placeholder-color="item.options.placeholdercolor"
						:search-icon-color="item.options.placeholdercolor"
						@click="searchclick(item.data.link)"
						>
						</u-search>
					</view>
				</template>
				
				<!--图文导航-->
				<template v-if="item.name == 'nav'">
					<diy-nav ref="diyNav" :modelData="item"></diy-nav>
				</template>
				
				<!--按钮-->
				<template v-if="item.name == 'button'">
					<button
					:style="[$util.getModelStyle(item.options),
					{
						lineHeight: item.options.height+'px',
						textAlign:'center',
						fontSize: item.options.fontSize,
						fontWeight: item.options.fontWeight
					}]"
					@click="navTo(item.data.link.path, {login: false}, item.data.link)"
					>{{item.data.title}}</button>
				</template>
				
				<!-- 标题 -->
				<template v-if="item.name == 'title'">
					<div :style="[$util.getModelStyle(item.options)]">
						<template v-if="item.options.style == '1'">
							<view class="gui-flex gui-rows gui-nowrap gui-align-items-center" 
							@click="navTo(item.options.link.path, {login: false}, item.data.link)">
								<view class="gui-title-line"></view>
								<text class="gui-primary-text gui-h6" style="padding-left:50rpx; padding-right:50rpx;" :style="{
									color:item.options.textColor,
									fontSize:item.options.fontSize+'px',
									fontWeight:item.options.fontWeight,
								}"
								>{{item.options.title}}</text>
								<view class="gui-title-line"></view>
							</view>
						</template>
						<template v-else>
							<view @click="navTo(item.options.link.path, {login: false}, item.data.link)">
								<text class="gui-primary-text gui-h6 gui-title-text" style="padding-left:20rpx; padding-right:20rpx;" :style="{
									color:item.options.textColor,
									fontSize:item.options.fontSize+'px',
									fontWeight:item.options.fontWeight,
								}"
								>{{item.options.title}}</text>
							</view>
						</template>
					</div>
				</template>
				
				<!--文章组件-->
				<template v-if="item.name == 'imagetext'">
					<diy-essay ref="diyEssay" :modelData="item"></diy-essay>
				</template>
				
				<!--公告组件-->
				<template v-if="item.name == 'notice'">
					<diy-notice ref="diyNotice" :modelData="item"></diy-notice>
				</template>
				
				<!--课程组件-->
				<template v-if="item.name == 'course'">
					<diy-course ref="diyCourse" :modelData="item"></diy-course>
				</template>
				
				<!--题库组件-->
				<!-- <template v-if="item.name == 'banklist'">
					<diy-school-bank ref="diySchoolBank" :modelData="item"></diy-school-bank>
				</template> -->
				
				<!-- 数据块 -->
				<template v-if="item.name=='datablock'">
					<sd-data-block ref="datablock" :modelData="item"></sd-data-block>
				</template>
				
				<!-- 商城商品 -->
				<template v-if="item.name=='good'">
					<diy-goods-list ref="goodsList" :modelData="item"></diy-goods-list>
				</template>
				
				<!-- 滑动块 -->
				<template v-if="item.name=='scrollblock'">
					<diy-scroll-block ref="scrollBlock" :modelData="item"></diy-scroll-block>
				</template>
				
				<!-- 副文本 -->
				<template v-if="item.name=='richtext'">
					<diy-rich-text :modelData="item"></diy-rich-text>
				</template>
			</block>
		</view>
	</view>
</template>

<script>
	// 用法
	//<diy-module v-if="page_id" ref="diyModule" :pageId="page_id" @diy-back="diyBack"></diy-module>
	export default {
		name:"diy-module",
		props:{
			target:{
				type:[String],
				default:''
			},
			pageId:{
				type:[Number, String],
				default:0
			}
		},
		data() {
			return {
				diyData:[
					{	
						name: "page",
						data: {
						    pageName: "",
						    searchTitle: "请输入商品名称"
						},
						head: {
							height: 200,
							background: null,
							imagelist: [],
							interval: 10, //轮播时间
							borderRadius: 50,
							PaddingTop: 0,
						},
						options: {
						    background: "",
						    tabbarbackground: "rgba(255, 255, 255, 1)",
						    tabbarColor: "#303133",
						    show_tabbar: "0",
						    is_bank: "0",
						    search: "0",
						    location: "0",
							padding:'0'
						}
					}
				]
			};
		},
		created() {
			//console.log('diy-module-create', this.target, this.pageId) 
			this.getDiyData(); 
		},
		methods:{
			//获取页面数据 
			getDiyData(){
				this.$util.throttle(()=>{
					this.$request('GetDiyPage', {
						target:this.target,
						pageId: this.pageId
					},{
						showLoading: false
					}).then(async (res)=>{
						//console.log('diy-module获取的页面数据', res)
						var diyData = {}
						if(res.data.data.diyData){
							this.diyData = res.data.data.diyData;
							diyData = res.data.data.diyData;
							if(res.data.data.diyData.length && res.data.data.diyData[0].data.pageName){
								uni.setNavigationBarTitle({
									title: res.data.data.diyData[0].data.pageName
								});
							}
						}
						await this.$emit('diy-back', diyData)
					})
				})
			},
			
			//搜索框点击事件
			searchclick(e){
				if(e && e.path){
					this.navTo(e.path)
				}
			},
			//选择城市
			cityChange(e) {
				this.city = e.city;
			},
		}
	}
</script>

<style lang="scss" scoped>
	//头部
	.head-box {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}
	.model-list-box{
		position: relative;
	}
</style>