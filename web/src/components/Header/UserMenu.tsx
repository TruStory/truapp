import Tippy from '@tippy.js/react';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import AppConfig from 'shared/app-config.json';
import { Account } from 'shared/blockchain/account';
import AppAccountAvatar from 'shared/components/AppAccount/AppAccountAvatar';
import AppAccountInfo from 'shared/components/AppAccount/AppAccountInfo';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import { slack } from 'shared/images/Brand/BrandImages';
import { addclaim_black, addclaim_purple, how_black, how_purple, leaderboard_black, leaderboard_purple, logout_red, logout_white, notification_black, notification_purple, profile_black, profile_purple, value_black, value_purple, wallet_black, wallet_purple } from 'shared/images/Pages/PageImages';
import { logout } from 'shared/redux/actions/auth.action';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import Analytics from 'shared/utils/analytics';
import tippy from 'tippy.js';
import 'web/src/styles/tippy.css';
import { Routes } from '../../navigation/Routes';
import { ViewWidths } from '../../styles';
import BaseActionable from '../Base/BaseActionable';
import MenuItem from '../DropdownMenu/MenuItem';

interface Props extends RouteComponentProps {
  style?: React.CSSProperties;
  account: Account;
  logout: () => void;
}

const UserMenu = (props: Props) => {

  const { account, history, style, logout } = props;
  const goToClaim = () => {
    tippy.hideAll({ duration: 0 });
    history.push(Routes.CREATE);
  };
  const goToLeaderboard = () => {
    tippy.hideAll({ duration: 0 });
    history.push(Routes.LEADERBOARD);
  };
  const goToInvites = () => {
    tippy.hideAll({ duration: 0 });
    history.push(Routes.INVITES);
  };
  const goToHow = () => {
    tippy.hideAll({ duration: 0 });
    history.push(Routes.HOW_IT_WORKS);
  };
  const goToValues = () => {
    tippy.hideAll({ duration: 0 });
    history.push(Routes.VALUES);
  };
  const goToSlack = () => {
    tippy.hideAll({ duration: 0 });
    window.open(AppConfig.slack_url, '_blank');
  };
  const goToWallet = () => {
    tippy.hideAll({ duration: 0 });
    history.push(Routes.WALLET);
  };
  const goToNotifications = () => {
    tippy.hideAll({ duration: 0 });
    history.push(Routes.NOTIFICATIONS);
  };
  const goToProfile = () => {
    tippy.hideAll({ duration: 0 });
    history.push(`${Routes.PROFILE}${account.id}`);
  };
  const logoutUser = () => {
    logout();
    tippy.hideAll({ duration: 0 });
    Analytics.reset();
    window.location.href = `${ AppConfig.base_url }/auth-logout`;
  };

  const avatarTitle = (
    <div style={ { display: 'flex', flexDirection: 'column' } }>
      <BaseText
        bold={ true }
      >
        { account.userProfile.fullName }
      </BaseText>
      <BaseText
        textSize={ TextSize.H6 }
        style={ { marginTop: -Whitespace.TINY } }
      >
        { account.userProfile.username }
      </BaseText>
    </div>
  );

  const content = (
    <div style={ styles.menu }>
      <div style={ { marginLeft: Whitespace.SMALL, display: 'flex' } }>
        <AppAccountInfo appAccount={ account } avatarSize={ AvatarSize.LARGE } title={ avatarTitle } />
      </div>
      <BaseLine style={ { marginTop: Whitespace.LARGE } } />
      <MenuItem
        onClick={ goToClaim  }
        icon={ { active: addclaim_purple, regular: addclaim_black } }
      >
        Start a Debate
      </MenuItem>
      <BaseLine />
      <MenuItem
        onClick={ goToHow }
        icon={ { active: how_purple, regular: how_black } }
      >
        How to Play
      </MenuItem>
      <MenuItem
        onClick={ goToValues }
        icon={ { active: value_purple, regular: value_black } }
      >
        Values and Guidelines
      </MenuItem>
      <MenuItem
        onClick={ goToSlack }
        icon={ { active: slack, regular: slack } }
      >
        Join Us On Slack
      </MenuItem>
      <BaseLine />
      <MenuItem
        onClick={ goToWallet }
        icon={ { active: wallet_purple, regular: wallet_black } }
      >
        Wallet
      </MenuItem>
      <MenuItem
        onClick={ goToLeaderboard }
        icon={ { active: leaderboard_purple, regular: leaderboard_black } }
      >
        Leaderboard
      </MenuItem>
      <MenuItem
        onClick={ goToNotifications }
        icon={ { active: notification_purple, regular: notification_black } }
      >
        Notifications
      </MenuItem>
      <MenuItem
        onClick={ goToProfile }
        icon={ { active: profile_purple, regular: profile_black } }
      >
        Profile
      </MenuItem>
      <BaseLine />
      <MenuItem
        onClick={ logoutUser }
        hoverColors={ { regularText: Color.RED, hoverText: Color.WHITE, hoverBackground: Color.RED, regularBackground: Color.WHITE } }
        icon={ { active: logout_white, regular: logout_red } }
        style={ { borderBottomLeftRadius: Whitespace.SMALL, borderBottomRightRadius: Whitespace.SMALL } }
      >
        Logout
      </MenuItem>
    </div>
  );

  const onShow = () => tippy.hideAll({ duration: 0 });

  return (
    <div style={ { ...styles.container, ...style } }>
      <div className={ 'is-hidden-mobile' }>
        <BaseButton
          title={ 'Invite Friends' }
          accentColor={ Color.APP_PURPLE }
          outline={ false }
          onAction={ goToInvites }
          color={ Color.WHITE }
          style={ { marginRight: Whitespace.CONTAINER } }
          className={ 'filled-button' }
        />
      </div>
      <div className={ 'hvr-grow' }>
        <BaseActionable onAction={ goToProfile }>
          <AppAccountAvatar appAccount={ account } avatarSize={ AvatarSize.XLARGE } />
        </BaseActionable>
      </div>
      <Tippy
        interactive={ true }
        interactiveBorder={ 10 }
        content={ content }
        delay={ [100, 0] }
        theme={ 'light' }
        placement={ 'bottom-end' }
        popperOptions={ { modifiers: { preventOverflow: { enabled : false }, hide: { enabled : false }  } } }
        onShow={ onShow }
        animation={ 'shift-away' }
        trigger={ 'click' }
      >
        <span style={ { cursor: 'pointer', marginTop: 3 } }>
          <div className={ 'menu-icon-overlay' }>
            <BaseIconView  family={ 'Feather' } name={ 'chevron-down' } color={ Color.GRAY } />
          </div>
        </span>
      </Tippy>
    </div>
  );
};

const styles = {
  container: { display: 'flex', alignItems:  'center' },
  menu: {
    paddingTop: Whitespace.MEDIUM,
    width: ViewWidths.USER_MENU,
  },
};

const mapDispatchToProps = (dispatch: any) => ({
  logout: () => { return dispatch(logout()); },
});

export default withRouter(connect(null, mapDispatchToProps)(UserMenu));
