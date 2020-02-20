import CloseButton from 'mobile/src/components/Buttons/CloseButton';
import ClaimHeader from 'mobile/src/components/Claim/ClaimHeader';
import MarkdownInput from 'mobile/src/components/Markdown/MarkdownInput';
import { Routes } from 'mobile/src/navigation/Routes';
import { headerStyles } from 'mobile/src/styles';
import { calculateKeyboardOffset } from 'mobile/src/utils/keyboard';
import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseButton from 'shared/components/Base/BaseButton';
import CharacterCount from 'shared/components/CharacterCount';
import { addDraftArgument } from 'shared/redux/actions/argument-draft.action';
import { ArgumentDraft } from 'shared/redux/reducers/argument-draft.reducer';
import { Color } from 'shared/styles/colors';
import { actionSheetBottomPadding } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Settings } from 'shared/types/settings';
import ValidationUtil from 'shared/utils/validation';

interface NavigationParams {
  claimId: ID;
  argumentId?: ID;
  edit?: boolean;
  argumentText: string;
  settings: Settings;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  drafts: ArgumentDraft[];
  addDraftArgument: (claimId: ID, argumentText: string) => void;
}

const AddArgumentScreen1 = (props: Props) => {

  const { navigation, addDraftArgument, drafts } = props;
  const claimId = navigation.getParam('claimId');

  const find = drafts.find((draft: ArgumentDraft) => draft.claimId === claimId);
  const [ value, setValue ] = React.useState(find && find.argumentText ? find.argumentText : '');

  useEffect(() => {
    navigation.setParams({ argumentText: value });
  }, []);

  const onMarkdownGenerated = (argumentText: string) => {
    setValue(argumentText);
    addDraftArgument(claimId, argumentText);
    navigation.setParams({ argumentText });
  };

  return (
    <KeyboardAvoidingView
      style={ styles.container }
      behavior={ 'padding' }
      enabled={ Platform.OS === 'ios' }
      keyboardVerticalOffset={ calculateKeyboardOffset() - actionSheetBottomPadding }
    >
      <ClaimHeader claimId={ claimId } header={ true } />
      <MarkdownInput
        value={ value }
        onChange={ onMarkdownGenerated }
        color={ Color.APP_BLACK }
        autoFocus={ true }
        placeholder={ `What's your argument?` }
        style={ { flex: 1, paddingBottom: actionSheetBottomPadding } }
        inputStyle={ { flex: 1, paddingTop: Whitespace.LARGE } }
      />
    </KeyboardAvoidingView>
  );

};

AddArgumentScreen1.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  const argumentText = navigation.getParam('argumentText');
  const claimId = navigation.getParam('claimId');
  const argumentId = navigation.getParam('argumentId', ''); // for edits
  const edit = navigation.getParam('edit', false);

  const settings: Settings = navigation.getParam('settings');
  const minArgumentLength = settings.argumentBodyMinLength;
  const maxArgumentLength = settings.argumentBodyMaxLength;

  const validate = (): string[] => {
    return ValidationUtil.errors({
      argumentText: [
        ValidationUtil.err(ValidationUtil.minLength(argumentText, minArgumentLength),
          `The argument must be at least ${minArgumentLength} characters long`),
        ValidationUtil.err(ValidationUtil.maxLength(argumentText, maxArgumentLength),
          `The argument must be less than ${maxArgumentLength} characters long`),
      ],
    });
  };

  const validateResults = validate();
  const onNext = () => {
    if (validateResults.length === 0) {
      navigation.navigate(Routes.AddArgumentScreen2, { claimId, settings, edit, argumentId });
    } else {
      AlertModalHandler.alert('Oops!', validateResults[0]);
    }
  };

  return {
    ...headerStyles,
    headerTitle: (
      <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 } }>
        <CharacterCount
          minSize={ minArgumentLength }
          maxSize={ maxArgumentLength }
          text={ !argumentText ? '' : argumentText }
          includeAddressLength={ true }
          />
      </View>
    ),
    headerLeft: <CloseButton />,
    headerRight: (
      <BaseButton
        outline={ true }
        color={ Color.APP_PURPLE }
        disabled={ validateResults.length !== 0 }
        accentColor={ Color.WHITE }
        style={ { paddingHorizontal: 0, paddingRight: Whitespace.SMALL, borderWidth: 0 } }
        title={ 'Next' }
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
    paddingTop: Whitespace.TINY,
  },
});

const mapStateToProps = (state: any) => {
  return {
    drafts: state.drafts.drafts,
  };
};
const mapDispatchToProps = (dispatch: any) => ({
  addDraftArgument: (claimId: ID, argumentText: string) => {
    return dispatch(addDraftArgument(claimId, argumentText));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddArgumentScreen1);
