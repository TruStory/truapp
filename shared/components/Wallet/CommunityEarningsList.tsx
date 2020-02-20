import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { FlatList, ListRenderItemInfo, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import CommunityEarningItem from 'shared/components/Wallet/CommunityEarningItem';
import APP_ACCOUNT_COMMUNITY_EARNINGS_QUERY from 'shared/graphql/queries/app-account-community-earnings.query';
import AppAccountCommunityEarningsQuery, { AppAccountCommunityEarningsQueryData } from 'shared/graphql/types/AppAccountCommunityEarningsQuery';
import { Whitespace } from 'shared/styles/views';
import { Address, CommunityCoinDetails } from 'shared/types/appAccount';

interface Props {
  appAccountId: Address;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const CommunityEarningsList = (props: Props) => {
  const { appAccountId, style } = props;

  const renderList = (result: QueryResult<AppAccountCommunityEarningsQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    if (data.appAccountCommunityEarnings.length === 0) {
      return <ErrorComponent header='No Community Earnings' text='There were no earnings for any communities.' onRefresh={ refetch } />;
    }

    const renderCommunityCoinDetails = (rowData: ListRenderItemInfo<CommunityCoinDetails>) => {
      return (
        <View style={ { paddingLeft: Whitespace.SMALL, paddingRight: Whitespace.SMALL } }>
          <CommunityEarningItem communityCoinDetails={ rowData.item }  />
        </View>
      );
    };

    const keyExtractor = (item: CommunityCoinDetails, index: number) => index.toString();

    return (
      <View style={ [ styles.container, style ] }>
        <FlatList
          keyExtractor={ keyExtractor }
          data={ data.appAccountCommunityEarnings }
          renderItem={ renderCommunityCoinDetails }
        />
      </View>
    );
  };

  return (
    <AppAccountCommunityEarningsQuery query={ APP_ACCOUNT_COMMUNITY_EARNINGS_QUERY } variables={ { id: appAccountId } }>
      { renderList }
    </AppAccountCommunityEarningsQuery>
  );

};

const styles = StyleSheet.create({
  container: { },
});

export default CommunityEarningsList;
