import gql from 'graphql-tag';
import FEED_CLAIM_FRAGMENT from 'shared/graphql/fragments/feed-claim.fragment';

const CLAIM_OF_THE_DAY_QUERY = gql`
  query ClaimOfTheDayQuery($communityId: string) {
    claimOfTheDay(communityId: $communityId) {
      ... FeedClaimFragment
    }
  }
  ${FEED_CLAIM_FRAGMENT}
`;

export default CLAIM_OF_THE_DAY_QUERY;
