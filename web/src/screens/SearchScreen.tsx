import { NetworkStatus } from 'apollo-boost';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { connect } from 'react-redux';
import { match, RouteComponentProps, withRouter } from 'react-router';
import { Account } from 'shared/blockchain/account';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import FEED_CLAIMS_QUERY from 'shared/graphql/queries/feed-claims.query';
import FeedClaimsQuery, { FeedClaimsQueryData } from 'shared/graphql/types/FeedClaimsQuery';
import { TextSize } from 'shared/styles';
import { Whitespace } from 'shared/styles/views';
import { FeedFilters } from 'shared/types/community';
import { feedFilterMatchMap, feedFilterReverseMatchMap } from 'shared/utils/communities';
import ValidationUtil from 'shared/utils/validation';
import FeedClaimList from '../components/Claim/FeedClaimList';
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

const SearchScreen = (props: Props) => {
  const { match, history, location } = props;

  const params = new URLSearchParams(location.search);
  if (!params.get('q'))
    history.replace(Routes.HOME);

  const communityId = match.params.communityId ? match.params.communityId : 'all';
  const filterText = params.get('q') ? params.get('q')! : '';
  const feedFilter = match.params.feedFilter ?
    (feedFilterMatchMap.get(match.params.feedFilter) || feedFilterMatchMap.get(match.params.feedFilter) === 0
      ? feedFilterMatchMap.get(match.params.feedFilter) : FeedFilters.LATEST) : FeedFilters.LATEST;
  const searchTextPlaceholder = `Searching: '${filterText}'`;

  generateDocumentTitle(searchTextPlaceholder);

  const onChangeFilter = (feedFilter: FeedFilters) =>
    history.push(`${Routes.SEARCH}${communityId}/${feedFilterReverseMatchMap.get(feedFilter)}?&q=${filterText}`);

  const headerJsx = (
    <div style={ { alignItems: 'center', marginTop: Whitespace.SMALL - 2 } }>
      <FeedFilterDropdown
        value={ feedFilter! }
        onChange={ onChangeFilter }
        style={ { position: 'absolute', right: 0, top: 15, zIndex: 10 } }
      />
      <BaseText bold={ true } textSize={ TextSize.H3 } style={ { marginLeft: Whitespace.CONTAINER } }>
        { searchTextPlaceholder }
      </BaseText>
      <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
    </div>
  );

  const renderScreen = (result: QueryResult<FeedClaimsQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;

    if (loading && networkStatus === NetworkStatus.fetchMore && data && data.claims) {
      return (
        <React.Fragment>
        { headerJsx }
        <FeedClaimList
          claims={ data.claims.edges.map((edge) => edge.node) }
          onLoadMore={ () => { } }
          hasMore={ data.claims.pageInfo.hasNextPage }
        />
        <BaseLoadingIndicator />
      </React.Fragment>
      );
    }

    if (loading) return (
      <React.Fragment>
        { headerJsx }
        <BaseLoadingIndicator />
      </React.Fragment>
    );
    if (error || !data || !data.claims || data.claims.totalCount === 0) {
      return (
        <React.Fragment>
          { headerJsx }
          <ErrorComponent
            onRefresh={ refetch }
            text={ `There were no matching claims with the word '${filterText}' in ${ValidationUtil.capitalizeFirstLetter(communityId)}` }
            header={ 'No Claims Found' }
          />
        </React.Fragment>
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
      <React.Fragment>
        { headerJsx }
        <FeedClaimList
          claims={ claims }
          hasMore={ true }
          onLoadMore={ onFetchMore }
        />
      </React.Fragment>
    );
  };

  const queryVariables = {
    communityId,
    first: 10,
    feedFilter,
    filterText,
    isSearch: true,
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

export default withRouter(connect(mapStateToProps)(SearchScreen));
