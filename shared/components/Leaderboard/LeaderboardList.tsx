import * as React from 'react';
import { FlatList, ListRenderItemInfo, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import AppAccountInfo from 'shared/components/AppAccount/AppAccountInfo';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign } from 'shared/styles';
import { Whitespace } from 'shared/styles/views';
import { LeaderboardMetricFilters, TopUser } from 'shared/types/leaderboard';
import { Settings } from 'shared/types/settings';

interface Props {
  users: TopUser[];
  settings: Settings;
  metric: LeaderboardMetricFilters;
  style?: StyleProp<ViewStyle>;
}

const LeaderboardList = (props: Props) => {
  const { style, users, metric, settings } = props;

  const renderUser = (rowData: ListRenderItemInfo<TopUser>) => {
    let item1, item2 = '';

    const renderMetric = () => {
      if (metric === LeaderboardMetricFilters.TRU_EARNED ) {
        item1 = rowData.item.earned.humanReadable;
        item2 = settings.stakeDisplayDenom;
      } else if (metric === LeaderboardMetricFilters.AGREES_GIVEN) {
        item1 = rowData.item.agreesGiven;
        item2 = `Agrees`;
      } else {
        item1 = rowData.item.agreesReceived;
        item2 = `Agrees`;
      }

      return (
        <React.Fragment>
          <BaseText bold={ true }>{ item1 } </BaseText>
          <BaseText>{ item2 }</BaseText>
        </React.Fragment>
      );
    };

    return (
      <View style={ { flexDirection: 'row', marginVertical: Whitespace.MEDIUM } }>
        <BaseText
          bold={ true }
          style={ { width: Whitespace.LARGE * 2, marginRight: Whitespace.CONTAINER } }
          align={ TextAlign.CENTER }
        >
          { rowData.index + 1 }
        </BaseText>
        <View style={ { flexDirection: 'row', justifyContent: 'space-between', flex: 1 } }>
          <AppAccountInfo appAccount={ rowData.item.account } bold={ false } />
          <BaseText style={ { width: 150 } } align={ TextAlign.LEFT }>
            { renderMetric() }
          </BaseText>
        </View>
      </View>
    );
  };

  const keyExtractor = (item: TopUser, index: number) => index.toString();

  return (
    <View style={ [ styles.container, style ] }>
      <FlatList
        keyExtractor={ keyExtractor }
        data={ users }
        renderItem={ renderUser }
      />
    </View>
  );

};

const styles = StyleSheet.create({
  container: { },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(LeaderboardList);

