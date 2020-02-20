import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import QUESTIONS_QUERY from 'shared/graphql/queries/questions.query';
import QuestionsQuery, { QuestionsQueryData } from 'shared/graphql/types/QuestionsQuery';
import { TextSize } from 'shared/styles';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import BaseText from '../Base/BaseText';
import QuestionsInputContainer from './QuestionsInputContainer';
import QuestionsList from './QuestionsList';

interface Props extends RouteComponentProps {
  account?: Account;
  claimId: ID;
  style?: React.CSSProperties;
}

// [aamirl]: This component derives responsive styles from web/src/styles/app.scss

const QuestionsComponent = (props: Props) => {
  const { claimId, style } = props;

  const renderQuestions = (result: QueryResult<QuestionsQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;

    const { claimQuestions } = data;

    const postQuestion = async (text: string) => {
      await Chain.postQuestion({ claimId, body: text });
      refetch();
    };

    const deleteQuestion = async(questionId: ID) => {
      await Chain.deleteQuestion({ id: questionId });
      refetch();
    };

    return (
      <div
        style={ { ...styles.container, ...style } }
      >
        <QuestionsInputContainer
          postQuestion={ postQuestion }
          style={ { marginBottom: Whitespace.LARGE + 4 } }
        />
        { claimQuestions.length > 0 && <BaseText bold={ true } textSize={ TextSize.H3 } style={ { paddingLeft: Whitespace.SMALL } }>Active Questions</BaseText> }
        <QuestionsList
          claimQuestions={ claimQuestions }
          style={ { paddingRight: Whitespace.SMALL, paddingLeft: Whitespace.SMALL } }
          deleteQuestion={ deleteQuestion }
        />
      </div>
    );
  };

  return (
    <QuestionsQuery query={ QUESTIONS_QUERY } variables={ { claimId } } pollInterval={ 10000 }>
      { renderQuestions }
    </QuestionsQuery>
  );

};

const styles = {
  container: { },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default withRouter(connect(mapStateToProps)(QuestionsComponent));
