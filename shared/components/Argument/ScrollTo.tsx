import React from 'react';
import { StyleProp, StyleSheet, View } from 'react-native';
import { ID } from 'shared/types';

export interface ScrollToProps {
  selectedId?: ID;
  id: ID;
  container: any;
  children: React.ReactNode | React.ReactNode[];
  style?: StyleProp<any> & React.CSSProperties;
}

const ScrollTo = (props: ScrollToProps) => {
  const { style, children } = props;

  return (
    <View style={ [ styles.container, style ] }>{ children }</View>
  );

};

const styles = StyleSheet.create({
  container: { },
});

export default ScrollTo;
