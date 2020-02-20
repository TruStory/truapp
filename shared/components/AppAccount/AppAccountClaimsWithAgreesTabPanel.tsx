import { NetworkStatus } from 'apollo-boost';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import AppAccountClaimArgumentsList from 'shared/components/AppAccount/AppAccountClaimArgumentsList';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import APP_ACCOUNT_CLAIMS_WITH_AGREES_QUERY from 'shared/graphql/queries/app-account-claims-with-agrees.query';
import AppAccountClaimsWithAgreesQuery, { AppAccountClaimsWithAgreesQueryData } from 'shared/graphql/types/AppAccountClaimsWithAgreesQuery';
import { Address } from 'shared/types/appAccount';
import { AppAccountArgumentsFilter } from 'shared/types/argument';

interface Props {
  filter: AppAccountArgumentsFilter;
  tabLabel?: string;
  appAccountId: Address;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const AppAccountClaimWithAgreesTabPanel = (props: Props) => {
  const { appAccountId, style, filter } = props;
  let refreshing = false;

  const renderScreen = (result: QueryResult<AppAccountClaimsWithAgreesQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;

    if (loading && (!data || !data.appAccountClaimsWithAgrees)) return <BaseLoadingIndicator />;
    refreshing = networkStatus === NetworkStatus.refetch;

    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    if (data.appAccountClaimsWithAgrees.totalCount === 0) {
      return <ErrorComponent header='No agrees' text='This user has not agreed with any arguments' onRefresh={ refetch } />;
    }

    const onFetchMore = () => {
      if (networkStatus !== NetworkStatus.ready || data.appAccountClaimsWithAgrees.pageInfo.hasNextPage === false) return;
      fetchMore({
        variables: { after: data.appAccountClaimsWithAgrees.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.appAccountClaimsWithAgrees) { return prev; }
          if (fetchMoreResult.appAccountClaimsWithAgrees.pageInfo.endCursor === prev.appAccountClaimsWithAgrees.pageInfo.endCursor) return prev;
          fetchMoreResult.appAccountClaimsWithAgrees.edges =
            prev.appAccountClaimsWithAgrees.edges.concat(fetchMoreResult.appAccountClaimsWithAgrees.edges);
          return fetchMoreResult;
        },
      });
    };

    return (
      <View style={ [ styles.container, style ] }>
        <AppAccountClaimArgumentsList
          claimAndArguments={ data.appAccountClaimsWithAgrees.edges.map((edge) => edge.node) }
          refetch={ refetch }
          refreshing={ refreshing }
          onLoadMore={ onFetchMore }
          hasMore={ data.appAccountClaimsWithAgrees.pageInfo.hasNextPage }
        />
      </View>
    );
  };

  return (
    <AppAccountClaimsWithAgreesQuery query={ APP_ACCOUNT_CLAIMS_WITH_AGREES_QUERY } variables={ { id: appAccountId, filter, first: 10 } }>
      { renderScreen }
    </AppAccountClaimsWithAgreesQuery>
  );

};

const styles = StyleSheet.create({
  container: { },
});

export default AppAccountClaimWithAgreesTabPanel;
