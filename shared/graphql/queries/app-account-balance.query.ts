import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';

const APP_ACCOUNT_BALANCE_QUERY = gql`
  query AppAccountBalanceQuery($id: String) {
    appAccount(id: $id) {
      id
      earnedBalance {
        ... CoinFragment
      }
      availableBalance {
        ... CoinFragment
      }
    }
  }
  ${COIN_FRAGMENT}
`;

export default APP_ACCOUNT_BALANCE_QUERY;
