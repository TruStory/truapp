import { Query } from 'react-apollo';
import { Address, AppAccount } from 'shared/types/appAccount';

export interface AppAccountBalanceQueryData {
  appAccount: AppAccount;
}

interface Variables {
  id: Address;
}

export default class AppAccountBalanceQuery extends Query<AppAccountBalanceQueryData, Variables> { }
