import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView, { IconFamily } from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { LeaderboardDateFilter, LeaderboardDateFilters } from 'shared/types/leaderboard';
import { leaderboardDateFilters } from 'shared/utils/leaderboard';

interface Props {
  style?: StyleProp<ViewStyle>;
  onChange: (dateFilter: LeaderboardDateFilters) => void;
  value: LeaderboardDateFilters;
}

const LeaderboardDateOptions = (props: Props) => {

  const { onChange, value, style } = props;

  const listJsx: React.ReactNode[] = [];
  leaderboardDateFilters.map((dateFilter: LeaderboardDateFilter) => {
    listJsx.push(
      <BaseActionable style={ styles.option } onAction={ () => onChange(dateFilter.id) }>
        <View style={ { flexDirection: 'column', flex: 1 } }>
          <BaseText textSize={ TextSize.H4 } color={ Color.APP_BLACK }>{ dateFilter.name }</BaseText>
        </View>
        <BaseIconView
          name={ value === dateFilter.id ? 'check-circle' : 'radio-button-unchecked' }
          color={ value === dateFilter.id ? Color.APP_PURPLE : Color.APP_BLACK }
          family={ IconFamily.MATERIAL }
        />
      </BaseActionable>,
      );
  });

  return (
    <View style={ [ styles.container, style ] }>
      { listJsx }
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: Whitespace.LARGE },
});

export default LeaderboardDateOptions;
