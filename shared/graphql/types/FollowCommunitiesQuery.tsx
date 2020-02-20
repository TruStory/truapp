import { Query } from 'react-apollo';
import { Community } from 'shared/types/community';

export interface CommunitiesData {
  communities: Community[];
}

export default class CommunityQuery extends Query<CommunitiesData> { }
