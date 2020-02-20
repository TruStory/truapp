import EmailRecovery from 'mobile/src/components/Auth/EmailRecovery';
import SignInWithTwitter from 'mobile/src/components/SignInWithTwitter';
import { Routes } from 'mobile/src/navigation/Routes';
import { calculateNoHeaderKeyboardOffset } from 'mobile/src/utils/keyboard';
import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import { DevicePlatformType } from 'shared/blockchain/types';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { truToast } from 'shared/components/Toast/TruToast';
import { logo_small } from 'shared/images/Logo/LogoImages';
import { AuthSetCurrentAccount, setCurrentAccount } from 'shared/redux/actions/auth.action';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { TwitterLoginResponse } from 'shared/types/twitter';
import Analytics, { AnalyticsEventsMobile } from 'shared/utils/analytics';

interface Props extends NavigationScreenProps {
  account?: Account;
  device: { token: string, platform: DevicePlatformType};
  setCurrentAccount: (account: Account) => AuthSetCurrentAccount;
}

const LoginScreen = (props: Props) => {
  const { account, device, navigation, setCurrentAccount } = props;
  const [ loading, setLoading ] = React.useState(true);
  const [ identifier, setIdentifier ] = React.useState('');
  const [ password, setPassword ] = React.useState('');

  const [ showResendEmail, setShowResendEmail ] = React.useState(false);
  const onEmailSent = () => setShowResendEmail(false);

  const onForgotPassword = () => navigation.navigate(Routes.AccountRecovery);

  React.useEffect(() => {
    if (account && account.address) {
      Chain.account = new Account(account);
      navigation.navigate(Routes.Main);
    } else {
      setLoading(false);
    }
  }, []);
  const registerPushToken = async (acc: Account) => {

    //  Store the users APNS Device Token with truchaind
    if (acc && device && device.token) {
      try {
        await Chain.registerDeviceToken({
          address: acc.address,
          token: device.token,
          platform: device.platform,
        });
      }
      catch (e) {
        console.log(e);
      }
    }else {
      console.log('no device token found');
    }
  };

  const onClickTwitterAction = async (response: TwitterLoginResponse | undefined) => {
    setLoading(true);
    try {
      if (!response) {
        AlertModalHandler.alert('Uh oh!', 'There was an error retrieving your Twitter profile. Please try again.');
        return;
      }

      const resp = await Chain.register({
        authToken: response.authToken,
        authTokenSecret: response.authTokenSecret,
      });
      if (Chain.account) {
        Analytics.register(Chain.account.id, Chain.account.userProfile.fullName, Chain.account.userProfile.username, resp.group,  resp.signedUp);
        setCurrentAccount(Chain.account);
        registerPushToken(Chain.account);
      }
      Analytics.track(AnalyticsEventsMobile.SuccessfulLogin);
      navigation.navigate(Routes.Main);
    } catch (err) {
      const errMessage = err.message || err;
      AlertModalHandler.alert('Uh oh!', errMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = () => {
    Analytics.track(AnalyticsEventsMobile.SignUpWithEmailClicked);
    navigation.navigate(Routes.Register);
  };
  const login = async () => {
    LoadingBlanketHandler.show();
    try {
      const resp = await Chain.loginUser({ identifier, password });
      if (Chain.account) {
        Analytics.register(Chain.account.id, Chain.account.userProfile.fullName, Chain.account.userProfile.username, resp.group,  resp.signedUp);
        setCurrentAccount(Chain.account);
        registerPushToken(Chain.account);
      }
      Analytics.track(AnalyticsEventsMobile.SuccessfulLogin);
      navigation.navigate(Routes.Main);
    } catch (err) {
      truToast(err.message);
      if (err.message === 'Please verify your email.') {
        setShowResendEmail(true);
      } else {
        setShowResendEmail(false);
      }
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  if (loading) {
    return (
      <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
        <BaseLoadingIndicator />
      </View>
    );
  }

  const rightIcon = (
    <BaseIconView
      name={ 'arrow-right' }
      family={ 'Feather' }
      color={ Color.APP_PURPLE }
      size={ IconSize.XSMALL }
      style={ { marginLeft: Whitespace.TINY } }
    />
  );

  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        behavior={ 'padding' }
        enabled={ Platform.OS === 'ios' }
        style={ styles.container }
        keyboardVerticalOffset={ calculateNoHeaderKeyboardOffset() }
      >
        <ScrollView
          showsVerticalScrollIndicator={ false }
          contentContainerStyle={ [ styles.container, { flexGrow: 1, paddingVertical: Whitespace.LARGE } ] }
        >
          <BaseIconImageView source={ logo_small } size={ 50 } />
          <BaseText
            align={ TextAlign.CENTER }
            style={ { maxWidth: 220, marginTop: Whitespace.LARGE, marginBottom: Whitespace.LARGE } }
          >
            Sign in to learn, debate and have healthy conversation
          </BaseText>
          <SignInWithTwitter onClick={ onClickTwitterAction } width={ 250 } />
          <BaseText style={ { marginTop: Whitespace.LARGE + Whitespace.SMALL, marginBottom: Whitespace.SMALL } }>or sign in with</BaseText>
          <TextInput
            style={ styles.input }
            onChangeText={ setIdentifier }
            value={ identifier }
            placeholder={ 'email or username' }
            placeholderTextColor={ Color.GRAY }
            autoFocus={ true }
            autoCapitalize={ 'none' }
          />
          <TextInput
            style={ styles.input }
            onChangeText={ setPassword }
            value={ password }
            placeholderTextColor={ Color.GRAY }
            placeholder={ 'password' }
            autoFocus={ false }
            autoCapitalize={ 'none' }
            secureTextEntry={ true }
          />
          <EmailRecovery
            identifier={ identifier }
            visible={ showResendEmail }
            onEmailSent={ onEmailSent }
            style={ { marginVertical: Whitespace.SMALL } }
          />
          <View style={ { justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginVertical: Whitespace.LARGE * 2, width: 275 } }>
            <BaseActionable onAction={ register }>
              <BaseText>Sign Up</BaseText>
            </BaseActionable>
            <BaseButton
              title={ 'Log In' }
              icon={ rightIcon }
              onAction={ login }
              accentColor={ Color.APP_PURPLE }
              color={ Color.APP_PURPLE }
              iconAlign={ 'right' }
              height={ 36 }
              width={ 100 }
              outline={ true }
              borderRadius={ Whitespace.LARGE }
              disabled={ false }
              textSize={ TextSize.H5 }
            />
          </View>
          <View style={ { justifyContent: 'center', alignItems: 'center', marginBottom: Whitespace.LARGE } }>
            <BaseActionable onAction={ onForgotPassword }>
              <BaseText
                style={ { textDecorationLine: 'underline' } }
                color={ Color.GRAY }
                textSize={ TextSize.H5 }
              >
                Forgot Password?
              </BaseText>
            </BaseActionable>
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

LoginScreen.navigationOptions = {
  header: null,
  title: ' ',
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
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
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  device: state.device,
});

const mapDispatchToProps = (dispatch: any, props: any) => ({
  setCurrentAccount: (account: Account) => {
    return dispatch(setCurrentAccount(account));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
