import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Direction } from 'shared/styles';
import { ViewProps } from 'shared/styles/props';
import { isWeb } from 'shared/styles/utils';
import { MobilePadding, WebPadding } from 'shared/styles/views';

interface Props extends ViewProps {
  style?: StyleProp<ViewStyle> & React.CSSProperties;
  children: React.ReactChild | React.ReactChild[];
}

const BaseView = (props: Props) => {
  const {
    padding,
    paddingBottom,
    paddingHorizontal,
    paddingTop,
    paddingLeft,
    paddingRight,
    paddingVertical,
    flexX,
    flexY,
    style,
    children,
    direction,
    wrap,
  } = props;

  const viewStyle: any = { };
  const defaultPadding = isWeb() ? WebPadding.VIEW : MobilePadding.VIEW;

  if (padding !== undefined) {
    viewStyle.paddingLeft = typeof padding === 'boolean' ? defaultPadding : padding;
    viewStyle.paddingRight = typeof padding === 'boolean' ? defaultPadding : padding;
    viewStyle.paddingTop = typeof padding === 'boolean' ? defaultPadding : padding;
    viewStyle.paddingBottom = typeof padding === 'boolean' ? defaultPadding : padding;
  }

  if (paddingHorizontal !== undefined) {
    viewStyle.paddingLeft = typeof paddingHorizontal === 'boolean' ? defaultPadding : paddingHorizontal;
    viewStyle.paddingRight = typeof paddingHorizontal === 'boolean' ? defaultPadding : paddingHorizontal;
  }

  if (paddingVertical !== undefined) {
    viewStyle.paddingTop = typeof paddingVertical === 'boolean' ? defaultPadding : paddingVertical;
    viewStyle.paddingBottom = typeof paddingVertical === 'boolean' ? defaultPadding : paddingVertical;
  }

  paddingLeft !== undefined ?
    (viewStyle.paddingLeft = typeof paddingLeft === 'boolean' ? defaultPadding : paddingLeft) : null;
  paddingRight !== undefined ?
    (viewStyle.paddingRight = typeof paddingRight === 'boolean' ? defaultPadding : paddingRight) : null;
  paddingTop !== undefined ?
    (viewStyle.paddingTop = typeof paddingTop === 'boolean' ? defaultPadding : paddingTop) : null;
  paddingBottom !== undefined ?
    (viewStyle.paddingBottom = typeof paddingBottom === 'boolean' ? defaultPadding : paddingBottom) : null;

  if (direction) {
    viewStyle.flexDirection = direction;
  } else {
    viewStyle.flexDirection = isWeb() ? 'row' : 'column';
  }

  if (viewStyle.flexDirection === Direction.ROW) {
    if (flexX) {
      viewStyle.justifyContent = flexX;
      viewStyle.flex = 1;
    }
    if (flexY) {
      viewStyle.alignItems = flexY;
      viewStyle.flex = 1;
    }
  } else if (viewStyle.flexDirection === Direction.COLUMN) {
    if (flexX) {
      viewStyle.alignItems = flexX;
      viewStyle.flex = 1;
    }
    if (flexY) {
      viewStyle.justifyContent = flexY;
      viewStyle.flex = 1;
    }
  }

  if (wrap) {
    viewStyle.flexWrap = 'wrap';
  } else {
    viewStyle.flexWrap = 'nowrap';
  }

  return (
    <View style={ [ styles.container, viewStyle, style ] }>
      { children }
    </View>
  );
};

BaseView.defaultProps = {

};

const styles = StyleSheet.create({
  container: {  },
});

export default BaseView;
