import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Direction, FlexX, FlexY, TextAlign } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { HoverColors } from 'web/src/styles';

export interface TypographyProps {
  bold?: boolean;
  fontSize?: number;
  lineHeight?: number;
  color?: Color;
  align?: TextAlign;
  fontFamily?: string;
}

export interface ViewProps {
  padding?: boolean | number;
  paddingTop?: boolean | number;
  paddingBottom?: boolean | number;
  paddingLeft?: boolean | number;
  paddingRight?: boolean | number;
  paddingHorizontal?: boolean | number;
  paddingVertical?: boolean | number;
  direction?: Direction;
  flexX?: FlexX;
  flexY?: FlexY;
  wrap?: boolean;
}

export interface WebProps {
  onMouseOut?: () => void;
  onMouseOver?: () => void;
  hoverColors?: HoverColors;
  hoverIcon?: React.ReactNode | null;
}

export interface ReactCollapsibleProps {
  paddingHeight: number;
  translateY: number;
  translateOpacity: number;
  animatedY: number;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export interface PaginatedListProps {
  refetch?: any;
  refreshing?: boolean;
  onLoadMore: () => void;
  hasMore?: boolean;
}
