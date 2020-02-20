import gql from 'graphql-tag';
import COMMUNITY_FRAGMENT from 'shared/graphql/fragments/community.fragment';

const FOLLOW_COMMUNITY_QUERY = gql`
  query FollowCommunityQuery($communityId: string) {
    community(communityId: $communityId) {
      following
      ... CommunityFragment
    }
  }
  ${COMMUNITY_FRAGMENT}
`;

export default FOLLOW_COMMUNITY_QUERY;
