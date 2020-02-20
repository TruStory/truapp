import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign, TextSize } from 'shared/styles';
import { Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import squareLogo from 'web/src/images/squareLogo.svg';
import { generateDocumentTitle } from 'web/src/utils';
import { Routes } from '../../navigation/Routes';

interface Props extends RouteComponentProps {
  settings: Settings;
  account?: Account;
}

const AccountRecoverySent = (props: Props) => {

  const { history, account } = props;

  generateDocumentTitle('Account Recovery');
  const goHome = () => history.push(Routes.HOME);
  const goLogin = () => history.push(Routes.LOGIN);

  if (account)
    goHome();

  setTimeout(() => {
    goLogin();
  }, 3000);

  return (
    <div style={ styles.container }>
      <div style={ styles.centeredContainer }>
        <BaseActionable onAction={ goLogin } style={ { display: 'flex', cursor: 'pointer' } }>
          <img src={ squareLogo } alt='logo' style={ styles.mobileLogo } />
        </BaseActionable>
        <BaseText textSize={ TextSize.H2 } bold={ true } style={ { marginBottom: Whitespace.LARGE } }>
          Account Recovery
        </BaseText>
        <BaseText style={ { fontWeight: '200', maxWidth: 400, marginBottom: Whitespace.LARGE } } align={ TextAlign.CENTER }>
          Please check your email for a recovery password link. Redirecting you to the Login page...
        </BaseText>
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
};

export default AccountRecoverySent;
