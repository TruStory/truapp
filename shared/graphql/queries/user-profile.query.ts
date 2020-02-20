import gql from 'graphql-tag';
import COIN_FRAGMENT from 'shared/graphql/fragments/coin.fragment';

const USER_PROFILE_QUERY = gql`
  query UserProfileQuery($addresses: [String]) {
    users(addresses: $addresses) {
      id
      sequence
      coins {
        ... CoinFragment
      }
      userProfile {
        avatarURL
        fullName
        username
      }
      transactions {
        id
        transactionType
        story {
          id
          state
          body
        }
        createdTime
        amount {
          ... CoinFragment
        }
      }
    }
  }
  ${COIN_FRAGMENT}
`;

export default USER_PROFILE_QUERY;
