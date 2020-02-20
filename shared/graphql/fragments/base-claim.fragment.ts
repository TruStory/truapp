import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';
import COMMUNITY_FRAGMENT from 'shared/graphql/fragments/community.fragment';
import CREATOR_FRAGMENT from 'shared/graphql/fragments/creator.fragment';

const BASE_CLAIM_FRAGMENT = gql`
  fragment BaseClaimFragment on Claim {
    id
    community {
      ... CommunityFragment
    }
    body
    creator {
      ... CreatorFragment
    }
    source
    image
    video
    totalBacked {
      ... CoinFragment
    }
    totalChallenged {
      ... CoinFragment
    }
    createdTime
    commentCount
  }
  ${COMMUNITY_FRAGMENT}
  ${CREATOR_FRAGMENT}
  ${COIN_FRAGMENT}
`;
export default BASE_CLAIM_FRAGMENT;
