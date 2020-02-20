import BigNumber from 'bignumber.js';
import React from 'react';
import { connect } from 'react-redux';
import BaseLine from 'shared/components/Base/BaseLine';
import { Whitespace } from 'shared/styles/views';
import { AppAccountBalanceDetails, CommunityCoin } from 'shared/types/appAccount';
import { Settings } from 'shared/types/settings';
import BaseText from '../Base/BaseText';

interface Props {
  settings: Settings;
  appAccountDetails: AppAccountBalanceDetails;
  style?: React.CSSProperties;
}
const PendingBreakdownGrid = (props: Props) => {
  const { settings, appAccountDetails, style } = props;

  const listJsx: React.ReactNode[] = [];
  const bigPendingTotal = appAccountDetails.pendingBalance.amount;

  appAccountDetails.pendingStake.map(( communityCoin: CommunityCoin ) => {
    const ratio = new BigNumber(communityCoin.coin.amount).dividedBy(bigPendingTotal);
    const percentage = ratio.multipliedBy(100);

    listJsx.push(
      <div className={ 'columns' } key={ `${communityCoin.community.id}${communityCoin.coin.denom}` }>
        <div className={ 'column is-offset-1 is-5-desktop' }>
          <BaseText>{ communityCoin.community.name }</BaseText>
        </div>
        <div className={ 'column is-2-desktop' } style={ { justifyContent: 'center', display: 'flex' } }>
          <BaseText>{ `${percentage.isNaN() ? 0 : percentage.toFixed(0)}%` }</BaseText>
        </div>
        <div className={ 'column is-4-desktop' } style={ { justifyContent: 'flex-end', display: 'flex', marginBottom: Whitespace.TINY } }>
          <BaseText bold={ true }>{ communityCoin.coin.humanReadable }</BaseText>
        </div>
      </div>,
    );
  });

  return (
    <div style={ { ...styles.container, ...style } } className={ 'is-hidden-mobile' }>
      <div className={ 'columns' }>
        <div className={ 'column is-offset-1 is-5-desktop' }>
          <BaseText bold={ true }>Invested { settings.stakeDisplayDenom } Breakdown</BaseText>
        </div>
        <div className={ 'column is-2-desktop' } style={ { justifyContent: 'center', display: 'flex' } }>
          <BaseText bold={ true }>%</BaseText>
        </div>
        <div className={ 'column is-4-desktop' } style={ { justifyContent: 'flex-end', display: 'flex' } }>
          <BaseText bold={ true }>{ settings.stakeDisplayDenom }</BaseText>
        </div>
      </div>
      <div className={ 'column is-offset-1 is-11-desktop' } style={ { flex: 'none' } }>
        <BaseLine style={ { marginBottom: Whitespace.TINY + Whitespace.LARGE } } />
      </div>
      { listJsx }
    </div>

  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    flex: 1,
  },
};

const mapStateToProps = (state: any) => ({
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(PendingBreakdownGrid);
