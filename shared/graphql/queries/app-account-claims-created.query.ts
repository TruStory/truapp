import gql from 'graphql-tag';
import PAGE_INFO_FRAGMENT from 'shared/graphql/fragments/page-info.fragment';
import APP_ACCOUNT_CLAIM_FRAGMENT from '../fragments/app-account-claim.fragment';

const APP_ACCOUNT_CLAIMS_CREATED_QUERY = gql`
  query AppAccountClaimsWithArguments($id: String, $first: Number, $after: String) {
    appAccountClaimsCreated(id: $id, first: $first, after: $after) {
      edges {
        node {
          ... AppAccountClaimFragment
        }
        cursor
      }
      ... PageInfoFragment
    }
  }
  ${APP_ACCOUNT_CLAIM_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export default APP_ACCOUNT_CLAIMS_CREATED_QUERY;
