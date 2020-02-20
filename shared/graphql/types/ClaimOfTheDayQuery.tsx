import { Query } from 'react-apollo';
import { FeedClaim } from 'shared/types/claim';

export interface ClaimOfTheDayQueryData {
  claimOfTheDay: FeedClaim;
}

interface Variables {
  communityId: string;
  cacheBuster?: number;
}

export default class ClaimOfTheDayQuery extends Query<ClaimOfTheDayQueryData, Variables> { }
