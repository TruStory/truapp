import gql from 'graphql-tag';

const REFERRED_USERS_QUERY = gql`
  query ReferredUsersQuery {
    referredAppAccounts {
        id
        userProfile {
          avatarURL
          fullName
          username
          bio
        }
        userJourney
    }
  }
`;

export default REFERRED_USERS_QUERY;
