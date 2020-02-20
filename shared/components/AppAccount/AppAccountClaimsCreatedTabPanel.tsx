import { NetworkStatus } from 'apollo-boost';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import AppAccountClaimsCreatedList from 'shared/components/AppAccount/AppAccountClaimsCreatedList';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import APP_ACCOUNT_CLAIMS_CREATED_QUERY from 'shared/graphql/queries/app-account-claims-created.query';
import AppAccountClaimsCreatedQuery, { AppAccountClaimsCreatedQueryData } from 'shared/graphql/types/AppAccountClaimsCreatedQuery';
import { Address } from 'shared/types/appAccount';

interface Props {
  account? : Account;
  tabLabel?: string;
  appAccountId: Address;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const AppAccountClaimsCreatedTabPanel = (props: Props) => {
  const { appAccountId, style } = props;
  let refreshing = false;

  const renderScreen = (result: QueryResult<AppAccountClaimsCreatedQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;

    if (loading && (!data || !data.appAccountClaimsCreated)) return <BaseLoadingIndicator />;
    refreshing = networkStatus === NetworkStatus.refetch;

    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    if (data.appAccountClaimsCreated.totalCount === 0) {
      return <ErrorComponent header='No claims' text='This user has not created any claims' onRefresh={ refetch } />;
    }

    const onFetchMore = () => {
      if (networkStatus !== NetworkStatus.ready || data.appAccountClaimsCreated.pageInfo.hasNextPage === false) return;
      fetchMore({
        variables: { after: data.appAccountClaimsCreated.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.appAccountClaimsCreated) { return prev; }
          if (fetchMoreResult.appAccountClaimsCreated.pageInfo.endCursor === prev.appAccountClaimsCreated.pageInfo.endCursor) return prev;
          fetchMoreResult.appAccountClaimsCreated.edges =
            prev.appAccountClaimsCreated.edges.concat(fetchMoreResult.appAccountClaimsCreated.edges);
          return fetchMoreResult;
        },
      });
    };

    return (
      <View style={ [ styles.container, style ] }>
        <AppAccountClaimsCreatedList
          claims={ data.appAccountClaimsCreated.edges.map((edge) => edge.node) }
          onLoadMore={ onFetchMore }
          refetch={ refetch }
          refreshing={ refreshing }
          hasMore={ data.appAccountClaimsCreated.pageInfo.hasNextPage }
        />
      </View>
    );
  };

  return (
    <AppAccountClaimsCreatedQuery query={ APP_ACCOUNT_CLAIMS_CREATED_QUERY } variables={ { id: appAccountId, first: 10 } }>
      { renderScreen }
    </AppAccountClaimsCreatedQuery>
  );

};

const styles = StyleSheet.create({
  container: { },
  claimContainer: {
    flexDirection: 'column',
  },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(AppAccountClaimsCreatedTabPanel);
