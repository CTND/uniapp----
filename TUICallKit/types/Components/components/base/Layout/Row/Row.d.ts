export declare const rowProps: {
    readonly gutter: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly justify: {
        readonly type: StringConstructor;
        readonly values: readonly ["start", "center", "end", "space-around", "space-between", "space-evenly"];
        readonly default: "start";
    };
    readonly align: {
        readonly type: StringConstructor;
        readonly values: readonly ["top", "middle", "bottom"];
        readonly default: "top";
    };
    readonly customStyle: {
        readonly type: ObjectConstructor;
        readonly default: () => void;
    };
};
