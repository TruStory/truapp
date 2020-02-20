import gql from 'graphql-tag';
import ARGUMENT_FRAGMENT from 'shared/graphql/fragments/argument.fragment';
import FEED_CLAIM_FRAGMENT from 'shared/graphql/fragments/feed-claim.fragment';
import PAGE_INFO_FRAGMENT from 'shared/graphql/fragments/page-info.fragment';

const APP_ACCOUNT_CLAIMS_WITH_AGREES_QUERY = gql`
  query AppAccountClaimsWithAgrees($id: String, $filter: Number, $first: Number, $after: String) {
    appAccountClaimsWithAgrees(id: $id, first: $first, after: $after) {
      edges {
        node {
          ... FeedClaimFragment
          arguments(address: $id, filter: $filter) {
            ... ArgumentFragment
          }
        }
        cursor
      }
      ... PageInfoFragment
    }
  }
  ${FEED_CLAIM_FRAGMENT}
  ${ARGUMENT_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export default APP_ACCOUNT_CLAIMS_WITH_AGREES_QUERY;
