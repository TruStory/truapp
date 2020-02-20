import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import squareLogo from 'web/src/images/squareLogo.svg';
import { generateDocumentTitle } from 'web/src/utils';
import { Routes } from '../../navigation/Routes';

interface Props extends RouteComponentProps {
  settings: Settings;
  account?: Account;
}

const AccountRecoveryComplete = (props: Props) => {

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
        <BaseText textSize={ TextSize.H2 } bold={ true } style={ { marginBottom: Whitespace.LARGE * 2 } }>
          Account Recovery
        </BaseText>
        <BaseText style={ { fontWeight: '200', maxWidth: 400, marginBottom: Whitespace.LARGE } } align={ TextAlign.CENTER }>
          Password successfully changed! Redirecting you to the Login Page...
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

export default connect(mapStateToProps)(AccountRecoveryComplete);
