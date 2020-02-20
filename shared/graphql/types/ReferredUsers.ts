import { Query } from 'react-apollo';
import { AppAccount } from 'shared/types/appAccount';

export interface ReferredUsersData {
  referredAppAccounts: AppAccount[];
}

export default class ReferredUsersQuery extends Query<ReferredUsersData> { }
