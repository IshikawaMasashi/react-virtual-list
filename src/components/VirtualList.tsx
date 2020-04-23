import * as React from 'react';
import { useRef, useState, useEffect, useMemo, CSSProperties } from 'react';
import SizeAndPositionManager, { ItemSize } from './SizeAndPositionManager';
import {
  ALIGNMENT,
  DIRECTION,
  SCROLL_CHANGE_REASON,
  marginProp,
  oppositeMarginProp,
  positionProp,
  scrollProp,
  sizeProp,
} from './constants';

export { DIRECTION as ScrollDirection } from './constants';

export type ItemPosition = 'absolute' | 'sticky';

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

const STYLE_WRAPPER: CSSProperties = {
  overflow: 'auto',
  willChange: 'transform',
  WebkitOverflowScrolling: 'touch',
};

const STYLE_INNER: CSSProperties = {
  position: 'relative',
  width: '100%',
  minHeight: '100%',
};

const STYLE_ITEM: {
  position: ItemStyle['position'];
  top: ItemStyle['top'];
  left: ItemStyle['left'];
  width: ItemStyle['width'];
} = {
  position: 'absolute' as ItemPosition,
  top: 0,
  left: 0,
  width: '100%',
};

const STYLE_STICKY_ITEM = {
  ...STYLE_ITEM,
  position: 'sticky' as ItemPosition,
};

export default function VirtualList(props: Props) {
  const {
    estimatedItemSize,
    height,
    itemCount,
    itemSize,
    onItemsRendered,
    onScroll,
    overscanCount = 3,
    renderItem,
    scrollDirection = DIRECTION.VERTICAL,
    scrollOffset,
    scrollToAlignment,
    scrollToIndex,
    stickyIndices,
    style,
    width = '100%',
    ...rest
  } = props;

  const useForceUpdate = () => {
    const [, setState] = useState();
    return () => setState({});
  };

  const forceUpdate = useForceUpdate();

  const rootNodeRef = useRef<HTMLDivElement>(null);
  const styleCacheRef = useRef<StyleCache>({});

  const itemCountRef = useRef(0);

  const getSize = (index: number, itemSize: ItemSize) => {
    if (typeof itemSize === 'function') {
      return itemSize(index);
    }

    return Array.isArray(itemSize) ? itemSize[index] : itemSize;
  };

  const itemSizeGetter = (itemSize: Props['itemSize']) => {
    return (index: number) => getSize(index, itemSize);
  };

  const getEstimatedItemSize = () => {
    return (
      estimatedItemSize || (typeof itemSize === 'number' && itemSize) || 50
    );
  };
  const sizeAndPositionManager = new SizeAndPositionManager({
    itemCount: itemCount,
    itemSizeGetter: itemSizeGetter(itemSize),
    estimatedItemSize: getEstimatedItemSize(),
  });

  const getOffsetForIndex = (
    index: number,
    newScrollToAlignment = scrollToAlignment,
    newItemCount = itemCount
  ): number => {
    if (index < 0 || index >= newItemCount) {
      index = 0;
    }

    return sizeAndPositionManager.getUpdatedOffsetForIndex({
      align: newScrollToAlignment,
      containerSize: Number(props[sizeProp[scrollDirection]]),
      currentOffset: offset || 0,
      targetIndex: index,
    });
  };

  const [offset, setOffset] = useState(
    scrollOffset ||
      (scrollToIndex != null && getOffsetForIndex(scrollToIndex)) ||
      0
  );
  const [scrollChangeReason, setScrollChangeReason] = useState(
    SCROLL_CHANGE_REASON.REQUESTED
  );

  const scrollTo = (value: number) => {
    if (rootNodeRef.current) {
      rootNodeRef.current[scrollProp[scrollDirection]] = value;
    }
  };

  const getNodeOffset = () => {
    if (rootNodeRef.current) {
      return rootNodeRef.current[scrollProp[scrollDirection]];
    }
    return 0;
  };

  // const handleScroll = (event: Event) => {
  //   const offset = getNodeOffset();

  //   if (
  //     offset < 0 ||
  //     //   state.offset === offset ||
  //     event.target !== rootNodeRef.current
  //   ) {
  //     return;
  //   }

  //   // setState({
  //   //   offset,
  //   //   scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED
  //   // });
  //   setScrollChangeReason(SCROLL_CHANGE_REASON.OBSERVED);
  //   setOffset(offset);

  //   if (typeof onScroll === "function") {
  //     onScroll(offset, event);
  //   }
  // };
  const handleScroll = (event: Event) => {
    const newOffset = getNodeOffset();

    // newOffsetが0のとき、itemが表示されない
    if (
      newOffset < 0 ||
      // newOffset === offset ||
      event.target !== rootNodeRef.current
    ) {
      return;
    }

    // setState({
    //   offset,
    //   scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED
    // });
    setScrollChangeReason(SCROLL_CHANGE_REASON.OBSERVED);
    setOffset(newOffset);

    if (typeof onScroll === 'function') {
      onScroll(newOffset, event);
    }
  };

  useEffect(() => {
    if (rootNodeRef.current) {
      rootNodeRef.current.addEventListener('scroll', handleScroll, {
        passive: true,
      });
    }
    if (scrollOffset != null) {
      scrollTo(scrollOffset);
    } else if (scrollToIndex != null) {
      scrollTo(getOffsetForIndex(scrollToIndex));
    }
    return () => {
      if (rootNodeRef.current) {
        rootNodeRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const recomputeSizes = (startIndex = 0) => {
    styleCacheRef.current = {};
    sizeAndPositionManager.resetItem(startIndex);
  };

  useEffect(() => {
    sizeAndPositionManager.updateConfig({
      itemSizeGetter: itemSizeGetter(itemSize),
    });
    recomputeSizes();
  }, [itemSize, recomputeSizes, itemSizeGetter, sizeAndPositionManager]);

  useEffect(() => {
    setScrollChangeReason(SCROLL_CHANGE_REASON.REQUESTED);
    setOffset(scrollOffset || 0);
  }, [scrollOffset]);

  useEffect(() => {
    sizeAndPositionManager.updateConfig({
      itemCount,
      estimatedItemSize: getEstimatedItemSize(),
    });

    recomputeSizes();

    forceUpdate();
  }, [itemCount, stickyIndices]);

  useEffect(() => {
    // const scrollPropsHaveChanged = true;
    // const itemPropsHaveChanged = false;

    if (typeof scrollToIndex === 'number') {
      setOffset(getOffsetForIndex(scrollToIndex, scrollToAlignment, itemCount));
      setScrollChangeReason(SCROLL_CHANGE_REASON.REQUESTED);
      // setState({
      //   offset: getOffsetForIndex(scrollToIndex, scrollToAlignment, itemCount),
      //   scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
      // });
    }
  }, [scrollToIndex, scrollToAlignment]);

  useEffect(() => {
    if (scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED) {
      scrollTo(offset);
    }
  }, [offset]);

  const getStyle = (index: number, sticky: boolean) => {
    const style = styleCacheRef.current[index];

    if (style) {
      return style;
    }

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
          zIndex: 1,
        }
      : {
          ...STYLE_ITEM,
          [sizeProp[scrollDirection]]: size,
          [positionProp[scrollDirection]]: offset,
        });
  };

  if (itemCountRef.current !== itemCount) {
    sizeAndPositionManager.updateConfig({
      itemCount,
      estimatedItemSize: getEstimatedItemSize(),
    });

    recomputeSizes();
    itemCountRef.current = itemCount;
  }
  const { start, stop } = sizeAndPositionManager.getVisibleRange({
    containerSize: Number(props[sizeProp[scrollDirection]]) || 0,
    offset,
    overscanCount,
  });
  // const items: React.ReactNode[] = [];

  const innerStyle = {
    ...STYLE_INNER,
    [sizeProp[scrollDirection]]: sizeAndPositionManager.getTotalSize(),
  };

  const items = useMemo(() => {
    const result: React.ReactNode[] = [];
    if (stickyIndices != null && stickyIndices.length !== 0) {
      stickyIndices.forEach((index: number) =>
        result.push(
          renderItem({
            index,
            style: getStyle(index, true),
          })
        )
      );

      if (scrollDirection === DIRECTION.HORIZONTAL) {
        innerStyle.display = 'flex';
      }
    }

    if (typeof start !== 'undefined' && typeof stop !== 'undefined') {
      for (let index = start; index <= stop; index++) {
        if (stickyIndices != null && stickyIndices.includes(index)) {
          continue;
        }

        result.push(
          renderItem({
            index,
            style: getStyle(index, false),
          })
        );
      }

      if (typeof onItemsRendered === 'function') {
        onItemsRendered({
          startIndex: start,
          stopIndex: stop,
        });
      }
    }
    return result;
  }, [
    start,
    stop,
    getStyle,
    renderItem,
    scrollDirection,
    innerStyle.display,
    stickyIndices,
    onItemsRendered,
  ]);

  const wrapperStyle = { ...STYLE_WRAPPER, ...style, height, width };

  return (
    <div ref={rootNodeRef} {...rest} style={wrapperStyle}>
      <div style={innerStyle}>{items}</div>
    </div>
  );
}
