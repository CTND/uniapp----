export declare const ToggleWindowProps: {
    readonly bigWindow: {
        readonly type: StringConstructor;
    };
    readonly showSmallWindow: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly smallWindowWidth: {
        readonly type: StringConstructor;
        readonly default: "30%";
    };
    readonly smallWindowHeight: {
        readonly type: StringConstructor;
        readonly default: "30%";
    };
};
export declare const ToggleWindowEmits: string[];
