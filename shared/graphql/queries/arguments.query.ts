import gql from 'graphql-tag';
import ARGUMENT_FRAGMENT from 'shared/graphql/fragments/argument.fragment';

const ARGUMENTS_QUERY = gql`
  query ArgumentsQuery($claimId: ID!, $sort: Int, $cacheBuster: ID) {
    claimArguments(id: $claimId, sort: $sort) {
      ... ArgumentFragment
    }
  }
  ${ARGUMENT_FRAGMENT}
`;

export default ARGUMENTS_QUERY;
