import { DeviceType } from '../../TUICallService/const';
export declare function useDeviceList(deviceType: DeviceType): readonly [{
    readonly deviceList: import("@vue/reactivity").Ref<any[], any[]>;
    readonly currentDeviceId: import("@vue/reactivity").Ref<string, string>;
}, {
    readonly updateCurrentDeviceId: (value: any) => void;
}];
