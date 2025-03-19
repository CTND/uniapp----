export declare const LoadingProps: {
    readonly mode: {
        readonly type: StringConstructor;
        readonly values: readonly ["circle", "dot"];
        readonly default: "circle";
    };
    readonly loadingWidth: {
        readonly type: StringConstructor;
        readonly default: "40px";
    };
    readonly loadingHeight: {
        readonly type: StringConstructor;
        readonly default: "40px";
    };
    readonly color: {
        readonly type: StringConstructor;
    };
    readonly text: {
        readonly type: StringConstructor;
    };
    readonly layout: {
        readonly type: StringConstructor;
        readonly values: readonly ["row", "column"];
        readonly default: "column";
    };
};
