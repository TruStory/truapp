import React, { CSSProperties } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { LeaderboardDateFilters } from 'shared/types/leaderboard';

export interface LeaderboardDateFilterProps {
  style?: StyleProp<ViewStyle> & CSSProperties;
  onChange: (feedFilter: LeaderboardDateFilters) => void;
  value: LeaderboardDateFilters;
}

const LeaderboardDateFilterComponent = (props: LeaderboardDateFilterProps) => {
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

export default LeaderboardDateFilterComponent;
