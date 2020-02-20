import gql from 'graphql-tag';

const CREATOR_FRAGMENT = gql`
  fragment CreatorFragment on AppAccount {
    id
    userProfile {
      avatarURL
      fullName
      username
    }
  }
`;
export default CREATOR_FRAGMENT;
