<template>
	<gui-page  
	:refresh="true"
	:loadmore="true" 
	:customHeader="false"
	:customFooter="custom_Footer"
	:apiLoadingStatus="apiLoadingStatus" 
	@reload="reload" 
	@loadmorefun="loadmorefun" 
	:customStyle="{
		backgroundImage:'linear-gradient(to bottom, #D9E6FF, rgba(230,238,255,0) 30%)',
	}"
	@clickCallback="linkClick"
	ref="guipage"
		>
		
		<!-- 吸顶插槽 -->
		<template v-slot:gFixedTop>
			<view :style="{backgroundImage:'linear-gradient(to bottom, #D9E6FF, rgba(230,238,255,0) 30%)',
			padding:'50px 10px 0px 10px'
			}">
				<up-tabs
				v-if="tabs_list.length"
				:list="tabs_list"
				:current="current"
				:inactiveStyle="{
					color:'#36414D',
					fontSize:'16px'
				}"
				:activeStyle="{
					color: '#36414D',
					fontSize:'17px',
					fontWeight:600
				}"
				:itemStyle="{height: '40px'}"
				lineHeight="2px"
				lineColor="#36414D"
				@click="tabsClick"></up-tabs>
				<view class="address-search-box" style="background-color: #ffffff;">
					<view class="city-box"
					@click="navTo('/pages_public/cityList/index', {login:false})">
						<view class="city-info">
							<view class="micon icon-weizhi"></view>
							<view class="city-name">{{cityname || '选择城市'}}</view>
							<view class="micon icon-jiantou_down"></view>
						</view>
					</view>
					<view style="display: flex;flex-direction: column;justify-content: center;">
						<view style="background-color: #909399;width: 1px;height: 20px;"></view>
					</view>
					<view style="flex: 1;">
						<u-search
						placeholder="搜索" 
						v-model="queryForm.keyword" 
						height="32px"
						bgColor="rgba(0,0,0,0.0)"
						searchIconColor="#909399"
						placeholderColor="#909399"
						:inputStyle="{fontSize:'14px',color:'#909399',height:'70rpx',width:'120px'}"
						:showAction="true" 
						actionText="搜索" 
						:actionStyle="{color:'#36414D'}"
						animation
						@change="searchChange()"
						@search="queryData()"
						@custom="queryData()"
						></u-search>
					</view>
				</view>
				<view class="sort-box">
					<view class="sort-item" v-for="(s,i) in sort_list" :key="i" 
					@click="setSort(s)">
						{{s.text}}
						<text class="micon" :class="[s.icon]" style="font-size: 13px;"></text>
					</view>
				</view>
			</view>
		</template>
		<template v-slot:gBody>
			
			<view class="tag-box">
				<view class="tag-flex">
					<view class="tag" v-for="(area, a) in queryForm.area_list" :key="a">
						{{area.name}}
						<text class="micon icon-shanchu" style="font-size: 13px;" @click="delTag(a, 'area')"></text>
					</view>
					
					<view class="tag" v-for="(item, c) in queryForm.class_list" :key="c">
						{{item.title}}
						<text class="micon icon-shanchu" style="font-size: 13px;" @click="delTag(a, 'class')"></text>
					</view>
					
					<view class="tag">
						{{queryForm.extent_value.title}}
						<text v-if="queryForm.extent_value.value!=''" class="micon icon-shanchu" style="font-size: 13px;" @click="delTag('extent', 'extent')"></text>
					</view>
					
					<view class="tag" v-if="queryForm.money_arr.length">
						{{queryForm.money_arr[0]}}{{queryForm.money_arr.length==2?'-'+queryForm.money_arr[1]:''}}万元
						<text class="micon icon-shanchu" style="font-size: 13px;" @click="delTag('money', 'money')"></text>
					</view>
				</view>
			</view>
			<view class="list-body">
				<view class="block-box" v-for="(item, index) in list" :key="index"
				@click="navTo('/pages_transfershop/info/detail', {login: false}, {id: item.id})"
				>
					<view class="list-item">
						<view class="cover-box">
							<view v-if="item.tag_text" class="top-tag">{{item.tag_text}}</view>
							<image :src="item.cover_img" mode="aspectFill"></image>
						</view>
						<view class="list-content" style="padding-right: 10rpx;">
							<view class="list-title">{{item.title}}</view>
							<view class="area-box" style="padding-top: 6rpx;">
								<view class="area-text" style="color: #7A8699;">
									{{item.area_data.name + ' | '+item.area_data.street_name}}
								</view>
								<view class="space-box" style="color: #7A8699;">{{item.space}}km</view>
							</view>
							
							<view class="list-tag-box" style="padding-right: 0;">
								<view class="tag-box">
									<view class="tag-flex">
										<view class="tag" v-for="(tag, i) in item.tag_list" :key="i" 
										:style="{ backgroundColor: `rgba(41,95,204, 0.1)` }">
											<text :style="{ color: `rgba(41,95,204, 1)` }">{{tag.name}}</text>
										</view>
									</view>
								</view>
							</view>
							<view class="list-desc-box">
								<view class="desc-price">
									<template v-if="item.nature == 1">
										{{item.show_mianyi == 0 ? item.rent_money+'元/月':'面议'}}
									</template>
									<template v-else>
										{{item.transfer_fee}}万元
									</template>
								</view>
								<view class="desc-text-box" style="padding-left: 20px;color: #7A8699;">
									<text>{{item.extent}}</text><text class="hotTxt">m<text class="hot-txt">2</text></text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" 
			text="暂无数据" 
			marginTop="10vh"
			textColor="#c0c4cc"
			></u-empty>
			<!--加载中-->
			 
			<!-- 全屏加载 -->
			
			
			<!-- 分类选择 -->
			<u-popup
			:show="showTypeBox"
			:round="10" 
			:closeOnClickOverlay="false"
			@close="showTypeBox = false"
			>
				<view class="popup-mini-box" style="height: 60vh;">
					<view class="popup-but-title">
						<view class="but-box cancel" @click="cancelTypeCheck">取消</view>
						<view class="but-box true" @click="typeTrue">确定</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y" :style="{height: 'calc(60vh  - 50px )'}">
						<view class="list-box">
							<view class="list" hover-class="list-hover" hover-stay-time="100"
							v-for="(item, index) in type_list" :key="index"
							@click="checkType(item)"
							>
								<view class="list-item">
									<view class="list-title">
										{{item.title}}
									</view>
									<view class="action-box">
										<sd-icon 
										v-if="getClassId(item)"
										name="icon-xuanzhong"
										size="20" color="#287eef" top="0" :customStyle="{textAlign:'center', display:'block'}"></sd-icon>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</u-popup>
			
			<!-- 区域选择 -->
			<u-popup
			:show="showAreaBox"
			:round="10" 
			:closeOnClickOverlay="false"
			@close="showAreaBox = false"
			>
				<view class="popup-mini-box" style="height: 60vh;">
					<view class="popup-but-title">
						<view class="but-box cancel" @click="showAreaBox = false">取消</view>
						<view class="but-box true" @click="areaTrue">确定</view>
					</view>
					<view style="100%;">
						<scroll-view scroll-y="true" class="scroll-Y" :style="{height: 'calc(60vh  - 50px )'}">
							<view class="list-box">
								<view class="list" hover-class="list-hover" hover-stay-time="100"
								v-for="(item, aindex) in areaList" :key="aindex"
								@click="checkArea(item)">
									<view class="list-item">
										<view class="list-title">
											{{item.name}}
										</view>
										<view class="action-box">
											<sd-icon 
											v-if="getAdcode(item)"
											name="icon-xuanzhong"
											size="20" color="#287eef" top="0" :customStyle="{textAlign:'center', display:'block'}"></sd-icon>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</u-popup>
			
			<!-- 选择面积 -->
			<up-popup :show="showExtentBox" mode="top"  :closeOnClickOverlay="true" @close="closeExtentBox">
				<view class="extent-box">
					<template v-if="autoRef =='extent'">
						<view style="font-size: 16px;padding: 0 30px 10px 20px;color: #606266;padding-top: 80px;" class="border-b">
							选择面积:<text class="hotTxt">
										m<text class="hot-txt">2</text>
									</text>
						</view>
						<view class="extent-flex">
							<view class="tag-block" v-for="(tag, index) in extent_list" :key="index"
							@click="setExtent(tag, index)"
							:style="{
								backgroundColor:extentIndex==index?'#287eef':'',
								borderColor:extentIndex==index?'#287eef':'',
								color:extentIndex==index?'#ffffff':'#303133'
							}"
							>
								{{tag.title != '' ? tag.title : tag.value[0] +'-'+tag.value[1]}}
							</view>
						</view>
						<view style="font-size: 16px;padding: 0 30px 10px 30px;color: #606266;" class="border-b">
							自定义:
						</view>
						<view style="display: flex;padding: 5px 30px;padding-top: 20px;">
							<view style="flex: 1;display: flex;">
								<u--input
								class="input"
								placeholder="最小面积"
								v-model="extent_min"
								type='number'
								min="0"
								border="none"
								:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
								:customStyle="{paddingRight:'10px',height:'35px'}"
								inputAlign="left"
								:disableDefaultPadding="true"
								style="border-bottom: 1px solid #f0f0f0;border-radius: 0;padding: 0 10px;"
								/>
								<view style="font-size: 17px;padding: 0 5px;line-height: 35px;">至</view>
								<u--input
								class="input"
								placeholder="最大面积"
								v-model="extent_max"
								type='number'
								min="0"
								border="none"
								:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
								:customStyle="{paddingRight:'10px',height:'35px'}"
								inputAlign="left"
								:disableDefaultPadding="true"
								style="border-bottom: 1px solid #f0f0f0;border-radius: 0;padding: 0 10px;"
								/>
							</view>
							<view style="padding: 0 30px;">
								<view class="small-but" @click="closeExtentBox">确定</view>
							</view>
						</view>
					</template>
					<template v-if="autoRef =='more'">
						<!-- <view style="font-size: 16px;padding: 0 30px 10px 30px;color: #606266;padding-top: 80px;" class="border-b">
							转让类型:
						</view>
						<view class="extent-flex">
							<view class="tag-block" v-for="(tag, index) in nature_list" :key="index"
							@click="setMore(index)"
							:style="{
								backgroundColor:natureIndex==index?'#287eef':'',
								borderColor:natureIndex==index?'#287eef':'',
								color:natureIndex==index?'#ffffff':'#303133'
							}"
							>
								{{tag.title}}
							</view>
						</view> -->
						<view style="height: 50px;"></view>
						<!-- <view style="font-size: 16px;padding: 0 30px 10px 20px;color: #606266;" class="border-b">
							{{natureIndex==0?'店铺租金':'店铺售价'}}:
						</view> -->
						<view style="font-size: 16px;padding: 0 30px 10px 20px;color: #606266;" class="border-b">
							金额范围:（万）
						</view>
						<view style="display: flex;padding: 5px 30px;padding-top: 20px;">
							<view style="flex: 1;display: flex;">
								<u--input
								class="input"
								placeholder="最小金额"
								v-model="money_min"
								type='number'
								min="0"
								border="none"
								:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
								:customStyle="{paddingRight:'10px',height:'35px'}"
								inputAlign="left"
								:disableDefaultPadding="true"
								style="border-bottom: 1px solid #f0f0f0;border-radius: 0;padding: 0 10px;"
								/>
								<view style="font-size: 17px;padding: 0 5px;line-height: 35px;">至</view>
								<u--input
								class="input"
								placeholder="最大金额"
								v-model="money_max"
								type='number'
								min="0"
								border="none"
								:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
								:customStyle="{paddingRight:'10px',height:'35px'}"
								inputAlign="left"
								:disableDefaultPadding="true"
								style="border-bottom: 1px solid #f0f0f0;border-radius: 0;padding: 0 10px;"
								/>
							</view>
							<view style="padding: 0 30px;">
								<view class="small-but" @click="closeMoreBox">确定</view>
							</view>
						</view>
					</template>
				</view>
			</up-popup>
			
			<push-popup-vue ref="pushPopup"></push-popup-vue>
		</template>
		
	</gui-page>
</template>
<script>
	import pushPopupVue from '../push-popup.vue';
export default {
	components:{
		pushPopupVue
	},
	data() {
		return {
			current:0,
			tabs_list:[
				{
					name:'转生意',
					nature: 1,
					type: 0,
				},
				{
					name:'租商铺',
					nature: 1,
					type: 1,
				},
				{
					name:'卖商铺',
					nature: 2,
					type: 0,
				},
			],
			sortIndex: 0,//排序方式
			sort_list:[
				{
					text:'区域',
					icon:'icon-jiantou_down',
					field:'area'
				},
				{
					text:'行业',
					icon:'icon-jiantou_down',
					field:'class'
				},
				{
					text:'面积',
					icon:'icon-jiantou_down',
					field:'extent'
				},
				{
					text:'更多',
					icon:'icon-jiantou_down',
					field:'more'
				}
			],
			natureIndex: 0,
			nature_list:[
				{
					title:'转让',
					value: 1
				},
				{
					title:'出售',
					value: 2
				}
			],
			
			extentIndex: 0,
			extent_list:[
				{
					title:'不限',
					value:[]
				},
				{
					title:'20以下',
					value: [0, 20]
				},
				{
					title:'20-50',
					value: [20,50]
				},
				{
					title:'50-100',
					value: [50, 100]
				},
				{
					title:'100-200',
					value: [100,200]
				},
				{
					title:'200-300',
					value: [200,500]
				},
				{
					title:'500以上',
					value: [500,99999]
				}
			],
			extent_min:'', //设置的最小面积
			extent_max: '', //设置的最大面积
			
			money_min:'',
			money_max:'', 
			list:[],
			//列表渲染数据
			totalCount:0,//总数据量
			apiLoadingStatus:false,
			queryForm:{
				pageNo: 1,
				pageSize: 10,
				keyword: '',
				area_list: [], //选中的区域 街道
				class_list: [], //选中的分类
				extent_value: {
					title:'不限',
					value:[]
				}, //面积值
				nature: 1,
				type: 0,
				is_case: 0,
				money_arr: []
			},
			
			cityname:'',
			citycode:'',
			
			showTypeBox:false,
			showAreaBox: false,
			showExtentBox:false,
			autoRef:'extent', 
			type_list:[],
			//适合经营
			suitList:[],
			//待选标签
			tagList:[],
			//区域列表
			areaIndex:0,
			areaList:[],
			aloneChecked:false,
		}
	},
	watch: {
		//监听数据变化
	    citycode(newValue, value) {
			console.log('监听数据变化 新值为：', newValue, value);
			if(newValue != value){
				this.getArea();
				this.queryData();
			}
	    },
		
		//面积
		extent_min:{
			//immediate: true,
			deep: true,
			handler (newValue, oldValue) {
				this.extentIndex = null;
				this.queryForm.extent_value.value[0] = newValue;
				if(newValue){
					if(this.extent_max){
						this.queryForm.extent_value.title = newValue + '-'+ this.extent_max;
					}else{
						this.queryForm.extent_value.title =  newValue + '-';
					}
				}else{
					if(this.extent_max){
						this.queryForm.extent_value.title = '-' + this.extent_max;
					}else{
						this.queryForm.extent_value.title = '';
					}
				}
			}
		},
		extent_max:{
			//immediate: true,
			deep: true,
			handler (newValue, oldValue) {
				this.extentIndex = null;
				this.queryForm.extent_value.value[1] = newValue;
				if(newValue){
					if(this.extent_min){
						this.queryForm.extent_value.title = this.extent_min + '-' + newValue;
					}else{
						this.queryForm.extent_value.title = '-' + newValue;
					}
				}else{
					if(this.extent_min){
						this.queryForm.extent_value.title = this.extent_min + '-';
					}else{
						this.queryForm.extent_value.title = '';
					}
				}
			}
		},
	},
	onLoad: function(options) {
		this.$util.getLocationData((res)=>{
			console.log('获取的位置', res)
			if(res.citycode && res.city != ''){
				if(this.citycode == ''){
					let citycode = this.$util.getKey('citycode');
					let cityname = this.$util.getKey('cityname');
					if(citycode && cityname){
						this.citycode = citycode;
						this.cityname = cityname;
					}else{
						this.cityname = res.city;
						this.citycode = res.citycode;
					}
				}
				this.locationdata = res;
			}else{
				this.navTo('/pages_public/cityList/index', {login:false})
			}
		})
		console.log('this.citycode', this.citycode)
		this.getParams();
	},
	onShow() {
		
	},
	methods: {
		areaTrue(){
			this.showAreaBox = false;
			this.queryData();
		},
		typeTrue(){
			this.showTypeBox = false;
			this.queryData();
		},
		setSort(e){
			if(e.field == 'area'){
				this.showAreaBox = true;
			}else if(e.field == 'class'){
				this.showTypeBox = true;
			}else if(e.field == 'extent' || e.field == 'more'){
				this.showExtentBox = true;
				this.autoRef = e.field;
			}
			
		},
		tabsClick(item) {
			console.log('tabsClick', item)
			this.current = item.index;
			this.queryForm = Object.assign({}, this.queryForm, {
				nature: item.nature,
				type: item.type
			})
			this.queryData();
		},
		//获取配置参数
		getParams(){
			this.$request('transShopTypeList', {},{
				showLoading: false,
			}).then((res)=>{
				console.log('获取配置参数', res)
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
				console.log('获取区域', res)
				let data = res.data.data;
				this.areaList = [];
				this.areaIndex = 0;
				if(data.list.length){
					this.areaList = data.list;
				}
			})
		},
		//选择区域
		checkArea(item){
			let area_list = JSON.parse(JSON.stringify(this.queryForm.area_list));
			let index = area_list.findIndex(n => n.adcode == item.adcode);
			if(index > -1){
				area_list.splice(index, 1);
			}else{
				area_list.push({
					name: item.name,
					adcode: item.adcode
				})
			}
			this.queryForm.area_list = area_list;
		},
		//删除标签
		delTag(a, b){
			if(b == 'area'){
				this.queryForm.area_list.splice(a, 1);
			}else if(b == 'class'){
				this.queryForm.class_list.splice(a, 1);
			}else if(b == 'extent'){
				this.queryForm.extent_value = {
					title:'不限',
					value:[]
				};
				this.extentIndex = 0;
			}else if(b == 'money'){
				this.queryForm.money_arr = [];
			}
		},
		//选择分类
		checkType(item){
			let class_list = JSON.parse(JSON.stringify(this.queryForm.class_list));
			let index = class_list.findIndex(n => n.id == item.id);
			if(index > -1){
				class_list.splice(index, 1);
			}else{
				class_list.push({
					id: item.id,
					title: item.title
				})
			}
			this.queryForm.class_list = class_list;
		},
		getClassId(item){
			let class_list = JSON.parse(JSON.stringify(this.queryForm.class_list));
			if(class_list.length == 0){
				return false;
			}
			let index = class_list.findIndex(n => n.id == item.id);
			if(index > -1){
				return true;
			}
			return false;
		},
		//取消分类选择
		cancelTypeCheck(){
			this.showTypeBox = false;
		},
		//标签选择
		checkboxChange(n){
			let tag_list = this.queryForm.tag_list;
			let index = tag_list.findIndex(a=>a.tag_id == n.tag_id);
			if(index > -1){
				this.queryForm.tag_list.splice(index, 1);
			}else{
				this.queryForm.tag_list.push(n);
			}
		},
		getAdcode(item){
			let area_list = this.queryForm.area_list;
			if(area_list.length == 0){
				return false;
			}
			let index = area_list.findIndex(n => n.adcode == item.adcode);
			if(index > -1){
				return true
			}
			return false;
		},
		//选择面积
		setExtent(tag, index){
			console.log('tag1111111111111', JSON.stringify(tag))
			this.queryForm.extent_value = JSON.parse(JSON.stringify(tag));
			this.extentIndex = index;
			this.extent_min = '';
			this.extent_max = '';
			this.closeExtentBox();
		},
		closeExtentBox(){
			this.queryData();
			this.showExtentBox = false;
		},
		
		//设置属性
		setMore(index){
			this.natureIndex = index;
			this.queryForm.nature = this.nature_list[index].value;
		},
		//设置金额
		closeMoreBox(){
			if(this.money_min !== undefined){
				this.queryForm.money_arr[0] = this.money_min;
			}
			if(this.money_max !== undefined){
				this.queryForm.money_arr[1] = this.money_max;
			}
			this.showExtentBox = false;
			this.queryData();
		},
		//适合经营选择
		suitChange(item){
			let suit_list = this.queryForm.suit_list;
			let index = suit_list.findIndex(a=>a.id == item.id);
			if(index > -1){
				this.queryForm.suit_list.splice(index, 1);
			}else{
				this.queryForm.suit_list.push(item);
			}
		},
		
		//搜索框内容改变
		searchChange(){
			if(this.queryForm.keyword == ''){
				this.showAction = false;
				this.queryData();
			}else{
				this.showAction = true;
			}
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
			const t = this;
			this.apiLoadingStatus = true;
			const post_data = JSON.parse(JSON.stringify(this.queryForm));
			post_data.citycode = this.citycode;
			this.$request('transShopInfoList', post_data,{
				showLoading: false,
			}).then((res)=>{
				console.log('数据列表', res)
				if(this.queryForm.pageNo == 1) {
					this.list = [];
				}
				if(res.data.data.list.length){
					let list = res.data.data.list.map((item)=>{
						let space = 0;
						if(item.latitude && item.longitude && t.locationdata.latitude && t.locationdata.longitude){
							space = t.$util.getDistance(item.latitude, item.longitude, t.locationdata.latitude, t.locationdata.longitude);
							//console.log('计算出的距离', space)
						}
						item.space = space.toFixed(2);
						item.sortval = space.toFixed(2);//排序字段
						return item;
					})
					this.list = this.list.concat(list); //追加新数据
				}
				this.dataListEvent(res.data.data);
			})
		},
		
		//链接点击事件
		linkClick(e){
			if(e.event == 'push'){
				this.$refs['pushPopup'].open();
			}
		},
	}
}
</script>

<style lang="scss" scoped>
	.hotTxt{
		font-size: 28rpx;
		position: relative; 
		color: #929599
	}
	.hot-txt{
		position: relative;
		top: -3px; 
		font-size: 10px;
		color: #929599
	}
	//位置+搜索框
	.address-search-box{
		width: 90%;
		height: 70rpx;
		line-height: 70rpx;
		background: rgba(255,255,255,0.1);
		border-radius: 32rpx;
		border: 2rpx solid rgba(255,255,255,0.2);
		margin: 10px auto;
		display: flex;
		.city-box{
			display: flex;
			max-width: 32vw;
			overflow: hidden;
			padding: 0 20rpx;
			.city-info{
				display: flex;
				.city-name{
					overflow: hidden;
					font-weight: 600;
					font-size: 24rpx;
					color: #36414D;
					// line-height: 64rpx;
					text-align: left;
					font-style: normal;
					margin-right: 10rpx;
					margin-left: 4rpx;
				}
				.micon{
					height:70rpx;
					// line-height: 64rpx;
					font-size: 24rpx;
					color: #36414D;
					font-weight: bold;
				}
			}
			
		}
	}
	.tag-box{
		padding: 5px 10px;
		.tag-flex{
			display: flex;
			flex-wrap: wrap;
			.tag{
				padding: 2px 5px;
				border-radius: 2px;
				font-size: 13px;
				color: #606266;
				background-color: #ffffff;
				margin-right: 5px;
				margin-bottom: 5px;
			}
		}
	}
	
	.top-box{
		background-color: #ffffff;
		padding: 10px 20px;
		display: flex;
		.time-box{
			flex: 1;
			font-size: 16px;
			font-weight: bold;
		}
	}
	.sort-box{
		// background-color: #ffffff;
		padding: 10px 15px;
		display: flex;
		justify-content: space-between;
		.sort-item{
			font-size: 15px;
			color: #303133;
			width: 23%;
			text-align: center;
			.micon{
				color: #606266;
			}
		}
		.active{
			color: #fd7bb7;
			font-weight: bold;
			.micon{
				color: #fd7bb7;
			}
		}
	}
	.search-box{
		background-color: #ffffff; 
		// padding: 5px 0;
		.search-input-box{
			padding: 5px 20px;
			padding-right: 10px;
		}
		
	}
	
	//面积选择器
	.extent-box{
		padding-top: 10px;
		padding-bottom: 30px;
		.extent-flex{
			display: flex;
			flex-wrap: wrap;
			background-color: #ffffff;
			padding: 10px 15px;
			.tag-block{
				padding: 0px 10px;
				border-radius: 2px;
				font-size: 15px;
				color: #606266;
				background-color: #ffffff;
				margin: 10px;
				border: 1px solid #f0f0f0;
				line-height: 25px;
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
	
	.list-body{
		padding: 10px;
		.block-box{
			box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(20,36,51,0.05);
			border-radius: 16rpx;
			background-color: #ffffff;
			margin-bottom: 20rpx;
			.list-item{
				display: flex;
				padding: 10px;
				.cover-box{
					width: 120px;
					height: 100px;
					border-radius: 16rpx;
					overflow: hidden;
					position: relative;
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
						z-index: 998;
					}
				}
				.list-content{
					flex: 1;
					padding-left: 8px;
					padding-right: 10px;
					min-width: 0;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.list-title{
						font-size: 28rpx;
						color: #36414D;
						font-weight: bold;
						line-height: 18px;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
					}
					.list-desc-box{
						display: flex;
						padding-top: 1px;
						.desc-text-box{
							flex: 1;
							color: #606266;
							font-size: 14px;
						}
						.desc-price{
							color: red;
							font-size: 14px;
						}
					}
					.list-tag-box{
						padding: 10rpx 0;
						.tag-box{
							flex: 1;
							padding: 0;
							.tag-flex{
								display: flex;
								flex-wrap: wrap;
								.tag{
									background-color: #295FCC;
									color: #ffffff;
									border-radius: 50rpx;
									font-size: 24rpx;
									margin-right: 8rpx;
									height: 40rpx;
									line-height: 42rpx;
									padding: 0 16rpx;
									margin-bottom: 4rpx;
									display: inline-block;
								}
							}
						}
					}
					.area-box{
						color: #606266;
						font-size: 14px;
						display: flex;
						.area-text{
							flex: 1;
						}
						.space-box{
							padding-left: 10px;
							color: #909399;
							font-size: 13px;
						}
					}
				}
			}
		}
	}
</style>