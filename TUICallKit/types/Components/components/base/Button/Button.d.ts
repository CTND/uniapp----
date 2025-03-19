export declare const ButtonProps: {
    iconSrc: {
        type: StringConstructor;
    };
    iconSize: {
        type: NumberConstructor;
    };
    text: {
        type: StringConstructor;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    loadingColor: {
        type: StringConstructor;
        default: string;
    };
    loadingWidth: {
        type: StringConstructor;
        default: string;
    };
    loadingHeight: {
        type: StringConstructor;
        default: string;
    };
    size: {
        type: StringConstructor;
        values: readonly ["small", "middle", "large"];
        default: string;
    };
    width: {
        type: StringConstructor;
    };
    height: {
        type: StringConstructor;
    };
    color: {
        type: StringConstructor;
    };
    direction: {
        type: StringConstructor;
        values: readonly ["row", "column"];
        default: string;
    };
    shape: {
        type: StringConstructor;
        values: readonly ["circle", "round"];
    };
    buttonStyle: {
        type: ObjectConstructor;
    };
    buttonTextStyle: {
        type: ObjectConstructor;
    };
};
