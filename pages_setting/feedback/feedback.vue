<template>
	<gui-page ref="guipage"
		>
		<template v-slot:gBody>
			<view class="block">
				<view class="title">问题描述</view>
				<up-textarea v-model="content" placeholder="请填写50字以内的问题描述" autoHeight border="none"
				style="padding: 5px;"
				:maxlength="50"
				height="100"
				></up-textarea>
			</view>
			
			<view class="block">
				<view class="title">上传凭证(提供问题截图)</view>
				<view class="imgs-box">
					<view class="img-box" v-for="(item, index) in images" :key="index">
						<image :src="item" 
						:lazy-load="true"
						mode="aspectFill"
						></image>
						<view class="micon icon-guanbi1" @click.stop="deleteImg(index)"></view>
					</view>
					<view v-if="images.length < 3" class="add-box" @click="addImage()">
						<view class="micon icon-tianjia"></view>
						<view class="add-text">添加图片</view>
					</view>
				</view>
			</view>
			<view class="block" style="display: flex;">
				<view class="title">真实姓名：</view>
				<u--input
				placeholder="请输入您的姓名"
				border="none"
				v-model="name"
			  ></u--input>
			</view>
			<view class="block" style="display: flex;">
				<view class="title">联系电话：</view>
				<u--input
				placeholder="请输入您的联系电话"
				border="none"
				v-model="mobile"
				type="number"
			  ></u--input>
			</view>
			
			<u-button type="primary" text="提交"
			shape="circle" throttleTime="1000"
			size="large"
			:customStyle="$util.butStyle('primary',{
				marginTop:'30px', 
				backgroundColor:System.big_but_color,
				width:'95%',
				borderRadius:'2px'
				})"
			@click="save()"
			></u-button>
		</template>
	</gui-page>
</template>
<script>
export default {
	data() {
		return {
			title:'产品建议', //反馈名称
			params:{
				type:'feedbank', //类型 feedbank：建议 complain：投诉
			},
			
			name:'',
			mobile:'',
			content:'',
			images:[]
		}
	},
	onLoad:function(options){
		if(options.title){
			this.title = options.title;
			uni.setNavigationBarTitle({
				title: options.title
			});
		}
		if(options.params){
			this.params = options.params;
		}
	},
	methods: {
		addImage(){
			const t = this;
			let num = 3 - this.images.length;
			this.$util.upload(num, {type:'image', sourceType:['album', 'camera']}, (res)=>{
				if(res.length){
					this.images = this.images.concat(res);
				}
			})
		},
		deleteImg(index){
			const t = this;
			t.images.splice(index, 1);
		},
		save(){
			if(this.content == ''){
				this.msg('请输入问题描述');
				return;
			}
			if(this.name == ''){
				this.msg('请输入姓名');
				return;
			}
			if(this.mobile == ''){
				this.msg('请输入联系电话');
				return;
			}
			this.$util.throttle(async ()=>{
				let post_data = {
					title: this.title,
					params: this.params,
					name: this.name,
					mobile:this.mobile,
					content: this.content,
					images: this.images,
				};
				this.$request('feedBank', post_data,{
					showLoading: true,
				}).then((res)=>{
					if(res.data.code == 200){
						this.msg('我们已收到您的反馈！');
						setTimeout(()=>{
							uni.navigateBack();
						},1000)
					}
				})
			})
		}
	}
}
</script>
<style scoped lang="scss">
	.block{
		background-color: #ffffff;
		padding: 10px 15px;
		margin: 5px 0;
		.title{
			font-size: 16px;
			line-height: 30px;
		}
		.imgs-box{
			display: flex;
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
	}
	
	.add-box{
		width:calc((100vw - 55px) / 3);
		height: calc((100vw - 50px) / 3);
		margin: 5px;
		border-radius: 5px;
		overflow: hidden;
		background-color: #f0f0f0;
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
</style>