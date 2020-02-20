import BalancePieChart from 'mobile/src/components/Wallet/BalancePieChart';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { Dimensions, View } from 'react-native';
import { styles } from 'react-native-markdown-renderer';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import CommunityEarningsTabPanel from 'shared/components/Wallet/CommunityEarningsTabPanel';
import EarningsTabPanel from 'shared/components/Wallet/EarningsTabPanel';
import APP_ACCOUNT_BALANCE_DETAILS_QUERY from 'shared/graphql/queries/app-account-balance-details.query';
import AppAccountBalanceDetailsQuery, { AppAccountBalanceDetailsQueryData } from 'shared/graphql/types/AppAccountBalanceDetailsQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

interface Props extends NavigationScreenProps {
  account?: Account;
}

const WalletScreen = (props: Props) => {
  const { account } = props;

  if (!account)
    return null;

  const appAccountId = account.id;

  const renderScreen = (result: QueryResult<AppAccountBalanceDetailsQueryData, any>) => {
    const { loading, data, refetch, error } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    const { appAccount } = data;

    return (
      <View style={ { flex:  1 } }>
        <BalancePieChart appAccountDetails={ appAccount } />
        <ScrollView style={ { marginTop: Whitespace.SMALL } }>
          <ScrollableTabView
            style={ [ styles.container, { flexGrow: 1, height: Dimensions.get('window').height - 310 } ] }
            tabBarActiveTextColor={ Color.APP_PURPLE }
            tabBarInactiveTextColor={ Color.GRAY }
            tabBarUnderlineStyle={ { height: 1, backgroundColor: Color.APP_PURPLE } }
          >
            <EarningsTabPanel appAccountId={ account.id } tabLabel={ 'Transactions' } />
            <CommunityEarningsTabPanel appAccountId={ account.id } tabLabel={ 'Community Earnings' } />
          </ScrollableTabView>
        </ScrollView>
      </View>
    );
  };

  return (
    <AppAccountBalanceDetailsQuery query={ APP_ACCOUNT_BALANCE_DETAILS_QUERY } variables={ { id: appAccountId } } fetchPolicy={ 'network-only' }>
      { renderScreen }
    </AppAccountBalanceDetailsQuery>
  );

};

WalletScreen.navigationOptions = {
  title: ' ',
  headerLeft: <BaseText bold={ true } textSize={ TextSize.H1 } style={ { marginLeft: Whitespace.SMALL } }>My Wallet</BaseText>,
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(WalletScreen);
