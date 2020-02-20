import CommunitiesSidebar from 'mobile/src/components/Communities/CommunitiesSidebar';
import MenuLink from 'mobile/src/components/Menu/MenuLink';
import { Routes } from 'mobile/src/navigation/Routes';
import NavigationService from 'mobile/src/utils/NavigationService';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationScreenProps, ScrollView, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import { DevicePlatformType } from 'shared/blockchain/types';
import AppAccountInfo from 'shared/components/AppAccount/AppAccountInfo';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import BalanceWidget from 'shared/components/BalanceWidget';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import { add_claim_black, add_claim_purple } from 'shared/images/Claim/ClaimImages';
import { how_black, how_purple, invite_black, leaderboard_black, leaderboard_purple, logout_red, logout_white } from 'shared/images/Pages/PageImages';
import { removeAllDrafts } from 'shared/redux/actions/argument-draft.action';
import { logout } from 'shared/redux/actions/auth.action';
import { removeAllClaimDrafts } from 'shared/redux/actions/claim-draft.action';
import { removeAllCommentDrafts } from 'shared/redux/actions/comment-draft.action';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Settings } from 'shared/types/settings';

interface Props extends NavigationScreenProps {
  account?: Account;
  settings: Settings;
  device: { token: string, platform: DevicePlatformType};
  logout: () => void;
  removeAllClaimDrafts: () => void;
  removeAllCommentDrafts: () => void;
  removeAllDrafts: () => void;
}

const Menu = (props: Props) => {
  const { account, device, logout, navigation, settings, removeAllClaimDrafts, removeAllCommentDrafts, removeAllDrafts } = props;

  if (!account) return null;
  const deregisterPushToken = async () => {
    try {
      if (device && device.token) {
        await Chain.unregisterDeviceToken(device.token, device.platform);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onLogout = () => {
    deregisterPushToken();
    removeAllClaimDrafts();
    removeAllCommentDrafts();
    removeAllDrafts();
    logout();
    NavigationService.navigate(Routes.Auth, { }, '');
  };

  const onAddClaim = () => navigation.navigate(Routes.AddClaim, { settings });
  const onHowPlay = () => navigation.navigate(Routes.HowItWorks, { settings });
  const onInvite = () => navigation.navigate(Routes.InviteStack, { settings });
  const onLeaderboard = () => navigation.navigate(Routes.Leaderboard);

  return (
    <SafeAreaView>
      <ScrollView
        style={ styles.container }
      >
        <AppAccountInfo
          appAccount={ account }
          avatarSize={ AvatarSize.MEDIUM }
          textSize={ TextSize.H4 }
        />
        <BalanceWidget appAccountId={ account.id } style={ { marginTop: Whitespace.MEDIUM } } />
        <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
        <MenuLink
          title={ 'Start A Debate' }
          onClick={ onAddClaim }
          color={ Color.APP_BLACK }
          icon={ { active: add_claim_purple, regular: add_claim_black } }
        />
        <MenuLink
          title={ 'How To Play' }
          onClick={ onHowPlay }
          color={ Color.APP_BLACK }
          icon={ { active: how_purple, regular: how_black } }
        />
        <MenuLink
          title={ 'Invite A Friend' }
          onClick={ onInvite }
          color={ Color.APP_BLACK }
          icon={ { active: invite_black, regular: invite_black } }
        />
        <MenuLink
          title={ 'Leaderboard' }
          onClick={ onLeaderboard }
          color={ Color.APP_BLACK }
          icon={ { active: leaderboard_purple, regular: leaderboard_black } }
        />
        <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
        <BaseText bold={ true } style={ { marginBottom: Whitespace.SMALL } }>Communities</BaseText>
        <CommunitiesSidebar />
        <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
        <MenuLink
          title={ 'Logout' }
          onClick={ onLogout }
          color={ Color.RED }
          icon={ { active: logout_white, regular: logout_red } }
          style={ { marginBottom: Whitespace.LARGE + Whitespace.MEDIUM } }
        />
      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Whitespace.LARGE,
    paddingBottom: Whitespace.LARGE,
    paddingHorizontal: Whitespace.SMALL,
  },
});

const mapStateToProps = (state: any) => {
  return {
    account: state.auth.account,
    settings: state.settings.settings,
    device: state.device,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch(logout()),
  removeAllClaimDrafts: () => dispatch(removeAllClaimDrafts()),
  removeAllDrafts: () => dispatch(removeAllDrafts()),
  removeAllCommentDrafts: () => dispatch(removeAllCommentDrafts()),
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Menu));
