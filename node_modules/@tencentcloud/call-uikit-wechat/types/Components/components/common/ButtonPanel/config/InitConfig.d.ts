export declare const ButtonPanelConfig: {
    pc: {
        singleCall: {
            video: {
                calling: ({
                    name: string;
                    props: {};
                } | {
                    name: string;
                    props?: undefined;
                })[][];
                accept: ({
                    name: string;
                    props: {};
                } | {
                    name: string;
                    props?: undefined;
                })[][];
                connected: ({
                    name: string;
                    props: {};
                } | {
                    name: string;
                    props?: undefined;
                })[][];
            };
            audio: {
                calling: ({
                    name: string;
                    props: {};
                } | {
                    name: string;
                    props?: undefined;
                })[][];
                accept: {
                    name: string;
                }[][];
                connected: ({
                    name: string;
                    props: {};
                } | {
                    name: string;
                    props?: undefined;
                })[][];
            };
        };
        groupCall: {
            video: {
                calling: ({
                    name: string;
                    props: {};
                } | {
                    name: string;
                    props?: undefined;
                })[][];
                accept: {
                    name: string;
                }[][];
                connected: ({
                    name: string;
                    props: {};
                } | {
                    name: string;
                    props?: undefined;
                })[][];
            };
            audio: {
                calling: ({
                    name: string;
                    props: {};
                } | {
                    name: string;
                    props?: undefined;
                })[][];
                accept: {
                    name: string;
                }[][];
                connected: ({
                    name: string;
                    props: {};
                } | {
                    name: string;
                    props?: undefined;
                })[][];
            };
        };
    };
    mobile: any;
};
