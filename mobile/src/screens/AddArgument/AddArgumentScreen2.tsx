
import { Routes } from 'mobile/src/navigation/Routes';
import { headerStyles } from 'mobile/src/styles';
import { calculateKeyboardOffset } from 'mobile/src/utils/keyboard';
import * as React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseButton from 'shared/components/Base/BaseButton';
import CharacterCount from 'shared/components/CharacterCount';
import { addDraftSummary } from 'shared/redux/actions/argument-draft.action';
import { ArgumentDraft } from 'shared/redux/reducers/argument-draft.reducer';
import { Color } from 'shared/styles/colors';
import { MobileFontSize } from 'shared/styles/fonts';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Settings } from 'shared/types/settings';
import ValidationUtil from 'shared/utils/validation';

interface NavigationParams {
  claimId: ID;
  argumentId?: ID;
  edit?: boolean;
  settings: Settings;
  summaryText?: string;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  drafts: ArgumentDraft[];
  addDraftSummary: (claimId: ID, summaryText: string) => void;
}

const AddArgumentScreen2 = (props: Props) => {
  const { navigation, drafts, addDraftSummary } = props;
  const claimId = navigation.getParam('claimId');
  const find = drafts.find((draft: ArgumentDraft) => draft.claimId === claimId);
  const [ value, setValue ] = React.useState(find && find.summaryText ? find.summaryText : '');

  React.useEffect(() => {
    navigation.setParams({ summaryText: value });
  }, []);

  const onChangeText = (summaryText: string) => {
    setValue(summaryText);
    addDraftSummary(claimId, summaryText);
    navigation.setParams({ summaryText });
  };

  return(
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
        placeholder={ `Summarize your argument so it's easier to read for others!` }
        autoFocus={ true }
      />
    </KeyboardAvoidingView>
  );
};

AddArgumentScreen2.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  const summaryText = navigation.getParam('summaryText');
  const claimId = navigation.getParam('claimId');
  const argumentId = navigation.getParam('argumentId'); // for edit
  const edit = navigation.getParam('edit', false);
  const settings: Settings = navigation.getParam('settings');
  const { argumentSummaryMaxLength, argumentBodyMinLength } = settings;

  const validate = (): string[] => {
    return ValidationUtil.errors({
      summaryText: [
        ValidationUtil.err(ValidationUtil.minLength(summaryText, argumentBodyMinLength),
          `The argument summary must be at least ${argumentBodyMinLength} characters long`),
        ValidationUtil.err(ValidationUtil.maxLength(summaryText, argumentSummaryMaxLength),
          `The argument summary must be less than ${argumentSummaryMaxLength} characters long`),
      ],
    });
  };

  const validateResults = validate();
  const onNext = () => {
    if (validateResults.length === 0) {
      navigation.navigate(Routes.AddArgumentScreen3, { claimId, edit, argumentId });
    } else {
      AlertModalHandler.alert('Oops!', validateResults[0]);
    }
  };

  return {
    ...headerStyles,
    headerTitle: (
      <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 } }>
        <CharacterCount
          minSize={ argumentBodyMinLength }
          maxSize={ argumentSummaryMaxLength }
          text={ !summaryText ? '' : summaryText }
        />
      </View>
    ),
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
    drafts: state.drafts.drafts,
  };
};
const mapDispatchToProps = (dispatch: any) => ({
  addDraftSummary: (claimId: ID, summaryText: string) => {
    return dispatch(addDraftSummary(claimId, summaryText));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddArgumentScreen2);
