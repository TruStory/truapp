import gql from 'graphql-tag';
import ARGUMENT_FRAGMENT from 'shared/graphql/fragments/argument.fragment';
import SLASH_FRAGMENT from 'shared/graphql/fragments/slash.fragment';

const SLASHES_QUERY = gql`
  query SlashesQuery {
    slashes {
      ...SlashFragment
      argument {
        ...ArgumentFragment
      }
    }
  }
  ${SLASH_FRAGMENT}
  ${ARGUMENT_FRAGMENT}
`;

export default SLASHES_QUERY;
