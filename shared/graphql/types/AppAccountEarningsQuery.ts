import { Query } from 'react-apollo';
import { Address } from 'shared/types/appAccount';
import { EarningsData } from 'shared/types/wallet';

export interface AppAccountEarningsQueryData {
  appAccountEarnings: EarningsData;
}

interface Variables {
  id: Address;
  from: string;
  to: string;
}

export default class AppAccountEarningsQuery extends Query<AppAccountEarningsQueryData, Variables> { }
