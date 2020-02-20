import * as React from 'react';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { FontFamily, WebFontSize, WebLineHeight } from 'shared/styles/fonts';
import { TypographyProps } from 'shared/styles/props';

export interface Props extends TypographyProps {
  textSize?: TextSize;
  style?: React.CSSProperties;
  children: any;
}

const BaseText = (props: Props) => {
  const { bold, color, align, children, fontFamily, style } = props;
  const fontWeight = bold ? 'bold' as 'bold' : 'normal' as 'normal';

  const textSize: any = props.textSize ? props.textSize : TextSize.H4;
  const fontSize = WebFontSize[textSize];
  const lineHeight = WebLineHeight[textSize];

  const incomingStyles = {
    textAlign: align,
    fontWeight,
    color,
    fontSize,
    lineHeight: `${lineHeight}px`,
    fontFamily,
    letterSpacing: -0.1,
    wordBreak: 'break-word' as 'break-word',
  };

  return (
    <span style={ { ...styles.container, ...incomingStyles, ...style } }>
      { children }
    </span>
  );
};

BaseText.defaultProps = {
  bold: false,
  color: Color.APP_BLACK,
  fontFamily: FontFamily.base,
  align: TextAlign.DEFAULT,
  hoverable: false,
};

const styles = {
  container: { },
};

export default BaseText;
