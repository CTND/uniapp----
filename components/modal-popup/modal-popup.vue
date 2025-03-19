<template>
	<up-popup
		v-if="show"
		:show="show"
		mode="center"
		:zoom="zoom"
		
		:bgColor="modalData.bgColor"
		:closeable="modalData.closeOnClickOverlay"
		:customStyle="{
			borderRadius: '10px', 
			overflow: 'hidden',
			marginTop: `-${$u.addUnit(modalData.negativeTop)}`
		}"
		:closeOnClickOverlay="modalData.closeOnClickOverlay"
		:safeAreaInsetBottom="false"
		:duration="400"
		@click="clickHandler"
		@close="close()"
	>
		<view class="u-modal"
			:style="{
				width: '80vw',
				backgroundImage:modalData.gradbgColor?'linear-gradient('+modalData.gradbgColor+')' : ''
			}"
		>
			<text
				class="u-modal__title"
				v-if="modalData.title"
			>{{ modalData.title }}</text>
			<view
				class="u-modal__content"
				:style="{
					paddingTop: `${modalData.title ? 12 : 0}px`,
					textAlign: modalData.contentAlign ? 'center' : 'left',
				}"
			>
				<view class="popup-img" v-if="modalData.popup_img">
					<image :src="$util.img(modalData.popup_img)" mode="widthFix"></image>
				</view>
				<view class="modal-slot-text">
					<up-parse :content="modalData.content" @linkTap="popuplinkTap" :previewImg="false"></up-parse>
				</view>
			</view>
			<template v-if="modalData.soltButton">
				<view class="u-modal__button-group--confirm-button">
					<view style="padding-top: 10px;">
						<up-button
							v-if="modalData.showConfirmButton"
							:text="modalData.confirmText"
							type="primary"
							shape="circle"
							:customStyle="{width:'150px',margin:'auto'}"
							@click="confirmHandler()"
						></up-button>
						<view v-if="modalData.showCancelButton"
						style="font-size: 14px;color: #909399;text-align: center;padding-top: 15px;" 
						@click="cancelHandler()">{{modalData.cancelText}}</view>
					</view>
				</view>
			</template>
			<template v-else>
				<up-line v-if="modalData.showConfirmButton || modalData.showCancelButton"></up-line>
				<view
					class="u-modal__button-group"
					:style="{
						flexDirection: 'row' 
					}"
				>
					<view
						class="u-modal__button-group__wrapper u-modal__button-group__wrapper--cancel"
						:hover-stay-time="150"
						hover-class="u-modal__button-group__wrapper--hover"
						:class="[modalData.showCancelButton && !modalData.showConfirmButton && 'u-modal__button-group__wrapper--only-cancel']"
						v-if="modalData.showCancelButton"
						@tap="cancelHandler"
					>
						<text
							class="u-modal__button-group__wrapper__text"
							:style="{
								color: cancelColor
							}"
						>{{ modalData.cancelText }}</text>
					</view>
					<u-line
						direction="column"
						v-if="modalData.showConfirmButton && modalData.showCancelButton"
					></u-line>
					<view
						class="u-modal__button-group__wrapper u-modal__button-group__wrapper--confirm"
						:hover-stay-time="150"
						hover-class="u-modal__button-group__wrapper--hover"
						:class="[!modalData.showCancelButton && modalData.showConfirmButton && 'u-modal__button-group__wrapper--only-confirm']"
						v-if="modalData.showConfirmButton"
						@tap="confirmHandler"
					>
						<u-loading-icon v-if="loading"></u-loading-icon>
						<text
							v-else
							class="u-modal__button-group__wrapper__text"
							:style="{
								color: confirmColor
							}"
						>{{ modalData.confirmText }}</text>
					</view>
				</view>
			</template>
		</view>
	</up-popup>
</template>

<script>
	export default {
		name:"modal-popup",
		data() {
			return {
				show:false,
				zoom: true,
				cancelColor: '#606266', //取消按钮的颜色
				confirmColor: '#2979ff', //确认按钮的颜色
				loading: false, 
				
				modalData:{
					title:'提示',//提示标题
					popup_img:'', 
					content:'',//文本内容
					contentAlign:true,//文本是否居中
					confirmText:'确认',//确认按钮文字
					cancelText:'取消',//取消按钮文字
					showConfirmButton: false, //是否显示确认按钮
					showCancelButton:false,//是否显示取消按钮
					closeOnClickOverlay:false, //是否允许点击遮罩关闭Modal
					soltButton:false, //是否显示solt按钮
					negativeTop: 0, 
					bgColor: '#ffffff', //弹窗背景色 transparent为透明背景
					gradbgColor:'', //渐变背景色
				},
				options:{},//返回附带参数
			};
		},
		watch: {
			show(n) {
				// 为了避免第一次打开modal，又使用了异步关闭的loading
				// 第二次打开modal时，loading依然存在的情况
				if (n && this.loading) this.loading = false
			}
		},
		methods:{
			//打开
			open(params = {}, options={}){
				if(Object.keys(params).length){
					this.modalData = Object.assign({},this.modalData, params)
				}
				let options_Obj = {};
				if(Object.keys(options).length){
					options_Obj = Object.assign({}, options_Obj, options);
				}
				if(params.options){
					options_Obj = Object.assign({}, options_Obj, params.options);
				}
				this.options = JSON.parse(JSON.stringify(options_Obj));
				//console.log('options_ObjQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ', options_Obj, this.modalData)
				this.show = true;
			},
			//关闭
			close(){
				this.show = false;
				this.modalData = this.$options.data().modalData;
			},
			// 点击确定按钮
			confirmHandler() {
				this.$emit('modal-callback', 1, Object.assign({}, this.options))
			},
			// 点击取消按钮
			cancelHandler() {
				this.$emit('modal-callback', 0, Object.assign({}, this.options))
			},
			//提示消息点击事件
			popuplinkTap(e){
				//console.log('popuplinkTap', e)
				let options = Object.assign({}, this.options, e)
				this.$emit('modal-callback', -1, options)
			},
			// 点击遮罩
			// 从原理上来说，modal的遮罩点击，并不是真的点击到了遮罩
			// 因为modal依赖于popup的中部弹窗类型，中部弹窗比较特殊，虽有然遮罩，但是为了让弹窗内容能flex居中
			// 多了一个透明的遮罩，此透明的遮罩会覆盖在灰色的遮罩上，所以实际上是点击不到灰色遮罩的，popup内部在
			// 透明遮罩的子元素做了.stop处理，所以点击内容区，也不会导致误触发
			clickHandler() {
				if (this.modalData.closeOnClickOverlay) {
					this.show = false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "uview-plus/libs/css/components.scss";
	$u-modal-border-radius: 6px;

	.u-modal {
		width: 650rpx;
		border-radius: $u-modal-border-radius;
		overflow: hidden;

		&__title {
			font-size: 16px;
			font-weight: bold;
			color: $u-content-color;
			text-align: center;
			padding-top: 25px;
			display: block
		}

		&__content {
			// padding: 12px 25px 25px 25px;
			// @include flex;
			// justify-content: center;
			// line-height: 1.5;
			// &__text {
			// 	font-size: 15px;
			// 	color: $u-content-color;
			// 	flex: 1;
			// }
		}

		&__button-group {
			@include flex;

			&--confirm-button {
				flex-direction: column;
				padding: 0px 25px 15px 25px;
			}

			&__wrapper {
				flex: 1;
				@include flex;
				justify-content: center;
				align-items: center;
				height: 48px;
				
				&--confirm,
				&--only-cancel {
					border-bottom-right-radius: $u-modal-border-radius;
				}
				
				&--cancel,
				&--only-confirm {
					border-bottom-left-radius: $u-modal-border-radius;
				}

				&--hover {
					background-color: $u-bg-color;
				}

				&__text {
					color: $u-content-color;
					font-size: 16px;
					text-align: center;
				}
			}
		}
	}
</style>