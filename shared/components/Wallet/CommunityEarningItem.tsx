import BigNumber from 'bignumber.js';
import * as React from 'react';
import { StyleProp, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import BaseText from 'shared/components/Base/BaseText';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { CommunityCoinDetails } from 'shared/types/appAccount';
import { Settings } from 'shared/types/settings';
import BaseLine from '../Base/BaseLine';
import CommunityTitle from '../Communities/CommunityTitle';

interface Props {
  settings: Settings;
  communityCoinDetails: CommunityCoinDetails;
  style?: StyleProp<any> & React.CSSProperties;
}

const CommunityEarningItem = (props: Props) => {
  const { settings, communityCoinDetails, style } = props;
  const { totalEarned, community, weeklyEarned } = communityCoinDetails;

  const bigWeeklyAmount = new BigNumber(weeklyEarned.amount);
  const bigTotalAmount = new BigNumber(totalEarned.amount);

  const weeklyColor = bigWeeklyAmount.isGreaterThan(0) ? Color.GREEN : ( bigWeeklyAmount.isEqualTo(0) ? Color.APP_BLACK : Color.RED );
  const weeklyEarnings = bigWeeklyAmount.isEqualTo(0) ? '---' :
    `${ bigWeeklyAmount.isLessThan(0) ? '-' : '' }${ weeklyEarned.humanReadable } ${ settings.stakeDisplayDenom }`;

  const totalColor = bigTotalAmount.isLessThan(0) ? Color.RED : Color.APP_BLACK;
  const totalEarnings = bigTotalAmount.isEqualTo(0) ? '---' : `${ bigTotalAmount.isLessThan(0) ? '-' : '' }${ totalEarned.humanReadable } ${ settings.stakeDisplayDenom }`;

  return (
    <View style={ [ styles.container, style ] }>
      <View style={ { flexDirection: 'row', marginTop: Whitespace.MEDIUM } }>
        <CommunityTitle community={ community } style={ { flex: 1 } } />
        <View style={ { flexDirection: 'row' } }>
          <BaseText style={ { flex: 1 } }>Total Earned</BaseText>
          <BaseText color={ totalColor }>{ totalEarnings }</BaseText>
        </View>
      </View>
      <View style={ { flexDirection: 'row', marginTop: Whitespace.MEDIUM } }>
          <BaseText style={ { flex: 1 } }>Weekly Earnings</BaseText>
          <BaseText color={ weeklyColor }>{ weeklyEarnings }</BaseText>
      </View>
      <BaseLine style={ { marginTop: Whitespace.MEDIUM } } />
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

export default connect(mapStateToProps)(CommunityEarningItem);
