import gql from 'graphql-tag';
import ARGUMENT_FRAGMENT from 'shared/graphql/fragments/argument.fragment';

const ARGUMENT_QUERY = gql`
  query ArgumentQuery($argumentId: ID!) {
    claimArgument(id: $argumentId) {
      ... ArgumentFragment
    }
  }
  ${ARGUMENT_FRAGMENT}
`;

export default ARGUMENT_QUERY;
