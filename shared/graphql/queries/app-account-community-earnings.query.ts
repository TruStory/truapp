import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';
import COMMUNITY_FRAGMENT from 'shared/graphql/fragments/community.fragment';

const APP_ACCOUNT_COMMUNITY_EARNINGS_QUERY = gql`
  query AppAccountCommunityEarningsQuery($id: String) {
    appAccountCommunityEarnings(id: $id) {
      id
      totalEarned {
        ... CoinFragment
      }
      weeklyEarned {
        ... CoinFragment
      }
      community {
        ... CommunityFragment
      }
    }
  }
  ${COIN_FRAGMENT}
  ${COMMUNITY_FRAGMENT}
`;

export default APP_ACCOUNT_COMMUNITY_EARNINGS_QUERY;
