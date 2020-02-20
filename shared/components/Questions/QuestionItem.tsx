import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import AppAccountInfo from 'shared/components/AppAccount/AppAccountInfo';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Question } from 'shared/types/questions';
import { Settings } from 'shared/types/settings';

interface Props {
  question: Question;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
  deleteQuestion: (questionId: ID) => void;
  account?: Account;
  settings: Settings;
}

const QuestionItem = (props: Props) => {
  const { question, style, account, settings, deleteQuestion } = props;
  const { creator, body } = question;

  const onDeleteQuestion = () => deleteQuestion(question.id);

  const renderDeleteButton = () => {
    if (account && settings.claimAdmins.includes(account.id)) {
      return (
        <BaseActionable onAction={ onDeleteQuestion } style={ { marginLeft: Whitespace.LARGE } }>
          <BaseIconView name={ 'trash' } color={ Color.RED } />
        </BaseActionable>
      );

    }
  };

  return (
    <View style={ [ styles.container, style ] }>
      <View style={ { flex: 1 } }>
        <View style={ styles.commentInfoContainer }>
          <AppAccountInfo appAccount={ creator } textSize={ TextSize.H6 } avatarSize={ AvatarSize.SMALL } />
        </View>
        <BaseText style={ { marginTop: Whitespace.TINY } }>{ body }</BaseText>
      </View>
      { renderDeleteButton() }
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  commentInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(QuestionItem);
