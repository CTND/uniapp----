export declare const AvatarProps: {
    readonly icon: {
        readonly type: StringConstructor;
    };
    readonly size: {
        readonly type: readonly [NumberConstructor, StringConstructor];
        readonly default: 100;
    };
    readonly shape: {
        readonly type: StringConstructor;
        readonly values: readonly ["circle", "square"];
        readonly default: "square";
    };
    readonly src: {
        readonly type: StringConstructor;
    };
    readonly defaultSrc: {
        readonly type: StringConstructor;
    };
    readonly text: {
        readonly type: StringConstructor;
    };
    readonly fit: {
        readonly type: StringConstructor;
        readonly values: readonly ["fill", "contain", "cover"];
        readonly default: "cover";
    };
    readonly customClass: {
        readonly type: StringConstructor;
    };
};
export declare const avatarEmits: {
    error: (evt: any) => any;
};
