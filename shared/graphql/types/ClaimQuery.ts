import { Query } from 'react-apollo';
import { ID } from 'shared/types';
import { Claim } from 'shared/types/claim';

export interface ClaimQueryData {
  claim: Claim;
}

interface Variables {
  claimId: ID;
}

export default class ClaimQuery extends Query<ClaimQueryData, Variables> { }
