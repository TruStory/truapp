import React, { CSSProperties } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { LeaderboardMetricFilters } from 'shared/types/leaderboard';

export interface LeaderboardMetricFilterProps {
  style?: StyleProp<ViewStyle> & CSSProperties;
  onChange: (feedFilter: LeaderboardMetricFilters) => void;
  value: LeaderboardMetricFilters;
}

const LeaderboardMetricFilterComponent = (props: LeaderboardMetricFilterProps) => {
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

export default LeaderboardMetricFilterComponent;
