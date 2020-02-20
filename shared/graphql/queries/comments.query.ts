import gql from 'graphql-tag';
import COMMENT_FRAGMENT from 'shared/graphql/fragments/comment.fragment';
import PAGE_INFO_FRAGMENT from 'shared/graphql/fragments/page-info.fragment';

const COMMENTS_QUERY = gql`
  query CommentsQuery($claimId: ID!, $argumentId: ID, $elementId: ID, $first: Number, $after: Number) {
    comments(id: $claimId, claimId: $claimId, argumentId: $argumentId, elementId: $elementId, first: $first, after: $after) {
      edges {
        node {
          ... CommentFragment
        }
        cursor
      }
      ... PageInfoFragment
    }
  }
  ${COMMENT_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export default COMMENTS_QUERY;
