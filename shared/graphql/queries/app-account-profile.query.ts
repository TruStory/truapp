import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';
import COMMUNITY_FRAGMENT from '../fragments/community.fragment';

const APP_ACCOUNT_PROFILE_QUERY = gql`
  query AppAccountProfileQuery($id: String) {
    appAccount(id: $id) {
      id
      userProfile {
        avatarURL
        fullName
        username
        bio
      }
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
      isJailed
      totalClaims
      totalArguments
      totalAgrees
      totalAgreesReceived
    }
  }
  ${COIN_FRAGMENT}
  ${COMMUNITY_FRAGMENT}
`;

export default APP_ACCOUNT_PROFILE_QUERY;
