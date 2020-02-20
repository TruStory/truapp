import gql from 'graphql-tag';

const COMMUNITY_FRAGMENT = gql`
  fragment CommunityFragment on Community {
    id
    name
    iconImage {
      regular
      active
    }
    heroImage
  }
`;
export default COMMUNITY_FRAGMENT;
