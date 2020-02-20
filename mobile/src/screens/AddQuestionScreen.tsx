import { headerStyles } from 'mobile/src/styles';
import { calculateKeyboardOffset } from 'mobile/src/utils/keyboard';
import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import Chain from 'shared/blockchain';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseText from 'shared/components/Base/BaseText';
import CharacterCount from 'shared/components/CharacterCount';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import ValidationUtil from 'shared/utils/validation';

interface NavigationParams {
  claimId: ID;
  questionText: string;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

const AddQuestionScreen = (props: Props) => {

  const { navigation } = props;
  const [ value, setValue ] = React.useState('');

  useEffect(() => {
    navigation.setParams({ questionText: value });
  }, []);

  const onChangeText = (questionText: string) => {
    setValue(questionText);
    navigation.setParams({ questionText });
  };

  return (
    <KeyboardAvoidingView
      style={ styles.container }
      behavior={ 'padding' }
      enabled={ Platform.OS === 'ios' }
      keyboardVerticalOffset={ calculateKeyboardOffset() }
    >
      <TextInput
        multiline={ true }
        style={ styles.input }
        onChangeText={ onChangeText }
        value={ value }
        placeholder={ `What's your question?` }
        autoFocus={ true }
      />
    </KeyboardAvoidingView>
  );
};

AddQuestionScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  const claimId = navigation.getParam('claimId');
  const questionText = navigation.getParam('questionText', '');
  const minQuestionLength = 5;
  const maxQuestionLength = 1000;

  const validate = (): string[] => {
    return ValidationUtil.errors({
      questionText: [
        ValidationUtil.err(ValidationUtil.minLength(questionText, minQuestionLength),
          `The claim must be at least ${minQuestionLength} characters long`),
        ValidationUtil.err(ValidationUtil.maxLength(questionText, maxQuestionLength),
          `The claim must be less than ${maxQuestionLength} characters long`),
      ],
    });
  };

  const onDismiss = () => { navigation.dismiss(); };
  const onNext = async () => {
    const validateResults = validate();
    if (validateResults.length === 0) {
      await Chain.postQuestion({ claimId, body: questionText });
      navigation.dismiss();
    } else {
      AlertModalHandler.alert('Oops!', validateResults[0]);
    }
  };

  return {
    ...headerStyles,
    headerTitle: (
      <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } }>
        <BaseText bold={ true }>Ask A Question</BaseText>
        <CharacterCount textSize={ TextSize.H6 } minSize={ minQuestionLength } maxSize={ maxQuestionLength } text={ questionText } />
      </View>
    ),
    headerLeft: (
      <BaseButton
        outline={ true }
        color={ Color.APP_PURPLE }
        accentColor={ Color.WHITE }
        style={ { paddingHorizontal: 0, paddingLeft: Whitespace.SMALL } }
        title={ 'Cancel' }
        onAction={ onDismiss }
        width={ 'auto' }
      />
    ),
    headerRight: (
      <BaseButton
        outline={ true }
        color={ Color.APP_PURPLE }
        accentColor={ Color.WHITE }
        style={ { paddingHorizontal: 0, paddingRight: Whitespace.SMALL } }
        title={ 'Post' }
        onAction={ onNext }
        width={ 'auto' }
      />
      ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: Whitespace.SMALL,
    paddingRight: Whitespace.SMALL,
    paddingTop: Whitespace.MEDIUM,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    padding: 0,
  },
});

export default AddQuestionScreen;
