import { Query } from 'react-apollo';
import { Community } from 'shared/types/community';

export interface CommunitiesQueryData {
  communities: Community[];
}

export interface Variables {
  reload?: number;
}

export default class CommunitiesQuery extends Query<CommunitiesQueryData, Variables> { }
