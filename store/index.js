import { createStore } from 'vuex'
import {request} from '@/common/js/request'
const store = createStore({
    state: {
		//全局缓存参数  userInfo  video_id push_clientid
    	//单一状态树，定义应用状态的默认初始值，页面显示所需的数据从该对象中进行读取
    	//不可直接对 state 进行更改，需要通过 Mutation 方法来更改
    	//由于 Vuex 的状态存储是响应式的，从 store 实例中读取状态最简单的方法就是在计算属性中返回某个状态
    	//每当 store.state.count 变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。
    	//.通过属性访问，需要在根节点注入 store ->return store.state.username 
		System:{},//系统配置数据
		systemInfo:{},//系统信息
		
		//底部自定义导航数据
		tabbarIndex : 0,//底部导航下标
		tabbarData:{
			value:0,//默认导航索引
			options:{
				iconSize: 25,
				navmarginTop: 2,
				fontSize: 12,
				inactiveColor: "#565555",
				activeColor: "#1989fa",
				iconBold: 0,
				dot: 0,
				bgColor: "#ffffff"
			},//参数
			list:[],//导航列表
		},
		
		timParam:{},//腾讯IM参数  SDKid
		timSDK:{},//腾讯TIM对象
		userSig:'',//IM当前用户签名
		push_clientid:'',//客户端推送标识cid
    	gaodekey:'f31c92a5e85c722522be78f5653715c0',
		//分享数据
    	ShareData:{
			title:'',
			imageUrl:'',
			path:''
		},
		shareParams:{},//分享参数
    	diyData:[],//Diy数据
    	
		userInfo: {userid:0},
    	token: '',
		locationdata:{},//位置信息
    	showWindow: true,//首页弹窗全局弹窗一次
    	
    	timerIdent: false,//全局1s定时器，只在全局开启一个，所有需要定时执行的任务监听该值即可，无需额外开启
    	cartCount: 0, //购物车数量
    	orderCount: {}, //订单数量
    	couponCount: 0, //可用优惠券数量
    	timestamp: 1608820295, //初始时间戳
    	menuDot: 0, //底部菜单栏是否显示红点
    },
    getters: {
    	//可以认为是 store 的计算属性，对 state 的加工，是派生出来的数据。
    	//通过属性访问，Getter 会暴露为 store.getters 对象，
    	//你可以以属性的形式访问这些值->return store.getters.doneTodos  
    	
    	timeString(state) {//时间戳转换后的时间
    		var date = new Date(state.timestamp);
    		var year = date.getFullYear();
    		var mon  = date.getMonth()+1;
    		var day  = date.getDate();
    		var hours = date.getHours();
    		var minu = date.getMinutes();
    		var sec = date.getSeconds();
    		var trMon = mon<10 ? '0'+mon : mon
    		var trDay = day<10 ? '0'+day : day
    		return year+'-'+trMon+'-'+trDay+" "+hours+":"+minu+":"+sec;
    	}
    },
    mutations: {
    	//Vuex中store数据改变的唯一方法就是mutation
    	//同步函数 必须使用 store.commit 调用 mutation（需要在根节点注入 store）。
    	//用法示例：
    	// this.$store.commit('setStateAttr', {
    	// 	key: 'system',
    	// 	val: res.data.data.get_system
    	// })
    	updateTime(state){//更新当前时间戳
    		state.timestamp = Date.now()
    	},
    	//更新state数据
    	setStateAttr(state, param){
    		if(param instanceof Array){
    			for(let item of param){
    				state[item.key] = item.val;
    			}
    		}else{
    			state[param.key] = param.val;
    		}
    	},
    	//更新token
    	setToken(state, data){
    		const {token, tokenExpired} = data;
			//console.log('更新token', data)
    		state.token = token;
    		uni.setStorageSync('token', token);
    		uni.setStorageSync('tokenExpired', tokenExpired);
    		this.dispatch('getUserInfo'); //更新用户信息
    	},
    	//退出登录
    	logout(state, ref = 1){
			//console.log('出登录', state, ref, url)
    		state.token = '';
			uni.setStorageSync('token', '');
    		uni.removeStorageSync('token');
    		uni.setStorageSync('loginLock', 1);
			uni.setStorageSync('userInfo', '')
    		uni.removeStorageSync('userInfo');
    		setTimeout(()=>{
    			state.userInfo = {userid:0};
				state.tabbarData.value = 0;
				if(ref == 1){
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}else{
					uni.navigateBack();
				}
    		}, 500)
    	},
    },
    actions: {
    	//异步函数
    	//action 提交的是 mutation，通过 mutation 来改变 state ，而不是直接变更状态。
    	//action 可以包含任意异步操作。
    	//actions 通过 store.dispatch 方法触发:->store.dispatch('addCountAction')
    	//更新用户信息
		
		//获取系统设置
		async getSystem({state, commit}, callback = null){
			let ext = {
				showLoading: false,
				cache: 5*60
			};
			const res = await request('Getsystem',{}, ext);
			console.log('获取系统设置', res)
			if(res.data.code == 200 && res.data.data.System){
				commit('setStateAttr', {
					key: 'System',
					val: res.data.data.System
				})
				typeof callback == 'function' && callback(res.data.data.System);
			}
		},
    	async getUserInfo({state, commit}, callback = null){
			var data = {
				deviceBrand: state.systemInfo.deviceBrand,
				deviceType: state.systemInfo.deviceType,
				osName: state.systemInfo.osName,
				deviceId:state.systemInfo.deviceId,
			};
			var push_clientid = uni.getStorageSync('push_clientid');
			if(push_clientid){
				data.push_clientid = push_clientid;
			}
    		const res = await request('userInfo',data,{
				showLoading: false
			});
    		if(res.data.code === 200){
    			let userInfo = res.data.data.userInfo;
				//console.log('store获取用户信息-----', userInfo)
				//缓存用户简单数据
				uni.setStorageSync('userInfo', JSON.stringify({
					userid: userInfo.userid,
					avatar: userInfo.avatar,
					nickname: userInfo.nickname.replace(/<[^>]+>/g, '')
				}))
    			commit('setStateAttr', {
    				key: 'userInfo',
    				val: userInfo
    			})
				typeof callback == 'function' && callback(userInfo);
    		}else{
    			typeof callback == 'function' && callback({});
    		}
    	},
		
		//获取IM参数
		async getTim({state, commit}, callback = null){
			const res = await request('getTimParam',{},{
				showLoading: false
			});
			console.log('store-获取IM参数', res)
			if(res.data.code === 200){
				typeof callback == 'function' && callback(res.data.data);
			}else{
				typeof callback == 'function' && callback({});
			}
		},
		
    	//更新购物车数量
    	async getCartCount({state, commit}){
    		let count = 0;
    		if(state.token){
    			try {
    				const res = await request('CartCount',{},{});
    				count = res.data.data.total || 0;
    			}catch (err){
    				console.error('更新购物车数量 => ', err);
    			}
    		}
    		commit('setStateAttr', {
    			key: 'cartCount',
    			val: count
    		})
    		return count;
    	},
    	//更新用户订单数量
    	async getOrderCount({state, commit}){
    		let data = {
    			c0: 0,
    			c1: 0,
    			c2: 0,
    			c3: 0
    		}
    		if(state.token){
    			try {
    				const res = await request('order', 'getOrderCount');
    				data = res;
    			}catch (err){
    				console.error('更新用户订单数量 => ', err);
    			}
    		}
    		commit('setStateAttr', {
    			key: 'orderCount',
    			val: data
    		})
    	},
    	//更新用户优惠券数量
    	async getCouponCount({state, commit}){
    		let count = 0;
    		if(state.token){
    			try {
    				const res = await request('coupon', 'getUserCouponCount');
    				count = res.total;
    				console.log(res);
    			}catch (err){
    				console.error('更新用户优惠券数量 => ', err);
    			}
    		}
    		commit('setStateAttr', {
    			key: 'couponCount',
    			val: count
    		})
    	},
    }
})
 
export default store