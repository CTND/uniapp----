<template>
	<view v-show="show" class="plugin-box">
		<view class="input-box">
			<view class="editor-box">
				<editor id="editor" class="sd-container" placeholder="发布评论..." 
				@ready="editorReady" @focus="editorFcous" @input="editorInput"></editor>
			</view>
			<view class="but-box">
				<view class="ico-box" @click="open()">
					<sd-icon :name="showEmoji ? 'icon-jianpan1' : 'icon-a-smile'" size="26" color="#adadad"></sd-icon>
				</view>
				<view class="send-but" @click="sendPlugin()">评论</view>
			</view>
		</view>
		<view v-show="showEmoji" class="emoji-box">
			<scroll-view v-if="emoji_list.length" :scroll-y="true" class="scroll-box">
				<view class="icom-box">
					<view class="emoji" v-for="(img, index) in emoji_list" :key="index" @click="addEmoji(img)">
						<image :src="img" mode="aspectFill"></image>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"sd-emoji-input",
		data() {
			return {
				show: false,
				showEmoji:false,//初始默认不显示emoji列表
				editorCtx:{},
				emoji_list:[],//表情列表
				cid:0,
				item:{},//对象数据
			};
		},
		created() {
			this.getEmojis();
		},
		methods:{
			//显示
			showInput(item, cid){
				if(item){
					this.item = item;
				}
				this.cid = cid;
				if(this.show){
					return false;
				}
				this.show = true;
			},
			//隐藏
			hidenInput(){
				this.show = false;
				this.showEmoji = false;
			},
			getEmojis(){
				this.$request('getEmojis', {},{
					showLoading: false,
				}).then((res)=>{
					console.log('获取图标', res)
					if(res.data.data.list){
						this.emoji_list = res.data.data.list;
					}
				})
			},
			editorReady(){
				const query = uni.createSelectorQuery().in(this);
				query.select('#editor').context(data => {
					this.editorCtx = data.context;
					this.editorCtx.format('whiteSpace', 'nowrap');
				}).exec();
			},
			//打开图标选择器
			open(){
				if(this.showEmoji === false){
					this.editorCtx.blur();
				}
				this.showEmoji = this.showEmoji ? false : true;
			},
			//编辑器聚焦
			editorFcous(e){
				//this.showEmoji = false;
			},
			//编辑器内容改变时触发
			editorInput(e){
				console.log('编辑器内容改变时触发', e)
			},
			//点击EMOJI图标
			addEmoji(img){
				const t = this;
				//uni.hideKeyboard();
				//t.editorCtx.blur();
				this.editorCtx.insertImage({
					src: img,
					width:'20px',
					height:'20px',
					success: function() {
						console.log('insert image success')
					},
					complete:function(){
						//uni.hideKeyboard();
						//t.editorCtx.blur();
					}
				})
			},
			//初始化编辑器内容
			setContents(){
				const t = this;
				this.editorCtx.getContents({
					success:(res)=>{
						let html = t.iGetInnerText(res.html);
						console.log('t.editorCtx', t.editorCtx)
						t.editorCtx.setContents({
							delta:html
						})
					},
					fail:(err)=>{
						console.log('err', err)
					}
				})
			},
			iGetInnerText(testStr) {
				var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
				resultStr = testStr.replace(/[ ]/g, "");    //去掉空格
				resultStr = testStr.replace(/[\r\n]/g, ""); //去掉回车换行
				return resultStr;
			},
			//发送评论
			sendPlugin(){
				const t = this;
				this.editorCtx.getContents({
					success: function(res) {
						console.log('success', res)
						var reg1 = new RegExp("↵","g");
						var a1 = res.text.replace(reg1,"");
						var a = a1.replace(/\s*/g,"");
						if(res.html.indexOf('<img') == -1 && !a){
							t.msg('内容不能为空');
							return;
						}else{
							if(!Object.keys(t.item).length){
								t.msg('评论对象未知');
								return;
							}
							t.$request('SamePublishNewsComment', {
								new_id:t.item.new_id,
								cid:t.cid,
								contentText:res.html
							},{
								showLoading: false,
							}).then((r)=>{
								t.msg(r.data.msg);
								t.hidenInput();
								t.editorCtx.clear();
								if(r.data.code == 200 && r.data.data.comment){
									t.$emit('plugin-back', r.data.data.comment);
								}
							})
						}
					},
					fail:(err)=>{
						console.log('err', err)
					}
				})
			},
			//获取编辑器内容
			getContents(){
				console.log('获取编辑器内容', this.editorCtx)
				this.editorCtx.getContents({
					success:(res)=>{
						console.log('success', res)
					},
					fail:(err)=>{
						console.log('err', err)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.plugin-box{
		background-color: #f3f3f3;
		padding: 20rpx 30rpx;
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 999;

		.input-box{
			display: flex;
			background: #ffffff;
			padding: 16rpx 20rpx;
			border-radius: 100rpx;

			.editor-box{
				flex: 1;
				overflow: hidden;
				height: 60rpx;
				padding: 20rpx 10rpx;
				.sd-container{
					display: -webkit-box;
					position: relative;
					box-sizing: border-box;
					-webkit-user-select: text;
					user-select: text;
					outline: 1;
					overflow: hidden;
					height: 50rpx;
					min-height: 50rpx;
					vertical-align: bottom;
					img,image{
						vertical-align: bottom;
					}
				}
			}
			.but-box{
				display: flex;
				.ico-box{
					padding: 8rpx;
				}
				.send-but{
					width: 100rpx;
					height: 60rpx;
					line-height: 60rpx;
					background-color: #4f7ffd;
					border-radius: 60rpx;
					text-align: center;
					font-size: 28rpx;
					color: #ffffff;
				}
			}
		}
		
		.emoji-box{
			padding: 20rpx 0;
			.scroll-box{
				height: 40vh;
				.icom-box{
					display: flex;
					flex-wrap: wrap;
					justify-content: space-around;
					.emoji{
						width: 90rpx;
						height: 90rpx;
						padding: 15rpx;
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
			}
			
		}
	}
</style>