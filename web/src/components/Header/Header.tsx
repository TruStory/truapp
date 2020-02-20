import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Account } from 'shared/blockchain/account';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import UnreadNotificationsIndicator, { NotificationIndicatorType } from 'shared/components/Notifications/UnreadNotificationsIndicator';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace, ZIndex } from 'shared/styles/views';
import UserMenu from 'web/src/components/Header/UserMenu';
import logo from 'web/src/images/logo.svg';
import squareLogo from 'web/src/images/squareLogo.svg';
import { ViewHeights } from 'web/src/styles';
import { Routes } from '../../navigation/Routes';
import SignInButton from '../Login/SignInButton';
import SearchInput from './SearchInput';

interface Props extends RouteComponentProps {
  account?: Account;
  menuToggled: () => void;
}

const Header = (props: Props) => {
  const { account, history, menuToggled } = props;
  const goHome = () => history.push(Routes.HOME);

  const loggedOutJsx = (
    <React.Fragment>
      <SignInButton title={ 'Sign Up Or Log In' } width={ 250 } />
    </React.Fragment>
  );

  return (
    <div style={ styles.container }>
      <div style={ styles.header }>
        <div style={ styles.logoContainer } className={ 'logo-container' }>
          <BaseActionable style={ { marginRight: Whitespace.LARGE, width: IconSize.REGULAR, cursor: 'pointer' } } onAction={ menuToggled }>
            <div className={ 'menu-toggle-overlay' } style={ { width: IconSize.REGULAR, position: 'relative' } }>
              <div style={ { position: 'absolute', zIndex: 15 } } className={ 'header-notification-indicator' }>
                <UnreadNotificationsIndicator type={ NotificationIndicatorType.ICON } />
              </div>
              <BaseIconView family={ 'Feather' } name={ 'menu' } color={ Color.APP_PURPLE } size={ IconSize.REGULAR } />
            </div>
          </BaseActionable>
          <BaseActionable onAction={ goHome } style={ { display: 'flex', cursor: 'pointer' } }>
            <img src={ logo } alt='logo' style={ styles.logo }  className='is-hidden-mobile' />
            <img src={ squareLogo } alt='logo' style={ styles.mobileLogo }  className='is-hidden-tablet' />
          </BaseActionable>
        </div>
        <SearchInput style={ styles.searchInput } />
        <div style={ { display: 'flex', flex: 1, justifyContent: 'flex-end' } } className={ 'header-menu-container' }>
          { account === undefined ? loggedOutJsx : <UserMenu account={ account } /> }
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    top: 0,
    left: 0,
    right: 0,
    height: ViewHeights.HEADER ,
    backgroundColor: Color.WHITE,
    position: 'fixed' as 'fixed',
    boxShadow: `rgba(171, 167, 191, 0.25) 0px 0px 25px 0px`,
    padding: `0 ${Whitespace.MEDIUM}px`,
    display: 'flex',
    alignItems: 'center',
    zIndex: ZIndex.HEADER,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  searchInput: {
    marginLeft: Whitespace.MEDIUM,
    marginRight: Whitespace.MEDIUM,
    flex: 1,
  },
  header: {
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 28,
  },
  mobileLogo: {
    width: 50,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default withRouter(connect(mapStateToProps)(Header));
