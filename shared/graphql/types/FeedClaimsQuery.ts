import { Query } from 'react-apollo';
import { FeedClaim } from 'shared/types/claim';
import { FeedFilters } from 'shared/types/community';
import { Paginated } from 'shared/types/graphql';

export interface FeedClaimsQueryData {
  claims: Paginated<FeedClaim>;
}
interface Variables {
  communityId?: string;
  feedFilter?: FeedFilters;
  filterText?: string;
  first?: number;
  after?: string;
  isSearch?: boolean;
}

export default class FeedClaimsQuery extends Query<FeedClaimsQueryData, Variables> { }
