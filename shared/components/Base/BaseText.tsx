import * as React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { FontFamily, MobileFontSize, MobileLineHeight, WebFontSize, WebLineHeight } from 'shared/styles/fonts';
import { TypographyProps } from 'shared/styles/props';
import { isWeb } from 'shared/styles/utils';
export interface BaseTextProps extends TypographyProps {
  textSize?: TextSize;
  style?: StyleProp<TextStyle> & StyleProp<ViewStyle> | React.CSSProperties;
  children: any;
}

const BaseText = (props: BaseTextProps) => {
  const { bold, color, align, children, fontFamily, style } = props;
  const fontWeight = bold ? '700' : '400';

  const textSize: any = props.textSize ? props.textSize : TextSize.H4;
  const fontSize = isWeb() ? WebFontSize[textSize] : MobileFontSize[textSize];
  const lineHeight = isWeb() ? WebLineHeight[textSize] : MobileLineHeight[textSize];

  const incomingStyles = {
    textAlign: align, fontWeight, color, fontSize, lineHeight, fontFamily, letterSpacing: -0.1 };

  return (
    <Text style={ [ styles.container, incomingStyles, style ] }>
      { children }
    </Text>
  );
};

BaseText.defaultProps = {
  bold: false,
  color: Color.APP_BLACK,
  fontFamily: FontFamily.base,
  align: TextAlign.DEFAULT,
  hoverable: false,
};

const styles = StyleSheet.create({
  container: { },
});

export default BaseText;
