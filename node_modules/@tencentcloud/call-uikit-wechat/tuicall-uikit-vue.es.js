(function(){"use strict";try{if(typeof document!="undefined"){var e=document.createElement("style");e.appendChild(document.createTextNode("")),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { EVENT as u, TUICallEngine as tt } from "tuicall-engine-wx";
import { TUICore as ie, TUIConstants as B, TUILogin as it } from "@tencentcloud/tui-core";
import Fe from "@tencentcloud/chat";
var s = /* @__PURE__ */ ((A) => (A.CALL = "call", A.CUSTOM = "custom", A))(s || {}), d = /* @__PURE__ */ ((A) => (A[A.UNKNOWN = 0] = "UNKNOWN", A[A.AUDIO = 1] = "AUDIO", A[A.VIDEO = 2] = "VIDEO", A))(d || {}), F = /* @__PURE__ */ ((A) => (A.UNKNOWN = "unknown", A.CALLEE = "callee", A.CALLER = "caller", A))(F || {}), h = /* @__PURE__ */ ((A) => (A.IDLE = "idle", A.CALLING = "calling", A.CONNECTED = "connected", A))(h || {}), ne = /* @__PURE__ */ ((A) => (A.CONTAIN = "contain", A.COVER = "cover", A.FILL = "fill", A))(ne || {}), oe = /* @__PURE__ */ ((A) => (A.RESOLUTION_480P = "480p", A.RESOLUTION_720P = "720p", A.RESOLUTION_1080P = "1080p", A))(oe || {});
const T = {
  IDLE: "idle",
  BE_INVITED: "be-invited",
  DIALING_C2C: "dialing-c2c",
  DIALING_GROUP: "dialing-group",
  CALLING_C2C_AUDIO: "calling-c2c-audio",
  CALLING_C2C_VIDEO: "calling-c2c-video",
  CALLING_GROUP_AUDIO: "calling-group-audio",
  CALLING_GROUP_VIDEO: "calling-group-video"
}, at = {
  unknown: 0,
  audio: 1,
  video: 2
  /* VIDEO */
};
var G = /* @__PURE__ */ ((A) => (A.EAR = "ear", A.SPEAKER = "speaker", A))(G || {}), J = /* @__PURE__ */ ((A) => (A[A.FRONT = 0] = "FRONT", A[A.BACK = 1] = "BACK", A))(J || {}), b = /* @__PURE__ */ ((A) => (A.Camera = "camera", A.Microphone = "microphone", A.SwitchCamera = "switchCamera", A.InviteUser = "inviteUser", A))(b || {}), q = /* @__PURE__ */ ((A) => (A.Open = "open", A.Close = "close", A))(q || {}), be = /* @__PURE__ */ ((A) => (A.LocalInLargeView = "local", A.RemoteInLargeView = "remote", A))(be || {}), x = /* @__PURE__ */ ((A) => (A[A.INVITE = 1] = "INVITE", A[A.CANCEL_INVITE = 2] = "CANCEL_INVITE", A[A.ACCEPT_INVITE = 3] = "ACCEPT_INVITE", A[A.REJECT_INVITE = 4] = "REJECT_INVITE", A[A.INVITE_TIMEOUT = 5] = "INVITE_TIMEOUT", A))(x || {});
const Me = {
  SWITCH_TO_AUDIO_CALL_FAILED: 60001,
  SWITCH_TO_VIDEO_CALL_FAILED: 60002,
  MICROPHONE_UNAVAILABLE: 60003,
  CAMERA_UNAVAILABLE: 60004,
  BAN_DEVICE: 60005,
  NOT_SUPPORTED_WEBRTC: 60006,
  ERROR_BLACKLIST: 20007
}, Qe = {
  SWITCH_TO_AUDIO_CALL_FAILED: "switchToAudioCall-call-failed",
  SWITCH_TO_VIDEO_CALL_FAILED: "switchToVideoCall-call-failed",
  MICROPHONE_UNAVAILABLE: "microphone-unavailable",
  CAMERA_UNAVAILABLE: "camera-unavailable",
  BAN_DEVICE: "ban-device",
  NOT_SUPPORTED_WEBRTC: "not-supported-webrtc",
  ERROR_BLACKLIST: "blacklist-user-tips"
};
var Ye = /* @__PURE__ */ ((A) => (A[A.NORMAL = 0] = "NORMAL", A[A.RELEASE = 1] = "RELEASE", A[A.WARNING = 2] = "WARNING", A[A.ERROR = 3] = "ERROR", A[A.NONE = 4] = "NONE", A))(Ye || {});
const ue = {
  CALL_STATUS: "callStatus",
  CALL_ROLE: "callRole",
  CALL_MEDIA_TYPE: "callMediaType",
  LOCAL_USER_INFO: "localUserInfo",
  LOCAL_USER_INFO_EXCLUDE_VOLUMN: "localUserInfoExcludeVolume",
  REMOTE_USER_INFO_LIST: "remoteUserInfoList",
  REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST: "remoteUserInfoExcludeVolumeList",
  CALLER_USER_INFO: "callerUserInfo",
  IS_GROUP: "isGroup",
  CALL_DURATION: "callDuration",
  CALL_TIPS: "callTips",
  TOAST_INFO: "toastInfo",
  IS_MINIMIZED: "isMinimized",
  ENABLE_FLOAT_WINDOW: "enableFloatWindow",
  BIG_SCREEN_USER_ID: "bigScreenUserId",
  LANGUAGE: "language",
  IS_CLICKABLE: "isClickable",
  DISPLAY_MODE: "displayMode",
  VIDEO_RESOLUTION: "videoResolution",
  PUSHER: "pusher",
  PLAYER: "player",
  IS_EAR_PHONE: "isEarPhone",
  IS_MUTE_SPEAKER: "isMuteSpeaker",
  SHOW_PERMISSION_TIP: "SHOW_PERMISSION_TIP",
  NETWORK_STATUS: "NetWorkStatus",
  GROUP_ID: "groupID",
  ROOM_ID: "roomID",
  ROOM_ID_TYPE: "roomIdType",
  SHOW_SELECT_USER: "showSelectUser",
  IS_SHOW_ENABLE_VIRTUAL_BACKGROUND: "isShowEnableVirtualBackground",
  ENABLE_VIRTUAL_BACKGROUND: "enableVirtualBackground",
  GROUP_CALL_MEMBERS: "groupCallMembers",
  PUSHER_ID: "pusherId"
}, At = {
  INNER_ATTR_KIT_INFO: "inner_attr_kit_info"
}, rt = {
  INITIAL_PUSHER: "initialPusher",
  NEW_PUSHER: "newPusher"
}, i = {
  PREFIX: "【CallService】",
  AUDIO: "audio",
  VIDEO: "video",
  LOCAL_VIDEO: "localVideo",
  ERROR: "error",
  TIMEOUT: "timeout",
  RAF: "raf",
  INTERVAL: "interval",
  DEFAULT: "default",
  BOOLEAN: "boolean",
  STRING: "string",
  NUMBER: "number",
  OBJECT: "object",
  ARRAY: "array",
  FUNCTION: "function",
  UNDEFINED: "undefined",
  UNKNOWN: "unknown",
  ALL: "all",
  MYSELF: "myself",
  DEVICE_LIST: "deviceList",
  CAMERA_POSITION: "cameraPosition",
  CUSTOM_UI_CONFIG: "customUIConfig",
  TRANSLATE: "translate",
  ...rt,
  ...ue,
  ...At
}, st = "https://web.sdk.qcloud.com/component/TUIKit/assets/call.png", nt = "https://web.sdk.qcloud.com/component/TUIKit/assets/call-video-reverse.svg", ye = 2147483647, Pe = 4;
var Oe = /* @__PURE__ */ ((A) => (A[A.TUI_CALL_KIT = 14] = "TUI_CALL_KIT", A[A.TIM_CALL_KIT = 15] = "TIM_CALL_KIT", A))(Oe || {}), Ue = /* @__PURE__ */ ((A) => (A[A.NUMBER_ROOM_ID = 1] = "NUMBER_ROOM_ID", A[A.STRING_ROOM_ID = 2] = "STRING_ROOM_ID", A))(Ue || {});
function ot() {
  wx.hideKeyboard && wx.hideKeyboard({
    complete: () => {
    }
  });
}
function lt() {
  wx.getSystemInfoSync().platform === "devtools" && wx.showModal({
    icon: "none",
    title: "运行环境提醒",
    content: "微信开发者工具不支持原生推拉流组件(即 <live-pusher> 和 <live-player> 标签)，请使用真机调试或者扫码预览。",
    showCancel: !1
  });
}
function He() {
  ot(), lt();
}
async function ct(A, e) {
  try {
    He();
    const t = {
      microphone: !0,
      camera: A === d.VIDEO
    };
    return await e._tuiCallEngine.deviceCheck(t) ? h.CALLING : h.IDLE;
  } catch (t) {
    return console.debug(t), h.IDLE;
  }
}
function It(A) {
  (A == null ? void 0 : A.code) === -1002 && wx.showModal({
    icon: "none",
    title: "error",
    content: (A == null ? void 0 : A.message) || "",
    showCancel: !1
  });
}
function Ct() {
  wx.showModal({
    icon: "none",
    title: "权限提示",
    content: "当前小程序 appid 不具备 <live-pusher> 和 <live-player> 的使用权限，您将无法正常使用实时通话能力，请使用企业小程序账号申请权限后再进行开发体验",
    showCancel: !1
  });
}
const ut = {
  // 按钮文案
  hangup: "挂断",
  reject: "拒绝",
  accept: "接受",
  camera: "摄像头",
  microphone: "麦克风",
  speaker: "扬声器",
  "open camera": "打开摄像头",
  "close camera": "关闭摄像头",
  "open microphone": "打开麦克风",
  "close microphone": "关闭麦克风",
  "video-to-audio": "转语音通话",
  "virtual-background": "模糊背景",
  // 通话结果
  "other side reject call": "对方已拒绝",
  "reject call": "{{ userList }} 拒绝通话",
  cancel: "取消通话",
  "other side line busy": "对方忙线",
  "in busy": "{{ userList }} 正在忙",
  "call timeout": "呼叫超时",
  "end call": "{{ userList }} 结束通话",
  // 通话提示语
  "caller calling message": "等待对方接受邀请",
  "callee calling video message": "邀请你视频通话",
  "callee calling audio message": "邀请你语音通话",
  "no microphone access": "没有麦克风权限",
  "no camera access": "没有摄像头权限",
  "invite member": "邀请成员",
  "Invited group call": "邀请你加入多人通话",
  "Those involved": "参与通话的有：",
  waiting: "等待接听...",
  me: "(我)",
  // 弹出层文案
  "browser-authorization": "浏览器授权",
  "mac-privacy": "系统偏好设置 -> 安全与隐私 -> 隐私",
  "win-privacy": "设置 -> 隐私和安全性 -> 应用权限",
  "mac-preferences": "打开系统偏好设置",
  "win-preferences": "打开系统设置",
  "Please enter userID": "请输入 userID",
  "View more": "查看更多",
  "people selected": "人已选中",
  "Select all": "全选",
  Cancel: "取消",
  Done: "完成",
  "exist group call": "当前群组中已经存在群组通话",
  // UI3.0 新增
  "camera enabled": "摄像头已开",
  "camera disabled": "摄像头已关",
  "microphone enabled": "麦克风已开",
  "microphone disabled": "麦克风已关",
  "speaker enabled": "扬声器已开",
  "speaker disabled": "扬声器已关",
  "open speaker": "开启扬声器",
  "close speaker": "关闭扬声器",
  "wait to be called": "等待接听",
  answered: "已接通",
  "people in the call": "人参与通话",
  "failed to obtain speakers": "无法获取扬声器",
  "you have a new call": "您有一个新的通话",
  "switch camera": "翻转",
  join: "加入",
  "people on the call": "人正在通话",
  "Supports a maximum of 9 people for simultaneous calls": "最多支持9人同时通话",
  you: "(你)",
  "The network is poor during your current call": "当前通话你的网络不佳",
  "The other user network is poor during the current call": "当前通话对方网络不佳",
  "TUICallKit init is not complete": "TUICallKit 初始化登录未完成，需要在 init 完成后使用此 API",
  // combine chat
  "Video call": "发起视频通话",
  "Voice call": "发起语音通话",
  "Call End": "通话结束",
  "Switch voice call": "切换语音通话",
  "Switch video call": "切换视频通话",
  "Call duration": "通话时长",
  "Call Cancel": "已取消",
  "Other Side Cancel": "对方已取消",
  Decline: "已拒绝",
  "Other Side Decline": "对方已拒绝",
  "No answer": "超时无应答",
  "Other Side No Answer": "对方无应答",
  Answered: "已接听",
  "Other Side Line Busy": "对方忙线中",
  "Line Busy": "忙线无应答",
  // 待废弃文案
  timeout: "{{ userList }} 超时",
  "kick out": "被踢",
  call: "通话",
  "video-call": "视频通话",
  "audio-call": "音频通话",
  search: "搜索",
  "search-result": "搜索结果",
  "Wechat scan right QR code": "微信扫右二维码",
  "Use-phone-and-computer": "用手机与电脑互打体验视频通话",
  "Scan the QR code above": "扫描上方二维码",
  "no-user": "未搜索到用户",
  "member-not-added": "未添加成员",
  "not-login": "未登录",
  "login-status-expire": "登录状态已失效，请刷新网页重试",
  "experience-multi-call": "体验多人通话请下载全功能demo:",
  "not-support-multi-call": "多人通话接口未开放",
  "input-phone-userID": "请输入手机号/用户ID",
  userID: "用户ID",
  "already-enter": "已经进入当前通话",
  "image-resolution": "分辨率",
  "default-image-resolution": "默认分辨率",
  "invited-person": "添加成员",
  "be-rejected": "对方已拒绝，",
  "be-no-response": "对方无应答，",
  "be-line-busy": "对方忙线中，",
  "be-canceled": "对方已取消",
  "voice-call-end": "语音通话结束",
  "video-call-end": "视频通话结束",
  "method-call-failed": "同步操作失败",
  "failed-to-obtain-permission": "权限获取失败",
  "environment-detection-failed": "环境检测失败",
  "switchToAudioCall-call-failed": "切语音调用失败",
  "switchToVideoCall-call-failed": "切视频调用失败",
  "microphone-unavailable": "没有可用的麦克风设备",
  "camera-unavailable": "没有可用的摄像头设备",
  "ban-device": "用户禁止使用设备",
  "not-supported-webrtc": "当前环境不支持 WebRTC",
  "blacklist-user-tips": "发起通话失败，被对方拉入黑名单，禁止发起！",
  "is-already-calling": "TUICallKit 已在通话状态",
  "need-init": "TUICallKit 发起通话前需保证 TUICallKitServer.init() 方法执行成功",
  "can't call yourself": "不能呼叫自己",
  // eslint-disable-line
  "accept-error": "接通失败",
  "accept-device-error": "接通失败，通话设备获取失败",
  "call-error": "发起通话失败"
}, Ee = typeof wx < "u" && typeof wx.getSystemInfoSync == "function" && !!wx.getSystemInfoSync().fontSizeSetting, xe = typeof uni < "u" && typeof uni > "u", me = Ee || xe, Je = typeof uni < "u", We = function() {
  return (typeof uni < "u" || typeof window < "u") && !me;
}(), Et = function() {
  return Ee ? wx : Je ? uni : window;
}(), K = We && window && window.navigator && window.navigator.userAgent || "", Lt = /Android/i.test(K), ht = /(?:Windows Phone)/.test(K), gt = /(?:SymbianOS)/.test(K), dt = /iPad/i.test(K) || /iPhone/i.test(K) || /iPod/i.test(K), ze = Lt || ht || gt || dt, Re = We && !ze, ft = Re && K.includes("Windows NT"), _t = Re && K.includes("Mac");
let qe = class Ae {
  constructor() {
    this.global = Et, this.isPC = !1, this.isH5 = !1, this.isWeChat = !1, this.isApp = !1, this.isUniPlatform = !1, this.isOfficial = !1, this.isWIN = !1, this.isMAC = !1, this.initEnv();
  }
  /**
   * 获取 TUIGlobal 实例
   * @returns {TUIGlobal}
  */
  static getInstance() {
    return Ae.instance || (Ae.instance = new Ae()), Ae.instance;
  }
  initEnv() {
    this.isPC = Re, this.isH5 = ze, this.isWeChat = Ee, this.isApp = xe && !Ee, this.isUniPlatform = Je, this.isWIN = ft, this.isMAC = _t;
  }
  initOfficial(e) {
    this.isOfficial = e === 1400187352 || e === 1400188366;
  }
};
const we = function(A) {
  return typeof A === i.UNDEFINED;
}, Te = function(A) {
  if (typeof A !== i.OBJECT || A === null)
    return !1;
  const e = Object.getPrototypeOf(A);
  if (e === null)
    return !0;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return e === t;
}, Xe = function(A) {
  return typeof Array.isArray === i.FUNCTION ? Array.isArray(A) : Object.prototype.toString.call(A).match(/^\[object (.*)\]$/)[1].toLowerCase() === i.ARRAY;
}, Le = function(A) {
  return typeof A === i.STRING;
}, Dt = function(A) {
  return typeof A === i.BOOLEAN;
}, je = function(A) {
  return (
    // eslint-disable-next-line
    A !== null && (typeof A === i.NUMBER && !isNaN(A - 0) || typeof A === i.OBJECT && A.constructor === Number)
  );
};
function Ze(A) {
  const e = Math.floor(A / 3600), t = Math.floor(A % 3600 / 60), a = Math.floor(A % 60);
  let r = e > 9 ? `${e}` : `0${e}`;
  return r += t > 9 ? `:${t}` : `:0${t}`, r += a > 9 ? `:${a}` : `:0${a}`, r;
}
function St(A) {
  if (typeof A === i.STRING)
    try {
      return !!JSON.parse(A);
    } catch (e) {
      return console.debug(e), !1;
    }
  return !1;
}
const ce = function(A) {
  return !A || !St(A) ? A : JSON.parse(A);
};
function ve(A) {
  return (A == null ? void 0 : A.message.indexOf("is ongoing, please avoid repeated calls")) !== -1;
}
function Bt(A) {
  const { message: e } = A;
  return e.indexOf("NotAllowedError: Permission denied") !== -1;
}
function _e() {
  return Date.now();
}
const Ut = function(A) {
  return typeof A === i.FUNCTION;
}, Nt = () => {
  if (qe.getInstance().isWeChat)
    return "zh-cn";
  const A = ((navigator == null ? void 0 : navigator.language) || (navigator == null ? void 0 : navigator.userLanguage) || "").substr(0, 2);
  let e = "en";
  switch (A) {
    case "zh":
      e = "zh-cn";
      break;
    case "ja":
      e = "ja_JP";
      break;
    default:
      e = "en";
  }
  return e;
}, Ot = function(A) {
  return Object.prototype.toString.call(A).match(/^\[object (.*)\]$/)[1].toLowerCase();
};
function Rt(A, e, t) {
  if (!A.hasOwnProperty(e))
    return A;
  const a = {};
  return Object.keys(A).forEach((r) => {
    r === e ? a[t] = A[r] : a[r] = A[r];
  }), a;
}
function wt(A, e) {
  return A.replace(/{{\s*(\w+)(\s*,\s*[^}]+)?\s*}}/g, (t, a) => {
    const r = a.trim();
    return e[r] !== void 0 ? String(e[r]) : t;
  });
}
const O = {
  OTHER_SIDE: "other side",
  CANCEL: "cancel",
  OTHER_SIDE_REJECT_CALL: "other side reject call",
  REJECT_CALL: "reject call",
  OTHER_SIDE_LINE_BUSY: "other side line busy",
  IN_BUSY: "in busy",
  CALL_TIMEOUT: "call timeout",
  END_CALL: "end call",
  TIMEOUT: "timeout",
  KICK_OUT: "kick out",
  CALLER_CALLING_MSG: "caller calling message",
  CALLER_GROUP_CALLING_MSG: "wait to be called",
  CALLEE_CALLING_VIDEO_MSG: "callee calling video message",
  CALLEE_CALLING_AUDIO_MSG: "callee calling audio message",
  NO_MICROPHONE_DEVICE_PERMISSION: "no microphone access",
  NO_CAMERA_DEVICE_PERMISSION: "no camera access",
  EXIST_GROUP_CALL: "exist group call",
  LOCAL_NETWORK_IS_POOR: "The network is poor during your current call",
  REMOTE_NETWORK_IS_POOR: "The other user network is poor during the current call"
}, H = {
  "zh-cn": ut
};
function X(A) {
  var a, r;
  const e = l.getData(s.CALL, i.LANGUAGE);
  let t = "";
  if (Le(A))
    t = ((a = H == null ? void 0 : H[e]) == null ? void 0 : a[A]) || "";
  else if (Te(A)) {
    const { key: n, options: o } = A;
    t = ((r = H == null ? void 0 : H[e]) == null ? void 0 : r[n]) || "", t = wt(t, o);
  }
  return t;
}
const Tt = "data:audio/mpeg;base64,SUQzAwAAAAAAGFRYWFgAAAAOAAAAVFhYWABpc29taXNvMv/zNGQAAqwAvnihCAADQAF4CUAQAFYAg3Lh8u+XUD5///wx//wQOAhKAgb/////xOoH4g8Hz4Pq8RoAbdTgMsMt9hcb990EP//zNGQQBPDjEgDItAAFWcIoAYoQAN9P/03QQ//umn//91SXL5uXP+pf8WYTvzgJPAQ+p/7f///1//6f///WH///F4BtJhNFkP/zNGQGA/jjNADHiAAEQDJcAYkQAGWrn6vw6ljfPtj/////////9Pv9sL/mL/QezSepgwrimv07//////y3u602OiyhOYb+LP/zNGQIBKTBKADoCACDoCZMAckAAKHKCUIAFsqGZXtSZ/////////Sn/Vy3nVUOJBqSX2UAkQxBddzv//////yq3lcgaTmTQ//zNGQHA9SrJgA8AliD4C5IAApYAKh3FKlMunKHm8H/2//77vkdqB2xfsXaHiDKBGtFKqONF3/////Z9VXClT5ND+syHkjBq//zNGQLBITJIAA8AmQEiDI4AAjSAGa1Vffm3ff/1/0//11tvZpAaIw3dBiIrjJgHQrGVWmdBU1f/////oDqEKrV1OpBUTjQtv/zNGQHAsjDKAAwAl4D0Co8AAmCBHIQNtld6fm0+/VigZzuMnGZlkAMLMJFv/////33UIWeFQkKsaceBsangecHzYXKI//////zNGQUA4QjKAA3CAID8CpEABMCBPfuStx4FQVHYMgKcO6jIJh//////9uIlspQkGQ2YyZscAV83Bv/////ncL6BEiWHyA2K//zNEQbAogfJgAx5hAEwDJcCAsEBtICgF3/////WJaIuuqMCCVGucgkrtwiwBO//////pW4YFRWQhaRRhZZnVwGhf////+ocv/zNEQmApgVJAANjwAFkC5YCApeAolD4kQb+EQJYNKwLWGmc6sqMBwJvf////6tDEOWDgFJk1VywKMGoM2f////+N1JmgJuPv/zNGQuA4AbJAAl5hIDwC48AAIGBEho7wTL5b6kSO7IUAA5uDABYNNjGDBSJEN//////xtQsszVy27IcWBbQkLgzv7YmZYW///zNGQ2AqzFNAgcA1+D8CZIAAhMAP/3/rozCAsBjIqCY/DBWMfQZp1f/////0F6phXSNisgAJjo6icT2vpvM/Vf9v///97eu//z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", Ke = "data:audio/mpeg;base64,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//BP/+hwIa///Nf///wqXf/1IwFkb//wi3/1Pf/7FEQGAABjEVkFKKAADSOrIKOcAAKAUWQYooAAUpGswwRwAF//QA7//6iH/7//E1CP66uDpoqjowL/6/GGwzFQx/T3Vp/9XC73/yvuUKYdmmN6evmjf5L5ZKr/8hlL/f/7FGQCgAB5FF2GBKAADYOrUMEIAAGod2YcVoAANI6rg4pQAEZrqH8GxT/UqjT/+aDlf/6dvj/r/4+rR//UH//+wTMuo///86//9QGR//+wCCxv//+MCD//BP//oAIP///7FGQFAABgEdsNFKAAC2I68KOcAAMggWoYVQAAP46tAwQgAMzq//QwCv//4WM/+a0//YWHBbCL/5Hi/IAIkheLBSvsvr6F98kyv/4Zg7A3/0+pcfN//8bL5ar/+8wV/v/7FGQCgACDFF0GFKAADkQLYMCIAAGod2occoAANg7rw4pQAKbXi7oTBez1IPl9X/4G2b//1b7/r6/a/Gy//6HAX//+gDAv///nHf/xoBf//hF////ILP0V//lQuP//qP/7FGQDj/BVHVmBQC2QC6O6wDQHsgGEd2gUI4AAMA7sAopQAE8l+F//2DK3//y4f+Bj5j/+oX//8FpP///x0n//GAf//8Kf///xIcrp/ZHCA4SBM2nH8U7C55TDl+3X6P/7FGQKAADZI1uGFOAAEoRrMMKUAAGQd24cUQAANQ7sQ44gAHOZwyYabiX/9COkKb/T6rj9/09fUt+LGTgn/8YALf/+g43///kFf/zgX///UK////hxPTX/+4Sz//+sR//7FGQEA7BbHdmBoC2QDSEL3gADCQGgAXyUIQAAMw7rwpRwAK/hAeAAAAdAAAAAHQz///6wB/xxxyrjsayv6H/+r/+aBD//+Nm///8QulX+1VhmOIUu/+2UD0jR2CVfp//7FGQIgADVI1uGCOACD+RrYMCIAAGcd2ocE4AAMw7sQ4RQAGP+f8eIEjMMke//iRoP//tvp+v/Unyv4pqf/5n//84CQx///0FRv/+K///C3///6gKLdKr//EJ//9QHx//7FGQED/BSHdkBQBWQC4PKwCgHsgFYR2wUI4AANA7sAopQAD5hv/6Br//+SDvyge2n/+gP//8ISf/w9t//oDv//8K///8ggL6a+nTBTVf043E0UOgZIIdw1v/9FHfE3//7FGQLAADO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";
class pt {
  constructor() {
    this._bellContext = null, this._isMuteBell = !1, this._calleeBellFilePath = Ke, this._callRole = F.UNKNOWN, this._callStatus = h.IDLE, this._handleAudioInterruptionBegin = async () => {
      await this.stop();
    }, this._handleAudioInterruptionEnd = async () => {
      this._callStatus !== h.CALLING ? await this.stop() : await this.play();
    }, this._bellContext = wx.createInnerAudioContext(), this._addListenBellContextEvent(), this._bellContext.loop = !0;
  }
  setBellSrc() {
    const e = wx.getFileSystemManager();
    try {
      let t = Tt;
      this._callRole === F.CALLEE && (t = this._calleeBellFilePath || Ke), e.readFileSync(t, "utf8", 0), this._bellContext.src = t;
    } catch (t) {
      console.warn(`${i.PREFIX}Failed to setBellSrc, ${t}`);
    }
  }
  setBellProperties(e) {
    this._callRole = e.callRole || this._callRole, this._callStatus = e.callStatus || this._callStatus, this._calleeBellFilePath = e.calleeBellFilePath || this._calleeBellFilePath, this._isMuteBell = we(e.isMuteBell) ? this._isMuteBell : e.isMuteBell;
  }
  async play() {
    try {
      if (this._callStatus !== h.CALLING)
        return;
      this.setBellSrc(), this._callRole === F.CALLEE && !this._isMuteBell && await this._bellContext.play(), this._callRole === F.CALLER && await this._bellContext.play();
    } catch (e) {
      console.warn(`${i.PREFIX}Failed to play audio file, ${e}`);
    }
  }
  async stop() {
    try {
      this._bellContext.stop();
    } catch (e) {
      console.warn(`${i.PREFIX}Failed to stop audio file, ${e}`);
    }
  }
  async setBellMute(e) {
    this._callStatus !== h.CALLING && this._callRole !== F.CALLEE || (e ? await this.stop() : await this.play());
  }
  destroy() {
    try {
      this._isMuteBell = !1, this._calleeBellFilePath = "", this._callRole = F.UNKNOWN, this._callStatus = h.IDLE, this == null || this._removeListenBellContextEvent(), this._bellContext.destroy(), this._bellContext = null;
    } catch (e) {
      console.warn(`${i.PREFIX}Failed to destroy, ${e}`);
    }
  }
  _addListenBellContextEvent() {
    wx.onAudioInterruptionBegin(this._handleAudioInterruptionBegin), wx.onAudioInterruptionEnd(this._handleAudioInterruptionEnd);
  }
  _removeListenBellContextEvent() {
    wx.offAudioInterruptionBegin(this._handleAudioInterruptionBegin), wx.offAudioInterruptionEnd(this._handleAudioInterruptionEnd);
  }
}
function U() {
  return function(A, e, t) {
    const a = t.value, r = /* @__PURE__ */ new Set();
    return t.value = async function(...n) {
      var o, I;
      if (r.has(this)) {
        console.warn(`${i.PREFIX}previous ${e}() is ongoing, please avoid repeated calls`), (I = (o = this == null ? void 0 : this.getTUICallEngineInstance()) == null ? void 0 : o.reportLog) == null || I.call(o, {
          name: "TUICallKit.avoidRepeatedCall.fail",
          data: { name: e },
          error: `previous ${e}() is ongoing`
        });
        return;
      }
      try {
        r.add(this);
        const c = await a.apply(this, n);
        return r.delete(this), c;
      } catch (c) {
        throw r.delete(this), c;
      }
    }, t;
  };
}
const ae = i.PREFIX + "API";
function M(A) {
  return function(e, t, a) {
    let r = a.value;
    return a.value = function(...n) {
      return Gt.call(this, A, n, t), r.apply(this, n);
    }, a;
  };
}
function Gt(A, e, t) {
  try {
    if (e[0].SDKAppID || (A = Rt(A, "SDKAppID", "sdkAppID")), Xe(A))
      for (let a = 0; a < A.length; a++)
        Ve.call(this, {
          ...A[a],
          value: e[a],
          name: t
        });
    else
      for (const a in A)
        A.hasOwnProperty(a) && Ve.call(this, {
          ...A[a],
          value: e[0][a],
          name: t,
          key: a
        });
  } catch (a) {
    throw console.error(a), a;
  }
}
function Ve({ required: A, rules: e, range: t, value: a, allowEmpty: r, name: n, key: o }) {
  if (we(a)) {
    if (A)
      throw new Error(`${ae}<${n}>: ${o} is required.`);
    return;
  }
  const I = e.some((E) => E === Ot(a));
  let c = "";
  if (!I) {
    for (let E = 0; E < e.length; E++) {
      let C = e[E];
      C = C.replace(C[0], C[0].toUpperCase()), c += `${C}/`;
    }
    throw c = c.substring(0, c.length - 1), new Error(`${ae}<${n}>: ${o} must be ${c}, current ${o} is ${typeof a}.`);
  }
  if (r === !1 && Le(a) && a.trim() === "")
    throw new Error(`${ae}<${n}>: ${o} is blank.`);
  if (Xe(t) && t && t.indexOf(a) === -1)
    throw new Error(`${ae}<${n}>: ${o} error, only be ${t}, current ${o} is ${a}.`);
  if (Le(t) && t.indexOf("~") !== -1) {
    const E = t.split("~");
    if (a < +E[0] || a > +E[1] || je(a) && Number.isNaN(a))
      throw new Error(`${ae}<${n}>: ${o} error, only be ${t}, current ${o} is ${a}.`);
  }
}
const Q = {
  init: {
    SDKAppID: {
      required: !0,
      rules: [i.NUMBER],
      allowEmpty: !1
    },
    userID: {
      required: !0,
      rules: [i.STRING],
      allowEmpty: !1
    },
    userSig: {
      required: !0,
      rules: [i.STRING],
      allowEmpty: !1
    },
    tim: {
      required: !1,
      rules: [i.OBJECT]
    }
  },
  call: {
    userID: {
      required: !0,
      rules: [i.STRING],
      allowEmpty: !1
    },
    type: {
      required: !0,
      rules: [i.NUMBER],
      range: [1, 2],
      allowEmpty: !1
    },
    roomID: {
      required: !1,
      rules: [i.NUMBER],
      // 仅支持数字房间号, 后续会支持字符串房间号
      range: `0~${ye}`,
      allowEmpty: !1
    },
    strRoomID: {
      required: !1,
      rules: [i.STRING],
      allowEmpty: !0
    },
    userData: {
      required: !1,
      rules: [i.STRING],
      allowEmpty: !1
    },
    timeout: {
      required: !1,
      rules: [i.NUMBER],
      allowEmpty: !1
    }
  },
  groupCall: {
    userIDList: {
      required: !0,
      rules: [i.ARRAY],
      allowEmpty: !1
    },
    type: {
      required: !0,
      rules: [i.NUMBER],
      range: [1, 2],
      allowEmpty: !1
    },
    groupID: {
      required: !0,
      rules: [i.STRING],
      allowEmpty: !1
    },
    roomID: {
      required: !1,
      rules: [i.NUMBER],
      // 仅支持数字房间号, 后续会支持字符串房间号
      range: `0~${ye}`,
      allowEmpty: !1
    },
    strRoomID: {
      required: !1,
      rules: [i.STRING],
      allowEmpty: !0
    },
    timeout: {
      required: !1,
      rules: [i.NUMBER],
      allowEmpty: !1
    },
    userData: {
      required: !1,
      rules: [i.STRING],
      allowEmpty: !1
    },
    offlinePushInfo: {
      required: !1,
      rules: [i.OBJECT],
      allowEmpty: !1
    }
  },
  joinInGroupCall: {
    type: {
      required: !0,
      rules: [i.NUMBER],
      range: [1, 2],
      allowEmpty: !1
    },
    groupID: {
      required: !0,
      rules: [i.STRING],
      allowEmpty: !1
    },
    roomID: {
      required: !0,
      rules: [i.NUMBER],
      allowEmpty: !1
    },
    strRoomID: {
      required: !1,
      rules: [i.STRING],
      allowEmpty: !0
    }
  },
  inviteUser: {
    userIDList: {
      required: !0,
      rules: [i.ARRAY],
      allowEmpty: !1
    }
  },
  setSelfInfo: {
    nickName: {
      required: !1,
      rules: [i.STRING],
      allowEmpty: !1
    },
    avatar: {
      required: !1,
      rules: [i.STRING],
      allowEmpty: !1
    }
  },
  enableFloatWindow: [
    {
      key: "enable",
      required: !1,
      rules: [i.BOOLEAN],
      allowEmpty: !1
    }
  ],
  enableAIVoice: [
    {
      key: "enable",
      required: !0,
      rules: [i.BOOLEAN],
      allowEmpty: !1
    }
  ],
  enableMuteMode: [
    {
      key: "enable",
      required: !0,
      rules: [i.BOOLEAN],
      allowEmpty: !1
    }
  ],
  setCallingBell: [
    {
      key: "filePath",
      required: !1,
      rules: [i.STRING],
      allowEmpty: !0
    }
  ],
  setLanguage: [
    {
      key: "language",
      required: !0,
      rules: [i.STRING],
      allowEmpty: !1
    }
  ],
  setVideoDisplayMode: [
    {
      key: "displayMode",
      required: !0,
      rules: [i.STRING],
      range: [ne.CONTAIN, ne.COVER, ne.FILL],
      allowEmpty: !1
    }
  ],
  setVideoResolution: [
    {
      key: "resolution",
      required: !0,
      rules: [i.STRING],
      range: [oe.RESOLUTION_1080P, oe.RESOLUTION_480P, oe.RESOLUTION_720P],
      allowEmpty: !1
    }
  ]
};
function de(A) {
  return function(e, t, a) {
    let r = a.value;
    return a.value = function(...n) {
      return Ft.call(this, A, n, t), r.apply(this, n);
    }, a;
  };
}
function Ft(A) {
  if (A != null && A.engineInstance && !this._tuiCallEngine) {
    const e = `${i.PREFIX} ${X("TUICallKit init is not complete")}`;
    throw console.error(e), e;
  }
}
function he(A) {
  if (typeof A != "object" || A === null)
    return A;
  let e = Array.isArray(A) ? [] : {};
  for (let t in A)
    A.hasOwnProperty(t) && (e[t] = he(A[t]));
  return e;
}
class Mt {
  constructor() {
    this.defaultStore = {
      callStatus: h.IDLE,
      callRole: F.UNKNOWN,
      callMediaType: d.UNKNOWN,
      localUserInfo: { userId: "" },
      localUserInfoExcludeVolume: { userId: "" },
      remoteUserInfoList: [],
      remoteUserInfoExcludeVolumeList: [],
      callerUserInfo: { userId: "" },
      isGroup: !1,
      callDuration: "00:00:00",
      // 通话时长
      callTips: "",
      // 通话提示的信息. 例如: '等待谁接听', 'xxx 拒绝通话', 'xxx 挂断通话'
      toastInfo: { text: "" },
      // 远端用户挂断、拒绝、超时、忙线等的 toast 提示信息
      isMinimized: !1,
      // 用来记录当前是否悬浮窗模式
      enableFloatWindow: !1,
      // 开启/关闭悬浮窗功能，设置为false，通话界面左上角的悬浮窗按钮会隐藏
      bigScreenUserId: "",
      // 当前大屏幕显示的 userID 用户
      language: Nt(),
      // en, zh-cn
      isClickable: !1,
      // 是否可点击, 用于按钮增加 loading 效果，不可点击
      deviceList: { cameraList: [], microphoneList: [], currentCamera: {}, currentMicrophone: {} },
      showPermissionTip: !1,
      netWorkQualityList: [],
      // 显示网络状态差的提示
      isMuteSpeaker: !1,
      groupID: "",
      roomID: 0,
      roomIdType: 0,
      cameraPosition: J.FRONT,
      // 前置或后置，值为front, back
      groupCallMembers: [],
      // chat 群会话在的通话中的成员
      // TUICallKit 组件上的属性
      displayMode: ne.COVER,
      // 设置预览远端的画面显示模式
      videoResolution: oe.RESOLUTION_480P,
      showSelectUser: !1,
      // 小程序相关属性
      pusher: {},
      player: [],
      isEarPhone: !1,
      // 是否是听筒, 默认: false
      pusherId: i.INITIAL_PUSHER,
      // 重新渲染 live-Pusher 的标识位
      // 是否开启虚拟背景, 目前仅 web 支持
      isShowEnableVirtualBackground: !1,
      // 是否显示虚拟背景图标, 默认: false
      enableVirtualBackground: !1,
      // 是否开启虚拟背景， 默认: false
      // customUIConfig
      customUIConfig: {
        button: {},
        viewBackground: {},
        layoutMode: be.RemoteInLargeView
      },
      // translate function
      translate: X
    }, this.store = he(this.defaultStore), this.prevStore = he(this.defaultStore);
  }
  update(e, t) {
    switch (e) {
      case i.CALL_TIPS:
        const a = this.getData(e);
        this.prevStore[e] = a;
      default:
        this.store[e] = t;
    }
  }
  getPrevData(e) {
    return e ? this.prevStore[e] : this.prevStore;
  }
  getData(e) {
    return e ? this.store[e] : this.store;
  }
  // reset call store
  reset(e = []) {
    e.length === 0 && (e = Object.keys(this.store));
    const t = e.reduce((a, r) => ({ ...a, [r]: this.defaultStore[r] }), {});
    this.store = {
      ...this.defaultStore,
      ...this.store,
      ...t
    };
  }
}
let fe = class re {
  constructor() {
    this.timerId = -1, this.storeMap = {
      [s.CALL]: new Mt()
    }, this.task = {};
  }
  /**
   * 获取 TUIStore 实例
   * @returns {TUIStore}
  */
  static getInstance() {
    return re.instance || (re.instance = new re()), re.instance;
  }
  /**
   * UI 组件注册监听回调
   * @param {StoreName} storeName store 名称
   * @param {IOptions} options 监听信息
   * @param {Object} params 扩展参数
   * @param {String} params.notifyRangeWhenWatch 注册时监听时的通知范围, 'all' - 通知所有注册该 key 的监听; 'myself' - 通知本次注册该 key 的监听; 默认不通知
  */
  watch(e, t, a) {
    this.task[e] || (this.task[e] = {});
    const r = this.task[e];
    Object.keys(t).forEach((n) => {
      const o = t[n];
      r[n] || (r[n] = /* @__PURE__ */ new Map()), r[n].set(o, 1);
      const { notifyRangeWhenWatch: I } = a || {};
      if (I === i.ALL && this.notify(e, n), I === i.MYSELF) {
        const c = this.getData(e, n);
        o.call(this, c);
      }
    });
  }
  /**
   * UI 取消组件监听回调
   * @param {StoreName} storeName store 名称
   * @param {IOptions} options 监听信息,包含需要取消的回掉等
   */
  unwatch(e, t) {
    if (!this.task[e])
      return;
    const a = this.task[e];
    Object.keys(t).forEach((r) => {
      a[r].delete(t[r]);
    });
  }
  /**
   * 通用 store 数据更新，messageList 的变更需要单独处理
   * @param {StoreName} storeName store 名称
   * @param {string} key 变更的 key
   * @param {unknown} data 变更的数据
  */
  update(e, t, a) {
    var r;
    (Le(a) || je(a) || Dt(a)) && this.storeMap[e].store[t] === a || ((r = this.storeMap[e]) == null || r.update(t, a), this.notify(e, t));
  }
  /**
   * 获取 Store 的上一个状态值
   * @param {StoreName} storeName store 名称
   * @param {string} key 待获取的 key
   * @returns {Any}
  */
  getPrevData(e, t) {
    var a;
    return (a = this.storeMap[e]) == null ? void 0 : a.getPrevData(t);
  }
  /**
   * 获取 Store 数据
   * @param {StoreName} storeName store 名称
   * @param {string} key 待获取的 key
   * @returns {Any}
  */
  getData(e, t) {
    var a;
    return (a = this.storeMap[e]) == null ? void 0 : a.getData(t);
  }
  /**
   * UI 组件注册监听回调
   * @param {StoreName} storeName store 名称
   * @param {string} key 变更的 key
  */
  notify(e, t) {
    if (!this.task[e])
      return;
    const a = this.task[e];
    if (a[t]) {
      const r = a[t], n = this.getData(e, t);
      for (const [o] of r.entries())
        o.call(this, n);
    }
  }
  reset(e, t = [], a = !1) {
    if (e in this.storeMap) {
      const r = this.storeMap[e];
      t.length === 0 && (t = Object.keys(r == null ? void 0 : r.store)), r.reset(t), a && t.forEach((n) => {
        this.notify(e, n);
      });
    }
  }
  // 批量修改多个 key-value
  updateStore(e, t) {
    const a = t || s.CALL;
    Object.keys(e).forEach((r) => {
      this.update(a, r, e[r]);
    });
  }
};
const S = fe.getInstance();
function Ne(A, e) {
  const t = {
    userId: A,
    nick: "",
    avatar: "",
    remark: "",
    displayUserInfo: "",
    isAudioAvailable: !1,
    isVideoAvailable: !1,
    isEnter: !1,
    domId: e || A
  };
  return e ? t : { ...t, isEnter: !1 };
}
async function Qt(A, e) {
  var a, r, n, o, I;
  let t = Ne(A, i.LOCAL_VIDEO);
  try {
    if (!e)
      return t;
    const c = await e.getMyProfile(), E = S == null ? void 0 : S.getData(s.CALL, i.LOCAL_USER_INFO);
    return (c == null ? void 0 : c.code) === 0 && (t = {
      ...t,
      ...E,
      userId: (a = c == null ? void 0 : c.data) == null ? void 0 : a.userID,
      nick: (r = c == null ? void 0 : c.data) == null ? void 0 : r.nick,
      avatar: (n = c == null ? void 0 : c.data) == null ? void 0 : n.avatar,
      displayUserInfo: ((o = c == null ? void 0 : c.data) == null ? void 0 : o.nick) || ((I = c == null ? void 0 : c.data) == null ? void 0 : I.userID)
    }), t;
  } catch (c) {
    return console.error(`${i.PREFIX}getMyProfile failed, error: ${c}.`), t;
  }
}
async function le(A, e) {
  let t = A.map((a) => Ne(a));
  try {
    if (!e)
      return t;
    const a = await e.getFriendProfile({ userIDList: A });
    if (a.code === 0) {
      const { friendList: r = [], failureUserIDList: n = [] } = a.data;
      let o = n.map((C) => C.userID);
      if (n.length > 0) {
        const C = await e.getUserProfile({ userIDList: n.map((g) => g.userID) });
        (C == null ? void 0 : C.code) === 0 && (o = (C == null ? void 0 : C.data) || []);
      }
      const I = S == null ? void 0 : S.getData(s.CALL, i.REMOTE_USER_INFO_LIST), c = r.map((C) => C.userID), E = o.map((C) => C.userID);
      t = A.map((C) => {
        var Z, $, ee, te, Y, pe, Ge;
        const g = Ne(C), _ = c.indexOf(C), N = E.indexOf(C);
        let R = "", p = "", j = "", m = "";
        _ !== -1 && (R = ((Z = r[_]) == null ? void 0 : Z.remark) || "", p = ((ee = ($ = r[_]) == null ? void 0 : $.profile) == null ? void 0 : ee.nick) || "", j = R || p || g.userId || "", m = ((Y = (te = r[_]) == null ? void 0 : te.profile) == null ? void 0 : Y.avatar) || ""), N !== -1 && (p = ((pe = o[N]) == null ? void 0 : pe.nick) || "", j = p || g.userId || "", m = ((Ge = o[N]) == null ? void 0 : Ge.avatar) || "");
        const w = I.find((et) => et.userId === C) || {};
        return { ...g, ...w, remark: R, nick: p, displayUserInfo: j, avatar: m };
      });
    }
    return t;
  } catch (a) {
    return console.error(`${i.PREFIX}getRemoteUserProfile failed, error: ${a}.`), t;
  }
}
function Ie() {
  const A = S.getData(s.CALL, i.CALL_STATUS);
  if (A === h.IDLE)
    return T.IDLE;
  const e = S.getData(s.CALL, i.IS_GROUP);
  if (A === h.CALLING)
    return e ? T.DIALING_GROUP : T.DIALING_C2C;
  const t = S.getData(s.CALL, i.CALL_MEDIA_TYPE);
  return e ? t === d.AUDIO ? T.CALLING_GROUP_AUDIO : T.CALLING_GROUP_VIDEO : t === d.AUDIO ? T.CALLING_C2C_AUDIO : T.CALLING_C2C_VIDEO;
}
async function yt(A, e, t, a) {
  let r = [];
  try {
    const n = await e.getGroupMemberList({ groupID: A, count: t, offset: a });
    if (n.code === 0)
      return n.data.memberList || r;
  } catch (n) {
    return console.error(`${i.PREFIX}getGroupMember failed, error: ${n}.`), r;
  }
}
async function Pt(A, e) {
  let t = {};
  try {
    return (await e.getGroupProfile({ groupID: A })).data.group || t;
  } catch (a) {
    return console.warn(`${i.PREFIX}getGroupProfile failed, error: ${a}.`), t;
  }
}
function $e(A, e) {
  A === 0 && e ? (S.update(s.CALL, i.ROOM_ID, e), S.update(s.CALL, i.ROOM_ID_TYPE, Ue.STRING_ROOM_ID)) : (S.update(s.CALL, i.ROOM_ID, A), S.update(s.CALL, i.ROOM_ID_TYPE, Ue.NUMBER_ROOM_ID));
}
function P(A) {
  return (A == null ? void 0 : A.data) || {};
}
function De(A) {
  if (A.length === 0)
    return;
  let e = S.getData(s.CALL, i.REMOTE_USER_INFO_LIST);
  A.forEach((t) => {
    e = e.filter((a) => a.userId !== t);
  }), S.update(s.CALL, i.REMOTE_USER_INFO_LIST, e), S.update(s.CALL, i.REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST, e);
}
function Se(A, e, t) {
  let a = "";
  Bt(A) && (e === d.AUDIO && (a = O.NO_MICROPHONE_DEVICE_PERMISSION), e === d.VIDEO && (a = O.NO_CAMERA_DEVICE_PERMISSION), a && S.update(s.CALL, i.TOAST_INFO, { content: a, type: i.ERROR }), console.error(`${i.PREFIX}call failed, error: ${A.message}.`));
}
function V(A, e) {
  let t = S.getData(s.CALL, i.LOCAL_USER_INFO);
  e === i.AUDIO && (t = { ...t, isAudioAvailable: A }), e === i.VIDEO && (t = { ...t, isVideoAvailable: A }), S.update(s.CALL, i.LOCAL_USER_INFO, t), S.update(s.CALL, i.LOCAL_USER_INFO_EXCLUDE_VOLUMN, t);
}
class ge {
  static generateTaskID() {
    return this.currentTaskID++;
  }
  /**
   *
   * @param {string} taskName 'interval' 'timeout'
   * @param {function} callback
   * @param {object} options include:
   * @param {number} options.delay millisecond
   * @param {number} options.count 定时器回调执行次数，0 无限次 or n次
   * @param {boolean} options.backgroundTask 在页面静默后是否继续执行定时器
   */
  static run(e = i.TIMEOUT, t, a) {
    e === i.INTERVAL ? a = { delay: 2e3, count: 0, backgroundTask: !0, ...a } : a = { delay: 2e3, count: 0, backgroundTask: !0, ...a }, Te(t) && (a = { ...a, ...t }), Ut(e) && (t = e, e = i.TIMEOUT);
    const r = {
      taskID: this.generateTaskID(),
      loopCount: 0,
      intervalID: null,
      timeoutID: null,
      taskName: e,
      callback: t,
      ...a
    };
    return this.taskMap.set(r.taskID, r), e === i.INTERNAL ? this.interval(r) : this.timeout(r), r.taskID;
  }
  /**
   * 定时循环执行回调函数
   * 可以指定循环的时间间隔
   * 可以指定循环次数
   * @param {object} taskItem
   * @param {function} callback
   * @param {*} delay
   * @param {*} count
   * @returns ID
   */
  static interval(e) {
    const t = () => {
      e.callback(), e.loopCount += 1, this.isBreakLoop(e);
    };
    return e.intervalID = setInterval(t, e.delay);
  }
  /**
   * 延迟执行回调
   * count = 0,循环
   * count = n, 执行n次
   * @param {object} taskItem
   *
   */
  static timeout(e) {
    const t = () => {
      if (e.callback(), e.loopCount += 1, !this.isBreakLoop(e))
        return e.timeoutID = setTimeout(t, e.delay);
    };
    return e.timeoutID = setTimeout(t, e.delay);
  }
  static hasTask(e) {
    return this.taskMap.has(e);
  }
  static clearTask(e) {
    if (!this.taskMap.has(e))
      return !0;
    const { intervalID: t, timeoutID: a, onVisibilitychange: r } = this.taskMap.get(e);
    return t && clearInterval(t), a && clearTimeout(a), r && document.removeEventListener("visibilitychange", r), this.taskMap.delete(e), !0;
  }
  /**
   * 1. 如果已移除出定时队列，退出当前任务
   * 2. 如果当前任务已满足次数限制，则退出当前任务
   * @param {object} taskItem
   * @returns
   */
  static isBreakLoop(e) {
    return this.taskMap.has(e.taskID) ? e.count !== 0 && e.loopCount >= e.count ? (this.clearTask(e.taskID), !0) : !1 : !0;
  }
}
ge.taskMap = /* @__PURE__ */ new Map();
ge.currentTaskID = 1;
const mt = function(A) {
  if (A === null || typeof A > "u")
    return !0;
  if (typeof A == "boolean")
    return !1;
  if (typeof A == "number")
    return A === 0;
  if (typeof A == "string" || typeof A == "function" || Array.isArray(A))
    return A.length === 0;
  if (A instanceof Error)
    return A.message === "";
  if (Te(A)) {
    for (const e in A)
      if (Object.prototype.hasOwnProperty.call(A, e))
        return !1;
    return !0;
  }
  return !1;
}, Be = "_local_user_id";
class k {
  constructor() {
    this._viewConfig = {
      viewBackground: {
        local: {},
        remote: {}
      }
    }, this._isSetViewBackgroundConfig = { remote: !1, local: !1 }, this._tuiCallEngine = null, this._tuiStore = null;
  }
  static getInstance() {
    return k.instance || (k.instance = new k()), k.instance;
  }
  _updateViewBackground() {
    var a, r, n;
    const e = (a = this._tuiStore) == null ? void 0 : a.getData(s.CALL, i.CUSTOM_UI_CONFIG), { userId: t } = (r = this._tuiStore) == null ? void 0 : r.getData(s.CALL, i.LOCAL_USER_INFO);
    Object.keys(this._viewConfig.viewBackground.remote).includes(t) && delete this._viewConfig.viewBackground.remote[t], (n = this._tuiStore) == null || n.update(
      s.CALL,
      i.CUSTOM_UI_CONFIG,
      {
        ...e,
        viewBackground: {
          ...this._viewConfig.viewBackground.remote,
          ...this._viewConfig.viewBackground.local
        }
      }
    );
  }
  setEngineInstance(e) {
    this._tuiCallEngine = e;
  }
  setTUIStore(e) {
    this._tuiStore = e;
  }
  updateViewBackgroundUserId(e) {
    var t, a;
    if (e === "local") {
      const { userId: r } = (t = this._tuiStore) == null ? void 0 : t.getData(s.CALL, i.LOCAL_USER_INFO);
      if (Object.keys(this._viewConfig.viewBackground.remote).includes(r) && (delete this._viewConfig.viewBackground.remote[r], this._updateViewBackground()), !this._isSetViewBackgroundConfig.local)
        return;
      const n = this._viewConfig.viewBackground.local, o = n[r] || n[Be];
      n[r] = n[Be], this._viewConfig.viewBackground.local = { [r]: o }, this._updateViewBackground();
    } else {
      let r = this._viewConfig.viewBackground.remote;
      this._isSetViewBackgroundConfig.remote && Object.keys(r).includes("*") && (((a = this._tuiStore) == null ? void 0 : a.getData(s.CALL, i.REMOTE_USER_INFO_LIST)).map((I) => I.userId).forEach((I) => {
        Object.keys(r).includes(I) || (r[I] = r["*"]);
      }), this._viewConfig.viewBackground.remote = r, this._updateViewBackground());
    }
  }
  hideFeatureButton(e) {
    var a, r, n, o, I;
    (r = (a = this._tuiCallEngine) == null ? void 0 : a.reportLog) == null || r.call(a, {
      name: "TUICallKit.hideFeatureButton.start",
      data: { buttonName: e }
    });
    const t = (n = this._tuiStore) == null ? void 0 : n.getData(s.CALL, i.CUSTOM_UI_CONFIG);
    (I = this._tuiStore) == null || I.update(
      s.CALL,
      i.CUSTOM_UI_CONFIG,
      {
        ...t,
        button: {
          ...t.button,
          [e]: { ...((o = t.button) == null ? void 0 : o[e]) || {}, show: !1 }
        }
      }
    );
  }
  setLocalViewBackgroundImage(e) {
    var a, r, n;
    (r = (a = this._tuiCallEngine) == null ? void 0 : a.reportLog) == null || r.call(a, {
      name: "TUICallKit.setLocalViewBackgroundImage.start",
      data: { url: e }
    }), this._isSetViewBackgroundConfig.local = !0;
    let { userId: t } = (n = this._tuiStore) == null ? void 0 : n.getData(s.CALL, i.LOCAL_USER_INFO);
    mt(t) && (t = Be), this._viewConfig.viewBackground.local = { [t]: e }, this._updateViewBackground();
  }
  setRemoteViewBackgroundImage(e, t) {
    var a, r;
    (r = (a = this._tuiCallEngine) == null ? void 0 : a.reportLog) == null || r.call(a, {
      name: "TUICallKit.setRemoteViewBackgroundImage.start",
      data: { userId: e, url: t }
    }), this._isSetViewBackgroundConfig.remote = !0, e === "*" && (this._viewConfig.viewBackground.remote = {}), this._viewConfig.viewBackground.remote[e] = t, this._updateViewBackground();
  }
  setLayoutMode(e) {
    var a, r;
    (r = (a = this._tuiCallEngine) == null ? void 0 : a.reportLog) == null || r.call(a, {
      name: "TUICallKit.setLayoutMode.start",
      data: { layoutMode: e }
    });
    const t = this._tuiStore.getData(s.CALL, i.CUSTOM_UI_CONFIG);
    this._tuiStore.update(
      s.CALL,
      i.CUSTOM_UI_CONFIG,
      {
        ...t,
        layoutMode: e
      }
    );
  }
  setCameraDefaultState(e) {
    var a, r;
    (r = (a = this._tuiCallEngine) == null ? void 0 : a.reportLog) == null || r.call(a, {
      name: "TUICallKit.setCameraDefaultState.start",
      data: { isOpen: e }
    });
    const t = he(this._tuiStore.getData(s.CALL, i.CUSTOM_UI_CONFIG));
    Object.keys(t.button).includes(b.Camera) || (t.button[b.Camera] = {}), t.button[b.Camera].state = e ? q.Open : q.Close, this._tuiStore.update(s.CALL, i.CUSTOM_UI_CONFIG, t);
  }
}
const Ce = fe.getInstance(), y = {
  audioCall: () => "Voice call",
  videoCall: () => "Video call",
  switchToAudio: () => "Switch audio call",
  switchToVideo: () => "Switch video call",
  hangup: ({ callDuration: A }) => `${X("Call duration")}：${A}`
};
class W {
  constructor(e) {
    var t, a, r;
    this._callService = e.callService, ie.registerEvent(B.TUILogin.EVENT.LOGIN_STATE_CHANGED, B.TUILogin.EVENT_SUB_KEY.USER_LOGIN_SUCCESS, this), (t = B.TUIChat) != null && t.EVENT && ie.registerEvent((a = B.TUIChat.EVENT) == null ? void 0 : a.CHAT_STATE_CHANGED, (r = B.TUIChat.EVENT_SUB_KEY) == null ? void 0 : r.CHAT_OPENED, this), ie.registerService(B.TUICalling.SERVICE.NAME, this), ie.registerExtension(B.TUIChat.EXTENSION.INPUT_MORE.EXT_ID, this);
  }
  static getInstance(e) {
    return W.instance || (W.instance = new W(e)), W.instance;
  }
  // ================ 【】 ================
  /**
   * message on screen
   * @param {Any} params Parameters for message up-screening
   */
  callTUIService(e) {
    const { message: t } = e || {};
    ie.callService({
      serviceName: B.TUIChat.SERVICE.NAME,
      method: B.TUIChat.SERVICE.METHOD.UPDATE_MESSAGE_LIST,
      params: { message: t }
    });
  }
  /**
   * tuicore getExtension
   * @param {String} extensionID extension id
   * @param {Any} params tuicore pass parameters
   * @returns {Any[]} return extension
   */
  onGetExtension(e, t) {
    var a, r;
    if (e === B.TUIChat.EXTENSION.INPUT_MORE.EXT_ID) {
      if ((r = (a = this._callService.getTUICallEngineInstance()) == null ? void 0 : a.reportLog) == null || r.call(a, { name: "TUICallKit.onGetExtension", data: { extensionID: e, params: t } }), we(t))
        return [];
      if ([B.TUIChat.TYPE.ROOM, B.TUIChat.TYPE.CUSTOMER_SERVICE].includes(t.chatType))
        return [];
      let n = [];
      const o = {
        weight: 1e3,
        text: "语音通话",
        icon: st,
        data: {
          name: "voiceCall"
        },
        listener: {
          onClicked: async (c) => await this._handleTUICoreOnClick(c, c.type || d.AUDIO)
        }
      }, I = {
        weight: 900,
        text: "视频通话",
        icon: nt,
        data: {
          name: "videoCall"
        },
        listener: {
          onClicked: async (c) => await this._handleTUICoreOnClick(c, c.type || d.VIDEO)
        }
      };
      return t != null && t.chatType ? n = [o, I] : (!(t != null && t.filterVoice) && n.push(o), !(t != null && t.filterVideo) && n.push(I)), n;
    }
  }
  async onCall(e, t) {
    e === B.TUICalling.SERVICE.METHOD.START_CALL && await this._handleTUICoreOnClick(t, t.type);
  }
  /**
   * tuicore notify event manager
   * @param {String} eventName event name
   * @param {String} subKey sub key
   * @param {Any} options tuicore event parameters
   */
  async onNotifyEvent(e, t, a) {
    var r, n, o, I, c, E, C, g;
    try {
      if (e === B.TUILogin.EVENT.LOGIN_STATE_CHANGED)
        if (t === B.TUILogin.EVENT_SUB_KEY.USER_LOGIN_SUCCESS) {
          const { chat: _, userID: N, userSig: R, SDKAppID: p } = it.getContext();
          await ((r = this._callService) == null ? void 0 : r.init({ tim: _, userID: N, userSig: R, sdkAppID: p, isFromChat: !0, component: Oe.TIM_CALL_KIT })), (n = this._callService) == null || n.setIsFromChat(!0), (o = this._callService) == null || o.setLogLevel(Ye.NORMAL), this._addListenChatEvent();
        } else
          t === B.TUILogin.EVENT_SUB_KEY.USER_LOGOUT_SUCCESS && (this._removeListenChatEvent(), await ((I = this._callService) == null ? void 0 : I.destroyed()));
      if ((c = B.TUIChat) != null && c.EVENT && e === B.TUIChat.EVENT.CHAT_STATE_CHANGED && t === B.TUIChat.EVENT_SUB_KEY.CHAT_OPENED) {
        if ((E = this._callService) == null || E.setCurrentGroupId((a == null ? void 0 : a.groupID) || ""), Ce.getData(s.CALL, i.CALL_STATUS) !== h.IDLE)
          return;
        const _ = (C = this._callService) == null ? void 0 : C.getCurrentGroupId(), N = _ ? await this.getGroupAttributes((g = this._callService) == null ? void 0 : g.getTim(), _) : {};
        await this.updateStoreBasedOnGroupAttributes(N);
      }
    } catch (_) {
      console.error(`${i.PREFIX}TUICore onNotifyEvent failed, error: ${_}.`);
    }
  }
  // Handling the chat+call scenario, data required for the joinInGroupCall API: update store / clear relevant store data
  async updateStoreBasedOnGroupAttributes(e) {
    var t, a, r, n;
    (r = (a = (t = this._callService) == null ? void 0 : t.getTUICallEngineInstance()) == null ? void 0 : a.reportLog) == null || r.call(a, {
      name: "TUICallKit.getJoinGroupCallInfo.success",
      data: { groupAttributes: e }
    });
    try {
      const {
        group_id: o = "",
        room_id: I = 0,
        room_id_type: c = 0,
        call_media_type: E = i.UNKNOWN,
        // @ts-ignore
        user_list: C
        // The default value of the user list returned by the background is null
      } = e[i.INNER_ATTR_KIT_INFO] ? JSON.parse(e[i.INNER_ATTR_KIT_INFO]) : {};
      let g = (C || []).map((N) => N.userid);
      g = g.length && await le(g, (n = this._callService) == null ? void 0 : n.getTim());
      const _ = {
        [i.GROUP_ID]: o,
        [i.GROUP_CALL_MEMBERS]: g,
        [i.ROOM_ID]: I,
        [i.CALL_MEDIA_TYPE]: at[E],
        [i.ROOM_ID_TYPE]: c
      };
      Ce.updateStore(_, s.CALL);
    } catch (o) {
      console.warn(`${i.PREFIX}updateStoreBasedOnGroupAttributes fail, error: ${o}`);
    }
  }
  // Get group attribute
  async getGroupAttributes(e, t) {
    if (!t)
      return {};
    try {
      const { data: a } = await e.getGroupAttributes({
        groupID: t,
        keyList: []
      });
      return (a == null ? void 0 : a.groupAttributes) || {};
    } catch (a) {
      return console.warn(`${i.PREFIX}getGroupAttributes fail: ${a}`), {};
    }
  }
  isLineBusy(e) {
    var r;
    const t = ce(e.payload.data), a = ce(t == null ? void 0 : t.data);
    return (a == null ? void 0 : a.line_busy) === "line_busy" || (a == null ? void 0 : a.line_busy) === "" || ((r = a == null ? void 0 : a.data) == null ? void 0 : r.message) === "lineBusy";
  }
  async getCallKitMessage(e, t) {
    var _, N, R, p;
    const a = ce(e.payload.data);
    if ((a == null ? void 0 : a.businessID) !== 1)
      return {};
    let r = "";
    const n = ce(a == null ? void 0 : a.data), o = n.call_type, I = a.inviteeList, c = (_ = n == null ? void 0 : n.data) == null ? void 0 : _.inviter, E = Ce.getData(s.CALL, i.LOCAL_USER_INFO).userId, C = c === E, g = (N = n == null ? void 0 : n.data) == null ? void 0 : N.cmd;
    switch (a == null ? void 0 : a.actionType) {
      case x.INVITE: {
        r = y[g]({ callDuration: Ze(n == null ? void 0 : n.call_end) });
        break;
      }
      case x.CANCEL_INVITE:
        r = C ? "Call Cancel" : "Other Side Cancel";
        break;
      case x.ACCEPT_INVITE:
        ["switchToAudio", "switchToVideo"].includes(g) ? r = (R = y == null ? void 0 : y[g]) == null ? void 0 : R.call(y) : r = X("Answered");
        break;
      case x.REJECT_INVITE:
        this.isLineBusy(e) ? r = C ? "Line Busy" : "Other Side Line Busy" : r = C ? "Other Side Decline" : "Decline";
        break;
      case x.INVITE_TIMEOUT:
        ["switchToAudio", "switchToVideo"].includes(g) ? r = (p = y == null ? void 0 : y[g]) == null ? void 0 : p.call(y) : r = C ? "Other Side No Answer" : "No answer";
        break;
    }
    return { messageCardContent: r, callMediaType: o, inviteeList: I };
  }
  // =========================【chat: event listening】=========================
  _addListenChatEvent() {
    var e, t;
    if (!((e = this._callService) != null && e.getTim())) {
      console.warn(`${i.PREFIX}add tim event listener failed, tim is empty.`);
      return;
    }
    (t = this._callService) == null || t.getTim().on(Fe.EVENT.GROUP_ATTRIBUTES_UPDATED, this._handleGroupAttributesUpdated, this);
  }
  _removeListenChatEvent() {
    var e, t;
    if (!((e = this._callService) != null && e.getTim())) {
      console.warn(`${i.PREFIX}remove tim event listener failed, tim is empty.`);
      return;
    }
    (t = this._callService) == null || t.getTim().off(Fe.EVENT.GROUP_ATTRIBUTES_UPDATED, this._handleGroupAttributesUpdated, this);
  }
  /**
   * chat start audio/video call via click
   * @param {Any} options Parameters passed in when clicking on an audio/video call from chat
   * @param {CallMediaType} type call media type. 0 - audio; 1 - video.
   */
  async _handleTUICoreOnClick(e, t) {
    var a, r;
    try {
      const { groupID: n, userIDList: o = [], ...I } = e;
      n ? await ((a = this._callService) == null ? void 0 : a.groupCall({ groupID: n, userIDList: o, type: t, ...I })) : o.length === 1 && await ((r = this._callService) == null ? void 0 : r.call({ userID: o[0], type: t, ...I }));
    } catch (n) {
      console.debug(n);
    }
  }
  async _handleGroupAttributesUpdated(e) {
    var n;
    if (Ce.getData(s.CALL, i.CALL_STATUS) !== h.IDLE)
      return;
    const t = (e == null ? void 0 : e.data) || {}, { groupID: a = "", groupAttributes: r = {} } = t;
    a === ((n = this._callService) == null ? void 0 : n.getCurrentGroupId()) && await this.updateStoreBasedOnGroupAttributes(r);
  }
}
const L = fe.getInstance(), vt = k.getInstance();
class z {
  constructor(e) {
    this._callService = e.callService;
  }
  static getInstance(e) {
    return z.instance || (z.instance = new z(e)), z.instance;
  }
  addListenTuiCallEngineEvent() {
    var t;
    const e = (t = this._callService) == null ? void 0 : t.getTUICallEngineInstance();
    if (!e) {
      console.warn(`${i.PREFIX}add engine event listener failed, engine is empty.`);
      return;
    }
    e.on(u.ERROR, this._handleError, this), e.on(u.INVITED, this._handleNewInvitationReceived, this), e.on(u.USER_ACCEPT, this._handleUserAccept, this), e.on(u.USER_ENTER, this._handleUserEnter, this), e.on(u.USER_LEAVE, this._handleUserLeave, this), e.on(u.REJECT, this._handleInviteeReject, this), e.on(u.NO_RESP, this._handleNoResponse, this), e.on(u.LINE_BUSY, this._handleLineBusy, this), e.on(u.CALLING_CANCEL, this._handleCallingCancel, this), e.on(u.SDK_READY, this._handleSDKReady, this), e.on(u.KICKED_OUT, this._handleKickedOut, this), e.on(u.MESSAGE_SENT_BY_ME, this._messageSentByMe, this), u.CALL_MESSAGE && e.on(u.CALL_MESSAGE, this._handleCallMessage, this), u.ON_USER_NETWORK_QUALITY_CHANGED && e.on(u.ON_USER_NETWORK_QUALITY_CHANGED, this._handleNetworkQuality, this), e.on(u.CALL_END, this._handleCallingEnd, this), e.on(u.CALL_MODE, this._handleCallTypeChange, this), e.on(u.USER_UPDATE, this._handleUserUpdate, this);
  }
  removeListenTuiCallEngineEvent() {
    var t;
    const e = (t = this._callService) == null ? void 0 : t.getTUICallEngineInstance();
    e.off(u.ERROR, this._handleError, this), e.off(u.INVITED, this._handleNewInvitationReceived, this), e.off(u.USER_ACCEPT, this._handleUserAccept, this), e.off(u.USER_ENTER, this._handleUserEnter, this), e.off(u.USER_LEAVE, this._handleUserLeave, this), e.off(u.REJECT, this._handleInviteeReject, this), e.off(u.NO_RESP, this._handleNoResponse, this), e.off(u.LINE_BUSY, this._handleLineBusy, this), e.off(u.CALLING_CANCEL, this._handleCallingCancel, this), e.off(u.SDK_READY, this._handleSDKReady, this), e.off(u.KICKED_OUT, this._handleKickedOut, this), e.off(u.MESSAGE_SENT_BY_ME, this._messageSentByMe, this), u.ON_USER_NETWORK_QUALITY_CHANGED && e.off(u.ON_USER_NETWORK_QUALITY_CHANGED, this._handleNetworkQuality, this), e.off(u.CALL_END, this._handleCallingEnd, this), e.off(u.CALL_MODE, this._handleCallTypeChange, this), e.off(u.USER_UPDATE, this._handleUserUpdate, this);
  }
  _callerChangeToConnected() {
    var a;
    const e = L.getData(s.CALL, i.CALL_ROLE);
    L.getData(s.CALL, i.CALL_STATUS) === h.CALLING && e === F.CALLER && (L.update(s.CALL, i.CALL_STATUS, h.CONNECTED), (a = this._callService) == null || a.startTimer());
  }
  _unNormalEventsManager(e, t) {
    var n;
    console.log(`${i.PREFIX}${t} event data: ${JSON.stringify(e)}.`);
    const a = L.getData(s.CALL, i.IS_GROUP), r = L.getData(s.CALL, i.REMOTE_USER_INFO_LIST);
    switch (t) {
      case u.REJECT:
      case u.LINE_BUSY: {
        const { userID: o } = P(e);
        let I = t === u.REJECT ? O.OTHER_SIDE_REJECT_CALL : O.OTHER_SIDE_LINE_BUSY, c = "";
        a && (c = (r.find((E) => E.userId === o) || {}).displayUserInfo || o, I = t === u.REJECT ? O.REJECT_CALL : O.IN_BUSY), L.update(s.CALL, i.TOAST_INFO, { content: { key: I, options: { userList: c } } }), o && De([o]);
        break;
      }
      case u.NO_RESP: {
        const { userIDList: o = [] } = P(e), I = a ? O.TIMEOUT : O.CALL_TIMEOUT, c = o.map((E) => (r.find((g) => g.userId === E) || {}).displayUserInfo || E);
        L.update(s.CALL, i.TOAST_INFO, { content: { key: I, options: { userList: c.join() } } }), o.length > 0 && De(o);
        break;
      }
      case u.CALLING_CANCEL: {
        (n = this._callService) == null || n._resetCallStore();
        break;
      }
    }
  }
  _handleError(e) {
    var o;
    const { code: t, message: a } = e || {}, r = Object.values(Me).indexOf(t);
    let n = "";
    if (r !== -1) {
      const I = Object.keys(Me)[r];
      n = X(Qe[I]), n && L.update(s.CALL, i.TOAST_INFO, { content: Qe[I], type: i.ERROR });
    }
    (o = this._callService) == null || o.executeExternalAfterCalling(), console.error(`${i.PREFIX}_handleError, errorCode: ${t}; errorMessage: ${n || a}.`);
  }
  async _handleNewInvitationReceived(e) {
    var Z, $, ee, te;
    console.log(`${i.PREFIX}onCallReceived event data: ${JSON.stringify(e)}.`);
    const { sponsor: t = "", isFromGroup: a, callMediaType: r, inviteData: n = {}, calleeIdList: o = [], groupID: I = "", roomID: c, strRoomID: E } = P(e), C = L.getData(s.CALL, i.LOCAL_USER_INFO), g = [t, ...o.filter((Y) => Y !== C.userId)], _ = r || n.callType, N = _ === d.AUDIO ? O.CALLEE_CALLING_AUDIO_MSG : O.CALLEE_CALLING_VIDEO_MSG;
    let R = {
      [i.CALL_ROLE]: F.CALLEE,
      [i.IS_GROUP]: a,
      [i.CALL_STATUS]: h.CALLING,
      [i.CALL_MEDIA_TYPE]: _,
      [i.CALL_TIPS]: N,
      [i.CALLER_USER_INFO]: { userId: t },
      [i.GROUP_ID]: I
    };
    He();
    const p = { enableCamera: _ === d.VIDEO, enableMic: !0 };
    R = { ...R, [i.PUSHER]: p };
    const j = {
      microphone: !0,
      camera: _ === d.VIDEO
    };
    this._callService._preDevicePermission = await this._callService._tuiCallEngine.deviceCheck(j), $e(c, E), L.updateStore(R, s.CALL), (Z = this._callService) == null || Z.executeExternalBeforeCalling(), ($ = this._callService) != null && $.statusChanged && ((ee = this._callService) == null || ee.statusChanged({ oldStatus: T.IDLE, newStatus: T.BE_INVITED }));
    const m = await le(g, (te = this._callService) == null ? void 0 : te.getTim()), [w] = m.filter((Y) => Y.userId === t);
    m.length > 0 && L.updateStore({
      [i.REMOTE_USER_INFO_LIST]: m,
      [i.REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST]: m,
      [i.CALLER_USER_INFO]: {
        userId: t,
        nick: (w == null ? void 0 : w.nick) || "",
        avatar: (w == null ? void 0 : w.avatar) || "",
        displayUserInfo: (w == null ? void 0 : w.remark) || (w == null ? void 0 : w.nick) || t
      }
    }, s.CALL);
  }
  _handleUserAccept(e) {
    this._callerChangeToConnected(), L.update(s.CALL, i.CALL_TIPS, { text: "answered", duration: 2e3 }), console.log(`${i.PREFIX}accept event data: ${JSON.stringify(e)}.`);
  }
  async _handleUserEnter(e) {
    var o;
    this._callerChangeToConnected();
    const { userID: t, data: a } = P(e);
    a != null && a.playerList && L.update(s.CALL, i.PLAYER, a.playerList);
    let r = L.getData(s.CALL, i.REMOTE_USER_INFO_LIST);
    if (!r.find((I) => (I == null ? void 0 : I.userId) === t)) {
      r.push({ userId: t }), r.length > 0 && (L.update(s.CALL, i.REMOTE_USER_INFO_LIST, r), L.update(s.CALL, i.REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST, r));
      const [I] = await le([t], (o = this._callService) == null ? void 0 : o.getTim());
      r = L.getData(s.CALL, i.REMOTE_USER_INFO_LIST), r.forEach((c) => {
        (c == null ? void 0 : c.userId) === t && (c = Object.assign(c, I));
      });
    }
    r = r.map((I) => (I.userId === t && (I.isEnter = !0), I)), r.length > 0 && (L.update(s.CALL, i.REMOTE_USER_INFO_LIST, r), L.update(s.CALL, i.REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST, r), vt.updateViewBackgroundUserId("remote")), console.log(`${i.PREFIX}userEnter event data: ${JSON.stringify(e)}.`);
  }
  _handleUserLeave(e) {
    console.log(`${i.PREFIX}userLeave event data: ${JSON.stringify(e)}.`);
    const { data: t, userID: a } = P(e);
    if (t != null && t.playerList && L.update(s.CALL, i.PLAYER, t.playerList), L.getData(s.CALL, i.IS_GROUP)) {
      const n = (L.getData(s.CALL, i.REMOTE_USER_INFO_LIST).find((o) => o.userId === a) || {}).displayUserInfo || a;
      L.update(s.CALL, i.TOAST_INFO, { content: { key: O.END_CALL, options: { userList: n } } });
    }
    a && De([a]);
  }
  _handleInviteeReject(e) {
    this._unNormalEventsManager(e, u.REJECT);
  }
  _handleNoResponse(e) {
    this._unNormalEventsManager(e, u.NO_RESP);
  }
  _handleLineBusy(e) {
    this._unNormalEventsManager(e, u.LINE_BUSY);
  }
  _handleCallingCancel(e) {
    var t;
    (t = this._callService) == null || t.executeExternalAfterCalling(), this._unNormalEventsManager(e, u.CALLING_CANCEL);
  }
  _handleCallingEnd(e) {
    var t, a;
    console.log(`${i.PREFIX}callEnd event data: ${JSON.stringify(e)}.`), (t = this._callService) == null || t.executeExternalAfterCalling(), (a = this._callService) == null || a._resetCallStore();
  }
  // SDK_READY 后才能调用 tim 接口, 否则登录后立刻获取导致调用接口失败. v2.27.4+、v3 接口 login 后会抛出 SDK_READY
  async _handleSDKReady(e) {
    var a;
    let t = L.getData(s.CALL, i.LOCAL_USER_INFO);
    t = await Qt(t.userId, (a = this._callService) == null ? void 0 : a.getTim()), L.update(s.CALL, i.LOCAL_USER_INFO, t), L.update(s.CALL, i.LOCAL_USER_INFO_EXCLUDE_VOLUMN, t);
  }
  _handleKickedOut(e) {
    var t, a, r;
    console.log(`${i.PREFIX}kickOut event data: ${JSON.stringify(e)}.`), (t = this._callService) != null && t.kickedOut && ((a = this._callService) == null || a.kickedOut(e)), L.update(s.CALL, i.CALL_TIPS, O.KICK_OUT), (r = this._callService) == null || r._resetCallStore();
  }
  _messageSentByMe(e) {
    var a, r;
    const t = e == null ? void 0 : e.data;
    (a = this._callService) != null && a.onMessageSentByMe && ((r = this._callService) == null || r.onMessageSentByMe(t));
  }
  _handleCallMessage(e) {
    const t = P(e);
    this._callService._chatCombine.callTUIService({ message: t });
  }
  _handleCallTypeChange(e) {
    var r;
    const { newCallType: t, type: a } = P(e);
    L.update(s.CALL, i.CALL_MEDIA_TYPE, t || a), (r = this._callService) == null || r.setSoundMode(G.EAR);
  }
  _handleNetworkQuality(e) {
    const { networkQualityList: t = [] } = P(e);
    L.update(s.CALL, i.NETWORK_STATUS, t);
    const a = L.getData(s.CALL, i.IS_GROUP), r = L.getData(s.CALL, i.LOCAL_USER_INFO), n = L.getData(s.CALL, i.REMOTE_USER_INFO_LIST);
    if (!a) {
      if (t.find((c) => {
        var E;
        return ((E = n[0]) == null ? void 0 : E.userId) === (c == null ? void 0 : c.userId) && (c == null ? void 0 : c.quality) >= Pe;
      })) {
        L.update(s.CALL, i.CALL_TIPS, O.REMOTE_NETWORK_IS_POOR);
        return;
      }
      if (t.find((c) => (r == null ? void 0 : r.userId) === (c == null ? void 0 : c.userId) && (c == null ? void 0 : c.quality) >= Pe)) {
        L.update(s.CALL, i.CALL_TIPS, O.LOCAL_NETWORK_IS_POOR);
        return;
      }
    }
  }
  // ==========================【 miniProgram 私有事件】==========================
  _handleUserUpdate(e) {
    const t = P(e);
    t != null && t.pusher && L.update(s.CALL, i.PUSHER, t.pusher), t != null && t.playerList && L.update(s.CALL, i.PLAYER, t.playerList);
  }
}
var Kt = Object.defineProperty, Vt = Object.getOwnPropertyDescriptor, D = (A, e, t, a) => {
  for (var r = a > 1 ? void 0 : a ? Vt(e, t) : e, n = A.length - 1, o; n >= 0; n--)
    (o = A[n]) && (r = (a ? o(e, t, r) : o(r)) || r);
  return a && r && Kt(e, t, r), r;
};
const xt = qe.getInstance(), l = fe.getInstance(), v = k.getInstance();
v.setTUIStore(l);
const ke = "3.3.9", f = class se {
  constructor() {
    this._tim = null, this._TUICore = null, this._timerId = -1, this._startTimeStamp = _e(), this._bellContext = null, this._isFromChat = !1, this._currentGroupId = "", this._preDevicePermission = !1, this._offlinePushInfo = null, this._permissionCheckTimer = null, this._chatCombine = null, this._engineEventHandler = null, this._handleCallStatusChange = async (e) => {
      var t, a, r, n;
      try {
        const o = {
          callRole: l.getData(s.CALL, i.CALL_ROLE),
          callStatus: l.getData(s.CALL, i.CALL_STATUS)
        };
        if (this._bellContext.setBellProperties(o), e === h.CALLING)
          await ((t = this == null ? void 0 : this._bellContext) == null ? void 0 : t.play());
        else {
          if (e === h.CONNECTED) {
            const I = l.getData(s.CALL, i.IS_GROUP), c = l.getData(s.CALL, i.CALL_MEDIA_TYPE), E = l.getData(s.CALL, i.REMOTE_USER_INFO_LIST), C = I ? T.DIALING_GROUP : T.DIALING_C2C;
            l.update(s.CALL, i.CALL_TIPS, ""), this.statusChanged && this.statusChanged({ oldStatus: C, newStatus: Ie() }), !I && c === d.VIDEO && this.switchScreen(E[0].domId);
          }
          if (e === h.IDLE && this._isFromChat) {
            const I = this._currentGroupId ? await ((a = this._chatCombine) == null ? void 0 : a.getGroupAttributes(this._tim, this._currentGroupId)) : {};
            await ((r = this._chatCombine) == null ? void 0 : r.updateStoreBasedOnGroupAttributes(I, l, this));
          }
          await ((n = this == null ? void 0 : this._bellContext) == null ? void 0 : n.stop());
        }
      } catch (o) {
        console.warn(`${i.PREFIX}handleCallStatusChange, ${o}.`);
      }
    }, console.log(`${i.PREFIX}version: ${ke}`), this._watchTUIStore(), this._engineEventHandler = z.getInstance({ callService: this }), this._chatCombine = W.getInstance({ callService: this });
  }
  static getInstance() {
    return se.instance || (se.instance = new se()), se.instance;
  }
  async init(e) {
    var t, a;
    try {
      if (this._tuiCallEngine)
        return;
      let { userID: r, tim: n, userSig: o, sdkAppID: I, SDKAppID: c, isFromChat: E, component: C = Oe.TUI_CALL_KIT } = e;
      this._TUICore && (I = this._TUICore.SDKAppID, n = this._TUICore.tim), this._tim = n, console.log(`${i.PREFIX}init sdkAppId: ${I || c}, userId: ${r}`), this._tuiCallEngine = tt.createInstance({
        tim: n,
        // @ts-ignore
        sdkAppID: I || c,
        // 兼容传入 SDKAppID 的问题
        callkitVersion: ke,
        chat: E || !1,
        component: C
      }), v.setEngineInstance(this._tuiCallEngine), this._addListenTuiCallEngineEvent(), this._bellContext = new pt(), l.update(s.CALL, i.LOCAL_USER_INFO, { userId: r }), l.update(s.CALL, i.LOCAL_USER_INFO_EXCLUDE_VOLUMN, { userId: r }), v.updateViewBackgroundUserId("local"), await this._tuiCallEngine.login({ userID: r, userSig: o, assetsPath: "" });
      const g = l.getData(s.CALL, i.CUSTOM_UI_CONFIG);
      (a = (t = this._tuiCallEngine) == null ? void 0 : t.reportLog) == null || a.call(t, {
        name: "TUICallkit.init",
        data: {
          uiConfig: g
        }
      });
    } catch (r) {
      throw console.error(`${i.PREFIX}init failed, error: ${r}.`), r;
    }
  }
  // component destroy
  async destroyed() {
    var e;
    try {
      const t = l.getData(s.CALL, i.CALL_STATUS);
      if (t !== h.IDLE)
        throw new Error(`please destroyed when status is idle, current status: ${t}`);
      this._tuiCallEngine && (this._removeListenTuiCallEngineEvent(), await this._tuiCallEngine.destroyInstance(), this._tuiCallEngine = null), (e = this._bellContext) == null || e.destroy(), this._bellContext = null;
    } catch (t) {
      throw console.error(`${i.PREFIX}destroyed failed, error: ${t}.`), t;
    }
  }
  async call(e) {
    if (l.getData(s.CALL, i.CALL_STATUS) === h.IDLE)
      try {
        const { type: t, userID: a, offlinePushInfo: r } = e;
        if (l.getData(s.CALL, i.CALL_STATUS) !== h.IDLE)
          return;
        await this._updateCallStoreBeforeCall(t, [{ userId: a }]), this.executeExternalBeforeCalling(), e.offlinePushInfo = { ...this.getDefaultOfflinePushInfo(), ...r };
        const n = await this._tuiCallEngine.call(e);
        await this._updateCallStoreAfterCall([a], n);
      } catch (t) {
        this._handleCallError(t, "call");
      }
  }
  async groupCall(e) {
    if (l.getData(s.CALL, i.CALL_STATUS) === h.IDLE)
      try {
        const { userIDList: t, type: a, groupID: r, offlinePushInfo: n } = e;
        if (l.getData(s.CALL, i.CALL_STATUS) !== h.IDLE)
          return;
        const o = t.map((c) => ({ userId: c }));
        await this._updateCallStoreBeforeCall(a, o, r), this.executeExternalBeforeCalling(), e.offlinePushInfo = { ...this.getDefaultOfflinePushInfo(), ...n };
        const I = await this._tuiCallEngine.groupCall(e);
        await this._updateCallStoreAfterCall(t, I);
      } catch (t) {
        this._handleCallError(t, "groupCall");
      }
  }
  async inviteUser(e) {
    if (l.getData(s.CALL, i.CALL_STATUS) !== h.IDLE)
      try {
        const { userIDList: t } = e;
        let a = await le(t, this.getTim());
        const r = l.getData(s.CALL, i.REMOTE_USER_INFO_LIST);
        if (t.filter((o) => !r.some((I) => I.userId === o)).length === 0)
          return;
        l.update(s.CALL, i.REMOTE_USER_INFO_LIST, [...r, ...a]), l.update(s.CALL, i.REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST, [...r, ...a]), this._tuiCallEngine && await this._tuiCallEngine.inviteUser(e);
      } catch (t) {
        console.error(`${i.PREFIX}inviteUser failed, error: ${t}.`);
      }
  }
  async joinInGroupCall(e) {
    if (l.getData(s.CALL, i.CALL_STATUS) !== h.CONNECTED)
      try {
        const t = {
          [i.CALL_ROLE]: F.CALLEE,
          [i.IS_GROUP]: !0,
          [i.CALL_STATUS]: h.CONNECTED,
          [i.CALL_MEDIA_TYPE]: e.type,
          [i.GROUP_ID]: e.groupID,
          [i.ROOM_ID]: e.roomID
        };
        l.updateStore(t, s.CALL);
        const a = await this._tuiCallEngine.joinInGroupCall(e), r = this._getFeatureButtonDefaultState(b.Camera) === q.Close;
        e.type === d.VIDEO && !r && await this.openCamera(i.LOCAL_VIDEO), l.update(s.CALL, i.IS_CLICKABLE, !0), this.startTimer(), l.update(s.CALL, i.PUSHER, a), this.setSoundMode(e.type === d.AUDIO ? G.EAR : G.SPEAKER);
        const n = l.getData(s.CALL, i.LOCAL_USER_INFO);
        l.update(s.CALL, i.LOCAL_USER_INFO, { ...n, isEnter: !0 }), l.update(s.CALL, i.LOCAL_USER_INFO_EXCLUDE_VOLUMN, { ...n, isEnter: !0 }), V(!0, i.AUDIO);
      } catch (t) {
        this._handleCallError(t, "joinInGroupCall");
      }
  }
  // ===============================【其它对外接口】===============================
  getTUICallEngineInstance() {
    return (this == null ? void 0 : this._tuiCallEngine) || null;
  }
  setLogLevel(e) {
    var t;
    (t = this == null ? void 0 : this._tuiCallEngine) == null || t.setLogLevel(e);
  }
  setLanguage(e) {
    console.warn(`${i.PREFIX}The miniProgram does not support setLanguage`);
  }
  enableFloatWindow(e) {
    l.update(s.CALL, i.ENABLE_FLOAT_WINDOW, e);
  }
  async setSelfInfo(e) {
    const { nickName: t, avatar: a } = e;
    try {
      await this._tuiCallEngine.setSelfInfo(t, a);
    } catch (r) {
      console.error(`${i.PREFIX}setSelfInfo failed, error: ${r}.`);
    }
  }
  async enableVirtualBackground(e) {
    l.update(s.CALL, i.IS_SHOW_ENABLE_VIRTUAL_BACKGROUND, e);
  }
  async setCallingBell(e) {
    const t = { calleeBellFilePath: e };
    this._bellContext.setBellProperties(t);
  }
  async enableMuteMode(e) {
    try {
      const t = { isMuteBell: e };
      this._bellContext.setBellProperties(t), await this._bellContext.setBellMute(e);
    } catch (t) {
      console.warn(`${i.PREFIX}enableMuteMode failed, error: ${t}.`);
    }
  }
  hideFeatureButton(e) {
    v.hideFeatureButton(e);
  }
  setLocalViewBackgroundImage(e) {
    v.setLocalViewBackgroundImage(e);
  }
  setRemoteViewBackgroundImage(e, t) {
    v.setRemoteViewBackgroundImage(e, t);
  }
  setLayoutMode(e) {
    v.setLayoutMode(e);
  }
  setCameraDefaultState(e) {
    v.setCameraDefaultState(e);
  }
  async accept() {
    var t, a, r, n, o, I;
    const e = l.getData(s.CALL, i.CALL_STATUS);
    if ((a = (t = this._tuiCallEngine) == null ? void 0 : t.reportLog) == null || a.call(t, {
      name: "TUICallKit.accept.start",
      data: { callStatus: e }
    }), e !== h.CONNECTED)
      try {
        const E = {
          microphone: !0,
          camera: l.getData(s.CALL, i.CALL_MEDIA_TYPE) === d.VIDEO
        }, C = await this._tuiCallEngine.deviceCheck(E);
        C && !this._preDevicePermission && (l.update(s.CALL, i.PUSHER_ID, i.NEW_PUSHER), this._preDevicePermission = C);
        const g = await this._tuiCallEngine.accept();
        if (g) {
          l.update(s.CALL, i.CALL_STATUS, h.CONNECTED), (n = this._chatCombine) == null || n.callTUIService({ message: (r = g == null ? void 0 : g.data) == null ? void 0 : r.message }), l.update(s.CALL, i.IS_CLICKABLE, !0), this.startTimer();
          const _ = l.getData(s.CALL, i.CALL_MEDIA_TYPE), N = this._getFeatureButtonDefaultState(b.Camera) === q.Close;
          _ === d.VIDEO && !N && await this.openCamera(i.LOCAL_VIDEO), g.pusher && l.update(s.CALL, i.PUSHER, g.pusher), this.setSoundMode(_ === d.AUDIO ? G.EAR : G.SPEAKER);
          const R = l.getData(s.CALL, i.LOCAL_USER_INFO);
          l.update(s.CALL, i.LOCAL_USER_INFO, { ...R, isEnter: !0 }), l.update(s.CALL, i.LOCAL_USER_INFO_EXCLUDE_VOLUMN, { ...R, isEnter: !0 }), V(!0, i.AUDIO);
        }
      } catch (c) {
        if ((I = (o = this._tuiCallEngine) == null ? void 0 : o.reportLog) == null || I.call(o, {
          name: "TUICallKit.accept.fail",
          level: "error",
          error: c
        }), ve(c))
          return;
        Se(c, d.AUDIO, this._tuiCallEngine), this._resetCallStore();
      }
  }
  async hangup() {
    if (l.getData(s.CALL, i.CALL_STATUS) !== h.IDLE) {
      try {
        const e = await this._tuiCallEngine.hangup();
        e == null || e.forEach((t) => {
          var a, r;
          (t == null ? void 0 : t.code) === 0 && ((r = this._chatCombine) == null || r.callTUIService({ message: (a = t == null ? void 0 : t.data) == null ? void 0 : a.message }));
        });
      } catch (e) {
        console.debug(e);
      }
      this._resetCallStore();
    }
  }
  async reject() {
    var e, t;
    if (l.getData(s.CALL, i.CALL_STATUS) !== h.IDLE) {
      try {
        const a = await this._tuiCallEngine.reject();
        (a == null ? void 0 : a.code) === 0 && ((t = this._chatCombine) == null || t.callTUIService({ message: (e = a == null ? void 0 : a.data) == null ? void 0 : e.message }));
      } catch (a) {
        console.debug(a);
      }
      this._resetCallStore();
    }
  }
  async openCamera(e) {
    try {
      await this._tuiCallEngine.openCamera(), V(!0, i.VIDEO);
    } catch (t) {
      Se(t, d.VIDEO, this._tuiCallEngine), console.error(`${i.PREFIX}openCamera error: ${t}.`);
    }
  }
  async closeCamera() {
    try {
      await this._tuiCallEngine.closeCamera(), V(!1, i.VIDEO);
    } catch (e) {
      console.error(`${i.PREFIX}closeCamera error: ${e}.`);
    }
  }
  async openMicrophone() {
    try {
      await this._tuiCallEngine.openMicrophone(), V(!0, i.AUDIO);
    } catch (e) {
      console.error(`${i.PREFIX}openMicrophone failed, error: ${e}.`);
    }
  }
  async closeMicrophone() {
    try {
      await this._tuiCallEngine.closeMicrophone(), V(!1, i.AUDIO);
    } catch (e) {
      console.error(`${i.PREFIX}closeMicrophone failed, error: ${e}.`);
    }
  }
  switchScreen(e) {
    e && l.update(s.CALL, i.BIG_SCREEN_USER_ID, e);
  }
  async switchCallMediaType() {
    var e, t;
    try {
      const a = l.getData(s.CALL, i.CALL_MEDIA_TYPE);
      if (a === d.AUDIO) {
        console.warn(`${i.PREFIX}switchCallMediaType failed, ${a} not support.`);
        return;
      }
      const r = await this._tuiCallEngine.switchCallMediaType(d.AUDIO);
      (r == null ? void 0 : r.code) === 0 && ((t = this._chatCombine) == null || t.callTUIService({ message: (e = r == null ? void 0 : r.data) == null ? void 0 : e.message })), l.update(s.CALL, i.CALL_MEDIA_TYPE, d.AUDIO);
      const o = l.getData(s.CALL, i.IS_GROUP) ? T.CALLING_GROUP_VIDEO : T.CALLING_C2C_VIDEO, I = Ie();
      this.statusChanged && this.statusChanged({ oldStatus: o, newStatus: I }), this.setSoundMode(G.EAR);
    } catch (a) {
      console.error(`${i.PREFIX}switchCallMediaType failed, error: ${a}.`);
    }
  }
  async switchCamera() {
    const t = l.getData(s.CALL, i.CAMERA_POSITION) === J.BACK ? J.FRONT : J.BACK;
    try {
      await this._tuiCallEngine.switchCamera(t), l.update(s.CALL, i.CAMERA_POSITION, t);
    } catch (a) {
      console.error(`${i.PREFIX}_switchCamera failed, error: ${a}.`);
    }
  }
  setSoundMode(e) {
    var t;
    try {
      let a = l.getData(s.CALL, i.IS_EAR_PHONE);
      const r = e || (a ? G.SPEAKER : G.EAR);
      (t = this._tuiCallEngine) == null || t.selectAudioPlaybackDevice(r), e ? a = e === G.EAR : a = !a, l.update(s.CALL, i.IS_EAR_PHONE, a);
    } catch (a) {
      console.error(`${i.PREFIX}setSoundMode failed, error: ${a}.`);
    }
  }
  async setBlurBackground(e) {
    try {
      l.update(s.CALL, i.ENABLE_VIRTUAL_BACKGROUND, e);
    } catch (t) {
      console.error(`${i.PREFIX}_setBlurBackground failed, error: ${t}.`);
    }
  }
  // ==========================【TUICallEngine 事件处理】==========================
  _addListenTuiCallEngineEvent() {
    this._engineEventHandler.addListenTuiCallEngineEvent();
  }
  _removeListenTuiCallEngineEvent() {
    this._engineEventHandler.removeListenTuiCallEngineEvent();
  }
  setCallback(e) {
    const { beforeCalling: t, afterCalling: a, onMinimized: r, onMessageSentByMe: n, kickedOut: o, statusChanged: I } = e;
    t && (this.beforeCalling = t), a && (this.afterCalling = a), r && (this.onMinimized = r), n && (this.onMessageSentByMe = n), o && (this.kickedOut = o), I && (this.statusChanged = I);
  }
  toggleMinimize() {
    const e = l.getData(s.CALL, i.IS_MINIMIZED);
    l.update(s.CALL, i.IS_MINIMIZED, !e), console.log(`${i.PREFIX}toggleMinimize: ${e} -> ${!e}.`), this.onMinimized && this.onMinimized(e, !e);
  }
  executeExternalBeforeCalling() {
    this.beforeCalling && this.beforeCalling();
  }
  executeExternalAfterCalling() {
    this.afterCalling && this.afterCalling();
  }
  // =========================【 miniProgram 公共方法】=========================
  // 处理用户异常退出的情况，处理了右滑退出，以及返回退出的情况。
  async handleExceptionExit() {
    try {
      if (l.getData(s.CALL, i.CALL_STATUS) === h.IDLE)
        return;
      this._resetCallStore(), await this._tuiCallEngine.handleExceptionExit();
    } catch (e) {
      console.error(`${i.PREFIX} handleExceptionExit failed, error: ${e}.`);
    }
  }
  // 处理 pusher 内部错误，没有 live-pusher 能力时做出弹窗提示。
  handlePusherError(e) {
    var t;
    ((t = e == null ? void 0 : e.detail) == null ? void 0 : t.errMsg) === "fail:access denied" && Ct();
  }
  setVideoDisplayMode(e) {
    l.update(s.CALL, i.DISPLAY_MODE, e);
  }
  async setVideoResolution(e) {
    var t;
    try {
      if (!e)
        return;
      l.update(s.CALL, i.VIDEO_RESOLUTION, e), await ((t = this._tuiCallEngine) == null ? void 0 : t.setVideoQuality(e));
    } catch (a) {
      console.warn(`${i.PREFIX}setVideoResolution failed, error: ${a}.`);
    }
  }
  // 通话时长更新
  startTimer() {
    this._timerId === -1 && (this._startTimeStamp = _e(), this._timerId = ge.run(i.TIMEOUT, this._updateCallDuration.bind(this), { delay: 1e3 }));
  }
  // =========================【private methods for service use】=========================
  // 处理 “呼叫” 抛出的异常
  _handleCallError(e, t) {
    if (this._permissionCheckTimer && clearInterval(this._permissionCheckTimer), !ve(e))
      throw It(e), Se(e, d.AUDIO, this._tuiCallEngine), console.error(`${i.PREFIX}${t} failed, error: ${e}.`), this._resetCallStore(), e;
  }
  async _updateCallStoreBeforeCall(e, t, a) {
    const r = a || l.getData(s.CALL, i.IS_MINIMIZED) ? O.CALLER_GROUP_CALLING_MSG : O.CALLER_CALLING_MSG;
    let n = {
      [i.CALL_MEDIA_TYPE]: e,
      [i.CALL_ROLE]: F.CALLER,
      [i.REMOTE_USER_INFO_LIST]: t,
      [i.REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST]: t,
      [i.IS_GROUP]: !!a,
      [i.CALL_TIPS]: r,
      [i.GROUP_ID]: a
    };
    const o = { enableCamera: e === d.VIDEO, enableMic: !0 };
    n = { ...n, [i.PUSHER]: o }, l.updateStore(n, s.CALL);
    const I = await ct(e, this);
    console.log(`${i.PREFIX}mini beforeCall return callStatus: ${I}.`), l.update(s.CALL, i.CALL_STATUS, I);
    const c = await le(t.map((g) => g.userId), this.getTim());
    c.length > 0 && (l.update(s.CALL, i.REMOTE_USER_INFO_LIST, c), l.update(s.CALL, i.REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST, c));
    const E = {
      microphone: !0,
      camera: e === d.VIDEO
    };
    let C = await this._tuiCallEngine.deviceCheck(E);
    C || (this._permissionCheckTimer && clearInterval(this._permissionCheckTimer), this._permissionCheckTimer = setInterval(async () => {
      C = await this._tuiCallEngine.deviceCheck(E), C && this._permissionCheckTimer && (clearInterval(this._permissionCheckTimer), l.update(s.CALL, i.CALL_STATUS, h.CALLING));
    }, 500));
  }
  async _updateCallStoreAfterCall(e, t) {
    var a, r;
    if (t) {
      l.update(s.CALL, i.IS_CLICKABLE, !0), $e(t == null ? void 0 : t.roomID, t == null ? void 0 : t.strRoomID);
      const n = l.getData(s.CALL, i.CALL_MEDIA_TYPE);
      (r = this._chatCombine) == null || r.callTUIService({ message: (a = t == null ? void 0 : t.data) == null ? void 0 : a.message }), t.pusher && l.update(s.CALL, i.PUSHER, t.pusher), this.setSoundMode(n === d.AUDIO ? G.EAR : G.SPEAKER), l.update(s.CALL, i.CALL_STATUS, h.CALLING);
      const o = this._getFeatureButtonDefaultState(b.Camera) === q.Close;
      n === d.VIDEO && !o && await this.openCamera(i.LOCAL_VIDEO);
      const I = l.getData(s.CALL, i.LOCAL_USER_INFO);
      l.update(s.CALL, i.LOCAL_USER_INFO, { ...I, isEnter: !0 }), l.update(s.CALL, i.LOCAL_USER_INFO_EXCLUDE_VOLUMN, { ...I, isEnter: !0 }), V(!0, i.AUDIO);
    } else
      this._permissionCheckTimer && clearInterval(this._permissionCheckTimer), this._permissionCheckTimer = null, this._resetCallStore();
  }
  _getFeatureButtonDefaultState(e) {
    var a;
    const { button: t } = l.getData(s.CALL, i.CUSTOM_UI_CONFIG);
    return (a = t == null ? void 0 : t[e]) == null ? void 0 : a.state;
  }
  _updateCallDuration() {
    const e = Math.round((_e() - this._startTimeStamp) / 1e3), t = Ze(e);
    l.update(s.CALL, i.CALL_DURATION, t);
  }
  _stopTimer() {
    this._timerId !== -1 && (ge.clearTask(this._timerId), this._timerId = -1);
  }
  _resetCallStore() {
    const e = Ie();
    this._stopTimer();
    let t = Object.keys(ue).filter((n) => {
      switch (ue[n]) {
        case i.CALL_STATUS:
        case i.LANGUAGE:
        case i.IS_GROUP:
        case i.DISPLAY_MODE:
        case i.VIDEO_RESOLUTION:
        case i.ENABLE_FLOAT_WINDOW:
        case i.LOCAL_USER_INFO:
        case i.IS_SHOW_ENABLE_VIRTUAL_BACKGROUND:
        case i.LOCAL_USER_INFO_EXCLUDE_VOLUMN:
          return !1;
        default:
          return !0;
      }
    });
    t = t.map((n) => ue[n]), l.reset(s.CALL, t), l.getData(s.CALL, i.CALL_STATUS) !== h.IDLE && l.reset(s.CALL, [i.CALL_STATUS], !0), l.reset(s.CALL, [i.IS_MINIMIZED], !0), l.reset(s.CALL, [i.IS_EAR_PHONE], !0), l.reset(s.CALL, [i.ENABLE_VIRTUAL_BACKGROUND], !0), l.reset(s.CALL, [i.IS_MUTE_SPEAKER], !0), l.update(s.CALL, i.LOCAL_USER_INFO, {
      ...l.getData(s.CALL, i.LOCAL_USER_INFO),
      isVideoAvailable: !1,
      isAudioAvailable: !1
    }), l.update(s.CALL, i.LOCAL_USER_INFO_EXCLUDE_VOLUMN, {
      ...l.getData(s.CALL, i.LOCAL_USER_INFO_EXCLUDE_VOLUMN),
      isVideoAvailable: !1,
      isAudioAvailable: !1
    }), l.update(s.CALL, i.REMOTE_USER_INFO_LIST, []), l.update(s.CALL, i.REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST, []), l.update(s.CALL, i.CAMERA_POSITION, J.FRONT);
    const r = Ie();
    e !== r && this.statusChanged && this.statusChanged({ oldStatus: e, newStatus: r });
  }
  // =========================【Calling the Chat SDK APi】=========================
  // 获取群成员
  async getGroupMemberList(e, t) {
    const a = l.getData(s.CALL, i.GROUP_ID);
    return await yt(a, this.getTim(), e, t);
  }
  // 获取群信息
  async getGroupProfile() {
    const e = l.getData(s.CALL, i.GROUP_ID);
    return await Pt(e, this.getTim());
  }
  _watchTUIStore() {
    l == null || l.watch(s.CALL, {
      [i.CALL_STATUS]: this._handleCallStatusChange
    });
  }
  _unwatchTUIStore() {
    l == null || l.unwatch(s.CALL, {
      [i.CALL_STATUS]: this._handleCallStatusChange
    });
  }
  // =========================【融合 chat 】=========================
  bindTUICore(e) {
    this._TUICore = e;
  }
  // =========================【set、get methods】=========================
  getTim() {
    var e, t;
    return this._tim ? this._tim : this._tuiCallEngine ? ((e = this._tuiCallEngine) == null ? void 0 : e.tim) || ((t = this._tuiCallEngine) == null ? void 0 : t.getTim()) : (console.warn(`${i.PREFIX}getTim warning: _tuiCallEngine Instance is not available.`), null);
  }
  setIsFromChat(e) {
    this._isFromChat = e;
  }
  setCurrentGroupId(e) {
    this._currentGroupId = e;
  }
  getCurrentGroupId() {
    return this._currentGroupId;
  }
  setDefaultOfflinePushInfo(e) {
    this._offlinePushInfo = e;
  }
  getDefaultOfflinePushInfo() {
    const e = l.getData(s.CALL, i.LOCAL_USER_INFO);
    return this._offlinePushInfo ? this._offlinePushInfo : {
      title: (e == null ? void 0 : e.displayUserInfo) || "",
      description: X("you have a new call")
    };
  }
  async getCallMessage(e) {
    return await this._chatCombine.getCallKitMessage(e, this.getTim());
  }
};
D([
  U(),
  M(Q.init)
], f.prototype, "init", 1);
D([
  U(),
  M(Q.call),
  de({ engineInstance: !0 })
], f.prototype, "call", 1);
D([
  U(),
  M(Q.groupCall),
  de({ engineInstance: !0 })
], f.prototype, "groupCall", 1);
D([
  U(),
  M(Q.inviteUser),
  de({ engineInstance: !0 })
], f.prototype, "inviteUser", 1);
D([
  U(),
  M(Q.joinInGroupCall),
  de({ engineInstance: !0 })
], f.prototype, "joinInGroupCall", 1);
D([
  M(Q.setLanguage)
], f.prototype, "setLanguage", 1);
D([
  M(Q.enableFloatWindow)
], f.prototype, "enableFloatWindow", 1);
D([
  M(Q.setSelfInfo)
], f.prototype, "setSelfInfo", 1);
D([
  M(Q.setCallingBell)
], f.prototype, "setCallingBell", 1);
D([
  M(Q.enableMuteMode)
], f.prototype, "enableMuteMode", 1);
D([
  U()
], f.prototype, "accept", 1);
D([
  U()
], f.prototype, "hangup", 1);
D([
  U()
], f.prototype, "reject", 1);
D([
  U()
], f.prototype, "openCamera", 1);
D([
  U()
], f.prototype, "closeCamera", 1);
D([
  U()
], f.prototype, "openMicrophone", 1);
D([
  U()
], f.prototype, "closeMicrophone", 1);
D([
  U()
], f.prototype, "switchScreen", 1);
D([
  U()
], f.prototype, "switchCallMediaType", 1);
D([
  U()
], f.prototype, "switchCamera", 1);
D([
  U()
], f.prototype, "setSoundMode", 1);
D([
  U()
], f.prototype, "setBlurBackground", 1);
D([
  M(Q.setVideoDisplayMode)
], f.prototype, "setVideoDisplayMode", 1);
D([
  M(Q.setVideoResolution)
], f.prototype, "setVideoResolution", 1);
let kt = f;
const Jt = kt.getInstance(), Wt = "3.3.9";
export {
  d as CallMediaType,
  F as CallRole,
  b as FeatureButton,
  be as LayoutMode,
  i as NAME,
  T as STATUS,
  s as StoreName,
  Jt as TUICallKitServer,
  xt as TUIGlobal,
  l as TUIStore,
  Wt as Version,
  ne as VideoDisplayMode,
  oe as VideoResolution,
  X as t,
  v as uiDesign
};
