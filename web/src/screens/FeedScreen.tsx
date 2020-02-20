import { NetworkStatus } from 'apollo-boost';
import React, { useEffect } from 'react';
import { QueryResult } from 'react-apollo';
import { connect } from 'react-redux';
import { match, RouteComponentProps, withRouter } from 'react-router';
import { Account } from 'shared/blockchain/account';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ClaimOfTheDay from 'shared/components/Claim/ClaimOfTheDay';
import CommunityHeading from 'shared/components/Communities/CommunityHeading';
import ErrorComponent from 'shared/components/ErrorComponent';
import FEED_CLAIMS_QUERY from 'shared/graphql/queries/feed-claims.query';
import FeedClaimsQuery, { FeedClaimsQueryData } from 'shared/graphql/types/FeedClaimsQuery';
import { TextSize } from 'shared/styles';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { FeedFilters } from 'shared/types/community';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import { feedFilterMatchMap, feedFilterNameMatchMap, feedFilterReverseMatchMap } from 'shared/utils/communities';
import ValidationUtil from 'shared/utils/validation';
import FeedClaimList from 'web/src/components/Claim/FeedClaimList';
import FeedFilterDropdown from '../components/Filters/FeedFilterDropdown';
import { Routes } from '../navigation/Routes';
import { generateDocumentTitle } from '../utils';

interface Params {
  communityId?: string;  // CategoryId
  feedFilter?: string;  // FeedFilter
}
interface Props extends RouteComponentProps {
  account?: Account;
  match: match<Params>;
}

const FeedScreen = (props: Props) => {
  useEffect(() => {
    Analytics.track(AnalyticsEventsWeb.FeedOpened );
  }, []);
  const { match, history, account } = props;

  // homepage should default to discover("all") feed when logged out, home feed when logged in
  const communityId = match.params.communityId ? match.params.communityId : (account ? 'home' : 'all');
  const feedFilter = match.params.feedFilter ?
    (feedFilterMatchMap.get(match.params.feedFilter) || feedFilterMatchMap.get(match.params.feedFilter) === 0
      ? feedFilterMatchMap.get(match.params.feedFilter) : FeedFilters.TRENDING) : ( communityId === 'livedebates' ? FeedFilters.LATEST : FeedFilters.TRENDING );
  const onOpenFeedClaim = (claimId: ID) => { history.push(`${Routes.CLAIM}${claimId}`);  };
  const onChangeFilter = (feedFilter: FeedFilters) =>
    history.push(`${Routes.COMMUNITY}${communityId}/${feedFilterReverseMatchMap.get(feedFilter)}`);

  generateDocumentTitle(`${ feedFilterNameMatchMap.get(feedFilter!) } ${ValidationUtil.capitalizeFirstLetter(communityId)} Debates`);

  const headerJsx = (
    <div>
      <CommunityHeading communityId={ communityId } />
      <ClaimOfTheDay
        communityId={ communityId }
        onOpenClaim={ onOpenFeedClaim }
        cacheBuster={ Math.random() }
      />
      <BaseLine style={ { marginTop: Whitespace.LARGE + Whitespace.SMALL, marginBottom: Whitespace.LARGE } } />
      <div style={ {   display: 'flex', justifyContent: 'space-between' } }>
        <BaseText
          bold={ true }
          textSize={ TextSize.H2 }
          style={ { marginLeft: Whitespace.CONTAINER } }
        >
          Claims
        </BaseText>
        <FeedFilterDropdown
          value={ feedFilter! }
          onChange={ onChangeFilter }
        />
      </div>
    </div>
  );

  const renderScreen = (result: QueryResult<FeedClaimsQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;

    if (loading && networkStatus === NetworkStatus.fetchMore && data && data.claims) {
      return (
        <div>
          { headerJsx }
          <FeedClaimList
            claims={ data.claims.edges.map((edge) => edge.node) }
            onLoadMore={ () => { } }
            hasMore={ data.claims.pageInfo.hasNextPage }
          />
          <BaseLoadingIndicator />
        </div>
      );
    }

    if (loading) return (
      <div>
        { headerJsx }
        <BaseLoadingIndicator />
      </div>
    );

    if (error || !data || !data.claims || data.claims.totalCount === 0) {
      return (
        <div>
          { headerJsx }
          <ErrorComponent
            onRefresh={ refetch }
            text={ `There were no claims in ${ValidationUtil.capitalizeFirstLetter(communityId)}` }
            header={ 'No Claims Found' }
          />
        </div>
      );
    }

    const onFetchMore = () => {
      if (networkStatus !== NetworkStatus.ready || data.claims.pageInfo.hasNextPage === false) return;
      fetchMore({
        variables: { after: data.claims.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.claims) { return prev; }
          if (fetchMoreResult.claims.pageInfo.endCursor === prev.claims.pageInfo.endCursor) return prev;
          fetchMoreResult.claims.edges = prev.claims.edges.concat(fetchMoreResult.claims.edges);
          return fetchMoreResult;
        },
      });
    };

    const claims = data.claims.edges.map((edge) => edge.node);
    return (
      <div>
        { headerJsx }
        <FeedClaimList
          claims={ claims }
          onLoadMore={ onFetchMore }
          hasMore={ data.claims.pageInfo.hasNextPage }
          style={ { marginTop: Whitespace.LARGE } }
        />
      </div>
    );
  };

  const queryVariables = {
    communityId,
    first: 10,
    feedFilter,
  };

  return (
    <FeedClaimsQuery
      query={ FEED_CLAIMS_QUERY }
      variables={ queryVariables }
      notifyOnNetworkStatusChange={ true }
    >
      { renderScreen }
    </FeedClaimsQuery>
  );

};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default withRouter(connect(mapStateToProps)(FeedScreen));
