<template>
	<!-- 全屏加载 -->
	
</template>

<script>
	import { queryParams } from 'uview-plus';
	export default{
		data() {
			return {
				redirect_url: '',
				url_params:{}, //scene里面传递的参数
			}
		},
		onLoad: function(options) {
			console.log('首页参数', options)
			const t = this;
			if(options.scene){
				var scene = decodeURIComponent(options.scene);
				var str = t.$util.base64_decode(scene);
				//console.log('index_scene', str)
				var urlToJson = this.$util.urlToJson(str);
				if(Object.keys(urlToJson).length){
					this.url_params = urlToJson;
				}
				//console.log('urlToJson', urlToJson)
				//分销userid
				var shareid = t.$util.geturlParam(str,'sid');
				if(shareid){
					uni.setStorageSync('shareid', shareid);
				}
			}else{
				if(options.redirect_url){
					let redirect_url = decodeURIComponent(this.$util.base64_decode(options.redirect_url));
					//console.log('解码出来的跳转路由', redirect_url)
					this.redirect_url = redirect_url;
				}
				if(options.shareid){
					uni.setStorageSync('shareid', options.shareid);
				}
				if(Object.keys(options).length){
					let url_params = {};
					let keys = Object.keys(options);
					//console.log('keys', keys)
					for(var i = 0; i < keys.length; i++){
						if(keys[i] != 'redirect_url' && keys[i] != 'shareid'){
							url_params[keys[i]] = options[keys[i]];
						}
					}
					this.url_params = url_params;
					//console.log('url_params', url_params)
				}
			}
			
		},
		onShow() {
			this.$store.dispatch('getSystem', (res)=>{
				//console.log('this.$store.dispatch_system333333333333333333333333333333', res)
				//console.log('this.$store.state.tabbarData', this.$store.state.tabbarData)
				
				let jump_path = '';
				let jump_type = '';
				if(this.redirect_url){
					jump_path = this.redirect_url;
				}else{
					jump_path = res.jump_path; 
				}
				if(res.jump_type){
					jump_type = res.jump_type;
				}
				jump_path = jump_path.replace(/\u0000/g, '');//清理制表符
				jump_path = jump_path.split(' ').join(''); //清理空格
				//console.log('index处理跳转方式@@', jump_path.replace(/\u0000/g, '')+'1')  
				this.redirectTo(jump_path, this.url_params, jump_type);
				
			})
		},
		onReady() {
			
		}
	}
</script>

<style>
</style>