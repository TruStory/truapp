import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Color } from 'shared/styles/colors';

interface Props {
  children: any;
  backgroundColor: Color;
  style?: StyleProp<ViewStyle>;
}

const FloatingSheet = (props: Props) => {
  const { children, style, backgroundColor } = props;

  return (
    <View style={ [ styles.bottomContainer, { backgroundColor }, style ] }>
      { children }
    </View>
  );
};

FloatingSheet.defaultProps = {
  backgroundColor: Color.APP_BLACK,
};

const styles = StyleSheet.create({
  bottomContainer: {
    alignItems: 'center',
    zIndex: 10000,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 1.0,
    shadowColor: Color.APP_BLACK,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 5,
  },
});

export default FloatingSheet;
