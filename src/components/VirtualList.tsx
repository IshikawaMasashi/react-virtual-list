import * as React from "react";
// import * as PropTypes from "prop-types";
import SizeAndPositionManager, { ItemSize } from "./SizeAndPositionManager";
import {
  ALIGNMENT,
  DIRECTION,
  SCROLL_CHANGE_REASON,
  marginProp,
  oppositeMarginProp,
  positionProp,
  scrollProp,
  sizeProp
} from "./constants";

export { DIRECTION as ScrollDirection } from "./constants";

export type ItemPosition = "absolute" | "sticky";

export interface ItemStyle {
  position: ItemPosition;
  top?: number;
  left: number;
  width: string | number;
  height?: number;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
  marginBottom?: number;
  zIndex?: number;
}

interface StyleCache {
  [id: number]: ItemStyle;
}

export interface ItemInfo {
  index: number;
  style: ItemStyle;
}

export interface RenderedRows {
  startIndex: number;
  stopIndex: number;
}

export interface Props {
  className?: string;
  estimatedItemSize?: number;
  height: number | string;
  itemCount: number;
  itemSize: ItemSize;
  overscanCount?: number;
  scrollOffset?: number;
  scrollToIndex?: number;
  scrollToAlignment?: ALIGNMENT;
  scrollDirection?: DIRECTION;
  stickyIndices?: number[];
  style?: React.CSSProperties;
  width?: number | string;
  onItemsRendered?({ startIndex, stopIndex }: RenderedRows): void;
  onScroll?(offset: number, event: Event): void;
  renderItem(itemInfo: ItemInfo): React.ReactNode;
}

export interface State {
  offset: number;
  scrollChangeReason: SCROLL_CHANGE_REASON;
}

const STYLE_WRAPPER: React.CSSProperties = {
  overflow: "auto",
  willChange: "transform",
  WebkitOverflowScrolling: "touch"
};

const STYLE_INNER: React.CSSProperties = {
  position: "relative",
  width: "100%",
  minHeight: "100%"
};

const STYLE_ITEM: {
  position: ItemStyle["position"];
  top: ItemStyle["top"];
  left: ItemStyle["left"];
  width: ItemStyle["width"];
} = {
  position: "absolute" as ItemPosition,
  top: 0,
  left: 0,
  width: "100%"
};

const STYLE_STICKY_ITEM = {
  ...STYLE_ITEM,
  position: "sticky" as ItemPosition
};

const { useRef, useState, useEffect } = React;

function VirtualList(props: Props) {
  const useForceUpdate = () => {
    const [, setState] = useState();
    return () => setState({});
  };

  const forceUpdate = useForceUpdate();

  const rootNodeRef = useRef<HTMLDivElement>(null);

  const styleCacheRef = useRef<StyleCache>({});

  const itemCountRef = useRef(0);
  // static propTypes = {
  //   estimatedItemSize: PropTypes.number,
  //   height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  //     .isRequired,
  //   itemCount: PropTypes.number.isRequired,
  //   itemSize: PropTypes.oneOfType([
  //     PropTypes.number,
  //     PropTypes.array,
  //     PropTypes.func
  //   ]).isRequired,
  //   onScroll: PropTypes.func,
  //   onItemsRendered: PropTypes.func,
  //   overscanCount: PropTypes.number,
  //   renderItem: PropTypes.func.isRequired,
  //   scrollOffset: PropTypes.number,
  //   scrollToIndex: PropTypes.number,
  //   scrollToAlignment: PropTypes.oneOf([
  //     ALIGNMENT.AUTO,
  //     ALIGNMENT.START,
  //     ALIGNMENT.CENTER,
  //     ALIGNMENT.END
  //   ]),
  //   scrollDirection: PropTypes.oneOf([
  //     DIRECTION.HORIZONTAL,
  //     DIRECTION.VERTICAL
  //   ]),
  //   stickyIndices: PropTypes.arrayOf(PropTypes.number),
  //   style: PropTypes.object,
  //   width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  // };

  const getSize = (
    index: number,
    itemSize: number | number[] | ((index: number) => number)
  ) => {
    if (typeof itemSize === "function") {
      return itemSize(index);
    }

    return Array.isArray(itemSize) ? itemSize[index] : itemSize;
  };

  const itemSizeGetter = (itemSize: Props["itemSize"]) => {
    return (index: number) => getSize(index, itemSize);
  };
  const getEstimatedItemSize = (props: Props /*props = this.props*/) => {
    return (
      props.estimatedItemSize ||
      (typeof props.itemSize === "number" && props.itemSize) ||
      50
    );
  };
  const sizeAndPositionManager = new SizeAndPositionManager({
    itemCount: props.itemCount,
    itemSizeGetter: itemSizeGetter(props.itemSize),
    estimatedItemSize: getEstimatedItemSize(props)
  });

  const getOffsetForIndex = (
    index: number,
    scrollToAlignment = props.scrollToAlignment,
    itemCount: number = props.itemCount
  ): number => {
    const { scrollDirection = DIRECTION.VERTICAL } = props;

    if (index < 0 || index >= itemCount) {
      index = 0;
    }

    return sizeAndPositionManager.getUpdatedOffsetForIndex({
      align: scrollToAlignment,
      containerSize: Number(props[sizeProp[scrollDirection]]),
      currentOffset: offset || 0,
      targetIndex: index
    });
  };

  const [state, setState] = useState({
    offset:
      props.scrollOffset ||
      (props.scrollToIndex != null && getOffsetForIndex(props.scrollToIndex)) ||
      0,
    scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
  });

  // const [offset, setOffset] = useState(
  //   props.scrollOffset ||
  //     (props.scrollToIndex != null && getOffsetForIndex(props.scrollToIndex)) ||
  //     0
  // );

  // const [scrollChangeReason, setScrollChangeReason] = useState(
  //   SCROLL_CHANGE_REASON.REQUESTED
  // );

  // const state: State = {
  //   offset:
  //     props.scrollOffset ||
  //     (props.scrollToIndex != null && getOffsetForIndex(props.scrollToIndex)) ||
  //     0,
  //   scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
  // };
  // const componentDidMount = () => {
  useEffect(() => {
    const { scrollOffset, scrollToIndex } = props;
    rootNodeRef.current!.addEventListener("scroll", handleScroll, {
      passive: true
    });

    if (scrollOffset != null) {
      scrollTo(scrollOffset);
    } else if (scrollToIndex != null) {
      scrollTo(getOffsetForIndex(scrollToIndex));
    }
    return () => {
      rootNodeRef.current!.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // const componentWillReceiveProps = (nextProps: Props) => {
  //   const {
  //     estimatedItemSize,
  //     itemCount,
  //     itemSize,
  //     scrollOffset,
  //     scrollToAlignment,
  //     scrollToIndex
  //   } = props;
  //   const scrollPropsHaveChanged =
  //     nextProps.scrollToIndex !== scrollToIndex ||
  //     nextProps.scrollToAlignment !== scrollToAlignment;
  //   const itemPropsHaveChanged =
  //     nextProps.itemCount !== itemCount ||
  //     nextProps.itemSize !== itemSize ||
  //     nextProps.estimatedItemSize !== estimatedItemSize;

  //   if (nextProps.itemSize !== itemSize) {
  //     sizeAndPositionManager.updateConfig({
  //       itemSizeGetter: itemSizeGetter(nextProps.itemSize)
  //     });
  //   }

  //   if (
  //     nextProps.itemCount !== itemCount ||
  //     nextProps.estimatedItemSize !== estimatedItemSize
  //   ) {
  //     sizeAndPositionManager.updateConfig({
  //       itemCount: nextProps.itemCount,
  //       estimatedItemSize: getEstimatedItemSize(nextProps)
  //     });
  //   }

  //   if (itemPropsHaveChanged) {
  //     recomputeSizes();
  //   }

  //   if (nextProps.scrollOffset !== scrollOffset) {
  //     setOffset(nextProps.scrollOffset || 0);
  //     setScrollChangeReason(SCROLL_CHANGE_REASON.REQUESTED);
  //   } else if (
  //     typeof nextProps.scrollToIndex === "number" &&
  //     (scrollPropsHaveChanged || itemPropsHaveChanged)
  //   ) {
  //     setOffset(
  //       getOffsetForIndex(
  //         nextProps.scrollToIndex,
  //         nextProps.scrollToAlignment,
  //         nextProps.itemCount
  //       )
  //     );
  //     setScrollChangeReason(SCROLL_CHANGE_REASON.REQUESTED);
  //   }
  // };

  useEffect(() => {
    const { itemSize } = props;
    sizeAndPositionManager.updateConfig({
      itemSizeGetter: itemSizeGetter(itemSize)
    });
    recomputeSizes();
  }, [props.itemSize]);

  useEffect(() => {
    const { itemCount } = props;

    sizeAndPositionManager.updateConfig({
      itemCount,
      estimatedItemSize: getEstimatedItemSize(props)
    });

    recomputeSizes();

    forceUpdate();
  }, [props.itemCount, props.stickyIndices]);

  useEffect(() => {
    // const { scrollToIndex, scrollToAlignment, itemCount } = props;
    // const scrollPropsHaveChanged = true;
    // const itemPropsHaveChanged = false;

    if (typeof scrollToIndex === "number") {
      setState({
        offset: getOffsetForIndex(scrollToIndex, scrollToAlignment, itemCount),
        scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
      });
    }
  }, [props.scrollToIndex, props.scrollToAlignment]);

  // const componentDidUpdate = (_: Props, prevState: State) => {
  //   // const { offset, scrollChangeReason } = state;

  //   if (
  //     prevState.offset !== offset &&
  //     scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED
  //   ) {
  //     scrollTo(offset);
  //   }
  // };

  useEffect(() => {
    const { offset, scrollChangeReason } = state;
    if (scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED) {
      scrollTo(offset);
    }
  }, [state.offset]);

  const scrollTo = (value: number) => {
    const { scrollDirection = DIRECTION.VERTICAL } = props;

    rootNodeRef.current![scrollProp[scrollDirection]] = value;
  };

  const recomputeSizes = (startIndex = 0) => {
    styleCacheRef.current = {};
    sizeAndPositionManager.resetItem(startIndex);
  };

  // const getRef = (node: HTMLDivElement): void => {
  //   rootNode = node;
  // };

  const handleScroll = (event: Event) => {
    const { onScroll } = props;
    const offset = getNodeOffset();

    if (
      offset < 0 ||
      //   state.offset === offset ||
      event.target !== rootNodeRef.current
    ) {
      return;
    }

    setState({
      offset,
      scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED
    });

    if (typeof onScroll === "function") {
      onScroll(offset, event);
    }
  };

  const getNodeOffset = () => {
    const { scrollDirection = DIRECTION.VERTICAL } = props;

    return rootNodeRef.current![scrollProp[scrollDirection]];
  };

  const getStyle = (index: number, sticky: boolean) => {
    const style = styleCacheRef.current[index];

    if (style) {
      return style;
    }

    const { scrollDirection = DIRECTION.VERTICAL } = props;
    const { size, offset } = sizeAndPositionManager.getSizeAndPositionForIndex(
      index
    );

    return (styleCacheRef.current[index] = sticky
      ? {
          ...STYLE_STICKY_ITEM,
          [sizeProp[scrollDirection]]: size,

          // [positionProp[scrollDirection]]: offset,
          [marginProp[scrollDirection]]: offset,
          [oppositeMarginProp[scrollDirection]]: -(offset + size),
          zIndex: 1
        }
      : {
          ...STYLE_ITEM,
          [sizeProp[scrollDirection]]: size,
          [positionProp[scrollDirection]]: offset
        });
  };
  // render() {
  const {
    estimatedItemSize,
    height,
    overscanCount = 3,
    renderItem,
    itemCount,
    itemSize,
    onItemsRendered,
    onScroll,
    scrollDirection = DIRECTION.VERTICAL,
    scrollOffset,
    scrollToIndex,
    scrollToAlignment,
    stickyIndices,
    style,
    width,
    ...rest
  } = props;

  if (itemCountRef.current !== itemCount) {
    sizeAndPositionManager.updateConfig({
      itemCount,
      estimatedItemSize: getEstimatedItemSize(props)
    });

    recomputeSizes();
    itemCountRef.current = itemCount;
  }
  const { offset } = state;
  const { start, stop } = sizeAndPositionManager.getVisibleRange({
    containerSize: Number(props[sizeProp[scrollDirection]]) || 0,
    offset,
    overscanCount
  });
  const items: React.ReactNode[] = [];
  const wrapperStyle = { ...STYLE_WRAPPER, ...style, height, width };
  const innerStyle = {
    ...STYLE_INNER,
    [sizeProp[scrollDirection]]: sizeAndPositionManager.getTotalSize()
  };

  if (stickyIndices != null && stickyIndices.length !== 0) {
    stickyIndices.forEach((index: number) =>
      items.push(
        renderItem({
          index,
          style: getStyle(index, true)
        })
      )
    );

    if (scrollDirection === DIRECTION.HORIZONTAL) {
      innerStyle.display = "flex";
    }
  }

  if (typeof start !== "undefined" && typeof stop !== "undefined") {
    for (let index = start; index <= stop; index++) {
      if (stickyIndices != null && stickyIndices.includes(index)) {
        continue;
      }

      items.push(
        renderItem({
          index,
          style: getStyle(index, false)
        })
      );
    }

    if (typeof onItemsRendered === "function") {
      onItemsRendered({
        startIndex: start,
        stopIndex: stop
      });
    }
  }

  return (
    <div ref={rootNodeRef} {...rest} style={wrapperStyle}>
      <div style={innerStyle}>{items}</div>
    </div>
  );
}

VirtualList.defaultProps = {
  overscanCount: 3,
  scrollDirection: DIRECTION.VERTICAL,
  width: "100%"
};

export default VirtualList;
