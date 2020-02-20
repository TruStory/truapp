import * as React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity } from 'react-native';
import { TruTipText } from 'shared/components/WebOnly/TruTip';

export interface BaseActionableProps {
  onAction: () => void;
  onHover?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  disabled?: boolean;
  children: any;
  style?: StyleProp<any> & React.CSSProperties;
  tip?: TruTipText;
  className?: string;
  delayPressIn?: number;
}

const BaseActionable = (props: BaseActionableProps) => {
  const {
    onAction,
    style,
    disabled,
    children,
    delayPressIn,
  } = props;

  return (
    <TouchableOpacity disabled={ disabled } onPress={ onAction } style={ [ styles.container, style ] } delayPressIn={ delayPressIn || 0 }>
      { children }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {  },
});

export default BaseActionable;
