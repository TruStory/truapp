import * as React from 'react';
import { StyleProp } from 'react-native';
import { connect } from 'react-redux';
import QuestionItem from 'shared/components/Questions/QuestionItem';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Question } from 'shared/types/questions';

interface QuestionsListProps {
  account: Account;
  claimQuestions: Question[];
  style?: StyleProp<any> & React.CSSProperties;
  deleteQuestion: (questionId: ID) => void;
}

const QuestionsList = (props: QuestionsListProps) => {
  const { claimQuestions, style, deleteQuestion } = props;

  claimQuestions.sort((a: Question, b: Question) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const listJsx: React.ReactNode[] = [];
  claimQuestions.map((question: Question, index) => {

    listJsx.push(
      <div
        key={ index.toString() }
        style={ { ...styles.questionContainer } }
      >
        <QuestionItem
          question={ question }
          deleteQuestion={ deleteQuestion }
        />
      </div>,
    );
  });

  return (
    <div style={ { ...styles.container, ...style } }>
      { listJsx }
    </div>
  );
};

const styles = {
  container: {
    overflow: 'auto',
  },
  questionContainer: {
    marginBottom: Whitespace.LARGE + Whitespace.SMALL + 2,
    marginTop: Whitespace.LARGE + Whitespace.SMALL + 2,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(QuestionsList);
