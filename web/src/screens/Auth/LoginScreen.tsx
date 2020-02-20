import * as queryString from 'query-string';
import React, { ChangeEvent, KeyboardEvent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { truToast } from 'shared/components/Toast/TruToast';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import { loginUser } from 'shared/services/auth';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import { store } from 'web/src/App';
import squareLogo from 'web/src/images/squareLogo.svg';
import { generateDocumentTitle } from 'web/src/utils';
import BaseTextInput from '../../components/Base/BaseTextInput';
import SignInWithTwitter from '../../components/Login/SignInWithTwitter';
import { Routes } from '../../navigation/Routes';

interface Props extends RouteComponentProps {
  settings: Settings;
  account?: Account;
}

const LoginScreen = (props: Props) => {

  const { history, account, location } = props;
  const [ identifier, setIdentifier ] = React.useState('');
  const [ password, setPassword ] = React.useState('');
  const [ showResendEmail, setShowResendEmail ] = React.useState(false);

  const resendEmail = async() => {
    LoadingBlanketHandler.show();
    try {
      await Chain.resendVerificationEmail({ identifier });
      truToast(`A recovery email has been sent to the email or username associated with: ${identifier}`);
    } catch (err) {
      truToast(err.message);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  generateDocumentTitle('Login');
  const goHome = () => history.push(Routes.HOME);

  if (account)
    goHome();

  // if referrer is present, persist it in session storage
  const parsedQueryString = queryString.parse(location.search);
  if (parsedQueryString.referrer && parsedQueryString.referrer !== '') {
    sessionStorage.setItem('referrer', parsedQueryString.referrer.toString());
  }

  const onChangeIdentifier = (e: ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value);
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const register = () => {
    Analytics.track(AnalyticsEventsWeb.SignUpWithEmailClicked);
    history.push(Routes.REGISTER);
  };
  const login = async () => {
    LoadingBlanketHandler.show();
    try {
      await Chain.loginUser({ identifier, password });
      setShowResendEmail(false);
      await loginUser(store);
      Analytics.track(AnalyticsEventsWeb.SuccessfulLogin);
      const account = store.getState().auth.account as Account | undefined;
      if (account && account.userMeta.onboardFollowCommunities) {
        history.push(Routes.HOME);
      } else {
        history.push(Routes.ONBOARDING_FOLLOW);
      }
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
  const disabled = identifier === '' || password === '';

  const rightIcon = (
    <BaseIconView
      name={ 'arrow-right' }
      family={ 'Feather' }
      color={ Color.APP_PURPLE }
      size={ IconSize.XSMALL }
      style={ { marginLeft: Whitespace.TINY } }
    />
  );

  const rightHoverIcon = (
    <BaseIconView
      name={ 'arrow-right' }
      family={ 'Feather' }
      color={ Color.WHITE }
      size={ IconSize.XSMALL }
      style={ { marginLeft: Whitespace.TINY } }
    />
  );

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 && !disabled) login();
  };

  // tslint:disable: max-line-length
  return (
    <div style={ styles.container }>
      <div style={ styles.centeredContainer }>
        <BaseActionable onAction={ goHome } style={ { display: 'flex', cursor: 'pointer', justifyContent: 'center', width: '100%', marginBottom: Whitespace.LARGE } }>
          <img src={ squareLogo } alt='logo' style={ styles.mobileLogo } />
        </BaseActionable>
        <BaseText style={ { maxWidth: 280, margin: '0 auto', display: 'flex' } } align={ TextAlign.CENTER }>
          Sign in to learn, debate, and have productive conversations
        </BaseText>
        <SignInWithTwitter
          width={ 368 }
          outline={ false }
          title={ 'Log in with' }
          iconAlign={ 'right' }
          style={ { marginTop: Whitespace.LARGE * 2, display: 'flex', justifyContent: 'center' } }
        />
        <div className={ 'line-both-sides' } style={ { marginBottom: Whitespace.LARGE, marginTop: Whitespace.LARGE * 2 } }>
          <BaseText color={ Color.GRAY } style={ { fontWeight: '200' } } textSize={ TextSize.H5 }>
            or sign in with
          </BaseText>
        </div>
        <BaseTextInput
          placeholder={ 'username or email' }
          value={ identifier }
          onChange={ onChangeIdentifier }
          color={ Color.APP_PURPLE }
          style={ styles.input }
          textSize={ TextSize.H5 }
        />
        <div style={ { position: 'relative', width: '100%', maxWidth: 375, display: showResendEmail ? 'block' : 'none' } }>
          <BaseText color={ Color.RED } textSize={ TextSize.H6 } style={ { marginRight: 3 } }>This email has already been registered, but not verified.</BaseText>
          <BaseActionable onAction={ resendEmail }>
            <BaseATag color={ Color.RED } bold={ true } textSize={ TextSize.H6 }>Resend Link?</BaseATag>
          </BaseActionable>
        </div>
        <BaseTextInput
          placeholder={ 'password' }
          value={ password }
          color={ Color.APP_PURPLE }
          onChange={ onChangePassword }
          style={ styles.input }
          type={ 'password' }
          textSize={ TextSize.H5 }
          onKeyUp={ onKeyUp }
        />
        <div style={ { display: 'flex', marginTop: Whitespace.LARGE * 2, alignItems: 'center' } }>
          <div style={ { display: 'flex', flex: 1 } }>
            <BaseButton
              title={ 'Sign Up' }
              onAction={ register }
              style={ { padding: 0 } }
              width={ 'auto' }
              height={ 27 }
              hoverColors={ { regularBackground: Color.WHITE, regularText: Color.APP_PURPLE, hoverBackground: Color.WHITE, hoverText: Color.APP_PURPLE } }
              disabled={ false }
              textSize={ TextSize.H5 }
            />
          </div>
          <div style={ { display: 'flex', justifyContent: 'flex-end' } }>
            <BaseButton
              title={ 'Log In' }
              icon={ rightIcon }
              hoverIcon={ rightHoverIcon }
              onAction={ login }
              iconAlign={ 'right' }
              height={ 36 }
              width={ 100 }
              outline={ true }
              hoverColors={ { regularBackground: Color.APP_PURPLE, regularText: Color.APP_PURPLE, hoverBackground: Color.APP_PURPLE, hoverText: Color.WHITE } }
              borderRadius={ Whitespace.LARGE }
              disabled={ disabled }
              textSize={ TextSize.H5 }
            />
          </div>
        </div>
        <div style={ { display: 'flex', marginTop: 30, alignItems: 'flex-start', flexDirection: 'column' } }>
          <BaseATag
            href={ 'https://www.trustory.io/terms/' }
            target={ '_blank' }
            textSize={ TextSize.H6 }
            color={ Color.APP_BLACK }
            style={ { fontWeight: 200 } }
          >
            By logging in, I accept the Terms and Conditions.
          </BaseATag>
          <BaseATag
            appLink={ Routes.ACCOUNT_RECOVERY }
            target={ '_blank' }
            textSize={ TextSize.H6 }
            color={ Color.APP_BLACK }
            underline={ true }
            style={ { marginTop: Whitespace.SMALL, fontWeight: 200 } }
          >
            Forgot Password?
            <BaseText textSize={ TextSize.H6 } style={ { fontWeight: '200', marginLeft: 3 } }>Click Here.</BaseText>
          </BaseATag>
        </div>
      </div >
   </div>
  );

};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  centeredContainer: {
    maxWidth: 375,
    width: '100%',
  },
  mobileLogo: {
    width: 65,
  },
  input: {
    borderBottom: `1px solid ${Color.LINE_GRAY}`,
    marginTop: Whitespace.MEDIUM,
    maxWidth: 375,
    paddingLeft: Whitespace.TINY,
    paddingBottom: Whitespace.SMALL,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(LoginScreen);
