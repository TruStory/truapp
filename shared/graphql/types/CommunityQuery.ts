import { Query } from 'react-apollo';
import { Community } from 'shared/types/community';

export interface CommunityData {
  community: Community;
}

interface Variables {
  communityId: string;
}

export default class CommunityQuery extends Query<CommunityData, Variables> { }
