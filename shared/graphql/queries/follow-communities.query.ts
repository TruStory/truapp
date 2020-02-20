import gql from 'graphql-tag';
import COMMUNITY_FRAGMENT from 'shared/graphql/fragments/community.fragment';

const FOLLOW_COMMUNITIES_QUERY = gql`
  query FollowCommunitiesQuery {
    communities {
      following
      ...CommunityFragment
      description
    }
  }
  ${COMMUNITY_FRAGMENT}
`;

export default FOLLOW_COMMUNITIES_QUERY;
