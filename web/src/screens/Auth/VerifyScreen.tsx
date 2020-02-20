import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign, TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import squareLogo from 'web/src/images/squareLogo.svg';
import { generateDocumentTitle } from 'web/src/utils';
import { truToast } from '../../components/Toast/TruToast';
import { Routes } from '../../navigation/Routes';

interface Props extends RouteComponentProps {
  settings: Settings;
  account?: Account;
}

const VerifyScreen = (props: Props) => {

  const { history, account, location } = props;

  generateDocumentTitle('Verify Email');
  const goHome = () => history.push(Routes.HOME);
  const goLogin = () => history.push(Routes.LOGIN);

  if (account)
    goHome();

  const params = new URLSearchParams(location.search);
  if (params.get('token') && params.get('id')) {

    const verifyEmail = async() => {
      Analytics.track(AnalyticsEventsWeb.ConfirmationEmailClicked);
      try {
        const r = await Chain.verifyEmail({ id: Number(params.get('id')), token: params.get('token')! });
        if (r.verified) {
          if (r.created && r.user) {
            const { address , group, userProfile } = r.user;
            Analytics.register(address, userProfile.fullName, userProfile.username, group, true);
          }
          goLogin();
        }
      } catch (err) {
        truToast(err.message);
      }
    };

    React.useEffect(() => {
      verifyEmail();
    }, []);

    return (
      <div style={ styles.container }>
        <div style={ styles.centeredContainer }>
          <BaseActionable onAction={ goHome } style={ { display: 'flex', cursor: 'pointer' } }>
            <img src={ squareLogo } alt='logo' style={ styles.mobileLogo } />
          </BaseActionable>
          <BaseText textSize={ TextSize.H2 } bold={ true } style={ { marginBottom: Whitespace.LARGE * 2 } }>
            Verifying Your Email
          </BaseText>
          <BaseText style={ { fontWeight: '200', maxWidth: 400, marginBottom: Whitespace.LARGE } } align={ TextAlign.CENTER }>
            Please hold on while we verify your account...
          </BaseText>
        </div>
      </div>
    );
  }

  return (
    <div style={ styles.container }>
      <div style={ styles.centeredContainer }>
        <BaseActionable onAction={ goHome } style={ { display: 'flex', cursor: 'pointer' } }>
          <img src={ squareLogo } alt='logo' style={ styles.mobileLogo } />
        </BaseActionable>
        <BaseText textSize={ TextSize.H2 } bold={ true } style={ { marginBottom: Whitespace.LARGE * 2 } }>
          Verify Your Email
        </BaseText>
        <BaseText style={ { fontWeight: '200', maxWidth: 400, marginBottom: Whitespace.LARGE } } align={ TextAlign.CENTER }>
          Welcome to TruStory! Please verify your email address. You will need to confirm your email to use your account.
        </BaseText>
        <BaseButton
          title={ 'Sounds Good' }
          onAction={ goLogin }
          width={ 150 }
          outline={ true }
          color={ Color.APP_PURPLE }
          accentColor={ Color.APP_PURPLE }
          disabled={ false }
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
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(VerifyScreen);
