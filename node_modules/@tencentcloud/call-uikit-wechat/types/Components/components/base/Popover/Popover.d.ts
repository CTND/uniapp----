export declare const PopoverProps: {
    trigger: {
        type: StringConstructor;
        values: readonly ["click", "hover"];
        default: string;
    };
    placement: {
        type: StringConstructor;
        values: readonly ["top", "bottom", "left", "right"];
        default: string;
    };
    color: {
        type: StringConstructor;
    };
    isShowArrow: {
        type: BooleanConstructor;
        default: boolean;
    };
    arrowSize: {
        type: NumberConstructor;
        default: number;
    };
    arrowDistance: {
        type: NumberConstructor;
        default: number;
    };
    show: {
        type: BooleanConstructor;
    };
    autoClose: {
        type: NumberConstructor;
        default: number;
    };
};
