import { ITUIStore } from '../interface/ITUIStore';
// @ts-ignore
import { EVENT as TUICallEvent } from 'tuicall-engine-wx';
import { IUserInfo } from '../interface/ICallService';
import { StoreName, CallStatus, CallMediaType, NAME, CallRole, StatusChange, ErrorCode, ErrorMessage, AudioPlayBackDevice,
  NETWORK_QUALITY_THRESHOLD } from '../const/index';
import { CallTips, t } from '../locales/index';
import { initAndCheckRunEnv } from './miniProgram';
import { getMyProfile, getRemoteUserProfile, updateRoomIdAndRoomIdType, analyzeEventData, deleteRemoteUser } from './utils';
import promiseRetryDecorator from '../utils/decorators/promise-retry';
import { UIDesign } from './UIDesign';
import TuiStore from '../TUIStore/tuiStore';
const TUIStore: ITUIStore = TuiStore.getInstance();
const uiDesign = UIDesign.getInstance();


export default class EngineEventHandler {
  static instance: EngineEventHandler;
  private _callService: any;

  constructor(options) {
    this._callService = options.callService;
  }

  static getInstance(options) {
    if (!EngineEventHandler.instance) {
      EngineEventHandler.instance = new EngineEventHandler(options);
    }
    return EngineEventHandler.instance;
  }
  public addListenTuiCallEngineEvent() {
    const callEngine = this._callService?.getTUICallEngineInstance();

    if (!callEngine) {
      console.warn(`${NAME.PREFIX}add engine event listener failed, engine is empty.`);
      return;
    }

    callEngine.on(TUICallEvent.ERROR, this._handleError, this);
    callEngine.on(TUICallEvent.INVITED, this._handleNewInvitationReceived, this); // 收到邀请事件
    callEngine.on(TUICallEvent.USER_ACCEPT, this._handleUserAccept, this); // 主叫收到被叫接通事件
    callEngine.on(TUICallEvent.USER_ENTER, this._handleUserEnter, this); // 有用户进房事件
    callEngine.on(TUICallEvent.USER_LEAVE, this._handleUserLeave, this); // 有用户离开通话事件
    callEngine.on(TUICallEvent.REJECT, this._handleInviteeReject, this); // 主叫收到被叫的拒绝通话事件
    callEngine.on(TUICallEvent.NO_RESP, this._handleNoResponse, this); // 主叫收到被叫的无应答事件
    callEngine.on(TUICallEvent.LINE_BUSY, this._handleLineBusy, this); // 主叫收到被叫的忙线事件
    callEngine.on(TUICallEvent.CALLING_CANCEL, this._handleCallingCancel, this); // 主被叫在通话未建立时, 收到的取消事件
    callEngine.on(TUICallEvent.SDK_READY, this._handleSDKReady, this); // SDK Ready 回调
    callEngine.on(TUICallEvent.KICKED_OUT, this._handleKickedOut, this); // 未开启多端登录时, 多端登录收到的被踢事件
    callEngine.on(TUICallEvent.MESSAGE_SENT_BY_ME, this._messageSentByMe, this);
    // @ts-ignore
    TUICallEvent.CALL_MESSAGE && callEngine.on(TUICallEvent.CALL_MESSAGE, this._handleCallMessage, this); // call message card display event
    // @ts-ignore
    TUICallEvent.ON_USER_NETWORK_QUALITY_CHANGED && callEngine.on(TUICallEvent.ON_USER_NETWORK_QUALITY_CHANGED, this._handleNetworkQuality, this); // 用户网络质量
    callEngine.on(TUICallEvent.CALL_END, this._handleCallingEnd, this); // 主被叫在通话结束时, 收到的通话结束事件
    // @ts-ignore
    callEngine.on(TUICallEvent.CALL_MODE, this._handleCallTypeChange, this);
    // @ts-ignore
    callEngine.on(TUICallEvent.USER_UPDATE, this._handleUserUpdate, this); // mini: user data update
  }
  public removeListenTuiCallEngineEvent() {
    const callEngine = this._callService?.getTUICallEngineInstance();

    callEngine.off(TUICallEvent.ERROR, this._handleError, this);
    callEngine.off(TUICallEvent.INVITED, this._handleNewInvitationReceived, this);
    callEngine.off(TUICallEvent.USER_ACCEPT, this._handleUserAccept, this);
    callEngine.off(TUICallEvent.USER_ENTER, this._handleUserEnter, this);
    callEngine.off(TUICallEvent.USER_LEAVE, this._handleUserLeave, this);
    callEngine.off(TUICallEvent.REJECT, this._handleInviteeReject, this);
    callEngine.off(TUICallEvent.NO_RESP, this._handleNoResponse, this);
    callEngine.off(TUICallEvent.LINE_BUSY, this._handleLineBusy, this);
    callEngine.off(TUICallEvent.CALLING_CANCEL, this._handleCallingCancel, this);
    callEngine.off(TUICallEvent.SDK_READY, this._handleSDKReady, this);
    callEngine.off(TUICallEvent.KICKED_OUT, this._handleKickedOut, this);
    callEngine.off(TUICallEvent.MESSAGE_SENT_BY_ME, this._messageSentByMe, this);
    // @ts-ignore
    TUICallEvent.ON_USER_NETWORK_QUALITY_CHANGED && callEngine.off(TUICallEvent.ON_USER_NETWORK_QUALITY_CHANGED, this._handleNetworkQuality, this);
    callEngine.off(TUICallEvent.CALL_END, this._handleCallingEnd, this);
    // @ts-ignore
    callEngine.off(TUICallEvent.CALL_MODE, this._handleCallTypeChange, this); // 切换通话事件 miniProgram CALL_MODE
    // @ts-ignore
    callEngine.off(TUICallEvent.USER_UPDATE, this._handleUserUpdate, this); // mini: user data update
  }
  private _callerChangeToConnected() {
    const callRole = TUIStore.getData(StoreName.CALL, NAME.CALL_ROLE);
    const callStatus = TUIStore.getData(StoreName.CALL, NAME.CALL_STATUS);

    if (callStatus === CallStatus.CALLING && callRole === CallRole.CALLER) {
      TUIStore.update(StoreName.CALL, NAME.CALL_STATUS, CallStatus.CONNECTED);
      this._callService?.startTimer();
    }
  }
  private _unNormalEventsManager(event: any, eventName: TUICallEvent): void {
    console.log(`${NAME.PREFIX}${eventName} event data: ${JSON.stringify(event)}.`);
    const isGroup = TUIStore.getData(StoreName.CALL, NAME.IS_GROUP);
    const remoteUserInfoList = TUIStore.getData(StoreName.CALL, NAME.REMOTE_USER_INFO_LIST);

    switch (eventName) {
      case TUICallEvent.REJECT:
      case TUICallEvent.LINE_BUSY: {
        const { userID: userId } = analyzeEventData(event);
        let callTipsKey = eventName === TUICallEvent.REJECT ? CallTips.OTHER_SIDE_REJECT_CALL : CallTips.OTHER_SIDE_LINE_BUSY;
        let userListNeedToShow = '';
        if (isGroup) {
          userListNeedToShow = (remoteUserInfoList.find(obj => obj.userId === userId) || {}).displayUserInfo || userId;
          callTipsKey = eventName === TUICallEvent.REJECT ? CallTips.REJECT_CALL : CallTips.IN_BUSY;
        }
        TUIStore.update(StoreName.CALL, NAME.TOAST_INFO, { content: { key: callTipsKey, options: { userList: userListNeedToShow } } });
        userId && deleteRemoteUser([userId]);
        break;
      }
      case TUICallEvent.NO_RESP: {
        const { userIDList = [] } = analyzeEventData(event);
        const callTipsKey = isGroup ? CallTips.TIMEOUT : CallTips.CALL_TIMEOUT;
        const userInfoList: string[] = userIDList.map(userId => {
          const userInfo: IUserInfo = remoteUserInfoList.find(obj => obj.userId === userId) || {};
          return userInfo.displayUserInfo || userId;
        });
        TUIStore.update(StoreName.CALL, NAME.TOAST_INFO, { content: { key: callTipsKey, options: { userList: userInfoList.join() } } });
        userIDList.length > 0 && deleteRemoteUser(userIDList);
        break;
      }
      case TUICallEvent.CALLING_CANCEL: {
        this._callService?._resetCallStore();
        break;
      }
    }
  }


  private _handleError(event: any): void {
    const { code, message } = event || {};
    const index = Object.values(ErrorCode).indexOf(code);
    let callTips = '';

    if (index !== -1) {
      const key = Object.keys(ErrorCode)[index];
      callTips = t(ErrorMessage[key]);
      callTips && TUIStore.update(StoreName.CALL, NAME.TOAST_INFO, { content: ErrorMessage[key], type: NAME.ERROR });
    }
    this._callService?.executeExternalAfterCalling();
    console.error(`${NAME.PREFIX}_handleError, errorCode: ${code}; errorMessage: ${callTips || message}.`);
  }
  private async _handleNewInvitationReceived(event: any) {
    console.log(`${NAME.PREFIX}onCallReceived event data: ${JSON.stringify(event)}.`);
    const { sponsor = '', isFromGroup, callMediaType, inviteData = {}, calleeIdList = [], groupID = '', roomID, strRoomID } = analyzeEventData(event);
    const currentUserInfo: IUserInfo = TUIStore.getData(StoreName.CALL, NAME.LOCAL_USER_INFO);
    const remoteUserIdList: string[] = [sponsor, ...calleeIdList.filter((userId: string) => userId !== currentUserInfo.userId)];
    const type = callMediaType || inviteData.callType;
    const callTipsKey = type === CallMediaType.AUDIO ? CallTips.CALLEE_CALLING_AUDIO_MSG : CallTips.CALLEE_CALLING_VIDEO_MSG;
    let updateStoreParams = {
      [NAME.CALL_ROLE]: CallRole.CALLEE,
      [NAME.IS_GROUP]: isFromGroup,
      [NAME.CALL_STATUS]: CallStatus.CALLING,
      [NAME.CALL_MEDIA_TYPE]: type,
      [NAME.CALL_TIPS]: callTipsKey,
      [NAME.CALLER_USER_INFO]: { userId: sponsor },
      [NAME.GROUP_ID]: groupID,
    };
    initAndCheckRunEnv();
    const pusher = { enableCamera: type === CallMediaType.VIDEO, enableMic: true }; // mini 默认打开麦克风
    updateStoreParams = { ...updateStoreParams, [NAME.PUSHER]: pusher };
    const deviceMap = {
      microphone: true,
      camera: type === CallMediaType.VIDEO,
    };
    this._callService._preDevicePermission = await this._callService._tuiCallEngine.deviceCheck(deviceMap);
    updateRoomIdAndRoomIdType(roomID, strRoomID);
    TUIStore.updateStore(updateStoreParams, StoreName.CALL);
    this._callService?.executeExternalBeforeCalling();
    this._callService?.statusChanged && this._callService?.statusChanged({ oldStatus: StatusChange.IDLE, newStatus: StatusChange.BE_INVITED });

    const remoteUserInfoList = await getRemoteUserProfile(remoteUserIdList, this._callService?.getTim());
    const [userInfo] = remoteUserInfoList.filter((userInfo: IUserInfo) => userInfo.userId === sponsor);

    remoteUserInfoList.length > 0 && TUIStore.updateStore({
      [NAME.REMOTE_USER_INFO_LIST]: remoteUserInfoList,
      [NAME.REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST]: remoteUserInfoList,
      [NAME.CALLER_USER_INFO]: {
        userId: sponsor,
        nick: userInfo?.nick || '',
        avatar: userInfo?.avatar || '',
        displayUserInfo: userInfo?.remark || userInfo?.nick || sponsor,
      },
    }, StoreName.CALL);
  }
  private _handleUserAccept(event: any): void {
    this._callerChangeToConnected();
    TUIStore.update(StoreName.CALL, NAME.CALL_TIPS, { text: 'answered', duration: 2000 });
    console.log(`${NAME.PREFIX}accept event data: ${JSON.stringify(event)}.`);
  }
  private async _handleUserEnter(event: any): Promise<void> {
    this._callerChangeToConnected();
    const { userID: userId, data } = analyzeEventData(event);
    data?.playerList && TUIStore.update(StoreName.CALL, NAME.PLAYER, data.playerList);
    let remoteUserInfoList = TUIStore.getData(StoreName.CALL, NAME.REMOTE_USER_INFO_LIST);
    const isInRemoteUserList = remoteUserInfoList.find(item => item?.userId === userId);

    if (!isInRemoteUserList) {
      remoteUserInfoList.push({ userId });

      if (remoteUserInfoList.length > 0) {
        TUIStore.update(StoreName.CALL, NAME.REMOTE_USER_INFO_LIST, remoteUserInfoList);
        TUIStore.update(StoreName.CALL, NAME.REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST, remoteUserInfoList);
      }
      const [userInfo] = await getRemoteUserProfile([userId], this._callService?.getTim());
      remoteUserInfoList = TUIStore.getData(StoreName.CALL, NAME.REMOTE_USER_INFO_LIST);
      remoteUserInfoList.forEach((obj) => {
        if (obj?.userId === userId) {
          obj = Object.assign(obj, userInfo);
        }
      });
    }
    remoteUserInfoList = remoteUserInfoList.map((obj: IUserInfo) => {
      if (obj.userId === userId) obj.isEnter = true;
      return obj;
    });

    if (remoteUserInfoList.length > 0) {
      TUIStore.update(StoreName.CALL, NAME.REMOTE_USER_INFO_LIST, remoteUserInfoList);
      TUIStore.update(StoreName.CALL, NAME.REMOTE_USER_INFO_EXCLUDE_VOLUMN_LIST, remoteUserInfoList);
      uiDesign.updateViewBackgroundUserId('remote');
    }
    console.log(`${NAME.PREFIX}userEnter event data: ${JSON.stringify(event)}.`);
  }
  private _handleUserLeave(event: any): void {
    console.log(`${NAME.PREFIX}userLeave event data: ${JSON.stringify(event)}.`);
    const { data, userID: userId } = analyzeEventData(event);
    data?.playerList && TUIStore.update(StoreName.CALL, NAME.PLAYER, data.playerList);

    if (TUIStore.getData(StoreName.CALL, NAME.IS_GROUP)) {
      const remoteUserInfoList = TUIStore.getData(StoreName.CALL, NAME.REMOTE_USER_INFO_LIST);
      const userListNeedToShow: string = (remoteUserInfoList.find(obj => obj.userId === userId) || {}).displayUserInfo || userId;
      TUIStore.update(StoreName.CALL, NAME.TOAST_INFO, { content: { key: CallTips.END_CALL, options: { userList: userListNeedToShow } } });
    }
    userId && deleteRemoteUser([userId]);
  }
  private _handleInviteeReject(event: any): void {
    this._unNormalEventsManager(event, TUICallEvent.REJECT);
  }
  private _handleNoResponse(event: any): void {
    this._unNormalEventsManager(event, TUICallEvent.NO_RESP);
  }
  private _handleLineBusy(event: any): void {
    this._unNormalEventsManager(event, TUICallEvent.LINE_BUSY);
  }
  private _handleCallingCancel(event: any): void {
    this._callService?.executeExternalAfterCalling();
    this._unNormalEventsManager(event, TUICallEvent.CALLING_CANCEL);
  }
  private _handleCallingEnd(event: any): void {
    console.log(`${NAME.PREFIX}callEnd event data: ${JSON.stringify(event)}.`);

    this._callService?.executeExternalAfterCalling();
    this._callService?._resetCallStore();
  }
  // SDK_READY 后才能调用 tim 接口, 否则登录后立刻获取导致调用接口失败. v2.27.4+、v3 接口 login 后会抛出 SDK_READY
  private async _handleSDKReady(event: any): Promise<void> {
    let localUserInfo: IUserInfo = TUIStore.getData(StoreName.CALL, NAME.LOCAL_USER_INFO);
    localUserInfo = await getMyProfile(localUserInfo.userId, this._callService?.getTim());

    TUIStore.update(StoreName.CALL, NAME.LOCAL_USER_INFO, localUserInfo);
    TUIStore.update(StoreName.CALL, NAME.LOCAL_USER_INFO_EXCLUDE_VOLUMN, localUserInfo);
  }
  private _handleKickedOut(event: any): void {
    console.log(`${NAME.PREFIX}kickOut event data: ${JSON.stringify(event)}.`);

    this._callService?.kickedOut && this._callService?.kickedOut(event);
    
    TUIStore.update(StoreName.CALL, NAME.CALL_TIPS, CallTips.KICK_OUT);
    this._callService?._resetCallStore();
  }
  private _messageSentByMe(event: any): void {
    const message = event?.data;

    this._callService?.onMessageSentByMe && this._callService?.onMessageSentByMe(message);
  }
  private _handleCallMessage(event: any) {
    const message = analyzeEventData(event);
    this._callService._chatCombine.callTUIService({ message });
  }
  private _handleCallTypeChange(event: any): void {
    const { newCallType, type } = analyzeEventData(event);
    TUIStore.update(StoreName.CALL, NAME.CALL_MEDIA_TYPE, newCallType || type);

    this._callService?.setSoundMode(AudioPlayBackDevice.EAR);
  }
  private _handleNetworkQuality(event) {
    const { networkQualityList = [] } = analyzeEventData(event);
    TUIStore.update(StoreName.CALL, NAME.NETWORK_STATUS, networkQualityList);
    const isGroup = TUIStore.getData(StoreName.CALL, NAME.IS_GROUP);
    const localUserInfo = TUIStore.getData(StoreName.CALL, NAME.LOCAL_USER_INFO);
    const remoteUserInfoList = TUIStore.getData(StoreName.CALL, NAME.REMOTE_USER_INFO_LIST);

    if(!isGroup) {
      const isRemoteNetworkPoor = networkQualityList.find(user => remoteUserInfoList[0]?.userId === user?.userId && user?.quality >= NETWORK_QUALITY_THRESHOLD);
      if(isRemoteNetworkPoor) {
        TUIStore.update(StoreName.CALL, NAME.CALL_TIPS, CallTips.REMOTE_NETWORK_IS_POOR);
        return;
      };
      const isLocalNetworkPoor = networkQualityList.find(user => localUserInfo?.userId === user?.userId && user?.quality >= NETWORK_QUALITY_THRESHOLD);
      if(isLocalNetworkPoor) {
        TUIStore.update(StoreName.CALL, NAME.CALL_TIPS, CallTips.LOCAL_NETWORK_IS_POOR);
        return;
      }
    }
  }
  // ==========================【 miniProgram 私有事件】==========================
  private _handleUserUpdate(event: any): void {
    const data = analyzeEventData(event);

    data?.pusher && TUIStore.update(StoreName.CALL, NAME.PUSHER, data.pusher);
    data?.playerList && TUIStore.update(StoreName.CALL, NAME.PLAYER, data.playerList);
  }
}