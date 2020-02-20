import EmailRecovery from 'mobile/src/components/Auth/EmailRecovery';
import { Routes } from 'mobile/src/navigation/Routes';
import { headerStyles } from 'mobile/src/styles';
import { calculateKeyboardOffset } from 'mobile/src/utils/keyboard';
import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { NavigationScreenProp, NavigationScreenProps, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseText from 'shared/components/Base/BaseText';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { truToast } from 'shared/components/Toast/TruToast';
import { logo_small } from 'shared/images/Logo/LogoImages';
import { AuthSetCurrentAccount, setCurrentAccount } from 'shared/redux/actions/auth.action';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

interface Props extends NavigationScreenProps {
  account?: Account;
  setCurrentAccount: (account: Account) => AuthSetCurrentAccount;
}

const AccountRecoveryScreen = (props: Props) => {
  const { account, navigation } = props;
  const [ identifier, setIdentifier ] = React.useState('');

  const [ showResendEmail, setShowResendEmail ] = React.useState(false);
  const onEmailSent = () => navigation.popToTop();

  const sendRecoveryEmail = async () => {
    LoadingBlanketHandler.show();
    try {
      await Chain.sendAccountRecoveryEmail({ identifier });
      setShowResendEmail(false);
      navigation.navigate(Routes.AccountRecoverySent);
    } catch (err) {
      truToast(err.message);
      if (err.message === 'The account associated with this email is not verified yet.') {
        setShowResendEmail(true);
      } else {
        setShowResendEmail(false);
      }
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  React.useEffect(() => {
    if (account && account.address) {
      Chain.account = new Account(account);
      navigation.navigate(Routes.Main);
    }
  }, []);

  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        behavior={ 'padding' }
        enabled={ Platform.OS === 'ios' }
        style={ styles.container }
        keyboardVerticalOffset={ calculateKeyboardOffset() }
      >
        <ScrollView
          showsVerticalScrollIndicator={ false }
          contentContainerStyle={ [ styles.container, { flexGrow: 1, padding: Whitespace.LARGE } ] }
        >
          <BaseIconImageView source={ logo_small } size={ 50 } />
          <BaseText
            style={ { maxWidth: 180, marginTop: Whitespace.SMALL, marginBottom: Whitespace.LARGE } }
            bold={ true }
            textSize={ TextSize.H2 }
          >
            Account Recovery
          </BaseText>
          <BaseText style={ { marginTop: Whitespace.LARGE, marginBottom: Whitespace.SMALL, fontWeight: '200' } }>
            Please provide your username or email and we will send you an email to recover your account!
          </BaseText>
          <TextInput
            style={ styles.input }
            onChangeText={ setIdentifier }
            value={ identifier }
            placeholder={ 'email or username' }
            autoFocus={ true }
            autoCapitalize={ 'none' }
          />
          <EmailRecovery
            identifier={ identifier }
            visible={ showResendEmail }
            onEmailSent={ onEmailSent }
            style={ { marginVertical: Whitespace.SMALL } }
          />
          <BaseButton
            title={ 'Send Me Help' }
            onAction={ sendRecoveryEmail }
            accentColor={ Color.APP_PURPLE }
            color={ Color.APP_PURPLE }
            iconAlign={ 'right' }
            height={ 36 }
            width={ 150 }
            outline={ true }
            borderRadius={ Whitespace.LARGE }
            disabled={ false }
            textSize={ TextSize.H5 }
            style={ { marginTop: Whitespace.LARGE } }
          />
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

AccountRecoveryScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
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
});

const mapDispatchToProps = (dispatch: any, props: any) => ({
  setCurrentAccount: (account: Account) => {
    return dispatch(setCurrentAccount(account));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountRecoveryScreen);
