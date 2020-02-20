import BigNumber from 'bignumber.js';
import * as React from 'react';
import { connect } from 'react-redux';
import BaseLine from 'shared/components/Base/BaseLine';
import CommunityTitle from 'shared/components/Communities/CommunityTitle';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { CommunityCoinDetails } from 'shared/types/appAccount';
import { Settings } from 'shared/types/settings';
import BaseText from 'web/src/components/Base/BaseText';

interface Props {
  settings: Settings;
  communityCoinDetails: CommunityCoinDetails;
  style?: React.CSSProperties;
}

const CommunityEarningItem = (props: Props) => {
  const { settings, communityCoinDetails, style } = props;
  const { totalEarned, weeklyEarned, community } = communityCoinDetails;

  const bigWeeklyAmount = new BigNumber(weeklyEarned.amount);
  const bigTotalAmount = new BigNumber(totalEarned.amount);

  const weeklyColor = bigWeeklyAmount.isGreaterThan(0) ? Color.GREEN : ( bigWeeklyAmount.isEqualTo(0) ? Color.APP_BLACK : Color.RED );
  const weeklyEarnings = bigWeeklyAmount.isEqualTo(0) ? '---' :
    `${ bigWeeklyAmount.isLessThan(0) ? '-' : '' }${ weeklyEarned.humanReadable } ${ settings.stakeDisplayDenom }`;

  const totalColor = bigTotalAmount.isLessThan(0) ? Color.RED : Color.APP_BLACK;
  const totalEarnings = bigTotalAmount.isEqualTo(0) ? '---' : `${ bigTotalAmount.isLessThan(0) ? '-' : '' }${ totalEarned.humanReadable } ${ settings.stakeDisplayDenom }`;

  return (
    <div style={ { ...styles.container, ...style } }>
      <CommunityTitle community={ community } />
      <BaseLine style={ { marginTop: Whitespace.SMALL, marginBottom: Whitespace.SMALL } } />
      <div style={ { display: 'flex', flexDirection: 'column' } }>
        <div style={ { display: 'flex', flexDirection: 'row', marginBottom: Whitespace.MEDIUM } }>
          <BaseText style={ { flex: 1 } }>Earnings This Week</BaseText>
          <BaseText color={ weeklyColor }>{ weeklyEarnings }</BaseText>
        </div>
        <div style={ { display: 'flex', flexDirection: 'row', marginBottom: Whitespace.MEDIUM } }>
          <BaseText style={ { flex: 1 } }>Total Earned</BaseText>
          <BaseText color={ totalColor }>{ totalEarnings }</BaseText>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(CommunityEarningItem);
