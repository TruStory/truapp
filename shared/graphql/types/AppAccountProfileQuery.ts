import { Query } from 'react-apollo';
import { Address, AppAccountProfileDetails } from 'shared/types/appAccount';

export interface AppAccountProfileQueryData {
  appAccount: AppAccountProfileDetails;
}

interface Variables {
  id: Address;
}

export default class AppAccountProfileQuery extends Query<AppAccountProfileQueryData, Variables> { }
