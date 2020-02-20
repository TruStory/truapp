import gql from 'graphql-tag';
import COMMUNITY_FRAGMENT from 'shared/graphql/fragments/community.fragment';

const COMMUNITIES_QUERY = gql`
  query CommunitiesQuery {
    communities {
      ...CommunityFragment
    }
  }
  ${COMMUNITY_FRAGMENT}
`;

export default COMMUNITIES_QUERY;
