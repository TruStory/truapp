import CloseButton from 'mobile/src/components/Buttons/CloseButton';
import InvitedFriendsList from 'mobile/src/components/Invites/InvitedFriendsList';
import InviteTimeline from 'mobile/src/components/Invites/InviteTimeline';
import { headerStyles } from 'mobile/src/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationScreenProp, ScrollView } from 'react-navigation';
import { connect } from 'react-redux';
import * as AppConfig from 'shared/app-config.json';
import { Account } from 'shared/blockchain/account';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import NativeShareSheet from 'shared/components/Share/NativeShareSheet';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';

interface Props {
  account?: Account;
}

const InviteScreen = (props: Props) => {
  const { account } = props;

  if (!account)
    return null;

  const referralLink = `${AppConfig.base_url}${AppConfig.invite_route_url}?referrer=${account.address}`;

  return(
    <ScrollView style={ [ styles.container ] }>
      <BaseText textSize={ TextSize.H1 } bold={ true }>Invite a Friend!</BaseText>
      <BaseText>Earn TRU by inviting your friends.</BaseText>
      <View style={ { marginTop: Whitespace.LARGE } }>
        <NativeShareSheet message={ referralLink }>
          <BaseText color={ Color.APP_PURPLE }>
            Tap here to share your referral link
          </BaseText>
        </NativeShareSheet>
      </View>
      <BaseText bold={ true } style={ {  marginTop: Whitespace.LARGE } }>Invites Available: { account.invitesLeft }</BaseText>
      <BaseText>To get the first set of (3) invites, you must complete 3 tasks.</BaseText>
      <InviteTimeline
        style={ { marginTop: Whitespace.MEDIUM, marginLeft: -Whitespace.SMALL } }
      />
      <BaseLine style={ { marginVertical: Whitespace.LARGE } } />
      <BaseText bold={ true }>Invitations Sent</BaseText>
      <BaseText>For every friend that has completed all three milestones, you will receive three more invites.</BaseText>
      <BaseText bold={ true } style={ {  marginTop: Whitespace.LARGE } }>Active Invitations</BaseText>
      <BaseLine style={ { marginTop: Whitespace.CONTAINER, marginBottom: Whitespace.MEDIUM } } />
      <InvitedFriendsList />
    </ScrollView>
  );
};

InviteScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  return {
    ...headerStyles,
    headerLeft: <CloseButton />,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: Whitespace.SMALL,
    paddingRight: Whitespace.SMALL,
    paddingTop: Whitespace.MEDIUM,
  },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
});

export default connect(mapStateToProps)(InviteScreen);
