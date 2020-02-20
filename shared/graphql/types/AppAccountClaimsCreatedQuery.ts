import { Query } from 'react-apollo';
import { Address } from 'shared/types/appAccount';
import { AppAccountClaim } from 'shared/types/claim';
import { Paginated } from 'shared/types/graphql';

export interface AppAccountClaimsCreatedQueryData {
  appAccountClaimsCreated: Paginated<AppAccountClaim>;
}

interface Variables {
  id: Address;
  first?: number;
  after?: string;
}

export default class AppAccountClaimsCreatedQuery extends Query<AppAccountClaimsCreatedQueryData, Variables> { }
