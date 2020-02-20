import LeaderboardTabComponent from 'mobile/src/components/Leaderboard/LeaderboardTabComponent';
import { headerStyles } from 'mobile/src/styles';
import * as React from 'react';
import { Dimensions, View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import ActionSheet from 'shared/components/ActionSheets/ActionSheet';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseText from 'shared/components/Base/BaseText';
import LeaderboardDateOptions from 'shared/components/Leaderboard/LeaderboardDateOptions';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { actionSheetBottomPadding, isIphoneX } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { LeaderboardDateFilters, LeaderboardMetricFilters } from 'shared/types/leaderboard';
import { leaderboardDateFilterReverseMatchMap, leaderboardMetricFilterReverseMatchMap } from 'shared/utils/leaderboard';

interface NavigationParams { }

interface Props extends NavigationScreenProps { }

const LeaderboardScreen = (props: Props) => {

  const [ dateFilter, setDateFilter ] = React.useState(LeaderboardDateFilters.LAST_WEEK);
  const setDateFilterValue = (filter: LeaderboardDateFilters) => {
    setModalVisible(false);
    setDateFilter(filter);
  };
  const [ modalVisible, setModalVisible ] = React.useState(false);

  const height = Dimensions.get('window').height - ( isIphoneX() ? 275 : 225 );

  const filterText = leaderboardDateFilterReverseMatchMap.get(dateFilter)!;

  return (
    <React.Fragment>
      <View style={ { paddingHorizontal: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } }>
        <BaseText bold={ true } textSize={ TextSize.H2 } style={ { marginBottom: Whitespace.TINY } }>Leaderboard</BaseText>
        <View style={ { flexDirection: 'row' } }>
          <BaseText>Top 50: </BaseText>
          <BaseActionable onAction={ () => setModalVisible(true) }>
            <BaseText style={ { textDecorationLine: 'underline' } } color={ Color.APP_PURPLE }>{ filterText }</BaseText>
          </BaseActionable>
        </View>
      </View>
      <ScrollableTabView
        style={ { flexGrow: 1, height } }
        tabBarActiveTextColor={ Color.APP_PURPLE }
        tabBarInactiveTextColor={ Color.GRAY }
        tabBarUnderlineStyle={ { height: 1, backgroundColor: Color.APP_PURPLE } }
      >
        <LeaderboardTabComponent
          dateFilter={ dateFilter }
          metricFilter={ LeaderboardMetricFilters.TRU_EARNED }
          tabLabel={ leaderboardMetricFilterReverseMatchMap.get(LeaderboardMetricFilters.TRU_EARNED)! }
        />
        <LeaderboardTabComponent
          dateFilter={ dateFilter }
          metricFilter={ LeaderboardMetricFilters.AGREES_RECEIVED }
          tabLabel={ leaderboardMetricFilterReverseMatchMap.get(LeaderboardMetricFilters.AGREES_RECEIVED)! }
        />
        <LeaderboardTabComponent
          dateFilter={ dateFilter }
          metricFilter={ LeaderboardMetricFilters.AGREES_GIVEN }
          tabLabel={ leaderboardMetricFilterReverseMatchMap.get(LeaderboardMetricFilters.AGREES_GIVEN)! }
        />
      </ScrollableTabView>
      <ActionSheet
        visible={ modalVisible }
        onCancel={ () => setModalVisible(false) }
      >
        <View style={ { backgroundColor: Color.WHITE, padding: Whitespace.LARGE, opacity: 0.95, paddingBottom: actionSheetBottomPadding } }>
          <LeaderboardDateOptions
            value={ dateFilter }
            onChange={ setDateFilterValue }
          />
        </View>
      </ActionSheet>
    </React.Fragment>
  );

};

LeaderboardScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, NavigationParams>}) => {
  return {
    ...headerStyles,
  };
};

export default LeaderboardScreen;
