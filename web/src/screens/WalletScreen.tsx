import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Account } from 'shared/blockchain/account';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import BalanceLineChart from 'shared/components/Wallet/BalanceLineChart';
import BalancePieChart from 'shared/components/Wallet/BalancePieChart';
import APP_ACCOUNT_BALANCE_DETAILS_QUERY from 'shared/graphql/queries/app-account-balance-details.query';
import AppAccountBalanceDetailsQuery, { AppAccountBalanceDetailsQueryData } from 'shared/graphql/types/AppAccountBalanceDetailsQuery';
import { TextSize } from 'shared/styles';
import { Whitespace } from 'shared/styles/views';
import BaseText from 'web/src/components/Base/BaseText';
import WalletTabsComponent from 'web/src/components/Wallet/WalletTabsComponent';
import PendingBreakdownGrid from '../components/Wallet/PendingBreakdownGrid';
import { generateDocumentTitle } from '../utils';

interface Props extends RouteComponentProps {
  account: Account;
}

const WalletScreen = (props: Props) => {
  const { account } = props;
  const appAccountId = account.id;

  generateDocumentTitle('My Wallet');

  const renderScreen = (result: QueryResult<AppAccountBalanceDetailsQueryData, any>) => {
    const { loading, data, refetch, error } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    const { appAccount } = data;

    return (
      <View>
        <BaseText bold={ true } textSize={ TextSize.H2 }>My Wallet</BaseText>
        <View style={ { flexDirection: 'row', justifyContent: 'center', marginBottom: Whitespace.LARGE } }>
          <BalancePieChart appAccountDetails={ appAccount } />
          <PendingBreakdownGrid appAccountDetails={ appAccount } style={ { marginTop: Whitespace.LARGE + Whitespace.SMALL } } />
        </View>
        <BalanceLineChart appAccountId={ appAccountId } />
        <WalletTabsComponent appAccountId={ appAccountId } />
      </View>

    );
  };

  return (
    <AppAccountBalanceDetailsQuery query={ APP_ACCOUNT_BALANCE_DETAILS_QUERY } variables={ { id: appAccountId } } fetchPolicy={ 'network-only' }>
      { renderScreen }
    </AppAccountBalanceDetailsQuery>
  );

};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default withRouter(connect(mapStateToProps)(WalletScreen));
