<template>
	<gui-page 
		ref="guipage"
		
		:customStyle="{
			backgroundColor:System.full_bg_color
		}"
	>
		
		<template v-slot:gBody>
			<view class="top-box">
				<view class="info-box">
					<view class="avatar-box" v-if="setting.avatar">
						<image :src="setting.avatar"></image>
					</view>
					<view class="content-box">
						{{setting.name || ''}}&nbsp;&nbsp;{{setting.position || ''}}
						<view class="desc-box" :class="[openDesc?'':'close-desc']">
							{{setting.desc}}
						</view>
						<view class="micon icon-jiantou_down" style="margin: auto;width: 30px;margin-top: 10px;"
						@click="descChange"
						></view>
					</view>
				</view>
			</view>
			<view class="week-box">
				<view class="week-block" v-for="(week, windex) in setting.date_week" :key="windex"
				:class="[weekIndex == windex ? 'active-week' : '']"
				@click="setweekIndex(windex)"
				>
					<view>{{week.week_name}}</view>
					<view>{{week.day}}</view>
				</view>
			</view>
			<view style="display: flex;padding: 10px;">
				<view style="font-size: 15px;color: #606266">挂号费用：</view>
				<view style="font-size: 16px;color: #E6A23C">￥{{setting.price}}</view>
			</view>
			<view class="time-box" v-if="setting.date_week.length">
				<view style="display: flex;flex-wrap: wrap;">
					<view class="time-label" v-for="(item, index) in setting.date_week[weekIndex].time_arr" :key="index"
					:style="{color:item.state != -1?'#909399':'#18b566'}"
					@click="openVisit(item, index+1)"
					>
						{{item.time}}[{{index+1}}]号
					</view>
				</view>
			</view>
			
			<up-popup :show="showPopup" mode="center" :round="10" closeable @close="closePopup" >
				<view class="popup-box">
					<view class="form-item">
						<view class="form-label">
							<view>
								预约时间
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content" style="line-height: 30px;">
								{{ruleForm.date}} {{ruleForm.time}}
							</view>
							<view class="icon-box" style="padding-top: 15px;">
								
							</view>
						</view>
					</view>
					
					<view class="form-item">
						<view class="form-label">
							<view>
								真实姓名
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入姓名"
									v-model="ruleForm.name"
									border="bottom"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box" style="padding-top: 15px;">
								
							</view>
						</view>
					</view>
					
					<view class="form-item">
						<view class="form-label">
							<view>
								身份证号
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入身份证号"
									v-model="ruleForm.idcard"
									type='idcard'
									border="bottom"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box" style="padding-top: 15px;">
								
							</view>
						</view>
					</view>
					
					<view class="form-item">
						<view class="form-label">
							<view>
								联系电话
								<text class="micon required"></text>
							</view>
						</view>
						<view class="form-content">
							<view class="content">
								<view class="input-box">
									<u--input
									class="input"
									placeholder="请输入电话"
									v-model="ruleForm.mobile"
									type='number'
									border="bottom"
									:placeholderStyle="{fontSize:'16px',color:'#ceccca'}"
									:customStyle="{paddingRight:'10px',height:'50px'}"
									inputAlign="right"
									:disableDefaultPadding="true"
									/>
								</view> 
							</view>
							<view class="icon-box" style="padding-top: 15px;">
								
							</view>
						</view>
					</view>
					<u-button
					text="确 定" 
					shape="circle" 
					:customStyle="{
						backgroundColor:System.big_but_color,color:'#ffffff',width:'80%',margin:'auto',marginTop:'50px'
					}"
					@click="submit()"
					></u-button>
				</view>
			</up-popup>
			<view class="fixed-right-box">
				<view class="icon-box" @click="navTo('/pages_enroll/visit/order', {login: true})">
					<view class="micon icon-liebiao" style="font-size: 18px;"></view>
					<view style="font-size: 10px;padding-top: 1px;">我的</view>
				</view>
				<view v-if="userInfo.roles == 'admin'" class="icon-box" @click="navTo('/pages_enroll/visit/manage/setting', {login: true})">
					<view class="micon icon-shezhi2" style="font-size: 18px;"></view>
					<view style="font-size: 10px;padding-top: 1px;">设置</view>
				</view>
				
			</view>
		</template>
	</gui-page>
</template>

<script>
	export default{
		data() {
			return {
				weekIndex: 0,
				openDesc:false,
				setting: {
					date_week:[],
					price: '',
					start_time:'',
					end_time: '',
					num: 100,
					time_step: 15,
					limit_day:1,
					avatar:'',
					desc:'',
					role: 'user'
				},
				
				
				showPopup:false,
				ruleForm:{
					date:'',
					time:'',
					name:'',
					mobile:'',
					idcard: '',
					on:''
				}
			}
		},
		onLoad: function() {
			
		},
		onShow() {
			this.getBase();
		},
		methods:{
			setweekIndex(windex){
				this.weekIndex = windex;
				this.ruleForm = {
					date:'',
					time:'',
					name:'',
					mobile:'',
					idcard: '',
					on:''
				}
				console.log(JSON.stringify(this.setting.date_week[windex].time_arr))
			},
			getBase(){
				this.$request('getVisitFormParams', {},{
					showLoading: false,
				}).then((res)=>{
					console.log('预约设置', res) 
					if(res.data.data.setting){
						this.setting = res.data.data.setting; 
					}
				})
			},
			descChange(){
				this.openDesc = this.openDesc ? false : true;
			},
			openVisit(item, on){
				console.log('item', JSON.stringify(item))
				if(item.state != -1){
					this.msg('当前时间不可预约');
					return;
				}
				if(!this.isLogin({nav:false})){
					this.isLogin();
					return;
				}
				this.ruleForm.date = this.setting.date_week[this.weekIndex].date;
				this.ruleForm.time = item.time;
				this.ruleForm.on = on;
				this.showPopup = true;
			},
			closePopup() {
				this.showPopup = false
			},
			submit(){
				this.$request('visitSubmitForm', this.ruleForm,{
					showLoading: false,
				}).then((res)=>{
					console.log('visitSubmitForm数据', res)
					if(res.data.code == 200){
						this.msg(res.data.msg);
						this.closePopup();
						this.getBase();
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.fixed-right-box{
		position: fixed;
		right: 0;
		bottom: 80px;
		padding: 10px;
		
		.icon-box{
			margin-bottom: 5px;
			width: 40px;
			height: 40px;
			padding: 5px;
			text-align: center;
			color: #ffffff;
			background-color: rgba(0,0,0,.6);
			border-radius: 100px;
			padding-top: 5px;
		}
	}
	.week-box{
		display: flex;
		.week-block{
			padding: 5px;
			text-align: center;
			background-color: #ffffff;
			margin: 2px;
			font-size: 14px;
			border-radius: 2px;
			flex: 1;
		}
		.active-week{
			background-color: #287eef;
			color: #ffffff;
		}
	}
	.top-box{
		background-color: #409EFF;
		padding: 10px;
		.info-box{
			display: flex;
			.avatar-box{
				width: 70px;
				height: 90px;
				overflow: hidden;
				border-radius: 5px;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.content-box{
				flex: 1;
				color: #ffffff;
				font-size: 14px;
				padding: 5px;
				padding-bottom: 0;
				.close-desc{
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}
			}
		}
	}
	.time-box{
		padding: 0 10px;
		background-color: #ffffff;
	}
	.time-label{
		padding: 5px;
		margin: 3px 5px;
		font-size: 16px;
		color: #18b566;
		width: 30%;
	}
	
	.popup-box{
		height: 60vh;
		width: 80vw;
		padding: 30px 20px;
		.popup-title-box{
			border-bottom: 1px solid #e7e6e4;
			height: 50px;
			line-height: 50px;
			text-align: center;
			font-size: 17px;
			color: #303133;
			font-weight: bold;
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
	}
</style>