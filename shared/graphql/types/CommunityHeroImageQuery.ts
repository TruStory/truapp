import { Query } from 'react-apollo';
import { Community } from 'shared/types/community';

export interface CommunityHeroImageData {
  community: Community;
}

interface Variables {
  communityId: string;
}

export default class CommunityHeroImageQuery extends Query<CommunityHeroImageData, Variables> { }
