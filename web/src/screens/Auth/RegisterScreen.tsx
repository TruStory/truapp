import { throttle } from 'lodash';
import React, { ChangeEvent, KeyboardEvent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import { checkEmail, checkUsername } from 'shared/services/auth';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import { EmailValidationResult, UsernameValidationResult } from 'shared/types/validation';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import ValidationUtil from 'shared/utils/validation';
import { generateDocumentTitle } from 'web/src/utils';
import BaseActionable from '../../components/Base/BaseActionable';
import BaseTextInput from '../../components/Base/BaseTextInput';
import { truToast } from '../../components/Toast/TruToast';
import { Routes } from '../../navigation/Routes';

interface Props extends RouteComponentProps {
  settings: Settings;
  account?: Account;
}

const debouncedCheckEmail = throttle(checkEmail, 200);
const debouncedCheckUsername = throttle(checkUsername, 200);

const RegisterScreen = (props: Props) => {

  const { history, account } = props;
  const [ email, setEmail ] = React.useState('');
  const [ password, setPassword ] = React.useState('');
  const [ confirmPassword, setConfirmPassword ] = React.useState('');
  const [ username, setUsername ] = React.useState('');

  const [ showResendEmail, setShowResendEmail  ] = React.useState(false);
  const [ emailValidated, setEmailValidated  ] = React.useState(false);
  const [ usernameValidated, setUsernameValidated ] = React.useState(false);
  const [ passwordValidated, setPasswordValidated ] = React.useState(false);
  const [ confirmPasswordValidated, setConfirmPasswordValidated ] = React.useState(false);

  generateDocumentTitle('Registration');
  const goHome = () => history.push(Routes.HOME);
  const goLogin = () => history.push(Routes.LOGIN);

  if (account)
    goHome();

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedCheckEmail(value, (data?: EmailValidationResult) => {
      if (data && ValidationUtil.validateEmail(value)) {
        setShowResendEmail(!data.is_unique && !data.is_verified);
        setEmailValidated( data.is_unique );
      } else {
        setShowResendEmail(false);
        setEmailValidated(false);
      }
    });
    setEmail(value);
  };
  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedCheckUsername(value, (data?: UsernameValidationResult) => {
      if (data && ValidationUtil.validateUsername(value)) {
        setUsernameValidated( data.is_unique );
      } else {
        setUsernameValidated(false);
      }
    });
    setUsername(value);
  };
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordValidated(ValidationUtil.validatePassword(value));
    setPassword(value);
  };
  const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPasswordValidated( passwordValidated && password === value );
    setConfirmPassword(value);
  };

  const resendEmail = async() => {
    try {
      await Chain.resendVerificationEmail({ identifier: email });
      truToast(`A recovery email has been sent to ${email}`);
    } catch (err) {
      truToast(err.message);
    }
  };

  const disabled = !(emailValidated && usernameValidated && passwordValidated && confirmPasswordValidated);

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 && !disabled) createAccount();
  };

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

  const createAccount = async () => {
    const referrer = sessionStorage.getItem('referrer') || '';
    LoadingBlanketHandler.show();
    try {
      const r = await Chain.registerUser({ email, password, full_name: username, username, referrer });
      if (r) {
        Analytics.track(AnalyticsEventsWeb.RegistrationEmailSent);
        history.push(Routes.VERIFY);
      }
    } catch (err) {
      truToast(err.message);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  // tslint:disable: max-line-length
  return (
    <div style={ styles.container }>
      <div style={ styles.centeredContainer }>
        <BaseButton
          title={ 'Log In' }
          icon={ rightIcon }
          hoverIcon={ rightHoverIcon }
          onAction={ goLogin }
          iconAlign={ 'right' }
          height={ 36 }
          width={ 100 }
          outline={ true }
          hoverColors={ { regularBackground: Color.APP_PURPLE, regularText: Color.APP_PURPLE, hoverBackground: Color.APP_PURPLE, hoverText: Color.WHITE } }
          borderRadius={ Whitespace.LARGE }
          style={ { transform: 'rotate(270deg)', marginBottom: Whitespace.LARGE * 3 } }
        />
        <BaseText textSize={ TextSize.H1 } bold={ true } style={ { marginBottom: Whitespace.LARGE * 2 } }>
          Sign Up
        </BaseText>
        <div style={ { justifyContent: 'center', marginBottom: Whitespace.SMALL } }>
          <div style={ { display: 'flex', justifyContent: 'center' } }>
            <BaseText style={ { fontWeight: '200', maxWidth: 250 } } align={ TextAlign.CENTER }>
              Welcome to
            </BaseText>
            <BaseText style={ { marginLeft: Whitespace.TINY } } align={ TextAlign.CENTER }>
              TruStory.
            </BaseText>
          </div>
          <BaseText style={ { fontWeight: '200', maxWidth: 250 } } align={ TextAlign.CENTER }>
            Let's pick an email and password for this account.
          </BaseText>
        </div>
        <div style={ { position: 'relative', width: '100%', maxWidth: 375, borderBottom: `1px solid ${Color.LINE_GRAY}` } }>
          <BaseTextInput
            placeholder={ 'email' }
            value={ email }
            onChange={ onChangeEmail }
            style={ { ...styles.input, borderBottom: 'none', maxWidth: 340 } }
            color={ Color.APP_PURPLE }
            textSize={ TextSize.H5 }
          />
          <BaseIconView
            name={ emailValidated ? 'check' : 'x' }
            color={ emailValidated ? Color.GREEN : Color.RED  }
            style={ { position: 'absolute', right: 0, top: 10, display: email === '' ? 'none' : 'flex' } }
          />
        </div>
        <div style={ { position: 'relative', width: '100%', maxWidth: 375, display: showResendEmail ? 'block' : 'none', marginTop: Whitespace.TINY, marginBottom: Whitespace.SMALL } }>
          <BaseText color={ Color.RED } textSize={ TextSize.H6 } style={ { marginRight: 3 } }>This email has already been registered, but not verified.</BaseText>
          <BaseActionable onAction={ resendEmail }>
            <BaseATag color={ Color.RED } bold={ true } textSize={ TextSize.H6 }>Resend Link?</BaseATag>
          </BaseActionable>
        </div>
        <div style={ { position: 'relative', width: '100%', maxWidth: 375, borderBottom: `1px solid ${Color.LINE_GRAY}` } }>
          <BaseTextInput
            placeholder={ 'username' }
            value={ username }
            onChange={ onChangeUsername }
            style={ { ...styles.input, borderBottom: 'none', maxWidth: 340 } }
            color={ Color.APP_PURPLE }
            textSize={ TextSize.H5 }
          />
          <BaseIconView
            name={ usernameValidated ? 'check' : 'x' }
            color={ usernameValidated ? Color.GREEN : Color.RED  }
            style={ { position: 'absolute', right: 0, top: 10, display: username === '' ? 'none' : 'flex' } }
          />
        </div>
        <div style={ { position: 'relative', width: '100%', maxWidth: 375, borderBottom: `1px solid ${Color.LINE_GRAY}` } }>
          <BaseTextInput
            placeholder={ 'password' }
            value={ password }
            onChange={ onChangePassword }
            style={ { ...styles.input, borderBottom: 'none', maxWidth: 340 } }
            color={ Color.APP_PURPLE }
            type={ 'password' }
            textSize={ TextSize.H5 }
          />
          <BaseIconView
            name={ passwordValidated ? 'check' : 'x' }
            color={ passwordValidated ? Color.GREEN : Color.RED  }
            style={ { position: 'absolute', right: 0, top: 10, display: password === '' ? 'none' : 'flex' } }
          />
        </div>
        <div style={ { display: 'flex', flexDirection: 'column', marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } }>
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
        </div>
        <div style={ { position: 'relative', width: '100%', maxWidth: 375, borderBottom: `1px solid ${Color.LINE_GRAY}` } }>
          <BaseTextInput
            placeholder={ 'confirm password' }
            value={ confirmPassword }
            onChange={ onChangeConfirmPassword }
            style={ { ...styles.input, borderBottom: 'none', maxWidth: 340 } }
            color={ Color.APP_PURPLE }
            type={ 'password' }
            textSize={ TextSize.H5 }
            onKeyUp={ onKeyUp }
          />
          <BaseIconView
            name={ confirmPasswordValidated ? 'check' : 'x' }
            color={ confirmPasswordValidated ? Color.GREEN : Color.RED  }
            style={ { position: 'absolute', right: 0, top: 10, display: confirmPassword === '' ? 'none' : 'flex' } }
          />
        </div>
        <div style={ { display: 'flex', marginTop: Whitespace.LARGE + Whitespace.MEDIUM, width: 385, justifyContent: 'center' } }>
          <BaseButton
            title={ 'Create Account' }
            icon={ rightIcon }
            hoverIcon={ rightHoverIcon }
            onAction={ createAccount }
            iconAlign={ 'right' }
            height={ 36 }
            width={ 140 }
            outline={ true }
            hoverColors={ { regularBackground: Color.APP_PURPLE, regularText: Color.APP_PURPLE, hoverBackground: Color.APP_PURPLE, hoverText: Color.WHITE } }
            borderRadius={ Whitespace.LARGE }
            disabled={ disabled }
          />
        </div>
      </div>
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
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    paddingTop: Whitespace.LARGE,
    paddingBottom: Whitespace.LARGE,
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

export default connect(mapStateToProps)(RegisterScreen);
