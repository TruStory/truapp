import { Query } from 'react-apollo';
import { Address, CommunityCoinDetails } from 'shared/types/appAccount';

export interface AppAccountCommunityEarningsQueryData {
  appAccountCommunityEarnings: CommunityCoinDetails[];
}

interface Variables {
  id: Address;
}

export default class AppAccountCommunityEarningsQuery extends Query<AppAccountCommunityEarningsQueryData, Variables> { }
