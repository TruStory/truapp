import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';
import COMMUNITY_FRAGMENT from '../fragments/community.fragment';

const APP_ACCOUNT_HOVER_QUERY = gql`
  query AppAccountHoverQuery($id: String) {
    appAccount(id: $id) {
      id
      userProfile {
        avatarURL
        fullName
        username
        bio
      }
      totalAgrees
      totalClaims
      totalArguments
      isJailed
      earnedBalance {
        ... CoinFragment
      }
      availableBalance {
        ... CoinFragment
      }
      earnedStake {
        coin {
          ... CoinFragment
        }
        community {
          ... CommunityFragment
        }
      }
    }
  }
  ${COIN_FRAGMENT}
  ${COMMUNITY_FRAGMENT}
`;

export default APP_ACCOUNT_HOVER_QUERY;
