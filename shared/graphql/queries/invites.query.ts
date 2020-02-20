import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';

const INVITES_QUERY = gql`
  query InvitesQuery {
    invites {
      id
      creator {
        id
        userProfile {
          username
        }
      }
      friend {
        id
        userProfile {
          username
        }
        earnedBalance {
          ... CoinFragment
        }
        totalClaims
        totalArguments
        totalAgrees
      }
      friendEmail
      paid
      createdAt
    }
  }
  ${COIN_FRAGMENT}
`;

export default INVITES_QUERY;
