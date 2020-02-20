import { Query } from 'react-apollo';
import { Address, AppAccountProfileDetails } from 'shared/types/appAccount';

export interface AppAccountHoverQueryData {
  appAccount: AppAccountProfileDetails;
}

interface Variables {
  id: Address;
}

export default class AppAccountHoverQuery extends Query<AppAccountHoverQueryData, Variables> { }
