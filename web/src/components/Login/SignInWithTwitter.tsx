import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { loginUser } from 'shared/services/auth';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import { store } from 'web/src/App';
import { authenticateService } from 'web/src/services/auth';
import { Routes } from '../../navigation/Routes';

interface Props extends RouteComponentProps {
  style?: React.CSSProperties;
  callback?: Function;
  width: string | number;
  title: string;
  outline: boolean;
  iconAlign: 'left' | 'right';
}

const MockSignInButton = () => {

  const mockRegister = async () => {
    await Chain.mockRegister();
    window.location.reload();
  };

  return <div style={ styles.mockRegisterButton } onClick={ mockRegister } />;

};

const SignInWithTwitter = (props: Props) => {
  const { callback, width, style, title, outline, iconAlign, history } = props;

  const authenticate = () =>  {
    Analytics.track(AnalyticsEventsWeb.SignUpWithTwitterClicked);
    authenticateService(async (event: any) => {
      if (event.data.type === 'AUTH_NOT_WHITELISTED') {
        window.location.href = AppConfig.waitlist_url;
        return;
      }
      if (event.data.type === 'AUTH_COMPLETE') {
        await loginUser(store);
        Analytics.track(AnalyticsEventsWeb.SuccessfulLogin);
        const account = store.getState().auth.account as Account | undefined;
        if (account && account.userMeta.onboardFollowCommunities) {
          history.push(Routes.HOME);
        } else {
          history.push(Routes.ONBOARDING_FOLLOW);
        }
        callback ? callback() : null;
      }
    }, sessionStorage.getItem('referrer') || '');
  };

  const desktopIcon = (
    <BaseIconView
      name={ 'social-twitter' }
      family={ 'Line' }
      color={ outline ? Color.TWITTER_BLUE : Color.WHITE }
      size={ IconSize.XSMALL }
      style={ { marginRight: iconAlign === 'left' ? Whitespace.TINY + 2 : 0, marginLeft: iconAlign === 'right' ? Whitespace.TINY + 2 : 0 } }
    />
  );

  const mobileIcon = (
    <BaseIconView
      name={ 'social-twitter' }
      family={ 'Line' }
      color={ outline ? Color.TWITTER_BLUE : Color.WHITE }
      size={ IconSize.XSMALL }
    />
  );

  const hoverColors = {
    regularText: outline ? Color.TWITTER_BLUE : Color.WHITE,
    regularBackground: outline ? Color.WHITE : Color.TWITTER_BLUE,
    hoverText: outline ? Color.TWITTER_BLUE : Color.WHITE,
    hoverBackground: outline ? Color.WHITE : Color.TWITTER_BLUE,
  };

  return (
    <div style={ { ...styles.container, ...style } }>
      { process.env.NODE_ENV === 'development' ? <MockSignInButton />  : null }
      <div className='is-hidden-mobile is-flex-tablet' style={ { width } }>
        <BaseButton
          hoverColors={ hoverColors }
          outline={ outline }
          title={ title }
          icon={ desktopIcon }
          onAction={ authenticate }
          width= { width }
          iconAlign={ iconAlign }
          textStyle={ { fontWeight: '200' } }
        />
      </div>
      <div className='is-hidden-tablet' style={ { alignItems: 'center' } }>
        <BaseButton
          hoverColors={ hoverColors }
          outline={ outline }
          onAction={ authenticate }
          icon={ mobileIcon }
          title={ '' }
          width={ 50 }
          iconAlign={ iconAlign }
          textStyle={ { fontWeight: '200' } }
        />
      </div>
    </div>
  );
};

const styles = {
  container: { },
  mockRegisterButton: {
    backgroundColor: Color.TRANSPARENT,
    position: 'absolute' as 'absolute',
    marginLeft: '-30px',
    width: '30px',
    height: '30px',
  },
};

export default withRouter(SignInWithTwitter);
