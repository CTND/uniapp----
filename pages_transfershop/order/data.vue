<template>
	<gui-page 
		ref="guipage"
		
		:customStyle="{
			backgroundColor:System.full_bg_color
		}"
	>
		
		<template v-slot:gBody>
			<view class="list-item" v-if="info.id > 0">
				<view class="list-content">
					<view  class="tag-box" :style="{backgroundColor:info.tag_data.tag_color}">
						{{info.tag_data.name}}
					</view>
					<view class="list-title text-overflow">
						{{info.title}}
					</view>
					<view class="list-desc-box">
						信息编号：{{info.order_no}}
					</view>
					<view class="list-desc-box">
						所在地区：<text>{{info.cityname}} {{info.area_data.name || ''}} {{info.area_data.street_name ||''}}</text>
					</view>
					<view class="list-desc-box">
						发布时间：{{info.create_time}}
					</view>
				</view>
			</view>
			<h4 style="padding: 10px;">近7日数据汇总</h4>
			<canvas canvas-id="KzFkSLAnHQAuLhTiYUCUDQIXnyJjPqYd" id="KzFkSLAnHQAuLhTiYUCUDQIXnyJjPqYd" class="charts" @touchend="tap"/>
			
			<h4 style="padding: 10px;">近7日各平台曝光统计</h4>
			<canvas canvas-id="onkWRAelLEcBCvQSpFuznrJrfeOPyKjD" id="onkWRAelLEcBCvQSpFuznrJrfeOPyKjD" class="charts" @touchend="tap"/>
			
			
			<!-- 全屏加载 -->
			
		</template>
	</gui-page>
</template>

<script>
	import uCharts from '@/common/js/u-charts.js';
	var uChartsInstance = {};
	export default{
		data() {
			return {
				id: 0,
				info:{
					id:0,
					banner_imgs:[],
					item_list:[]
				},
				
				cWidth: 750,
				cHeight: 500
			}
		},
		onLoad: function(options) {
			if(options.id){
				this.id = options.id;
				this.getData();
			}
		},
		onShow() {
			
		},
		onReady() {
		    //这里的 750 对应 css .charts 的 width
		    this.cWidth = uni.upx2px(750);
		    //这里的 500 对应 css .charts 的 height
		    this.cHeight = uni.upx2px(500);
		    //this.getServerData();
		},
		methods:{
			getData(){
				this.$request('transShopInfoData', {id: this.id},{
					showLoading: false,
				}).then((res)=>{
					console.log('详情', res)
					if(res.data.data.info){
						this.info = res.data.data.info;
						setTimeout(() => {
							let echart_data = res.data.data.echart_data;
							this.drawCharts('KzFkSLAnHQAuLhTiYUCUDQIXnyJjPqYd', echart_data);
							//各平台曝光
							this.drawCharts1('onkWRAelLEcBCvQSpFuznrJrfeOPyKjD', res.data.data.plagin_list);
							
						}, 500);
					}
				})
			},
			//访问数据
			drawCharts(id,data){
				const ctx = uni.createCanvasContext(id, this);
				uChartsInstance[id] = new uCharts({
					type: "column",
					context: ctx,
					width: this.cWidth,
					height: this.cHeight,
					categories: data.categories,
					series: data.series,
					animation: true,
					background: "#FFFFFF",
					color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
					padding: [15,15,0,5],
					enableScroll: false,
					legend: {},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						data: [
							{
								min: 0
							}
						]
					},
					extra: {
						column: {
							type: "group",
							width: 30,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08
						}
					}
				});
			},
			//平台曝光
			drawCharts1(id,data){
			      const ctx = uni.createCanvasContext(id, this);
			      uChartsInstance[id] = new uCharts({
			        type: "mount",
			        context: ctx,
			        width: this.cWidth,
			        height: this.cHeight,
			        series: data.series,
			        animation: true,
			        background: "#FFFFFF",
			        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
			        padding: [15,15,0,5],
			        enableScroll: false,
			        legend: {},
			        xAxis: {
			          disableGrid: true
			        },
			        yAxis: {
			          data: [
			            {
			              min: 0
			            }
			          ]
			        },
			        extra: {
			          mount: {
			            type: "mount",
			            widthRatio: 1.5
			          }
			        }
			      });
			},
			//进度条
			drawChartsaCcbar(id,data){
			      const ctx = uni.createCanvasContext(id, this);
			      uChartsInstance[id] = new uCharts({
			        type: "arcbar",
			        context: ctx,
			        width: this.cWidth,
			        height: this.cHeight,
			        series: data.series,
			        animation: true,
			        background: "#FFFFFF",
			        color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
			        padding: undefined,
			        title: {
			          name: "80%",
			          fontSize: 35,
			          color: "#2fc25b"
			        },
			        subtitle: {
			          name: "预计交易完成",
			          fontSize: 25,
			          color: "#666666"
			        },
			        extra: {
			          arcbar: {
			            type: "default",
			            width: 12,
			            backgroundColor: "#E9E9E9",
			            startAngle: 0.75,
			            endAngle: 0.25,
			            gap: 2,
			            linearType: "custom"
			          }
			        }
			      });
			},
			tap(e){
			  uChartsInstance[e.target.id].touchLegend(e);
			  uChartsInstance[e.target.id].showToolTip(e);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.charts{
	    width: 750rpx;
	    height: 500rpx;
		background-color: #ffffff;
	}
	.list-item{
		margin-bottom: 20rpx;
		background-color: #ffffff;
		padding: 15px;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		display: flex;
		position: relative;
		overflow: hidden;
		.tag-box{
			position: absolute;
			right: 0;
			top: 0;
			font-size: 14px;
			color: #ffffff;
			height: 28px;
			line-height: 28px;
			padding: 0 5px;
		}
		.list-content{
			flex: 1;
			min-width: 0;
			.list-title{
				font-size: 17px;
				font-weight: bold;
				color: #303166;
			}
			.list-desc-box{
				font-size: 14px;
				color: #606266;
				padding-top: 10px;
			}
		}
		.icon-box{
			line-height: 70px;
			font-size: 14px;
			color: #909399;
		}
	}
</style>