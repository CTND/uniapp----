import TUICallService, { TUIGlobal, TUIStore, uiDesign } from './CallService/index';
import {
  StoreName,
  NAME,
  CallRole,
  CallMediaType,
  CallStatus,
  StatusChange,
  VideoResolution,
  VideoDisplayMode,
  AudioPlayBackDevice,
  FeatureButton,
  LayoutMode,
} from './const/index';
import { t } from './locales/index';

// 实例化
const TUICallKitServer = TUICallService.getInstance();
// 输出产物
export {
  TUIGlobal,
  TUIStore,
  StoreName,
  TUICallKitServer,
  NAME,
  CallStatus,
  CallRole,
  CallMediaType,
  StatusChange,
  VideoResolution,
  VideoDisplayMode,
  AudioPlayBackDevice,
  t,
  uiDesign,
  FeatureButton,
  LayoutMode,
};
