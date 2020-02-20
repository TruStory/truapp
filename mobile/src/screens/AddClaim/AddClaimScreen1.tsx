import CloseButton from 'mobile/src/components/Buttons/CloseButton';
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
import CharacterCount from 'shared/components/CharacterCount';
import { addClaimDraftClaim } from 'shared/redux/actions/claim-draft.action';
import { ClaimDraft } from 'shared/redux/reducers/claim-draft.reducer';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { MobileFontSize } from 'shared/styles/fonts';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Settings } from 'shared/types/settings';
import ValidationUtil from 'shared/utils/validation';

interface NavigationParams {
  tempId: ID;
  claimText: string;
  settings: Settings;
}

interface Props extends NavigationScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  claim_drafts: ClaimDraft[];
  addClaimDraftClaim: (tempId: ID, claimText: string) => void;
}

const AddClaimScreen1 = (props: Props) => {

  const { navigation, addClaimDraftClaim, claim_drafts } = props;
  const tempId = 1; // this is what we are using for now until we are able to show a selection screen for drafts
  const find: ClaimDraft | undefined = claim_drafts.find((draft: ClaimDraft) => draft.tempId === tempId);
  const [ value, setValue ] = React.useState(find && find.claimText ? find.claimText : '');

  useEffect(() => {
    navigation.setParams({ claimText: value, tempId });
  }, []);

  const onChangeText = (claimText: string) => {
    addClaimDraftClaim(tempId, claimText);
    setValue(claimText);
    navigation.setParams({ claimText });
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
        placeholder={ `What's the claim?` }
        autoFocus={ true }
      />
    </KeyboardAvoidingView>
  );
};

AddClaimScreen1.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  const claimText = navigation.getParam('claimText');
  const settings: Settings = navigation.getParam('settings');
  const minClaimLength = settings.minClaimLength;
  const maxClaimLength = settings.maxClaimLength;

  const validate = (): string[] => {
    return ValidationUtil.errors({
      claimText: [
        ValidationUtil.err(ValidationUtil.minLength(claimText, minClaimLength),
          `The claim must be at least ${minClaimLength} characters long`),
        ValidationUtil.err(ValidationUtil.maxLength(claimText, maxClaimLength),
          `The claim must be less than ${maxClaimLength} characters long`),
      ],
    });
  };

  const onNext = () => {
    const tempId = navigation.getParam('tempId');
    const validateResults = validate();
    if (validateResults.length === 0) {
      navigation.navigate(Routes.AddClaimScreen2, { tempId, settings });
    } else {
      AlertModalHandler.alert('Oops!', validateResults[0]);
    }
  };

  return {
    ...headerStyles,
    headerTitle: (
      <View style={ { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 } }>
        <BaseText bold={ true }>Claim</BaseText>
        <CharacterCount textSize={ TextSize.H6 } minSize={ minClaimLength } maxSize={ maxClaimLength } text={ !claimText ? '' : claimText } />
      </View>
    ),
    headerLeft: <CloseButton />,
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
  addClaimDraftClaim: (tempId: ID, claimText: string) => {
    return dispatch(addClaimDraftClaim(tempId, claimText));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddClaimScreen1);
