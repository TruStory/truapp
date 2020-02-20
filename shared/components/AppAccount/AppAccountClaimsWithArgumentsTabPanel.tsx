import { NetworkStatus } from 'apollo-boost';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import AppAccountClaimArgumentsList from 'shared/components/AppAccount/AppAccountClaimArgumentsList';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import APP_ACCOUNT_CLAIMS_WITH_ARGUMENTS_QUERY from 'shared/graphql/queries/app-account-claims-with-arguments.query';
import AppAccountClaimsWithArgumentsQuery, { AppAccountClaimsWithArgumentsQueryData } from 'shared/graphql/types/AppAccountClaimsWithArgumentsQuery';
import { Address } from 'shared/types/appAccount';
import { AppAccountArgumentsFilter } from 'shared/types/argument';

interface Props {
  filter: AppAccountArgumentsFilter;
  tabLabel?: string;
  appAccountId: Address;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const AppAccountClaimsWithArgumentsTabPanel = (props: Props) => {
  const { appAccountId, style, filter } = props;
  let refreshing = false;

  const renderScreen = (result: QueryResult<AppAccountClaimsWithArgumentsQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;

    if (loading && (!data || !data.appAccountClaimsWithArguments)) return <BaseLoadingIndicator />;
    refreshing = networkStatus === NetworkStatus.refetch;

    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    if (data.appAccountClaimsWithArguments.totalCount === 0) {
      return <ErrorComponent header='No arguments' text='This user has not created any arguments' onRefresh={ refetch } />;
    }

    const onFetchMore = () => {
      if (networkStatus !== NetworkStatus.ready || data.appAccountClaimsWithArguments.pageInfo.hasNextPage === false) return;
      fetchMore({
        variables: { after: data.appAccountClaimsWithArguments.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.appAccountClaimsWithArguments) { return prev; }
          if (fetchMoreResult.appAccountClaimsWithArguments.pageInfo.endCursor === prev.appAccountClaimsWithArguments.pageInfo.endCursor) return prev;
          fetchMoreResult.appAccountClaimsWithArguments.edges =
            prev.appAccountClaimsWithArguments.edges.concat(fetchMoreResult.appAccountClaimsWithArguments.edges);
          return fetchMoreResult;
        },
      });
    };

    return(
      <View style={ [ styles.container, style ] }>
        <AppAccountClaimArgumentsList
          claimAndArguments={ data.appAccountClaimsWithArguments.edges.map((edge) => edge.node) }
          onLoadMore={ onFetchMore }
          refetch={ refetch }
          refreshing={ refreshing }
          hasMore={ data.appAccountClaimsWithArguments.pageInfo.hasNextPage }
        />
      </View>
    );
  };

  return (
    <AppAccountClaimsWithArgumentsQuery query={ APP_ACCOUNT_CLAIMS_WITH_ARGUMENTS_QUERY } variables={ { id: appAccountId, filter, first: 10 } }>
      { renderScreen }
    </AppAccountClaimsWithArgumentsQuery>
  );

};

const styles = StyleSheet.create({
  container: { },
});

export default AppAccountClaimsWithArgumentsTabPanel;
