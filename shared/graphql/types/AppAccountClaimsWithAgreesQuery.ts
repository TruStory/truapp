import { Query } from 'react-apollo';
import { Address } from 'shared/types/appAccount';
import { AppAccountArgumentsFilter } from 'shared/types/argument';
import { AppAccountClaimWithArguments } from 'shared/types/claim';
import { Paginated } from 'shared/types/graphql';

export interface AppAccountClaimsWithAgreesQueryData {
  appAccountClaimsWithAgrees: Paginated<AppAccountClaimWithArguments>;
}

interface Variables {
  id: Address;
  filter: AppAccountArgumentsFilter;
  first?: number;
  after?: string;
}

export default class AppAccountClaimsWithAgreesQuery extends Query<AppAccountClaimsWithAgreesQueryData, Variables> { }
