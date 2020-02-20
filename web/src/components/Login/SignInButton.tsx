import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import BaseIconView from 'shared/components/Base/BaseIconView';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import Analytics, { AnalyticsEventsWeb } from 'shared/utils/analytics';
import { Routes } from '../../navigation/Routes';
import BaseButton from '../Base/BaseButton';

interface Props extends RouteComponentProps {
  title?: string;
  width?: number | string;
  style?: React.CSSProperties;
}

const SignInButton = (props: Props) => {

  const { title, width, history, style } = props;
  const onClick = () => {
    Analytics.track(AnalyticsEventsWeb.SignUpLinkClicked);
    history.push(Routes.LOGIN);
  };

  const desktopIcon = (
    <BaseIconView
      name={ 'log-in' }
      family={ 'Feather' }
      color={ Color.WHITE }
      size={ IconSize.XSMALL }
      style={ { marginRight: Whitespace.TINY + 2 } }
    />
  );

  const mobileIcon = (
    <BaseIconView
      name={ 'log-in' }
      family={ 'Feather' }
      color={ Color.WHITE }
      size={ IconSize.XSMALL }
    />
  );

  return (
    <React.Fragment>
      <div className='is-hidden-mobile is-flex-tablet'>
        <BaseButton
          outline={ false }
          accentColor={ Color.APP_PURPLE }
          color={ Color.WHITE }
          title={ title ? title : 'Sign In' }
          width={ width ? width : 100 }
          onAction={ onClick }
          style={ style }
          icon={ desktopIcon }
        />
      </div>
      <div className='is-hidden-tablet' style={ { alignItems: 'center' } }>
        <BaseButton
          outline={ false }
          accentColor={ Color.APP_PURPLE }
          color={ Color.WHITE }
          title={ '' }
          width={ 50 }
          onAction={ onClick }
          style={ style }
          icon={ mobileIcon }
        />
      </div>
    </React.Fragment>

  );
};

export default withRouter(SignInButton);
