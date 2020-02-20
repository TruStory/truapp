import { throttle } from 'lodash';
import { Routes } from 'mobile/src/navigation/Routes';
import { headerStyles } from 'mobile/src/styles';
import { calculateKeyboardOffset } from 'mobile/src/utils/keyboard';
import React from 'react';
import { KeyboardAvoidingView, Linking, Platform, StyleSheet, TextInput, View } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps, SafeAreaView, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { truToast } from 'shared/components/Toast/TruToast';
import { logo_small } from 'shared/images/Logo/LogoImages';
import { checkEmail, checkUsername } from 'shared/services/auth';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { EmailValidationResult, UsernameValidationResult } from 'shared/types/validation';
import ValidationUtil from 'shared/utils/validation';

interface Props extends NavigationScreenProps {
  account?: Account;
}

const debouncedCheckEmail = throttle(checkEmail, 200);
const debouncedCheckUsername = throttle(checkUsername, 200);

const RegisterScreen = (props: Props) => {
  const { account, navigation } = props;
  const [ email, setEmail ] = React.useState('');
  const [ username, setUsername ] = React.useState('');
  const [ password, setPassword ] = React.useState('');
  const [ confirmPassword, setConfirmPassword ] = React.useState('');

  // const [ showResendEmail, setShowResendEmail ] = React.useState(false);
  const [ emailValidated, setEmailValidated  ] = React.useState(false);
  const [ passwordValidated, setPasswordValidated ] = React.useState(false);
  const [ usernameValidated, setUsernameValidated ] = React.useState(false);
  const [ confirmPasswordValidated, setConfirmPasswordValidated ] = React.useState(false);

  React.useEffect(() => {
    if (account && account.address) {
      Chain.account = new Account(account);
      navigation.navigate(Routes.Main);
    }
  }, []);

  const createAccount = async () => {
    LoadingBlanketHandler.show();
    try {
      const r = await Chain.registerUser({ email, password, full_name: username, username });
      if (r) {
        // Analytics.track(AnalyticsEventsWeb.RegistrationEmailSent);
        navigation.navigate(Routes.Verify);
      }
    } catch (err) {
      truToast(err.message);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const onChangeEmail = (text: string) => {
    debouncedCheckEmail(text, (data?: EmailValidationResult) => {
      if (data && ValidationUtil.validateEmail(text)) {
        // setShowResendEmail(!data.is_unique && !data.is_verified);
        setEmailValidated( data.is_unique );
      } else {
        // setShowResendEmail(false);
        setEmailValidated(false);
      }
    });
    setEmail(text);
  };
  const onChangeUsername = (text: string) => {
    debouncedCheckUsername(text, (data?: UsernameValidationResult) => {
      if (data && ValidationUtil.validateUsername(text)) {
        setUsernameValidated( data.is_unique );
      } else {
        setUsernameValidated(false);
      }
    });
    setUsername(text);
  };
  const onChangePassword = (text: string) => {
    setPasswordValidated(ValidationUtil.validatePassword(text));
    setPassword(text);
  };
  const onChangeConfirmPassword = (text: string) => {
    setConfirmPasswordValidated( passwordValidated && password === text );
    setConfirmPassword(text);
  };

  const disabled = !(emailValidated && usernameValidated && passwordValidated && confirmPasswordValidated);

  const openTerms = () => {
    const termsUrl = AppConfig.terms_url;
    Linking.canOpenURL(termsUrl).then(supported => {
      if (supported) {
        Linking.openURL(termsUrl);
      }
    });

  };

  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        style={ styles.container }
        behavior={ 'padding' }
        enabled={ Platform.OS === 'ios' }
        keyboardVerticalOffset={ calculateKeyboardOffset() }
      >
        <ScrollView contentContainerStyle={ [ styles.container, { flexGrow: 1, paddingVertical: Whitespace.LARGE } ] }>
          <BaseIconImageView source={ logo_small } size={ 50 } />
          <BaseText
            style={ { maxWidth: 180, marginTop: Whitespace.LARGE } }
            bold={ true }
            textSize={ TextSize.H1 }
          >
            Sign Up
          </BaseText>
          <BaseText style={ { maxWidth: 180, marginTop: Whitespace.LARGE, fontWeight: '200' } }>
            Welcome to TruStory.
          </BaseText>
          <BaseText
            align={ TextAlign.CENTER }
            style={ { maxWidth: 300, marginTop: Whitespace.TINY, marginBottom: Whitespace.LARGE, fontWeight: '200' } }
          >
            Let's pick an email and password for this account.
          </BaseText>
          <View style={ styles.inputContainer }>
            <TextInput
              style={ styles.input }
              onChangeText={ onChangeEmail }
              value={ email }
              placeholder=  { 'email' }
              placeholderTextColor={ Color.GRAY }
              autoFocus={ true }
              autoCapitalize={ 'none' }
            />
            <BaseIconView
              name={ emailValidated ? 'check' : 'x' }
              color={ emailValidated ? Color.GREEN : Color.RED  }
              style={ { position: 'absolute', right: Whitespace.MEDIUM, top: Whitespace.MEDIUM, display: email === '' ? 'none' : 'flex' } }
            />
          </View>
          <View style={ styles.inputContainer }>
            <TextInput
              style={ styles.input }
              onChangeText={ onChangeUsername }
              value={ username }
              placeholder={ 'username' }
              placeholderTextColor={ Color.GRAY }
              autoFocus={ true }
              autoCapitalize={ 'none' }
            />
            <BaseIconView
              name={ usernameValidated ? 'check' : 'x' }
              color={ usernameValidated ? Color.GREEN : Color.RED  }
              style={ { position: 'absolute', right: Whitespace.MEDIUM, top: Whitespace.MEDIUM, display: username === '' ? 'none' : 'flex' } }
            />
          </View>
          <View style={ { marginTop: Whitespace.LARGE } }>
            <BaseText color={ Color.RED } textSize={ TextSize.H6 } style={ { maxWidth: 385, width: '100%' } }>
              Use 8 or more characters
            </BaseText>
            <BaseText color={ Color.RED } textSize={ TextSize.H6 }>
              Use upper and lower case letter (e.g. Aa)
            </BaseText>
            <BaseText color={ Color.RED } textSize={ TextSize.H6 }>
              Use a number (e.g. 1234)
            </BaseText>
            <BaseText color={ Color.RED } textSize={ TextSize.H6 }>
              Use a symbol (e.g. !@#$)
            </BaseText>
          </View>
          <View style={ styles.inputContainer }>
            <TextInput
              style={ styles.input }
              onChangeText={ onChangePassword }
              value={ password }
              placeholder={ 'password' }
              placeholderTextColor={ Color.GRAY }
              autoFocus={ false }
              autoCapitalize={ 'none' }
              secureTextEntry={ true }
            />
            <BaseIconView
              name={ passwordValidated ? 'check' : 'x' }
              color={ passwordValidated ? Color.GREEN : Color.RED  }
              style={ { position: 'absolute', right: Whitespace.MEDIUM, top: Whitespace.MEDIUM, display: password === '' ? 'none' : 'flex' } }
            />
          </View>
          <View style={ styles.inputContainer }>
            <TextInput
              style={ styles.input }
              onChangeText={ onChangeConfirmPassword }
              value={ confirmPassword }
              placeholder={ 'confirm password' }
              placeholderTextColor={ Color.GRAY }
              autoFocus={ false }
              autoCapitalize={ 'none' }
              secureTextEntry={ true }
            />
            <BaseIconView
              name={ confirmPasswordValidated ? 'check' : 'x' }
              color={ confirmPasswordValidated ? Color.GREEN : Color.RED  }
              style={ { position: 'absolute', right: Whitespace.MEDIUM, top: Whitespace.MEDIUM, display: confirmPassword === '' ? 'none' : 'flex' } }
            />
          </View>
          <View style={ {  flexDirection: 'column', alignItems: 'center', marginBottom: Whitespace.LARGE * 2, width: '100%' } }>
            <BaseActionable onAction={ openTerms } style={ { marginVertical: Whitespace.MEDIUM } }>
              <BaseText
                textSize={ TextSize.H6 }
                color={ Color.GRAY }
              >
                By creating an account, I accept the
              </BaseText>
              <BaseText
                style={ { textDecorationLine: 'underline' } }
                textSize={ TextSize.H6 }
                color={ Color.GRAY }
                bold={ true }
              >
                Terms and Conditions and Privacy Policy.
              </BaseText>
            </BaseActionable>
            <BaseButton
              title={ 'Create Account' }
              accentColor={ Color.APP_PURPLE }
              color={ Color.APP_PURPLE }
              onAction={ createAccount }
              width={ 150 }
              height={ 36 }
              outline={ true }
              disabled={ disabled }
              textSize={ TextSize.H5 }
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BaseText
        color={ Color.LINE_GRAY }
        textSize={ TextSize.H6 }
        style={ { paddingTop: Whitespace.TINY } }
      >
        Copyright (C) Schelling Inc. 2019
      </BaseText>
    </SafeAreaView>
  );
};

RegisterScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  return {
    ...headerStyles,
  };
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    alignSelf: 'stretch',
    textAlignVertical: 'bottom',
    textAlign: 'center',
    padding: 0,
    paddingBottom: Whitespace.SMALL,
    borderBottomColor: Color.LINE_GRAY,
    borderBottomWidth: 1,
    marginTop: Whitespace.LARGE,
    fontWeight: '200',
  },
  inputContainer: { flexDirection: 'row', width: '100%', paddingHorizontal: Whitespace.LARGE * 2, position: 'relative' },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(RegisterScreen);
