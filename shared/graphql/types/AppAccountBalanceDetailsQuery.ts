import { Query } from 'react-apollo';
import { Address, AppAccountBalanceDetails } from 'shared/types/appAccount';

export interface AppAccountBalanceDetailsQueryData {
  appAccount: AppAccountBalanceDetails;
}

interface Variables {
  id: Address;
}

export default class AppAccountBalanceDetailsQuery extends Query<AppAccountBalanceDetailsQueryData, Variables> { }
