<template>
	<view>
		<text class="emojifont" style="font-size: 48px;" @click="test">&#xc001;</text>
		
	</view>
</template>

<script>
	import emojis from './emojis.js';
	export default {
		data() {
			return {
				emojis:emojis,
				value:'\uc160',
				textareaVal: '',
			}
		},
		async created() {
			/*let emojisList = [];
			for (let i = 0; i <= 82; i++) {
				emojisList.push(`/uC${this.transformnum(i)}`)
			}
			console.log('emojisList', emojisList)
			*/
		},
		methods: {
			onEditorReady() {
				// #ifdef MP-BAIDU
				this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor');
				// #endif
				
				// #ifdef APP-PLUS || H5 || MP-WEIXIN
				uni.createSelectorQuery().select('#editor').context((res) => {
					console.log('onEditorReady', res)
					this.editorCtx = res.context
				}).exec()
				// #endif
				
			},
			undo() {
				this.editorCtx.undo()
			},
			editorinput(e){
				console.log('editorinput', e)
			},
			test(){
				console.log('this.editorCtx', this.editorCtx)
				
			},
			/*transformnum(num){
				let len = 3 //显示的长度，如果以0001则长度为4
				num = parseInt(num, 10) + 1//转数据类型，以十进制自增
				num = num.toString()//转为字符串
				while (num.length < len) {//当字符串长度小于设定长度时，在前面加0
				  num = "0" + num
				}
				return num     
			},*/
			onClick(e){
				this.confirm(e)
			},
			// 输入EMO
			inputEmoji(emo) {
				this.textareaVal += emo;
			},
			delEmoji() {
				if(this.textareaVal.length > 1) {
					this.textareaVal = this.textareaVal.substr(0, this.textareaVal.length-2);
				}
			},
			sendEmoji() {
				console.log(this.textareaVal);
				this.textareaVal='';
			},
			onSelectEmoji(emoji) {
				let input = document.getElementById("input");
				let startPos = input.selectionStart;
				let endPos = input.selectionEnd;
				let resultText =
					input.value.substring(0, startPos) + emoji.data + input.value.substring(endPos);
					input.value = resultText;
					input.focus();
					input.selectionStart = startPos + emoji.data.length;
					input.selectionEnd = startPos + emoji.data.length;
					//赋值数据
					this.$set(this.form, "content", resultText);
			},
			//将表情转换成字符串
			transformationExpression (str) {
			    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
			    str = str.replace(patt, function(char){
					var H, L, code;
					if (char.length===2) {
						H = char.charCodeAt(0); // 取出高位
						L = char.charCodeAt(1); // 取出低位
						code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法
						return "&#" + code + ";";
					} else {
						return char;
					}
			    });
				console.log('ccc', str)
			    return str;
			}

		}
	}
</script>

<style>
	/* #ifndef APP-NVUE */
	 @font-face {
		font-family: 'emojifont';
		src: url('http://test.yunzxun.com/addons/public_serve/public/font/emojifont.ttf') format('truetype');
	}
	/* #endif */
	.emojifont {
		font-family: emojifont !important;
		font-style: normal;
	}
	.content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
	
		.line-title {
			padding-top: 20vh;
			display: flex;
			justify-content: center;
		}
	
		.title {
			font-size: 36rpx;
			color: #8f8f94;
		}
		
		.box {
			padding: 40rpx;
			background-color: #fff;
		}
		
		.text-area {
			height: 80rpx;
		}
		
		.textarea_input {
			height: 100%;
			width: 100%;
			box-sizing: border-box;
			border-radius: 10rpx;
			padding: 16rpx 4rpx;
			font-size: 32rpx;
			color: #333;
			background-color: #eee;
		}
		.emo-content {
			border: 1px solid #eee;
		}
</style>
