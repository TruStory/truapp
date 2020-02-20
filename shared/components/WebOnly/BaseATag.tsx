import * as React from 'react';
import { View } from 'react-native';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { FontFamily } from 'shared/styles/fonts';
import { TypographyProps } from 'shared/styles/props';

interface Props extends TypographyProps {
  textSize?: TextSize;
  href?: string;
  appLink?: string;
  target?: string;
  style?: React.CSSProperties;
  children: any;
  underline?: boolean;
}

const BaseATag = (props: Props) => {
  const { children } = props;
  return (
      <View>
        { children }
      </View>
  );
};

BaseATag.defaultProps = {
  bold: false,
  color: Color.APP_BLACK,
  fontFamily: FontFamily.base,
  align: TextAlign.DEFAULT,
  underline: false,
};

export default BaseATag;
