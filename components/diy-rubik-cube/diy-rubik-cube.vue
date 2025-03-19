<template>
	<view class="options-box" :style="[$util.getModelStyle(modelData.options)]" style="overflow: hidden;">
		<!-- 1行2个 -->
		<!-- row1-of2 -->

		<!-- 1行3个 -->
		<!-- row1-of3 -->

		<!-- 1行4个 -->
		<!-- row1-of4 -->

		<!-- 2左2右 -->
		<!-- row2-lt-of2-rt -->

		<!-- 1左2右 -->
		<!-- row1-lt-of2-rt -->

		<!-- 1上2下 -->
		<!-- row1-tp-of2-bm -->

		<!-- 1左3右 -->
		<!-- row1-lt-of1-tp-of2-bm -->

		<!-- 自定义 -->
		<!-- custom-rubik-cube --> 
		
		<view v-if="modelData.options.selectedTemplate == 'custom-rubik-cube'">
			<view style="position: relative;"><rich-text :nodes="customHtml"></rich-text></view>
		</view>
		<view v-else class="rubik-cube" :style="{ background: modelData.options.background }">
			<template v-if="modelData.options.selectedTemplate == 'row1-lt-of2-rt'">
				
				<view class="template-left"
				:style="{width:modelData.data.list[0].width+'%'}"
				>
					<template v-for="(item, index) in modelData.data.list" :key="'a_'+index">
						<template v-if="index == 0">
							<view :key="index" :class="['item', modelData.options.selectedTemplate]" @click="navTo(item.link.path,{event:item.link.event})" :style="{ padding: modelData.options.imageGap + 'rpx' }">
								<image :src="item.src" mode="widthFix"></image>
							</view>
						</template>
					</template>
				</view>

				<view class="template-right" :style="{width:(100 - modelData.data.list[0].width)+'%'}">
					<template v-for="(item, index) in modelData.data.list" :key="'b_'+index">
						<template v-if="index != 0">
							<view :key="index" :class="['item', modelData.options.selectedTemplate]" @click="navTo(item.link.path,{event:item.link.event})" :style="{ padding: modelData.options.imageGap + 'rpx' }">
								<image :src="item.src" mode="widthFix"></image>
							</view>
						</template>
					</template>
				</view>
			</template>

			<template v-else-if="modelData.options.selectedTemplate == 'row1-lt-of1-tp-of2-bm'">
				<view class="template-left" :style="{ paddingRight: modelData.options.imageGap + 'rpx' }">
					<template v-for="(item, index) in modelData.list" :key="'c_'+index">
						<template v-if="index == 0">
							<view :key="index" :class="['item', modelData.selectedTemplate]" @click="navTo(item.link.path, {event:item.link.event})">
								<image :src="item.imageUrl" mode="widthFix"></image>
							</view>
						</template>
					</template>
				</view>

				<view class="template-right" :style="{ paddingLeft: modelData.options.imageGap + 'rpx' }">
					<view class="template-top" :style="{ paddingBottom: modelData.options.imageGap + 'rpx' }">
						<template v-for="(item, index) in modelData.list" :key="'d_'+index">
							<template v-if="index == 1">
								<view :key="index" :class="['item', modelData.selectedTemplate]" @click="navTo(item.link.path, {event:item.link.event})">
									<image :src="item.imageUrl" mode="widthFix"></image>
								</view>
							</template>
						</template>
					</view>
					<view class="template-bottom" :style="{ paddingTop: modelData.options.imageGap + 'rpx' }">
						<template v-for="(item, index) in modelData.list" :key="'e_'+index">
							<template v-if="index != 0 && index != 1">
								<view
									:key="index"
									:class="['item', modelData.options.selectedTemplate]"
									@click="navTo(item.link.path, {event:item.link.event})"
									:style="{ width: 'calc((100% - ' + modelData.options.imageGap * 2 + 'rpx) / 2)' }"
								>
									<image :src="item.imageUrl" mode="widthFix"></image>
								</view>
							</template>
						</template>
					</view>
				</view>
			</template>

			<template v-else-if="modelData.options.selectedTemplate == 'row1-of3'">
				<view
					:class="['item', modelData.options.selectedTemplate]"
					v-for="(item, index) in modelData.data.list"
					:key="'f_'+index"
					@click="navTo(item.link.path, {event:item.link.event})"
					:style="{ width: 'calc((100% - ' + modelData.options.imageGap * 2 * 2 + 'rpx) / 3)' }"
				>
					<image :src="item.src" mode="widthFix"></image>
				</view>
			</template>

			<template v-else-if="modelData.options.selectedTemplate == 'row1-of4'">
				<view
					:class="['item', modelData.options.selectedTemplate]"
					v-for="(item, index) in modelData.data.list"
					:key="'g_'+index"
					@click="navTo(item.link.path, {event:item.link.event})"
					:style="{ width: 'calc((100% - ' + modelData.options.imageGap * 2 * 3 + 'rpx) / 4)' }"
				>
					<image :src="item.src" mode="widthFix"></image>
				</view>
			</template>

			<template v-else>
				<view
					:class="['item', modelData.options.selectedTemplate]"
					v-for="(item, index) in modelData.data.list"
					:key="'h_'+index"
					@click="navTo(item.link.path, {event:item.link.event})"
					:style="{ padding: modelData.options.imageGap + 'rpx' }"
				>
					<image :src="item.src" mode="widthFix"></image>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
// 魔方、橱窗
//import htmlParser from '@/common/js/html-parser';
export default {
	name: 'diy-rubik-cube',
	props:{
		modelData:{
			type:[Object],
			default:{
				data:{
					list: [
						{
						  src: '',
						  link: '',
						  width: 50,
						},
						{
						  src: '',
						  link: '',
						},
					],
				},
				options:{}
			}
		}
	},
	data() {
		return {
			customHtml: ''
		};
	},
	created() {
		//console.log('收到的页面参数-------------', JSON.stringify(this.modelData.options))
	},
	methods: {
	}
};
</script>

<style lang="scss">
.options-box{
	margin: auto;
}
.rubik-cube {
	// background: #ffffff;
	overflow: hidden;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
}

.rubik-cube .item {
	// float: left;
	text-align: center;
	line-height: 0;
}

.rubik-cube .item image {
	width: 100%;
	max-width: 100%;
	// max-height: 388rpx;
}

// 一行两个
.rubik-cube .item.row1-of2 {
	width: 50%;
	box-sizing: border-box;
}

.rubik-cube .item.row1-of2:nth-child(1) {
	padding-left: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of2:nth-child(2) {
	padding-right: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

// 一行三个
.rubik-cube .item.row1-of3 {
	width: 33.33%;
	box-sizing: border-box;
}

.rubik-cube .item.row1-of3:nth-child(1) {
	padding-left: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of3:nth-child(2) {
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of3:nth-child(3) {
	padding-right: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

// 一行四个
.rubik-cube .item.row1-of4 {
	width: 25%;
	box-sizing: border-box;
}

.rubik-cube .item.row1-of4:nth-child(1) {
	padding-left: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of4:nth-child(2) {
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of4:nth-child(3) {
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-of4:nth-child(4) {
	padding-right: 0 !important;
	padding-top: 0 !important;
	padding-bottom: 0 !important;
}

// 两左两右
.rubik-cube .item.row2-lt-of2-rt {
	width: 50%;
	display: inline-block;
	box-sizing: border-box;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(1) {
	padding-left: 0 !important;
	padding-top: 0 !important;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(2) {
	padding-right: 0 !important;
	padding-top: 0 !important;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(3) {
	padding-left: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row2-lt-of2-rt:nth-child(4) {
	padding-right: 0 !important;
	padding-bottom: 0 !important;
}

// 一左两右
.template-left{
	width: 50%;
	box-sizing: border-box;
}
.rubik-cube .template-right {
	width: 50%;
	box-sizing: border-box;
}

.rubik-cube .item.row1-lt-of2-rt {
	width: 100%;
	box-sizing: border-box;
}

.rubik-cube .template-left .item.row1-lt-of2-rt:nth-child(1) {
	padding-top: 0 !important;
	padding-left: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .template-right .item.row1-lt-of2-rt:nth-child(1) {
	padding-top: 0 !important;
	padding-right: 0 !important;
}

.rubik-cube .template-right .item.row1-lt-of2-rt:nth-child(2) {
	padding-right: 0 !important;
	padding-bottom: 0 !important;
}

// 一上两下
.rubik-cube .item.row1-tp-of2-bm:nth-child(1) {
	width: 100%;
	box-sizing: border-box;
	padding-top: 0 !important;
	padding-left: 0 !important;
	padding-right: 0 !important;
}

.rubik-cube .item.row1-tp-of2-bm:nth-child(2) {
	width: 50%;
	box-sizing: border-box;
	padding-left: 0 !important;
	padding-bottom: 0 !important;
}

.rubik-cube .item.row1-tp-of2-bm:nth-child(3) {
	width: 50%;
	box-sizing: border-box;
	padding-right: 0 !important;
	padding-bottom: 0 !important;
}

// 一左三右
.rubik-cube .template-left .item.row1-lt-of1-tp-of2-bm {
	width: 100%;
	box-sizing: border-box;
}

.rubik-cube .template-bottom {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
}
</style>
