import gql from 'graphql-tag';
import ARGUMENT_FRAGMENT from './argument.fragment';
import BASE_CLAIM_FRAGMENT from './base-claim.fragment';
import CREATOR_FRAGMENT from './creator.fragment';

const FEED_CLAIM_FRAGMENT = gql`
  fragment FeedClaimFragment on Claim {
    ... BaseClaimFragment
    topArgument {
      ... ArgumentFragment
    }
    argumentCount
    participantsCount
    participants {
      ... CreatorFragment
    }
  }
  ${BASE_CLAIM_FRAGMENT}
  ${ARGUMENT_FRAGMENT}
  ${CREATOR_FRAGMENT}
`;
export default FEED_CLAIM_FRAGMENT;
