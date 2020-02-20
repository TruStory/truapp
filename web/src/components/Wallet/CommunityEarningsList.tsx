import * as React from 'react';
import { QueryResult } from 'react-apollo';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import CommunityEarningItem from 'shared/components/Wallet/CommunityEarningItem';
import APP_ACCOUNT_COMMUNITY_EARNINGS_QUERY from 'shared/graphql/queries/app-account-community-earnings.query';
import AppAccountCommunityEarningsQuery, { AppAccountCommunityEarningsQueryData } from 'shared/graphql/types/AppAccountCommunityEarningsQuery';
import { Whitespace } from 'shared/styles/views';
import { Address, CommunityCoinDetails } from 'shared/types/appAccount';

interface Props {
  appAccountId: Address;
  style?: React.CSSProperties;
}

const CommunityEarningsList = (props: Props) => {
  const { appAccountId, style } = props;

  const renderList = (result: QueryResult<AppAccountCommunityEarningsQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    if (data.appAccountCommunityEarnings.length === 0) {
      return <ErrorComponent header='No transactions' text='There were no transactions.' onRefresh={ refetch } />;
    }

    const appAccountCommunityEarnings = data.appAccountCommunityEarnings;

    const listJsx: React.ReactNode[] = [];
    appAccountCommunityEarnings.map((communityCoinDetail: CommunityCoinDetails) => {
      listJsx.push(
        <div
          className={ 'column is-6-desktop is-6-tablet is-12-mobile' }
        >
          <div style={ styles.cardPadding }>
            <CommunityEarningItem
              communityCoinDetails={ communityCoinDetail }
              style={ styles.cardStyle }
            />
          </div>
        </div>,
      );
    });

    return (
      <div style={ { ...styles.container, ...style } } className={ 'columns' }>
        { listJsx }
      </div>
    );
  };

  return (
    <AppAccountCommunityEarningsQuery
      query={ APP_ACCOUNT_COMMUNITY_EARNINGS_QUERY }
      variables={ { id: appAccountId } }
      fetchPolicy='network-only'
    >
      { renderList }
    </AppAccountCommunityEarningsQuery>
  );

};

const styles = {
  container: { flexWrap: 'wrap' as 'wrap' },
  cardStyle: {
    padding: Whitespace.SMALL,
    shadowRadius: 3,
    borderRadius: Whitespace.SMALL,
    boxShadow: 'rgba(171, 167, 191, 0.25) 0px 0px 10px 0px',
  },
  cardPadding: {
    paddingTop: Whitespace.TINY,
    paddingBottom: Whitespace.TINY,
    paddingRight: Whitespace.SMALL / 2,
    paddingLeft: Whitespace.SMALL / 2,
  },
};

export default CommunityEarningsList;
