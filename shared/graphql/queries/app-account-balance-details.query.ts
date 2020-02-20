import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';
import COMMUNITY_FRAGMENT from 'shared/graphql/fragments/community.fragment';

const APP_ACCOUNT_BALANCE_DETAILS_QUERY = gql`
  query AppAccountBalanceDetailsQuery($id: String) {
    appAccount(id: $id) {
      id
      earnedBalance {
        ... CoinFragment
      }
      availableBalance {
        ... CoinFragment
      }
      pendingBalance {
        ... CoinFragment
      }
      pendingStake {
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

export default APP_ACCOUNT_BALANCE_DETAILS_QUERY;
