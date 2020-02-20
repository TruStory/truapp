import gql from 'graphql-tag';
import COIN_FRAGMENT from './coin.fragment';

const TRANSACTION_FRAGMENT = gql`
  fragment TransactionFragment on Transaction {
    id
    amount {
      ... CoinFragment
    }
    reference {
      referenceId
      type
      title
      body
    }
    createdTime
  }
  ${COIN_FRAGMENT}
`;
export default TRANSACTION_FRAGMENT;
