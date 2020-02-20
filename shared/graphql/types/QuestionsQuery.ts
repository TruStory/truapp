import { Query } from 'react-apollo';
import { ID } from 'shared/types';
import { Question } from 'shared/types/questions';

export interface QuestionsQueryData {
  claimQuestions: Question[];
}

interface Variables {
  claimId: ID;
}

export default class QuestionsQuery extends Query<QuestionsQueryData, Variables> { }
