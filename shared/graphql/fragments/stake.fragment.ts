import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';
import CREATOR_FRAGMENT from 'shared/graphql/fragments/creator.fragment';

const STAKE_FRAGMENT = gql`
  fragment StakeFragment on Stake {
    id
    stake {
      ... CoinFragment
    }
    creator {
      ... CreatorFragment
    }
    createdTime
    endTime
  }
  ${CREATOR_FRAGMENT}
  ${COIN_FRAGMENT}
`;
export default STAKE_FRAGMENT;
