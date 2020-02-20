import * as React from 'react';
import { FlatList, ListRenderItemInfo, StyleProp, StyleSheet, View } from 'react-native';
import QuestionItem from 'shared/components/Questions/QuestionItem';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Comment } from 'shared/types/comments';
import { Question } from 'shared/types/questions';

interface QuestionsListProps {
  claimQuestions: Question[];
  style?: StyleProp<any> & React.CSSProperties;
  deleteQuestion: (questionId: ID) => void;
}

const CommentsList = (props: QuestionsListProps) => {
  const { claimQuestions, style, deleteQuestion } = props;

  claimQuestions.sort((a: Question, b: Question) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  const renderQuestion = (rowData: ListRenderItemInfo<Comment>) => {
    return (
      <View style={ [ styles.questionContainer ] }>
        <QuestionItem question={ rowData.item } deleteQuestion={ deleteQuestion } />
      </View>
    );
  };

  const keyExtractor = (item: Comment, index: number) => index.toString();

  return (
    <View style={ [ styles.container, style ] }>
      <FlatList
        keyExtractor={ keyExtractor }
        data={ claimQuestions }
        initialNumToRender={ claimQuestions.length }
        renderItem={ renderQuestion }
        keyboardDismissMode={ 'interactive' }
        contentContainerStyle={ styles.container }
        onScrollToIndexFailed={ (err: any) => console.log(err) }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
  questionContainer: {
    marginBottom: Whitespace.MEDIUM,
    paddingHorizontal: Whitespace.SMALL,
  },
});

export default CommentsList;
