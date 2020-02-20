import gql from 'graphql-tag';
import FEED_CLAIM_FRAGMENT from 'shared/graphql/fragments/feed-claim.fragment';
import PAGE_INFO_FRAGMENT from 'shared/graphql/fragments/page-info.fragment';

const FEED_CLAIMS_QUERY = gql`
  query FeedClaimsQuery(
    $communityId: String, $feedFilter: Int, $isSearch: Boolean, $first: Int, $after: String, $filterText: String
  ) {
    claims (
      communityId: $communityId, feedFilter: $feedFilter, isSearch: $isSearch, first: $first, after: $after, filterText: $filterText
    ) {
      edges {
        node {
          ...FeedClaimFragment
        }
        cursor
      }
      ... PageInfoFragment
    }
  }
  ${FEED_CLAIM_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export default FEED_CLAIMS_QUERY;
