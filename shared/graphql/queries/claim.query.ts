import gql from 'graphql-tag';
import ARGUMENT_FRAGMENT from 'shared/graphql/fragments/argument.fragment';
import FEED_CLAIM_FRAGMENT from 'shared/graphql/fragments/feed-claim.fragment';

const CLAIM_QUERY = gql`
  query ClaimQuery($claimId: ID!) {
    claim(id: $claimId) {
      ... FeedClaimFragment
      arguments {
        ... ArgumentFragment
      }
    }
  }
  ${FEED_CLAIM_FRAGMENT}
  ${ARGUMENT_FRAGMENT}
`;

export default CLAIM_QUERY;
