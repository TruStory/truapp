import gql from 'graphql-tag';
import PAGE_INFO_FRAGMENT from 'shared/graphql/fragments/page-info.fragment';
import TRANSACTION_FRAGMENT from '../fragments/transaction.fragment';

const APP_ACCOUNT_TRANSACTIONS_QUERY = gql`
  query AppAccountTransactions($id: String, $first: Number, $after: String) {
    transactions(id: $id, first: $first, after: $after) {
      edges {
        node {
          ... TransactionFragment
        }
        cursor
      }
      ... PageInfoFragment
    }
  }
  ${TRANSACTION_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export default APP_ACCOUNT_TRANSACTIONS_QUERY;
