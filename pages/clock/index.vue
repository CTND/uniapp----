<template>
	<gui-page 
	ref="guipage"
	 
	:customFooter="false" 
	:showFooterBar="false"
	>
		<template v-slot:gBody>
			<view class="full-all-box">
				<map 
				id="map"
				ref="map"
				class="map-class"
				show-location
				:latitude="locatoionData.latitude" 
				:longitude="locatoionData.longitude"
				:markers="[{
					id:1,
					latitude:locatoionData.latitude,
					longitude:locatoionData.longitude,
					iconPath:'/static/images/dinwei-80.png',
					width:40,
					height:40
				}]"
				@regionchange="regionchange"
				@updated="mapupdated"
				>
				</map>
				<view class="content">
					<view  class="action-box" style="padding-top: 10px;">
						<view class="round-big">
							<view class="round-small" @click="doClock()">
								<view class="action-text">考勤打卡</view>
								<view class="action-text" style="padding-top: 20px;">
									{{timeH}}<text class="time-f">:</text>{{timeM}}
								</view>
							</view>
						</view>
					</view>
					<view  class="rotate-box" style="display: flex;justify-content: center;padding-top: 20px;min-width: 0;">
						<!-- <view class="rotate">
							<image :src="$util.img('images/modules/engine/loading2.png')"></image>
						</view>
						<view class="rotate-text">定位中...</view> -->
						<image :src="$util.img('images/system/dinwei-80.png')" style="width: 20px;height: 20px"></image>
						<view style="font-size: 14px;color: #606266;padding-left:5px;">
							<view style="color: #2979ff;font-size: 14px;text-align: center;">
								{{locatoionData.address || '未进入考勤范围'}}
							</view>
						</view>
					</view>
					<view  @click="getLoc()" 
					style="color: #2979ff;font-size: 14px;padding-top: 50px;text-align: center;width: 100px;margin: auto">
						
						重新定位
					</view>
				</view>
			</view>
			
			<!--加载中-->
			 
			 
			<!-- 全屏加载 -->
			<!--  -->
			
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				showPopup:false,
				showDateBox:false,
				date_value: Number(new Date()),//日期默认值
				current: 0,
				list: [{
                    name: '上下班打卡',
                }, {
                    name: '外出打卡',
                }],
				//菜单
				tabbar_value:0,
				tabbarOptions:{
					iconSize: 20,
					iconBold:0,
					fontSize: 12,
					inactiveColor: '#7d7e80',
					activeColor: '#2979ff',
					navmarginTop:3,
				},
				locatoionData:{
					latitude: '',
					longitude: '',
					adcode: "",
					city: "",
					citycode: "",
					district: "",
					province: "",
					address: ""
				},
				//打卡设置
				setting:{
					mend:0
				},
				showType:'empty',
				clockStatus:0,//是否可打卡
				timer:null, //当前定时器
				timeH:'', //当前时间
				timeM:'',
				action_name:'上班打卡',
				time_arr:[], //时间数组
				today_can_clock:0, //今日能否打卡
				
				//补卡
				ruleForm:{
					date1:'',
					clock_img:''
				}
			}
		},
		onLoad: function() {
			// this.getSetting();
			clearInterval(this.timer);
			this.getTime();
		},
		onShow() {
			
		},
		onReady() {
			var MapContext = uni.createMapContext('map', this);
			//MapContext.moveToLocation();
			this.MapContext = MapContext;
		},
		onHide() {
			clearInterval(this.timer);
		},
		methods:{
			
			closePopup() {
				this.showPopup = false
			},
			openPopup(){
				
			},
			mendsubmit(){
				if(this.ruleForm.date1 == ''){
					this.msg('请选择补卡时间');
					return false;
				}
				if(this.ruleForm.clock_img == ''){
					this.$util.msg('请上传图片！');
					return;
				};
				var post_data = {
					locatoion: this.locatoionData,
					current: -1,
					ref_name: '补卡',
					date: this.ruleForm.date1,
					clock_img: this.ruleForm.clock_img
				};
				this.$request('doClock', post_data,{
					showLoading: true,
				}).then((res)=>{
					if(res.data.code == 200){
						this.msg('打卡成功!');
					}
					this.ruleForm = {
						date1:'',
						clock_img:''
					};
					this.showPopup = false
				})
			},
			//选择时间
			showDate(e){
				this.date_ref = e;
				this.showDateBox = true;
			},
			//时间确定
			dateConfirm(e){
				this.showDateBox = false;
				var now = new Date(e.value);
				var year = now.getFullYear();
				let month = now.getMonth() + 1;
				month = month < 10 ? `0${month}` : month;
				var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
				
				var date = year + '-' + month + '-' + day;
				this.ruleForm[this.date_ref] = date;
			},
			getSetting(){
				this.$util.throttle(async ()=>{
					this.$request('getClockSetting', {},{
						showLoading: false
					}).then((res)=>{
						console.log('打卡设置', res)
						if(res.data.data.setting){
							this.setting = res.data.data.setting;
							this.time_arr = res.data.data.time_arr;
							this.action_name = res.data.data.action_name;
							this.today_can_clock = res.data.data.today_can_clock;
							if(res.data.data.today_can_clock == 1){
								this.checkTime();
							}else{
								this.clockStatus = 0;
							}
							this.getLoc();
						}else{
							this.msg('系统未设置打卡规则');
						}
					})
				})
			},
			
			click(item) {
				this.current = item.index;
				this.getLoc();
			},
			swiperChange(e){
				this.current = e.detail.current;
				this.getLoc();
			},
			
			getLoc(){
				this.showType = 'loading';
				this.$util.getLocationData(async(res)=>{
					if(Object.keys(res)){
						this.locatoionData = res;
						this.showType = 'clock';
						this.moveToLocation();
					}else{
						this.msg('获取位置错误');
						this.showType = 'error';
					}
				})
			},
			//获取当前时间
			getTime(){
				//实时显示当前时间
				const t = this;
				this.timer = setInterval(function(){
					var now = new Date();
					var h = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
					var m = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
					var s = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
					var time = h + ':' + m + ':' + s;
					//console.log('shij ', time)
					t.timeH = h;
					t.timeM = m;
					t.checkTime();//实时检测能否打卡
					//t.nowTime = time;
				}, 1000);
			},
			//地图视野变化
			regionchange:function(e){
				const t = this;
				if(e.detail.type=='end'){
					t.MapContext.getCenterLocation({
						success:(result)=>{
						}	
					});
				}
			},
			//地图渲染完成
			mapupdated(){
				console.log('地图渲染完成')
			},
			//将地图中心移动到当前定位点
			moveToLocation(){
				this.MapContext.moveToLocation()
			},
			checkTime(){
				if(this.today_can_clock == 0) return;
				if(this.time_arr.length == 0) return;
				let time_arr = this.time_arr;
				for(var i = 0; i < time_arr.length; i++){
					var beginTime = time_arr[i][0], endTime = time_arr[i][1];
					var res = this.checkAuditTime(beginTime, endTime);
					//console.log('检测时间', res)
					if(res){
						this.clockStatus = 1;
						break;
					}else{
						this.clockStatus = 0;
					}
				}
			},
			//判断时间是否在时间段内
			checkAuditTime(beginTime, endTime) {
				var nowDate = new Date();
				var beginDate = new Date(nowDate);
				var endDate = new Date(nowDate);
				
				var beginIndex = beginTime.lastIndexOf("\:");
				var beginHour = beginTime.substring(0, beginIndex);
				var beginMinue = beginTime.substring(beginIndex + 1, beginTime.length);
				beginDate.setHours(beginHour, beginMinue, 0, 0);
				
				var endIndex = endTime.lastIndexOf("\:");
				var endHour = endTime.substring(0, endIndex);
				var endMinue = endTime.substring(endIndex + 1, endTime.length);
				endDate.setHours(endHour, endMinue, 0, 0);
				return nowDate.getTime() - beginDate.getTime() >= 0 && nowDate.getTime() <= endDate.getTime();
			},
			addImage(ref){
				this.$util.upload(1, {
					type:'image', 
					sourceType:['camera'],
					ref:ref,
				}, (res, params)=>{
					if(res.length){
						this.ruleForm[params.ref] = res[0];
					}
				})
			},
			deleteImg(ref){
				const t = this;
				uni.showModal({
					title: '提示',
					content: '确定要删除该照片吗？',
					success: function (res) {
						if (res.confirm) {
							t.ruleForm[ref] = '';
						}
					}
				});
			},
			//打卡操作
			doClock(){
				if(this.locatoionData.address == ''){
					this.msg('不在考勤范围内！');
					return;
				}
				this.msg('打卡成功！');
				setTimeout(function() {
					this.goBack();
				}, 1000);
				return;
				if(this.current == 0){ //上下班打卡检测时间和位置
					if(this.today_can_clock == 0) return;
					if(this.clockStatus == 0){
						//this.$util.msg('打卡时间已过哦！');
						//return;
					};
					if(this.setting.location != '' && this.locatoionData.address == ''){
						this.msg('打卡位置不能为空！');
						return;
					}
				}else{
					if(this.locatoionData.address == ''){
						this.msg('打卡位置不能为空！');
						return;
					}
				}
				var post_data = {
					locatoion: this.locatoionData,
					current: this.current,
					ref_name: this.action_name
				};
				this.$request('doClock', post_data,{
					showLoading: true,
				}).then((res)=>{
					console.log('doClock', res)
					if(res.data.code == 200){
						//this.getSetting();
						this.msg('打卡成功!');
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.photos-box{
		// background-color: #ffffff;
		padding: 10px;
		display: flex;
		flex-wrap: wrap;
		.img-box{
			width:calc((100vw - 55px) / 3);
			height: calc((100vw - 50px) / 3);
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
		width:calc((100vw - 55px) / 3);
		height: calc((100vw - 50px) / 3);
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
	.form-block{
		background-color: #ffffff;
		padding: 0 15px;
		margin-bottom: 10px;
		.form-item{
			display: flex;
			// padding: 15px 0;
			box-sizing: border-box;
			height: 55px;
			line-height: 55px;
			vertical-align: middle;
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
			.form-content{
				flex: 1;
				display: flex;
				.content{
					flex: 1;
					min-width: 0;
					text-align: right;
					font-size: 16px;
					color: #303133;
					display: flex;
					.input-box{
						flex: 1;
						padding: 0 5px;
						.input{
							line-height: 35px;
							height: 35px;
							margin-top: 10px;
						}
					}
					.placeholder-box{
						text-align: right;
						font-size: 16px;
						color: #909399;
					}
				}
				.icon-box{
					padding-left: 5px;
				}
			}
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
				padding-top: 10px;
				.textarea{
					font-size: 17px;
					line-height: 1.3;
					color: #303133;
					border: 1px solid;
				}
			}
		}
		//操作部分
		.action-box{
			padding: 10px 0;
			.form-label{
				font-size: 17px;
				color: #303133;
			}
			.action-content{
				padding: 10px 5px;
				.step-box{
					display: flex;
					.step-left{
						padding-right: 5px;
						display: flex;
						flex-direction: column;
						.ico-box{
							width: 20px;
							height: 20px;
							margin: auto;
							border-radius: 20px;
							background-color: #bfc9d3;
						}
						.step-lin{
							flex: 1;
							width: 1px;
							background-color: #c0c4cc;
							margin: auto;
						}
					}
					.step-right{
						flex: 1;
						// display: flex;
						// flex-direction: column;
						.step-title{
							font-size: 16px;
							color: #303133;
							margin-bottom: 5px;
							padding-top: 2px;
							padding-left: 3px;
						}
						.step-content{
							flex: 1;
							display: flex;
							flex-wrap: wrap;
							vertical-align: middle;
							.info-box{
								background-color: #e4ecfd;
								display: flex;
								justify-content: space-between;
								height: 30px;
								line-height: 30px;
								border-radius: 3px;
								margin: 5px;
								overflow: hidden;
								text-align: center;
								.realname{
									font-size: 15px;
									color: #606266;
									max-width: 70px;
									padding: 0 5px;
									flex: 1;
									min-width: 0;
								}
							}
							.up-box{
								width: 30px;
								height: 30px;
								background-color: #e4ecfd; 
								text-align: center;
								border-radius: 2px;
								margin: 5px;
							}
						}
					}
				}
			}
		}
	}
	.popup-box{
		height: 95vh;
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
	}
	.swiper{
		height: calc(100vh - 110px);
	}
	.map-class{
		height: 200px;
		width: 377px;
		z-index: 1;
	}
	.full-box{
		padding: 10px;
		.full-block{
			background-color: #ffffff;
			border-radius: 5px;
			height: calc(100vh - 120px);
			padding-top: 32vh;
			.ico-box{
				width: 60px;
				height: 60px;
				margin: auto;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.remark{
				font-size: 14px;
				color: #303133;
				text-align: center;
				padding-top: 15px;
			}
		}
	}
	
	.full-all-box{
		height: calc(100vh - 110px);
		padding: 10px;
		position: relative;
		.content{
			padding: 0 15px;
			background-color: #ffffff;
			border-radius: 5px;
			height: calc(100vh - 120px);
			.location-box{
				padding: 50px 0 20px 0;
				text-align: center;
				.city-box{
					color: #618e31;
					font-size: 16px;
					padding-top: 10px;
				}
				.address-text{
					color: #618e31;
					font-size: 15px;
					padding-top: 5px;
				}
			}
			.rotate-box{
				padding-top: 100px;
				.rotate-text{
					font-size: 14px;
					color: #389bff;
					padding-top: 15px;
					text-align: center;
				}
				.rotate{
					width: 60px;
					height: 60px;
					margin: auto;
					text-align: center;
					animation: rotate 1.5s linear normal infinite;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
			.action-box{
				padding-top: 100px;
				.round-big{
					width: 150px;
					height: 150px;
					border-radius: 150px;
					margin: auto;
					background-color: #f0b104;
					padding: 10px;
					.round-small{
						width: 100%;
						height: 100%;
						border-radius: 100%;
						background-color: #ffffff;
						.action-text{
							font-size: 18px;
							color: #303133;
							font-weight: bold;
							text-align: center;
							padding-top: 40px;
						}
						.time-f{
							animation: fade-in 1s linear normal infinite;
						}
					}
				}
				.clock-false{
					background-color: #f4f4f5;
				}
			}
		}
	}
	
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		
		100% {
			transform: rotate(360deg);
		}
	}
	@keyframes fade-in {
	  from {
	    opacity: 0;
	  }
	  to {
	    opacity: 1;
	  }
	}
</style>