import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';
import CREATOR_FRAGMENT from 'shared/graphql/fragments/creator.fragment';

const LEADERBOARD_QUERY = gql`
  query Leaderboard($dateFilter: Int, $metricFilter :Int) {
    leaderboard (dateFilter: $dateFilter, metricFilter: $metricFilter) {
      account {
        ... CreatorFragment
      }
      earned {
        ... CoinFragment
      }
      agreesReceived
      agreesGiven
    }
  }
  ${CREATOR_FRAGMENT}
  ${COIN_FRAGMENT}
`;

export default LEADERBOARD_QUERY;
