import gql from 'graphql-tag';

const COIN_FRAGMENT = gql`
  fragment CoinFragment on Coin {
    amount
    denom
    humanReadable
  }
`;
export default COIN_FRAGMENT;
