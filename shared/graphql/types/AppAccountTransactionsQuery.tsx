import { Query } from 'react-apollo';
import { Address } from 'shared/types/appAccount';
import { Paginated } from 'shared/types/graphql';
import { Transaction } from 'shared/types/transactions';

export interface AppAccountTransactionsQueryData {
  transactions: Paginated<Transaction>;
}

interface Variables {
  id: Address;
  first?: number;
  after?: number;
}

export default class AppAccountTransactionsQuery extends Query<AppAccountTransactionsQueryData, Variables> { }
