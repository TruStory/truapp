import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';

const APP_ACCOUNT_EARNINGS_QUERY = gql`
  query AppAccountEarningsQuery($id: String, $from: String, $to: String) {
    appAccountEarnings(id: $id, from: $from, to: $to) {
      netEarnings {
        ... CoinFragment
      }
      dataPoints {
        date
        amount
      }
    }
  }
  ${COIN_FRAGMENT}
`;

export default APP_ACCOUNT_EARNINGS_QUERY;
