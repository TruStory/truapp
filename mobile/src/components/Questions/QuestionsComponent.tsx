import QuestionsList from 'mobile/src/components/Questions/QuestionsList';
import * as React from 'react';
import { QueryResult } from 'react-apollo';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import QUESTIONS_QUERY from 'shared/graphql/queries/questions.query';
import QuestionsQuery, { QuestionsQueryData } from 'shared/graphql/types/QuestionsQuery';
import { TextSize } from 'shared/styles';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';

interface Props {
  account?: Account;
  claimId: ID;
  style?: React.CSSProperties;
}

const QuestionsComponent = (props: Props) => {
  const { claimId, style } = props;

  const renderQuestions = (result: QueryResult<QuestionsQueryData, any>) => {
    const { loading, error, data, refetch } = result;
    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;

    const { claimQuestions } = data;

    const deleteQuestion = async(questionId: ID) => {
      await Chain.deleteQuestion({ id: questionId });
      refetch();
    };

    return (
      <View
        style={ [styles.container, style ] }
      >
        { claimQuestions.length > 0 && <BaseText bold={ true } textSize={ TextSize.H3 } style={ { paddingLeft: Whitespace.SMALL, paddingBottom: Whitespace.TINY } }>Active Questions</BaseText> }
        <QuestionsList
          claimQuestions={ claimQuestions }
          deleteQuestion={ deleteQuestion }
        />
      </View>
    );
  };

  return (
    <QuestionsQuery query={ QUESTIONS_QUERY } variables={ { claimId } } pollInterval={ 10000 }>
      { renderQuestions }
    </QuestionsQuery>
  );

};

const styles = StyleSheet.create({
  container: { },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(QuestionsComponent);
