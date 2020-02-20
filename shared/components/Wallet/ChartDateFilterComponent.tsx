import React, { CSSProperties } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { ChartDateFilters } from 'shared/types/wallet';

export interface ChartDateFilterProps {
  style?: StyleProp<ViewStyle> & CSSProperties;
  onChange: (feedFilter: ChartDateFilters) => void;
  value: ChartDateFilters;
}

const ChartDateFilterComponent = (props: ChartDateFilterProps) => {
  const { style } = props;

  return (
    <View style={ [ styles.container, style ] }>
      <BaseText>Filter</BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { display: 'flex', alignItems: 'center' },
});

export default ChartDateFilterComponent;
