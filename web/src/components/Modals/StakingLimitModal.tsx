import BigNumber from 'bignumber.js';
import React from 'react';
import { QueryResult } from 'react-apollo';
import { ImageBackground, View } from 'react-native';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import APP_ACCOUNT_BALANCE_QUERY from 'shared/graphql/queries/app-account-balance.query';
import AppAccountBalanceQuery, { AppAccountBalanceQueryData } from 'shared/graphql/types/AppAccountBalanceQuery';
import { staking_limit_web } from 'shared/images/Modals/ModalsImages';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { AppAccount } from 'shared/types/appAccount';
import { Routes } from '../../navigation/Routes';

interface Props extends RouteComponentProps {
  onClose: () => void;
  account: Account;
}

const defaultStakeLimit = 500;

const tierLimitsEarnedCoins = (denom: string) : Array<BigNumber> => {
  const multiplier = denom === 'utru' ? new BigNumber(1e6) : new BigNumber(1e9);
  return [
    new BigNumber(10).multipliedBy(multiplier),
    new BigNumber(20).multipliedBy(multiplier),
    new BigNumber(30).multipliedBy(multiplier),
    new BigNumber(40).multipliedBy(multiplier),
    new BigNumber(50).multipliedBy(multiplier),
  ];
};

const tierLimitsStakeAmounts = [
  1000,
  1500,
  2000,
  2500,
  3000,
];

const StakingLimitModal = (props: Props) => {
  const { onClose, account, history } = props;

  const onLearnMore = () => {
    onClose();
    history.push(Routes.HOW_IT_WORKS);
  };

  const renderModal = (result: QueryResult<AppAccountBalanceQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data || !data.appAccount) return <ErrorComponent onRefresh={ refetch } />;

    const appAccount: AppAccount = data.appAccount;
    const amount = new BigNumber(appAccount.earnedBalance.amount);
    const limits = tierLimitsEarnedCoins(appAccount.earnedBalance.denom);
    let limit = defaultStakeLimit;

    if (amount.gt(limits[4])) {
      limit = tierLimitsStakeAmounts[4];
    } else if (amount.gt(limits[3])) {
      limit = tierLimitsStakeAmounts[3];
    } else if (amount.gt(limits[2])) {
      limit = tierLimitsStakeAmounts[2];
    } else if (amount.gt(limits[1])) {
      limit = tierLimitsStakeAmounts[1];
    } else if (amount.gt(limits[0])) {
      limit = tierLimitsStakeAmounts[0];
    }

    return (
      <ImageBackground source={ staking_limit_web } style={ styles.modal }>
        <View style={ { flexDirection: 'row', alignItems: 'center' } }>
          <View style={ { flexDirection: 'row', flex: 1, justifyContent: 'center' } } />
          <BaseActionable onAction={ onClose } style={ { alignItems: 'flex-end' } }>
              <BaseIconView family={ 'Feather' } name={ 'x' } size={ IconSize.LARGE } />
          </BaseActionable>
        </View>
        <View style={ styles.mainContainer }>
          <BaseText textSize={ TextSize.H1 } bold={ true } style={ { lineHeight: '40px' } }>You've hit</BaseText>
          <BaseText textSize={ TextSize.H1 } bold={ true } style={ { marginBottom: Whitespace.SMALL, lineHeight: '40px' } }>
            your staking limit!
          </BaseText>
          <BaseText textSize={ TextSize.H3 }>Your TRU staking limit is { limit }. Earn</BaseText>
          <BaseText textSize={ TextSize.H3 }>more TRU to increase your limits!</BaseText>
          <View style={ styles.buttonContainer  }>
            <BaseButton
              title='Learn More'
              color={ Color.WHITE }
              accentColor={ Color.APP_PURPLE }
              outline={ false }
              onAction={ onLearnMore }
            />
          </View>
        </View>
      </ImageBackground>
    );
  };

  return (
    <AppAccountBalanceQuery query={ APP_ACCOUNT_BALANCE_QUERY } variables={ { id: account.id } }>
      { renderModal }
    </AppAccountBalanceQuery>
  );
};

StakingLimitModal.defaultProps = {
  onClose: () => { },
};

const styles = {
  modal: {
    display: 'flex' as 'flex',
    justifyContent: 'space-between' as 'space-between',
    height: 515,
    width: 400,
    margin: -Whitespace.LARGE,
    padding: Whitespace.LARGE + Whitespace.SMALL,
  },
  mainContainer: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
  },
  buttonContainer: {
    flexDirection: 'row' as 'row',
    marginTop: Whitespace.LARGE + Whitespace.SMALL,
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(withRouter(StakingLimitModal));
