import gql from 'graphql-tag';
import CREATOR_FRAGMENT from 'shared/graphql/fragments/creator.fragment';

const SLASH_FRAGMENT = gql`
  fragment SlashFragment on Slash {
    id
    argumentId
    type
    reason
    detailedReason
    creator {
      ... CreatorFragment
    }
    createdTime
  }
  ${CREATOR_FRAGMENT}
`;
export default SLASH_FRAGMENT;
