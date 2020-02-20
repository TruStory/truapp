import { Routes } from 'mobile/src/navigation/Routes';
import { headerStyles } from 'mobile/src/styles';
import { calculateKeyboardOffset } from 'mobile/src/utils/keyboard';
import React, { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseText from 'shared/components/Base/BaseText';
import { addClaimDraftSource } from 'shared/redux/actions/claim-draft.action';
import { ClaimDraft } from 'shared/redux/reducers/claim-draft.reducer';
import { Color } from 'shared/styles/colors';
import { MobileFontSize } from 'shared/styles/fonts';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Settings } from 'shared/types/settings';
import ValidationUtil from 'shared/utils/validation';

interface NavigationParams {
  tempId: ID;
  sourceText: string;
  settings: Settings;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  claim_drafts: ClaimDraft[];
  addClaimDraftSource: (tempId: ID, claimText: string) => void;
}

const AddClaimScreen3 = (props: Props) => {

  const { navigation, addClaimDraftSource, claim_drafts } = props;
  const tempId = navigation.getParam('tempId');
  const find: ClaimDraft | undefined = claim_drafts.find((draft: ClaimDraft) => draft.tempId === tempId);
  const [ value, setValue ] = React.useState(find && find.sourceText ? find.sourceText : '');

  useEffect(() => {
    navigation.setParams({ sourceText: value });
  }, []);

  const onChangeText = (sourceText: string) => {
    setValue(sourceText);
    addClaimDraftSource(tempId, sourceText);
    navigation.setParams({ sourceText });
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
        placeholder={ `Do you have a source?` }
        autoFocus={ true }
        autoCapitalize={ 'none' }
      />
    </KeyboardAvoidingView>
  );
};

AddClaimScreen3.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  const sourceText = navigation.getParam('sourceText');
  const settings: Settings = navigation.getParam('settings');
  const minSourceLength = 0;
  const maxSourceLength = 1000;

  const validate = (): string[] => {
    return ValidationUtil.errors({
      sourceText: [
        ValidationUtil.err(ValidationUtil.minLength(sourceText, minSourceLength),
          `The claim source must be at least ${minSourceLength} characters long`),
        ValidationUtil.err(ValidationUtil.maxLength(sourceText, maxSourceLength),
          `The claim source must be less than ${maxSourceLength} characters long`),
      ],
    });
  };

  const onNext = () => {
    const tempId = navigation.getParam('tempId');
    const validateResults = validate();
    if (validateResults.length === 0) {
      if (ValidationUtil.validateUrl(ValidationUtil.prefixUrl(sourceText)) || sourceText.trim() === '') {
        navigation.navigate(Routes.AddClaimScreen4, { tempId, settings });
      } else {
        AlertModalHandler.alert('Oops!', 'Please enter a valid url.');
      }
    } else {
      AlertModalHandler.alert('Oops!', validateResults[0]);
    }
  };

  return {
    ...headerStyles,
    headerTitle: (
      <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 } }>
        <BaseText bold={ true }>Add Source (optional)</BaseText>
      </View>
    ),
    headerRight: (
      <BaseButton
        outline={ true }
        color={ Color.APP_PURPLE }
        accentColor={ Color.WHITE }
        style={ { paddingHorizontal: 0, paddingRight: Whitespace.SMALL } }
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
    paddingTop: Whitespace.MEDIUM,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    padding: 0,
    fontSize: MobileFontSize.H4,
  },
});

const mapStateToProps = (state: any) => {
  return {
    claim_drafts: state.claim_drafts.claim_drafts,
  };
};
const mapDispatchToProps = (dispatch: any) => ({
  addClaimDraftSource: (tempId: ID, sourceText: string) => {
    return dispatch(addClaimDraftSource(tempId, sourceText));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddClaimScreen3);
