import { NetworkStatus } from 'apollo-boost';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import TransactionsList from 'shared/components/Wallet/TransactionsList';
import { Address } from 'shared/types/appAccount';
import APP_ACCOUNT_TRANSACTIONS_QUERY from '../../graphql/queries/app-account-transactions.query';
import AppAccountTransactionsQuery, { AppAccountTransactionsQueryData } from '../../graphql/types/AppAccountTransactionsQuery';
import BaseLoadingIndicator from '../Base/BaseLoadingIndicator';
import ErrorComponent from '../ErrorComponent';

interface Props {
  tabLabel?: string;
  appAccountId: Address;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const EarningsTabPanel = (props: Props) => {
  const { style, appAccountId } = props;

  let refreshing = false;

  const renderList = (result: QueryResult<AppAccountTransactionsQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;

    if (loading && (!data || !data.transactions)) return <BaseLoadingIndicator />;
    refreshing = networkStatus === NetworkStatus.refetch;

    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    if (data.transactions.totalCount === 0) {
      return <ErrorComponent header='No Transactions' text='You do not have any transactions.' onRefresh={ refetch } />;
    }

    const onFetchMore = () => {
      if (networkStatus !== NetworkStatus.ready || data.transactions.pageInfo.hasNextPage === false) return;
      fetchMore({
        variables: { after: data.transactions.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.transactions) { return prev; }
          if (fetchMoreResult.transactions.pageInfo.endCursor === prev.transactions.pageInfo.endCursor) return prev;
          fetchMoreResult.transactions.edges = prev.transactions.edges.concat(fetchMoreResult.transactions.edges);
          return fetchMoreResult;
        },
      });
    };

    return (
      <View style={ [ styles.container, style ] }>
        <TransactionsList
          transactions={ data.transactions.edges.map((edge) => edge.node) }
          onLoadMore={ onFetchMore }
          refetch={ refetch }
          refreshing={ refreshing }
          hasMore={ data.transactions.pageInfo.hasNextPage }
        />
      </View>
    );
  };

  return (
    <AppAccountTransactionsQuery
      query={ APP_ACCOUNT_TRANSACTIONS_QUERY }
      variables={ { id: appAccountId, first: 10 } }
      fetchPolicy={ 'network-only' }
    >
      { renderList }
    </AppAccountTransactionsQuery>
  );

};

const styles = StyleSheet.create({
  container: {  },
});

export default EarningsTabPanel;
