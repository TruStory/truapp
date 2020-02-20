import * as React from 'react';
import BaseView from 'shared/components/Base/BaseView';
import { Color } from 'shared/styles/colors';
import { isWeb } from 'shared/styles/utils';
import { MobileMargin, MobileRadius, WebMargin, WebRadius } from 'shared/styles/views';

export enum CardOption {
  NONE=0,
  AROUND=1,
  TOP=2,
  BOTTOM=3,
}

export enum CardHeight {
  FITCONTENT=0,
  FILLAVAILABLESPACE=1,
}

interface Props {
  children: any;
  style?: any;
  radius: CardOption | number;
  height: CardHeight | number;
  shadow: CardOption;
  margin: CardOption;
  backgroundColor: Color;
  borderColor: Color;
}

const BaseCard = (props: Props) => {

  const { children, style, radius, height, shadow, backgroundColor, margin, borderColor } = props;

  let cardStyle: any= { backgroundColor, borderWidth: 1, borderColor };
  height === CardHeight.FILLAVAILABLESPACE ? cardStyle.flex = 1 : null;

  const defaultRadius = isWeb() ? WebRadius.CARD : MobileRadius.CARD;
  const defaultMargin = isWeb() ? WebMargin.CARD : MobileMargin.CARD;

  switch (radius){
    case CardOption.AROUND:
      cardStyle.borderRadius = defaultRadius;
      break;
    case CardOption.BOTTOM:
      cardStyle.borderBottomLeftRadius = defaultRadius;
      cardStyle.borderBottomRightRadius = defaultRadius;
      break;
    case CardOption.TOP:
      cardStyle.borderTopLeftRadius = defaultRadius;
      cardStyle.borderTopRightRadius = defaultRadius;
      break;
  }

  switch (margin){
    case CardOption.AROUND:
      cardStyle.margin = defaultMargin;
      break;
    case CardOption.BOTTOM:
      cardStyle.marginBottom = defaultMargin;
      break;
    case CardOption.TOP:
      cardStyle.marginTop = defaultMargin;
      break;
  }

  switch (shadow){
    case CardOption.AROUND:
      cardStyle = {
        ...cardStyle,
        shadowRadius: 25,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.125,
        shadowColor: Color.APP_BLACK,
      };
      break;
    case CardOption.TOP:
      // cardStyle = { ...cardStyle, ...topShadow };
      break;
    case CardOption.BOTTOM:
      break;
  }

  return (
    <BaseView padding={ true } style={ { ...cardStyle, ...style } }>
      { children }
    </BaseView>
  );
};

BaseCard.defaultProps = {
  backgroundColor: Color.WHITE,
  radius: CardOption.AROUND,
  shadow: CardOption.NONE,
  margin: CardOption.AROUND,
  height: CardHeight.FITCONTENT,
  borderColor: Color.TRANSPARENT,
};

export default BaseCard;
