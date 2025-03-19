<template>
	<gui-page  
	ref="guipage"
	>
		<template v-slot:gHeader>
			<view 
			class="gui-bg-primary gui-dark-bg-level-3" 
			style="height:88rpx;" @click="test">
				<text 
				style="line-height:88rpx;" 
				class="gui-block gui-color-white gui-text gui-text-center">自定义吸顶元素mainHeight{{mainHeight}}-{{apiLoadingStatus}}</text>
			</view>
		</template>
		
		<template v-slot:gBody>
			
			<view class="list-body">
				<view class="list-item" v-for="(item, index) in list" :key="index">
					{{index}}
				</view>
			</view>
			<u-empty v-if="list.length==0" :icon="$util.img('images/empty/empty2.png')" text="暂无数据" marginTop="25vh"></u-empty>
			
			
			<u-button type="primary" text="确 定"
			shape="circle" throttleTime="1000"
			size="large"
			:customStyle="$util.butStyle('primary',{marginTop:'60px', backgroundColor:System.big_but_color,width:'80%'})"
			@click.stop="save()"
			></u-button>
			
		</template>
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
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
	onLoad: function() {
		this.queryData()
	},
	onShow() {
		
		this.getBase();
		
	},
	methods: {
		getBase(){
			this.$util.throttle(async ()=>{
				this.$request('getSameBase', {},{
					showLoading: false,
					cache: 10*60
				}).then((res)=>{
					console.log('请求数据', res)
					
				})
			})
			
		},
		//下拉刷新
		reload(){
			console.log('下拉刷新')
			setTimeout(()=>{
				this.$refs.guipage.endReload();//停止刷新
			}, 2000)
		},
		//上拉加载
		loadmorefun(){
			console.log('上拉加载')
			setTimeout(()=>{
				// // 加载完成后停止加载动画
				this.$refs.guipage.nomore();//没有更多数据
			}, 2000)
		},
		queryData() {
			this.queryForm.pageNo = 1;
			this.totalCount = 0;
			this.fetchData();
		},
		fetchData() {
			if(this.totalCount > 0 && this.totalCount <= this.nearby_list.length){
				return;
			}
			this.apiLoadingStatus = true;
			const queryForm = this.queryForm;
			this.$request('SameNearbyList', queryForm,{
				showLoading: true
			}).then((res)=>{
				if(this.queryForm.pageNo == 1){
					this.list = [];
				} 
				if(res.data.data.list.length){
					let list = res.data.data.list;
					this.list = this.list.concat(list);
				}
				this.dataListEvent(res.data.data);
			})
		},
		
	}
}
</script>

<style lang="scss" scoped>
	.list-body{
		padding: 10rpx;
		.list-item{
			height: 100px;
			line-height: 100px;
			margin-bottom: 20rpx;
			background-color: #ffffff;
		}
	}
</style>