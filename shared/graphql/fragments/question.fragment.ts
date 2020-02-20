import gql from 'graphql-tag';
import CREATOR_FRAGMENT from 'shared/graphql/fragments/creator.fragment';

const QUESTION_FRAGMENT = gql`
  fragment QuestionFragment on ClaimQuestion {
    id
    body
    claimId
    creator {
      ... CreatorFragment
    }
    createdAt
  }
  ${CREATOR_FRAGMENT}
`;
export default QUESTION_FRAGMENT;
