import * as React from 'react';
import { useRef } from 'react';
import { ItemSize } from './SizeAndPositionManager';
import { ALIGNMENT, DIRECTION } from './constants';

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

export interface ItemInfo {
  index: number;
  style: ItemStyle;
}

export interface RenderedRows {
  startIndex: number;
  stopIndex: number;
}
import { useResizeObserver } from '@ishikawa_masashi/react-hooks';
import VirtualList from './VirtualList';

export interface Props {
  className?: string;
  estimatedItemSize?: number;
  itemCount: number;
  itemSize: ItemSize;
  overscanCount?: number;
  scrollOffset?: number;
  scrollToIndex?: number;
  scrollToAlignment?: ALIGNMENT;
  scrollDirection?: DIRECTION;
  stickyIndices?: number[];
  style?: React.CSSProperties;
  onItemsRendered?({ startIndex, stopIndex }: RenderedRows): void;
  onScroll?(offset: number, event: Event): void;
  renderItem(itemInfo: ItemInfo): React.ReactNode;
}

export default function VirtualListContainer(props: Props) {
  const fillStyle = { width: '100%', height: '100%' };

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, height] = useResizeObserver(containerRef);

  return (
    <div style={fillStyle} ref={containerRef}>
      <VirtualList width={width} height={height} {...props} />
    </div>
  );
}
