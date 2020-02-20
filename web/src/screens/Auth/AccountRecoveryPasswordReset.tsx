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
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import ValidationUtil from 'shared/utils/validation';
import squareLogo from 'web/src/images/squareLogo.svg';
import { generateDocumentTitle } from 'web/src/utils';
import BaseTextInput from '../../components/Base/BaseTextInput';
import { truToast } from '../../components/Toast/TruToast';
import { Routes } from '../../navigation/Routes';

interface Props extends RouteComponentProps {
  settings: Settings;
  account?: Account;
}

const AccountRecoveryPasswordReset = (props: Props) => {

  const { history, account } = props;

  generateDocumentTitle('Account Recovery');
  const goHome = () => history.push(Routes.HOME);

  const params = new URLSearchParams(location.search);
  if (account || !params.get('token') || !params.get('id'))
    goHome();

  const resetPassword = async () => {
    LoadingBlanketHandler.show();
    try {
      const r = await Chain.resetAccountPassword({ user_id: Number(params.get('id')), token: params.get('token')!, password });
      console.log(r);
      history.push(Routes.ACCOUNT_RECOVERY_RESET_COMPLETE);
    } catch (err) {
      truToast(err.message);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) resetPassword();
  };

  const [ password, setPassword ] = React.useState('');
  const [ confirmPassword, setConfirmPassword ] = React.useState('');
  const [ passwordValidated, setPasswordValidated ] = React.useState(false);
  const [ confirmPasswordValidated, setConfirmPasswordValidated ] = React.useState(false);

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

  const disabled = !( passwordValidated && confirmPasswordValidated);

  return (
    <div style={ styles.container }>
      <div style={ styles.centeredContainer }>
        <BaseActionable onAction={ goHome } style={ { display: 'flex', cursor: 'pointer' } }>
          <img src={ squareLogo } alt='logo' style={ styles.mobileLogo } />
        </BaseActionable>
        <BaseText textSize={ TextSize.H2 } bold={ true } style={ { marginBottom: Whitespace.LARGE } }>
          Account Recovery
        </BaseText>
        <BaseText style={ { fontWeight: '200', maxWidth: 400, marginBottom: Whitespace.LARGE } } align={ TextAlign.CENTER }>
          Enter a new password
        </BaseText>
        <div style={ { position: 'relative', width: '100%', maxWidth: 375, borderBottom: `1px solid ${Color.LINE_GRAY}` } }>
          <BaseTextInput
            placeholder={ 'password' }
            value={ password }
            onChange={ onChangePassword }
            style={ { ...styles.input, borderBottom: 'none', maxWidth: 340 } }
            color={ Color.APP_PURPLE }
            type={ 'password' }
          />
          <BaseIconView
            name={ passwordValidated ? 'check' : 'x' }
            color={ passwordValidated ? Color.GREEN : Color.RED  }
            style={ { position: 'absolute', right: 0, top: 10, display: password === '' ? 'none' : 'flex' } }
          />
        </div>
        <div style={ { display: 'flex', flexDirection: 'column', marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } }>
          <BaseText color={ Color.RED } textSize={ TextSize.H6 } style={ { width: 385 } }>
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
        <div style={ { position: 'relative', width: '100%', maxWidth: 375, borderBottom: `1px solid ${Color.LINE_GRAY}`, marginBottom: Whitespace.LARGE } }>
          <BaseTextInput
            placeholder={ 'confirm password' }
            value={ confirmPassword }
            onChange={ onChangeConfirmPassword }
            style={ { ...styles.input, borderBottom: 'none', maxWidth: 340 } }
            color={ Color.APP_PURPLE }
            type={ 'password' }
            onKeyUp={ onKeyUp }
          />
          <BaseIconView
            name={ confirmPasswordValidated ? 'check' : 'x' }
            color={ confirmPasswordValidated ? Color.GREEN : Color.RED  }
            style={ { position: 'absolute', right: 0, top: 10, display: confirmPassword === '' ? 'none' : 'flex' } }
          />
        </div>
        <BaseButton
          title={ 'Reset Password' }
          onAction={ resetPassword }
          width={ 150 }
          outline={ true }
          color={ Color.APP_PURPLE }
          accentColor={ Color.APP_PURPLE }
          disabled={ disabled }
          textSize={ TextSize.H5 }
        />
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

export default connect(mapStateToProps)(AccountRecoveryPasswordReset);
