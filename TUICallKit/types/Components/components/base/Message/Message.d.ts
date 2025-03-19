export declare const MessageProps: {
    readonly isShow: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly message: {
        readonly type: StringConstructor;
        readonly default: "";
    };
    readonly type: {
        readonly type: StringConstructor;
        readonly values: readonly [string, string, string, string];
        readonly default: string;
    };
    readonly duration: {
        readonly type: NumberConstructor;
        readonly default: 3000;
    };
    readonly offset: {
        readonly type: NumberConstructor;
        readonly default: 16;
    };
    readonly showClose: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly showIcon: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly customClass: {
        readonly type: StringConstructor;
    };
    readonly customStyle: {
        readonly type: ObjectConstructor;
    };
};
export declare const MessageEmits: {
    onClose: any;
};
export declare function useMessage(props: any, emits: any): {
    messageContent: import("@vue/reactivity").Ref<any, any>;
    messageDuration: import("@vue/reactivity").Ref<any, any>;
    messageType: import("@vue/reactivity").Ref<any, any>;
    messageOffset: import("@vue/reactivity").Ref<any, any>;
    isShowCloseIcon: import("@vue/reactivity").Ref<any, any>;
    visible: import("@vue/reactivity").Ref<boolean, boolean>;
    show: (messageObj?: any) => void;
    close: () => void;
};
