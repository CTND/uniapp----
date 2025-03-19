export declare const OverlayProps: {
    readonly show: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly showMask: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly showBackgroundImage: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly blur: {
        readonly type: BooleanConstructor;
        readonly default: true;
    };
    readonly bgColor: {
        readonly type: StringConstructor;
    };
    readonly bgImage: {
        readonly type: StringConstructor;
    };
    readonly zIndex: {
        readonly type: NumberConstructor;
        readonly default: 11000;
    };
    readonly customClass: {
        readonly type: StringConstructor;
    };
    readonly customStyle: {
        readonly type: ObjectConstructor;
    };
    readonly customMaskStyle: {
        readonly type: ObjectConstructor;
    };
    readonly fit: {
        readonly type: StringConstructor;
        readonly default: "cover";
    };
    readonly defaultSrc: {
        readonly type: StringConstructor;
    };
};
export declare const OverlayEmits: string[];
