import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Color } from 'shared/styles/colors';

interface Props {
  height: number;
  color: Color;
  style?: StyleProp<ViewStyle>;
}

const BaseLine = (props: Props) => {

  const { height, color, style } = props;

  return (
    <View style={ [ styles.container, { height, backgroundColor: color, width: '100%' }, style ] } />
  );

};

BaseLine.defaultProps = {
  height: 1,
  color: Color.LINE_GRAY,

};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default BaseLine;
