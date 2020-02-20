import { Color } from 'shared/styles/colors';

export enum ViewHeights {
  HEADER = 60,
}

export enum ViewWidths {
  SITE = 720,
  MODAL = 500,
  USER_MENU = 285,
  CLAIM_MENU = 200,
  ARGUMENT_MENU = 200,
}

export interface HoverColors {
  hoverText: Color;
  hoverBackground: Color;
  regularText: Color;
  regularBackground: Color;
}
