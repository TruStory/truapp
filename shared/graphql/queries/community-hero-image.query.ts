import gql from 'graphql-tag';
import COMMUNITY_FRAGMENT from 'shared/graphql/fragments/community.fragment';

const COMMUNITY_HERO_IMAGE_QUERY = gql`
  query CommunityHeroImageQuery($communityId: string) {
    community(communityId: $communityId) {
      ... CommunityFragment
    }
  }
  ${COMMUNITY_FRAGMENT}
`;

export default COMMUNITY_HERO_IMAGE_QUERY;
