import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseText from 'shared/components/Base/BaseText';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { truToast } from 'shared/components/Toast/TruToast';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import squareLogo from 'web/src/images/squareLogo.svg';
import { generateDocumentTitle } from 'web/src/utils';
import BaseTextInput from '../../components/Base/BaseTextInput';
import { Routes } from '../../navigation/Routes';

interface Props extends RouteComponentProps {
  settings: Settings;
  account?: Account;
}

const AccountRecovery = (props: Props) => {

  const { history, account } = props;
  generateDocumentTitle('Account Recovery');

  const goLogin = () => history.push(Routes.LOGIN);
  const goHome = () => history.push(Routes.HOME);
  const [ identifier, setIdentifier ] = React.useState('');
  const [ showResendEmail, setShowResendEmail ] = React.useState(false);

  const resendEmail = async() => {
    LoadingBlanketHandler.show();
    try {
      await Chain.resendVerificationEmail({ identifier });
      truToast(`A recovery email has been sent to the email or username associated with: ${identifier}`);
      setShowResendEmail(false);
    } catch (err) {
      truToast(err.message);
    } finally {
      LoadingBlanketHandler.hide();
    }
  };

  const sendRecoveryEmail = async () => {
    LoadingBlanketHandler.show();
    try {
      await Chain.sendAccountRecoveryEmail({ identifier });
      setShowResendEmail(false);
      history.push(Routes.ACCOUNT_RECOVERY_SENT);
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

  if (account)
    goHome();

  const onChangeIdentifier = (e: ChangeEvent<HTMLInputElement>) => {
    if (showResendEmail)
      setShowResendEmail(false);

    setIdentifier(e.target.value);
  };

  return (
    <div style={ styles.container }>
      <div style={ styles.centeredContainer }>
        <BaseActionable onAction={ goLogin } style={ { display: 'flex', cursor: 'pointer' } }>
          <img src={ squareLogo } alt='logo' style={ styles.mobileLogo } />
        </BaseActionable>
        <BaseText textSize={ TextSize.H2 } bold={ true } style={ { marginBottom: Whitespace.LARGE * 2 } }>
          Account Recovery
        </BaseText>
        <BaseText style={ { fontWeight: '200', maxWidth: 400 } } align={ TextAlign.CENTER }>
          Please provide your username or email and we'll send you an email to recover your account!
        </BaseText>
        <BaseTextInput
          placeholder={ 'email or username' }
          value={ identifier }
          onChange={ onChangeIdentifier }
          color={ Color.APP_PURPLE }
          style={ styles.input }
        />
        <div style={ { position: 'relative', width: '100%', maxWidth: 375, display: showResendEmail ? 'block' : 'none' } }>
          <BaseText color={ Color.RED } textSize={ TextSize.H6 } style={ { marginRight: 3 } }>
            This email has already been registered, but not verified.
          </BaseText>
          <BaseActionable onAction={ resendEmail }>
            <BaseATag color={ Color.RED } bold={ true } textSize={ TextSize.H6 }>Resend Link?</BaseATag>
          </BaseActionable>
        </div>
        <BaseButton
          title={ 'Send Me Help' }
          onAction={ sendRecoveryEmail }
          width={ 150 }
          outline={ true }
          color={ Color.APP_PURPLE }
          accentColor={ Color.APP_PURPLE }
          disabled={ identifier === '' }
          textSize={ TextSize.H5 }
          style={ { marginTop: Whitespace.LARGE } }
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

export default connect(mapStateToProps)(AccountRecovery);
