export declare const Fit: readonly ["fill", "contain", "cover"];
export declare const MiniProgramImageFitMap: {
    readonly fill: "scaleToFill";
    readonly contain: "aspectFit";
    readonly cover: "aspectFill";
};
export declare const ImageProps: {
    readonly width: {
        readonly type: StringConstructor;
        readonly default: "320px";
    };
    readonly height: {
        readonly type: StringConstructor;
        readonly default: "240px";
    };
    readonly src: {
        readonly type: StringConstructor;
    };
    readonly fit: {
        readonly type: StringConstructor;
        readonly values: readonly ["fill", "contain", "cover"];
        readonly default: "fill";
    };
    readonly customStyle: {
        readonly type: ObjectConstructor;
    };
    readonly defaultSrc: {
        readonly type: StringConstructor;
    };
};
export declare const imageEmits: {
    error: (evt: any) => any;
};
