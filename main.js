
	import App from './App'
	import store from './store'
	
	import Util from './common/js/util.js'
	import mixin from './common/mixin/mixin'
	import uviewPlus from 'uview-plus'
	import guiPage from '@/components/gui-page/gui-page.vue'
	// #ifdef VUE3
	import { createSSRApp } from 'vue'
	export function createApp() {
		const app = createSSRApp(App)
		app.use(store)
		app.use(uviewPlus)
		app.mixin(mixin)
		app.config.globalProperties.$store = store;
		app.config.globalProperties.$util = Util;
		// 注册全局组件
		app.component("gui-page",guiPage);
		return {
			app
		}
	}
	// #endif