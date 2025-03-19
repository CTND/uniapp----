<template>
	<view style="padding: 10px;">
		<view style="display: flex;flex-wrap: wrap;">
			<view class="micon" v-bind:class="[checked == 1 ? 'icon-gouxuan': 'icon-danxuanweixuan']"
			style="line-height: 20px;font-size: 20px;color: #606266;line-height: 16px;"
			@click="agreeChage"></view>
			<view style="padding-left: 8px;font-size: 14px;color: #606266">我已阅读并同意：</view>
			<view style="font-size: 14px;color: #2979ff;display: flex;flex-wrap: wrap;">
				<view v-for="(item,index) in agree_list" :key="index"
				@click="navTo('/pages_public/agree/index?id='+item.id, {login:false})"
				>{{"《"+item.title+"》"}}</view>
			</view>
		</view>
	</view>
</template>
<!-- <sd-agree-link v-if="setting.id" :ids="setting.agrees" @agree-change="agreeChange"></sd-agree-link> -->
<script>
	export default{
		name:'sd-agree-link',
		props:{
			ids:{
				type:[Array,String],
				default:[]
			}
		},
		data() {
			return {
				agree_list:[],
				checked:0
			}
		},
		created() {
			console.log('ids', this.ids)
			if(this.ids){
				this.getAgrees();
			}
		},
		methods:{
			getAgrees(){
				this.$request('agreeList', {ids: this.ids},{
					showLoading: false,
				}).then((res)=>{
					if(res.data.data.agree_list){
						this.agree_list = res.data.data.agree_list;
					}
				})
			},
			agreeChage(){
				var checked = this.checked == 1 ? 0 : 1;
				this.checked = checked;
				this.$emit('agree-change', checked);
			}
		}
	}
</script>

<style>
</style>