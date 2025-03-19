export declare const GridProps: {
    readonly length: {
        readonly type: NumberConstructor;
        readonly default: 0;
    };
    readonly unit: {
        readonly type: StringConstructor;
        readonly values: string[];
        readonly default: "%";
    };
    readonly enableFocus: {
        readonly type: BooleanConstructor;
        readonly default: false;
    };
    readonly layout: {
        readonly type: ArrayConstructor;
    };
    readonly focus: {
        readonly type: readonly [StringConstructor, NumberConstructor];
    };
};
export declare const ChangeFocusEmits: string[];
export declare const GridContextKey = "GridContextKey";
