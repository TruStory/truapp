import gql from 'graphql-tag';
import BASE_CLAIM_FRAGMENT from './base-claim.fragment';
import CREATOR_FRAGMENT from './creator.fragment';

const APP_ACCOUNT_CLAIM_FRAGMENT = gql`
  fragment AppAccountClaimFragment on Claim {
    ... BaseClaimFragment
    argumentCount
    participantsCount
    participants {
      ... CreatorFragment
    }
  }
  ${BASE_CLAIM_FRAGMENT}
  ${CREATOR_FRAGMENT}
`;
export default APP_ACCOUNT_CLAIM_FRAGMENT;
