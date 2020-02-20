import gql from 'graphql-tag';
import COIN_FRAGMENT from './coin.fragment';
import CREATOR_FRAGMENT from './creator.fragment';
import SLASH_FRAGMENT from './slash.fragment';
import STAKE_FRAGMENT from './stake.fragment';

const ARGUMENT_FRAGMENT = gql`
  fragment ArgumentFragment on ClaimArgument {
    id
    claimId
    communityId
    vote
    summary
    body
    createdTime
    editedTime
    edited
    creator {
      ... CreatorFragment
    }
    upvotedStake {
      ... CoinFragment
    }
    upvotedCount
    downvotedCount
    isUnhelpful
    appAccountStake {
      ... StakeFragment
    }
    appAccountSlash {
      ... SlashFragment
    }
    stakers {
      ... CreatorFragment
    }
  }
  ${CREATOR_FRAGMENT}
  ${COIN_FRAGMENT}
  ${STAKE_FRAGMENT}
  ${SLASH_FRAGMENT}
`;
export default ARGUMENT_FRAGMENT;
