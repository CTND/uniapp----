import { PropType } from '../../../../adapter-vue';
import { DeviceType } from '../../../../TUICallService/const';
export declare const DeviceSelectProps: {
    deviceType: {
        type: PropType<DeviceType>;
    };
    isShowControlBtn: {
        type: BooleanConstructor;
        default: boolean;
    };
};
