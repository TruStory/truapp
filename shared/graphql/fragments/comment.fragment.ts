import gql from 'graphql-tag';
import CREATOR_FRAGMENT from 'shared/graphql/fragments/creator.fragment';

const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    id
    body
    claimId
    argumentId
    elementId
    creator {
      ... CreatorFragment
    }
    createdAt
  }
  ${CREATOR_FRAGMENT}
`;
export default COMMENT_FRAGMENT;
