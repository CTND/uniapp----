import { Direction } from '.';
export default function useSlide({ pageCount }: {
    pageCount: any;
}): {
    currentIndex: import("@vue/reactivity").Ref<number, number>;
    direction: import("@vue/reactivity").Ref<Direction, Direction>;
};
