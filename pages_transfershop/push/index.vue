<template>
	<gui-page 
		ref="guipage"
		
		:customFooter="custom_Footer"
		:customStyle="{
			backgroundColor:System.full_bg_color,
			padding:'10px'
		}"
		@popup-callback="popupCallback"
	>
		
		<template v-slot:gBody>
			<view v-if="System.cheat==2" class="form-box">
				<!-- <view class="add-photo-box">
					<view class="add-but-box" @click="addImage()">
						<view class="add-ico-box">
							<image :src="$util.img('images/system/add_photo3.svg')" style="width: 100%;height: 100%;"></image>
						</view>
						<view class="add-text">上传店铺照片</view>
					</view>
					<view class="photo-flex-box">
						<view class="img-box" v-for="(item, index) in ruleForm.banner_imgs" :key="index"
						@click="$util.previewImage(index, this.ruleForm.banner_imgs)">
							<image :src="item" 
							:lazy-load="true"
							mode="aspectFill"
							></image>
							<view class="micon icon-guanbi1" @click.stop="deleteImg(index)"></view>
						</view>
					</view>
				</view> -->
				
				<view class="form-block" v-if="ruleForm.nature==1">
					<view class="form-item select-box">
						<view class="form-label">
							<view>
								发布类型
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<up-radio-group v-model="ruleForm.type" placement="row" @change="typeChange">
									<up-radio shape="circle" label="生意转让" :name="0"></up-radio>
									<view style="width: 30px;"></view>
									<up-radio shape="circle" label="商铺出租" :name="1" ></up-radio>
								</up-radio-group>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="form-item">
						<view class="form-label">
							<view>
								店铺标题
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<up-input
									class="input"
									:placeholder="placeholder"
									v-model="ruleForm.title"
									type='text'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									></up-input>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				
				<view class="form-block">
					<view class="form-item select-box" >
						<view class="form-label">
							<view>
								店铺地址
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="data-box" style="padding-right: 10px;" @click="navTo('/pages_public/cityList/index', {login:false})">
									{{ruleForm.cityname || '选择城市'}}
								</view>
								<view class="placeholder-box" 
								v-if="ruleForm.cityname != '' && ruleForm.citycode != ''"
								@click="showAreaBox = true">
									{{ruleForm.area_data.name || ''}}{{ruleForm.area_data.street_name?' | ' + ruleForm.area_data.street_name: '选择区域'}}
								</view>
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy" 
								size="14" color="#c0c4cc" top="9"></sd-icon>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="form-item select-box" >
						<view class="form-label">
							<view>
								详细位置
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="data-box" style="padding-right: 10px;" @click="openLocation()">
									{{ruleForm.location_data.name || '选择位置'}}
								</view>
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy" 
								size="14" color="#c0c4cc" top="9"></sd-icon>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="form-item select-box" @click="showTypeBox = true">
						<view class="form-label">
							<view>
								当前业态
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content" style="display: block;">
								<view class="data-box">{{ruleForm.type_data.title || ''}}</view>
								<view class="placeholder-box" v-if="ruleForm.type_data.title ==''">请选择</view>
							</view>
							<view class="icon-box">
								<sd-icon name="icon-iconfonticonfonti2copycopy" 
								size="14" color="#c0c4cc" top="9"></sd-icon>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="column-box">
						<view class="form-label">
							<view>
								适合经营
							</view>
						</view>
						<view class="form-content">
							<view class="content" style="padding: 10px 0;">
								<up-checkbox-group placement="row">
									<up-checkbox
										v-for="(item, index) in suitList"
										:key="index"
										:label="item.title"
										:name="item.title"
										usedAlone
										:checked="checkSuit(item)"
										:customStyle="{margin: '5px',marginRight: '10px'}"
										size="20px"
										iconSize="18px"
										@change="suitChange(item)"
									>
									</up-checkbox>
								</up-checkbox-group>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="form-item">
						<view class="form-label">
							<view>
								所属商圈
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<up-input
									class="input"
									placeholder="请输入所属商圈"
									v-model="ruleForm.business_name"
									type='text'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									></up-input>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="column-box">
						<view class="form-label">
							<view>
								配套设施
							</view>
						</view>
						<view class="form-content">
							<view class="content" style="padding: 10px 0;display: flex;flex-wrap: wrap;">
								<view class="meating-block" v-for="(meat, mindex) in ruleForm.meating_list" :key="mindex"
								:class="[meat.selected ? 'meating-active' : '']"
								@click="setMeating(mindex)"
								>
									<view class="meating-ico">
										<image :src="meat.ico" mode="widthFix"></image>
									</view>
									<view class="meating-title">{{meat.title}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="column-box">
						<view class="form-label">
							<view>
								店铺标签
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content" style="padding: 10px 0;">
								<up-checkbox-group placement="row">
									<up-checkbox
										v-for="(item, index) in tagList"
										:key="index"
										:label="item.name"
										:name="item.name"
										:usedAlone="true"
										:disabled="getDisabled(item)"
										:checked="checkedTag(item)"
										:customStyle="{margin: '5px',marginRight: '10px'}"
										size="20px"
										iconSize="18px"
										@change="checkboxChange(item)"
									>
									</up-checkbox>
								</up-checkbox-group>
								
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="form-item">
						<view class="form-label">
							<view>
								店铺面积
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入面积"
									v-model="ruleForm.extent"
									type='digit'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box" style="padding-top: 15px;">
								<text class="hotTxt">
									m<text class="hot-txt">2</text>
								</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block" v-if="ruleForm.nature==1">
					<view class="form-item">
						<view class="form-label">
							<view>
								月租金
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入租金"
									v-model="ruleForm.rent_money"
									type='digit'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box" style="padding-top: 15px;">
								<text class="hotTxt">
									元/月
								</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="form-item">
						<view class="form-label">
							<view>
								管理费
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入管理费"
									v-model="ruleForm.manage_money"
									type='digit'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box" style="padding-top: 15px;">
								<text class="hotTxt">
									元/月
								</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="form-item">
						<view class="form-label">
							<view>
								水电费
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content" style="display: flex;">
							<view style="flex: 1;"></view>
							<view class="content" style="width: 100px;">
								<view style="display: block;">
									
								</view>
							</view>
							<view class="icon-box" style="padding: 10px 5px;">
								<up-radio-group v-model="ruleForm.water_money" placement="row">
									<up-radio shape="circle" label="商用" name="商用"></up-radio>
									<view style="width: 30px;"></view>
									<up-radio shape="circle" label="民用" name="民用" ></up-radio>
								</up-radio-group>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block" v-if="ruleForm.nature==1 && ruleForm.type == 0">
					<view class="form-item">
						<view class="form-label">
							<view>
								转让费
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入转让费"
									v-model="ruleForm.transfer_fee"
									type='digit'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box" style="padding-top: 15px;">
								<text class="hotTxt">
									万元
								</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block" v-if="ruleForm.nature==2">
					<view class="form-item">
						<view class="form-label">
							<view>
								出售价格
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入出售价格"
									v-model="ruleForm.transfer_fee"
									type='digit'
									border="none"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box" style="padding-top: 15px;">
								<text class="hotTxt">
									万元
								</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block" v-if="(ruleForm.nature==1 && ruleForm.type == 0) || ruleForm.nature==2">
					<view class="form-item select-box">
						<view class="form-label">
							<view>
								展示为面议
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="data-box"></view>
								<view class="placeholder-box" style="padding-top: 5px;">
									<u-switch v-model="ruleForm.show_mianyi" size="20"
									:activeValue="1"
									:inactiveValue="0"
									inactiveColor="#c8c9cc"
									space="5"
									@change="mianyiChange"
									></u-switch>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="column-box">
						<view class="form-label">
							店铺简介
						</view>
						<view class="column-content">
							<up-textarea
							class="textarea border-color1"
							v-model="ruleForm.desc" 
							placeholder="请输入内容" 
							height="80px"
							border="none"
							:disableDefaultPadding="true"
							></up-textarea>
						</view>
					</view>
				</view>
				
				<view class="form-block">
					<view class="column-box">
						<view class="form-label">
							店铺照片(单张大小不得超过2m)
							<text class="micon required"></text>
						</view>
						<view class="form-content">
							<view class="photos-box">
								<view class="img-box" v-for="(item, index) in ruleForm.banner_imgs" :key="index" 
								@click="$util.previewImage(index, this.ruleForm.banner_imgs)">
									<image :src="item" 
									:lazy-load="true"
									mode="aspectFill"
									></image>
									<view class="micon icon-guanbi1" @click.stop="deleteImg(index)"></view>
								</view>
								<view v-if="ruleForm.banner_imgs.length < 6" class="add-box" @click="addImage()">
									<view class="micon icon-tianjia"></view>
									<view class="add-text">添加照片</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!-- <view class="form-block">
					<view class="column-box">
						<view class="form-label">
							店内视频
							<text style="font-size: 12px;color: #909399">上传店内环境视频更容易成交哦！</text>
						</view>
						<view class="form-content" style="padding-top: 10px;">
							<view class="imgs-box" @click="checkVideo()" v-if="ruleForm.video_url == ''"
							style="display: flex;justify-content: center;flex-direction: column;"
							>
								<image :src="$util.img('images/system/add_video1.svg')" 
								style="width: 40px;height: 40px;display: block;margin: auto;"></image>
							</view>
							<view v-else>
								<video
									id="video_1"
									:poster="ruleForm.video_cover"
									:loop="true"
									:src="ruleForm.video_url"	
									:page-gesture="false"
									object-fit="contain"
									style="width: 100%;"
								></video>
								<view style="display: flex;">
									<view style="flex: 1;"></view>
									<view style="font-size: 14px;" :style="{color:System.big_but_color}"
									@click="reaxUpload"
									>重新上传</view>
								</view>
							</view>
						</view>
					</view>
				</view> -->
				
				<u-button type="primary" text="发 布"
				throttleTime="1000"
				size="large"
				shape="circle" 
				:customStyle="$util.butStyle('primary',{margin:'20px auto', backgroundColor:System.big_but_color,width:'90%'})"
				@click="submit()"
				></u-button>
			</view>
			
			
			
			
			<!-- 分类选择 -->
			<u-popup
			:show="showTypeBox"
			:round="10" 
			:closeOnClickOverlay="false"
			@close="showTypeBox = false"
			>
				<view class="popup-mini-box" style="height: 90vh;">
					<view class="popup-but-title">
						<view class="but-box cancel" @click="cancelTypeCheck">取消</view>
						<view class="but-box true" @click="showTypeBox = false">确定</view>
					</view>
					<scroll-view scroll-y="true" class="scroll-Y" :style="{height: 'calc(100vh  - 50px )'}">
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
										v-if="ruleForm.class_id == item.id"
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
				<view class="popup-mini-box" style="height: 90vh;">
					<view class="popup-but-title">
						<view class="but-box cancel" @click="showAreaBox = false">取消</view>
						<view class="but-box true" @click="showAreaBox = false">确定</view>
					</view>
					<view style="display: flex;">
						<view style="width: 150px;">
							<scroll-view scroll-y="true" class="scroll-Y" :style="{height: 'calc(100vh  - 50px )'}">
								<view class="list-box">
									<view class="list" hover-class="list-hover" hover-stay-time="100"
									v-for="(item, aindex) in areaList" :key="aindex"
									@click="checkArea(aindex)"
									:class="[aindex == areaIndex ? 'list-active' : '']"
									>
										<view class="list-item">
											<view class="list-title">
												{{item.name}}
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
						<view style="flex: 1;">
							<scroll-view scroll-y="true" class="scroll-Y" :style="{height: 'calc(100vh  - 50px )'}">
								<view class="list-box"  v-if="areaList.length && areaList[areaIndex].street_list">
									<view class="list" hover-class="list-hover" hover-stay-time="100"
									v-for="(item, sindex) in areaList[areaIndex].street_list" :key="sindex"
									@click="checkStreet(item)"
									>
										<view class="list-item">
											<view class="list-title">
												{{item.name}}
											</view>
											<view class="action-box">
												<sd-icon 
												v-if="ruleForm.area_data.street_name == item.name"
												name="icon-xuanzhong"
												size="20" color="#287eef" top="0" :customStyle="{textAlign:'center', display:'block'}"></sd-icon>
											</view>
										</view>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
			</u-popup>
			
			<!--加载中-->
			 
		</template>
		
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				showTypeBox:false,
				showAreaBox: false,
				type_list:[
					{
						id:1,
						title:'美食餐饮'
					}
				],
				//适合经营
				suitList:[
					{
						id:1,
						title:'美食餐饮'
					}
				],
				//待选标签
				tagList:[
					{
					  name: '证照齐全',
					},
				],
				//配套设施
				meating_list:[],
				meating_ids:[],
				cityname:'',
				citycode:'',
				//区域列表
				areaIndex:0,
				areaList:[],
				ruleForm: {
					id: 0,
					nature: 1, 
					type:0,
					class_id: 0,
					type_data:{
						id: 0,
						title: '',
					},
					title:'',
					cover_img: '',
					cityname:'',
					citycode:'',
					area_data:{
						name: '',
						street_name:''
					},
					location_data: {
						address: "",
						latitude: '',
						longitude: '',
						name: ""
					},
					suit_list:[],
					tag_list:[],
					//配套设施
					meating_list:[],
					show_mianyi: 0,
					transfer_fee: '',
					rent_money:'',
					extent:'',
					desc:'地理位置优越，采光好，通风通透，格局正，人流量大。现个人原因诚心出让',
					banner_imgs:[],
					video_url:'',
					video_cover:'', 
					media_id:'',
					business_name:'',
					water_money:'商用',
					manage_money:''
				},
				
				empty_form: null,
				placeholder:''
			}
		},
		watch: {
			citycode(newValue) {
				this.ruleForm.citycode = newValue;
				this.getArea();
			},
			cityname(newValue){
				this.ruleForm.cityname = newValue;
			}
		},
		onLoad: function(options) {
			if(options.nature){
				this.ruleForm.nature = options.nature;
			}
			if(options.id){
				this.ruleForm.id = options.id;
				this.$request('transShopOrderInfo', {id:options.id},{
					showLoading: false,
				}).then((res)=>{
					let data = res.data.data;
					if(data.orderData){
						this.ruleForm = data.orderData
					}
				})
			}
			this.setplaceholder();
			this.empty_form = JSON.parse(JSON.stringify(this.ruleForm));
			this.getParams();
		},
		onShow() {
			this.isLogin();
			
		},
		methods:{
			typeChange(){
				this.setplaceholder();
			},
			setplaceholder(){
				let placeholder = '';
				if(this.ruleForm.nature == 1){
					if(this.ruleForm.type==0){
						placeholder = '标题格式：转让+店铺名称';
					}else{
						placeholder = '标题格式：出租+所属商圈';
					}
				}else if(this.ruleForm.nature == 2){
					placeholder = '标题格式：出售+所属商圈';
				}
				this.placeholder = placeholder;
			},
			//获取配置参数
			getParams(){
				this.$request('transShopSendParam', {},{
					showLoading: false,
				}).then((res)=>{
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
					if(data.meating_list){
						this.meating_list = data.meating_list;
						if(this.ruleForm.id == 0){
							for(var i = 0; i < data.meating_list.length; i++){
								let meat = data.meating_list[i];
								meat.selected = false;
								let index = this.ruleForm.meating_list.push(meat);
							}
						}
					}
				})
			},
			//选择配套设施
			setMeating(mindex){
				let selected = this.ruleForm.meating_list[mindex].selected;
				let meat = JSON.parse(JSON.stringify(this.ruleForm.meating_list[mindex]));
				    meat.selected = selected ? false : true;
				this.ruleForm.meating_list[mindex] = JSON.parse(JSON.stringify(meat));
				console.log('this.ruleForm', this.ruleForm)
			},
			//获取区域
			getArea(){
				this.$request('getAreaList', {
					citycode: this.citycode,
					street:1
				},{
					showLoading: true,
				}).then((res)=>{
					//console.log('获取区域', res)
					let data = res.data.data;
					this.areaList = [];
					this.areaIndex = 0;
					this.ruleForm.area_data = {
						street_name:''
					};
					if(data.list.length){
						this.areaList = data.list;
						this.showAreaBox = true;
					}
				})
			},
			//选择区域
			checkArea(aindex){
				this.areaIndex = aindex;
			},
			//选择街道
			checkStreet(item){
				let areaIndex = this.areaIndex;
				let area = {
					name: this.areaList[areaIndex].name,
					citycode: this.areaList[areaIndex].citycode,
					adcode: this.areaList[areaIndex].adcode,
					street_name: item.name
				}
				this.ruleForm.area_data = area;
				this.showAreaBox = false;
			},
			//面议
			mianyiChange(e){
				this.ruleForm.show_mianyi = e;
			},
			//选择分类
			checkType(item){
				this.ruleForm.class_id = item.id;
				this.ruleForm.type_data = {
					id: item.id,
					title: item.title,
				}
			},
			//取消分类选择
			cancelTypeCheck(){
				this.showTypeBox = false;
			},
			//标签选择
			checkboxChange(n){
				let tag_list = this.ruleForm.tag_list;
				let index = tag_list.findIndex(a=>a.tag_id == n.tag_id);
				if(index > -1){
					this.ruleForm.tag_list.splice(index, 1);
				}else{
					this.ruleForm.tag_list.push(n);
				}
			},
			checkedTag(n){
				let tag_list = this.ruleForm.tag_list;
				let index = tag_list.findIndex(a=>a.tag_id == n.tag_id);
				if(index > -1){
					return true
				}else{
					return false
				}
			},
			
			getDisabled(n){
				let tag_list = this.ruleForm.tag_list;
				let index = tag_list.findIndex(a=>a.tag_id == n.tag_id);
				if(index > -1){
					return false
				}else{
					if(this.ruleForm.tag_list.length >= 3){
						return true;
					}
					return false
				}
			},
			//适合经营选择
			suitChange(item){
				let suit_list = this.ruleForm.suit_list;
				let index = suit_list.findIndex(a=>a.id == item.id);
				if(index > -1){
					this.ruleForm.suit_list.splice(index, 1);
				}else{
					this.ruleForm.suit_list.push(item);
				}
			},
			checkSuit(item){
				let suit_list = this.ruleForm.suit_list;
				let index = suit_list.findIndex(a=>a.id == item.id);
				if(index > -1){
					return true;
				}else{
					return false;
				}
			},
			
			addImage(){
				const t = this;
				if(this.ruleForm.banner_imgs.length >= 6){
					this.msg('最多只能上传5张照片');
					return;
				}
				uni.chooseImage({
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册或者拍照
					success: async function(res) {
						const tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							title: '上传中...'
						});
						for(var i = 0; i < res.tempFilePaths.length; i++){
							if(t.ruleForm.banner_imgs.length < 6){
								uni.uploadFile({
									url: t.$util.uploadUrl('image'),
									filePath: res.tempFilePaths[i],
									name: 'file[]',
									formData: {},
									success: function(res) {
										uni.hideLoading();
										var path_str = JSON.parse(res.data);
											console.log('path_str', path_str)
										if (path_str.code == 200) {
											t.ruleForm.banner_imgs.push(path_str.data.file_url)
										}else{
											uni.showToast({
												title: path_str.msg,
												icon: 'none'
											})
										}
									}
								});
							}
						}
					}
				});
			},
			deleteImg(index){
				const t = this;
				uni.showModal({
					title: '提示',
					content: '确定要删除该照片吗？',
					success: function (res) {
						if (res.confirm) {
							t.ruleForm.banner_imgs.splice(index, 1);
						}
					}
				});
			},
			checkVideo(){
				this.$util.upload(1, {type:'video', sourceType:['album', 'camera']}, (res)=>{
					if(res.code == 200 && res.data){
						this.ruleForm.video_url = res.data.file_url;
						this.ruleForm.video_cover = res.data.video_cover;
						if(res.data.media_id){
							this.ruleForm.media_id = res.data.media_id;
						}
					}
				})
			},
			//重新上传
			reaxUpload(){
				this.ruleForm.video_url = '';
				this.ruleForm.video_cover = '';
				this.ruleForm.media_id = '';
			},
			submit(){
				//console.log(this.ruleForm)
				const t = this;
				if(this.ruleForm.title == ''){
					this.msg('标题不能为空');
					return false;
				}
				if(this.ruleForm.citycode == ''){
					this.msg('请选择城市');
					return false;
				}
				if(this.ruleForm.area_data.street_name == ''){
					this.msg('请选择区域');
					return false;
				}
				if(this.ruleForm.location_data.name == ''){
					this.msg('请选择店铺位置');
					return false;
				}
				if(this.ruleForm.type_data.title == ''){
					this.msg('请选择业态');
					return false;
				}
				if(this.ruleForm.tag_list.length == 0){
					this.msg('请选择标签');
					return false;
				}
				if(this.ruleForm.extent == ''){
					this.msg('请填写店铺面积');
					return false;
				}
				if(this.ruleForm.nature==1 && this.ruleForm.rent_money == ''){
					this.msg('请填写月租');
					return false;
				}
				
				if(this.ruleForm.banner_imgs.length == 0){
					this.msg('请上传店铺照片');
					return false;
				}
				//console.log(this.ruleForm)
				//return
				this.$util.throttle(async ()=>{
					this.$request('transShopInfoPush', {
						post_data: this.ruleForm
					},{
						showLoading: true,
					}).then((res)=>{
						this.msg(res.data.msg);
						console.log('发布', res)
						if(res.data.code == 200){
							this.ruleForm = JSON.parse(JSON.stringify(this.empty_form));
							this.$forceUpdate();
							setTimeout(()=>{
								if(res.data.data.id){
									if(res.data.data.pay_price > 0){
										this.navTo('/pages_transfershop/push/success', {login: true}, {id: res.data.data.id}, 'redirectTo');
									}else{
										this.navTo('/pages_transfershop/order/list', {login: true}, {}, 'redirectTo');
									}
								}else{
									//调用上一个页面的方法 或者 设置数据
									let pages = getCurrentPages();
									let prePage = pages[pages.length - 2];
									prePage.$vm.queryData();
									this.goBack();
								}
							}, 1500)
						}
					})
				})
			},
			//选择位置
			openLocation(){
				this.$util.checkLocation(0, (res)=>{
					console.log('选择位置', res)
					if(Object.keys(res)){
						this.ruleForm.location_data = res;
					}else{
						this.msg('获取位置错误');
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.meating-block{
		width: calc( (100% - 40px) / 4);
		margin: 10rpx;
		padding: 10rpx 0;
		border: 1px solid #ffffff;
		border-radius: 10rpx;
		text-align: center;
		.meating-ico{
			width: 35px;
			height: 35px;
			margin:auto;
			overflow: hidden;
			
			image{
				width: 100%;
				height: 100%;
			}
		}
		.meating-title{
			font-size: 28rpx;
			color: #606266;
			padding-top: 4rpx;
		}
	}
	.meating-active{
		border: 1px solid #287eef;
	}
	.add-photo-box{
		background-color: #f3f4f6;
		padding: 50px 0 10px 0;
		.add-but-box{
			width: 100px;
			height: 100px;
			margin: auto;
			.add-ico-box{
				width: 60px;
				height: 60px;
				margin: auto;
			}
			.add-text{
				padding-top: 5px;
				font-size: 13px;
				color: #fa8325;
				text-align: center;
			}
		}
		.photo-flex-box{
			display: flex;
			flex-wrap: wrap;
			padding: 0 10px;
			.img-box{
				width:60px;
				height: 60px;
				margin: 5px;
				border-radius: 5px;
				overflow: hidden;
				position: relative;
				.icon-guanbi1{
					position: absolute;
					top: 0px;
					right: 0px;
					color: red;
				}
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	
	.photos-box{
		// background-color: #ffffff;
		padding: 10px 0;
		display: flex;
		flex-wrap: wrap;
		.img-box{
			width:30%;
			height: calc((100vw - 60px) / 3);
			margin: 5px;
			border-radius: 5px;
			overflow: hidden;
			position: relative;
			.icon-guanbi1{
				position: absolute;
				top: 5px;
				right: 5px;
				color: red;
			}
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.add-box{
		width:30%;
		height: calc((100vw - 60px) / 3);
		margin: 5px;
		border-radius: 5px;
		overflow: hidden;
		background-color: #f8f8f8;
		text-align: center;
		padding-top: 30px;
		.icon-tianjia{
			font-size: 24px;
			line-height: 30px;
		}
		.add-text{
			font-size: 14px;
			color: #909399;
			padding-top: 10px;
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
	.imgs-box{
		border: 1px dashed #e4e7ed;
		border-radius: 10px;
		height: 180px;
	}
	
	.form-box{
		
		// margin-top: 10px;
		.title-text{
			padding: 0 5px;
			font-size: 15px;
			color: #909399;
			margin-bottom: 5px;
		}
		.form-block{
			background-color: #ffffff;
			border-radius: 5px;
			padding: 0 15px;
			margin-bottom: 10px;
			// border-bottom: 1px solid #f0f0f0;
			.form-item{
				display: flex;
				padding: 0px 2px;
				box-sizing: border-box;
				vertical-align: middle;
				
				.form-label{
					font-size: 32rpx;
					color: #303133;
					line-height: 32px;
					display: flex;
					flex-direction: column;
					justify-content: center;
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
						font-size: 15px;
						color: #303133;
						display: flex;
						padding: 0 10px;
						padding-right: 5px;
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
								// height: 32px;
								// line-height: 32px;
							}
						}
						.placeholder-box{
							text-align: right;
							font-size: 15px;
							color: #909399;
							line-height: 32px;
						}
					}
					.icon-box{
						padding-left: 0px;
					}
				}
			}
			.select-box{
				padding: 10px 0;
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
</style>