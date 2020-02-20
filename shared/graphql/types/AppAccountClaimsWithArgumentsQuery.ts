import { Query } from 'react-apollo';
import { Address } from 'shared/types/appAccount';
import { AppAccountArgumentsFilter } from 'shared/types/argument';
import { AppAccountClaimWithArguments } from 'shared/types/claim';
import { Paginated } from 'shared/types/graphql';

export interface AppAccountClaimsWithArgumentsQueryData {
  appAccountClaimsWithArguments: Paginated<AppAccountClaimWithArguments>;
}

interface Variables {
  id: Address;
  filter: AppAccountArgumentsFilter;
  first?: number;
  after?: string;
}

export default class AppAccountClaimsWithArgumentsQuery extends Query<AppAccountClaimsWithArgumentsQueryData, Variables> { }
