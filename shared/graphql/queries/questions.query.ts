import gql from 'graphql-tag';
import QUESTION_FRAGMENT from 'shared/graphql/fragments/question.fragment';

const QUESTIONS_QUERY = gql`
  query QuestionsQuery($claimId: ID!) {
    claimQuestions(id: $claimId) {
      ... QuestionFragment
    }
  }
  ${QUESTION_FRAGMENT}
`;

export default QUESTIONS_QUERY;
