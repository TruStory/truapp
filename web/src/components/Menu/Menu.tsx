import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import AppConfig from 'shared/app-config.json';
import { Account } from 'shared/blockchain/account';
import BalanceWidget from 'shared/components/BalanceWidget';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import UnreadNotificationsIndicator, { NotificationIndicatorType } from 'shared/components/Notifications/UnreadNotificationsIndicator';
import { apple_store, google_store } from 'shared/images/Brand/BrandImages';
import { discover_black, discover_purple, home_black, home_purple, how_black, how_purple, leaderboard_black, leaderboard_purple, notification_black, notification_purple, profile_black, profile_purple, value_black, value_purple, wallet_black, wallet_purple } from 'shared/images/Pages/PageImages';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import CommunitiesSidebar from 'web/src/components/Communities/CommunitiesSidebar';
import FooterLinks from 'web/src/components/Menu/FooterLinks';
import MenuLink from 'web/src/components/Menu/MenuLink';
import TruTip from 'web/src/components/Popovers/TruTip';
import { Routes } from 'web/src/navigation/Routes';
import BaseActionable from '../Base/BaseActionable';

interface Props extends RouteComponentProps {
  style?: React.CSSProperties;
  onMenuItemClicked: () => void;
  account?: Account;
  open: boolean;
}

const Menu = (props: Props) => {

  const { account, open, style, onMenuItemClicked } = props;

  const balanceWidget = (
    <React.Fragment>
      <div style={ styles.contentContainer }>
        <BalanceWidget appAccountId={ account ? account.address : '' } />
      </div>
      <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
    </React.Fragment>
  );

  const onMenuItemClickedAction = () => onMenuItemClicked();

// tslint:disable: jsx-no-multiline-js
  return (
    <div style={ { ...styles.container, ...style } } className={ `menu ${ open ? 'slide-in' : 'slide-out' }` }>
      { account ? balanceWidget : null }
      <MenuLink
        path={ Routes.HOW_IT_WORKS }
        title={ 'How to Play' }
        icon={ { active: how_purple, regular: how_black } }
        onClicked={ onMenuItemClickedAction }
      />
      <MenuLink
        path={ Routes.VALUES }
        title={ 'Values and Guidelines' }
        icon={ { active: value_purple, regular: value_black } }
        onClicked={ onMenuItemClickedAction }
      />
      <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
      { account && <MenuLink
        path={ Routes.HOME }
        title={ 'Home' }
        icon={ { active: home_purple, regular: home_black } }
        onClicked={ onMenuItemClickedAction }
      /> }
      <MenuLink
        path={ `${Routes.COMMUNITY}all/` }
        title={ 'Discover' }
        icon={ { active: discover_purple, regular: discover_black } }
        onClicked={ onMenuItemClickedAction }
      />
      <MenuLink
        path={ `${Routes.LEADERBOARD}` }
        title={ 'Leaderboard' }
        icon={ { active: leaderboard_purple, regular: leaderboard_black } }
        onClicked={ onMenuItemClickedAction }
      />
      { account && <MenuLink
        path={ Routes.WALLET }
        title={ 'Wallet' }
        icon={ { active: wallet_purple, regular: wallet_black } }
        onClicked={ onMenuItemClickedAction }
      /> }
      { account && <div style={ { position: 'relative' } }>
        <MenuLink
          path={ Routes.NOTIFICATIONS }
          title={ 'Notifications' }
          icon={ { active: notification_purple, regular: notification_black } }
          onClicked={ onMenuItemClickedAction }
        />
        <UnreadNotificationsIndicator
          type={ NotificationIndicatorType.BADGE }
          style={ styles.notificationIndicator }
          color={ Color.WHITE }
          backgroundColor={ Color.RED }
        />
      </div> }
      { account && <MenuLink
        path={ `${Routes.PROFILE}${account ? account.id : ''}` }
        title={ 'Profile' }
        icon={ { active: profile_purple, regular: profile_black } }
        onClicked={ onMenuItemClickedAction }
      /> }
      <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
      <TruTip
        tip={ { title: 'Communities' , subtitle: 'Debates are categorized into communities.  ' } }
        clickable={ false }
      >
        <BaseText bold={ true }>Communities</BaseText>
      </TruTip>
      <CommunitiesSidebar
        onSidebarItemClick={ onMenuItemClickedAction }
      />
      <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
      <div style={ { justifyContent: 'center', alignItems: 'center', flex: 1, display: 'flex', flexDirection: 'row', marginLeft: Whitespace.CONTAINER } }>
        <BaseActionable onAction={ () => { window.open(AppConfig.ios_url, '_blank'); } }>
          <img src={ apple_store } style={ { width: '100%' } } />
        </BaseActionable>
        <BaseActionable onAction={ () => { window.open(AppConfig.android_url, '_blank'); } }>
          <img src={ google_store } style={ { width: '100%' } } />
        </BaseActionable>
      </div>
      <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
      <div style={ { ...styles.contentContainer, paddingBottom: Whitespace.MEDIUM } }>
        <FooterLinks />
      </div>
    </div>
  );
};

const styles = {
  container: { },
  contentContainer: { marginLeft: Whitespace.SMALL, marginRight: Whitespace.SMALL },
  menuItem: {
    paddingTop: Whitespace.MEDIUM / 2,
    paddingLeft: Whitespace.MEDIUM,
    paddingRight: Whitespace.MEDIUM,
    paddingBottom: Whitespace.MEDIUM / 2,
    cursor: 'pointer',
  },
  notificationIndicator: {
    position: 'absolute' as 'absolute',
    right: 15,
    top: 10,
  },
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default withRouter(connect(mapStateToProps)(Menu));
