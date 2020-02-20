import * as React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { ViewProps, WebProps } from 'shared/styles/props';
import { Whitespace } from 'shared/styles/views';

export interface BaseButtonProps extends ViewProps, WebProps {
  title: string;
  onAction?: () => void;
  disabled?: boolean;
  width: number | string;
  height: number | string;
  style?: StyleProp<any> & React.CSSProperties;
  textStyle?: StyleProp<any> & React.CSSProperties;
  outline?: boolean;
  icon?: React.ReactNode | null;
  iconAlign?: 'left' | 'right';
  disabledIcon?: React.ReactNode;
  color: Color;
  accentColor?: Color;
  borderRadius?: number;
  textSize: TextSize;
  textAlign?: TextAlign;
  bold?: boolean;
  className?: string;
  hoverTitle?: string;
}

const BaseButton = (props: BaseButtonProps) => {
  const {
    icon,
    title,
    disabled,
    width,
    color,
    accentColor,
    outline,
    disabledIcon,
    height,
    onAction,
    style,
    textSize,
    borderRadius,
    textAlign,
    bold,
    hoverColors,
    textStyle,
    iconAlign,
  } = props;

  let internalStyle: StyleProp<any> = { width, height, borderRadius };
  const titleColor = disabled ? Color.LIGHT_GRAY : ( hoverColors ? hoverColors.regularText : color);

  if (outline) {
    internalStyle.borderColor = disabled ? Color.DISABLED_BUTTON : ( hoverColors ? hoverColors.regularBackground : accentColor);
    internalStyle.borderWidth = 1;
  } else {
    internalStyle.backgroundColor = disabled ? Color.DISABLED_BUTTON : ( hoverColors ? hoverColors.regularBackground : accentColor);
  }

  if (textAlign) {
    if (textAlign === 'left') {
      internalStyle.textAlign = 'left';
      internalStyle.justifyContent = 'flex-start';
    }
    else if (textAlign === 'right') {
      internalStyle.textAlign = 'right';
      internalStyle.justifyContent = 'flex-end';
    }
    else {
      internalStyle.textAlign = 'center';
      internalStyle.justifyContent = 'center';
    }
  }

  const renderIconAndText = () => {
    if (iconAlign === 'left') {
      return (
        <React.Fragment>
          { disabled ? (disabledIcon ? disabledIcon : null) : (icon ? icon : null) }
          <BaseText color={ titleColor } textSize={ textSize } bold={ bold } style={ textStyle }>{ title }</BaseText>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <BaseText color={ titleColor } textSize={ textSize } bold={ bold } style={ textStyle }>{ title }</BaseText>
        { disabled ? (disabledIcon ? disabledIcon : null) : (icon ? icon : null) }
      </React.Fragment>
    );
  };

  if (onAction) {
    return (
      <TouchableOpacity disabled={ disabled } onPress={ onAction } style={ [ styles.container, internalStyle, style ] }>
        { renderIconAndText() }
      </TouchableOpacity>
    );
  }

  return (
    <View style={ [ styles.container, internalStyle, style ] }>
      { renderIconAndText() }
    </View>
  );
};

BaseButton.defaultProps = {
  width: 150,
  height: 44,
  outline: true,
  color: Color.APP_BLACK,
  accentColor: Color.APP_BLACK,
  borderRadius: Whitespace.LARGE + 2,
  textSize: TextSize.H4,
  textAlign: TextAlign.CENTER,
  bold: false,
  iconAlign: 'left',
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Whitespace.LARGE,
    borderRadius: Whitespace.TINY,
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default BaseButton;
