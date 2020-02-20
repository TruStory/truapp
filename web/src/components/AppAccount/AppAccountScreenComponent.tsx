import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import AppAccountAvatar from 'shared/components/AppAccount/AppAccountAvatar';
import BaseText from 'shared/components/Base/BaseText';
import CommunityCoinList from 'shared/components/Communities/CommunityCoinList';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { isLargerThanTablet } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { AppAccountProfileDetails } from 'shared/types/appAccount';
import { Settings } from 'shared/types/settings';
import { Routes } from '../../navigation/Routes';
import AppAccountTabsComponent from './AppAccountTabsComponent';

interface Props {
  account?: Account;
  settings: Settings;
  appAccountDetails: AppAccountProfileDetails;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const AppAccountScreenComponent = (props: Props) => {
  const { settings, appAccountDetails, style, account } = props;
  const jailedStyle = (appAccountDetails.isJailed ? styles.jailedStyle : null);

  const renderProfileImage = () => {
    const avatarJsx = (
      <AppAccountAvatar
        appAccount={ appAccountDetails }
        avatarSize={ isLargerThanTablet() ? 144 : 96 }
        style={ { marginRight: -Whitespace.SMALL } }
        clickable={ false }
      />);

    if (appAccountDetails.isJailed) {
      return(
        <View>
          <View style={ jailedStyle }>
            { avatarJsx }
          </View>
          <BaseText
            style={ { position: 'absolute', top: 55, left: 45 } }
            bold={ true }
            color={ Color.DARK_RED }
          >
            TIMEOUT
          </BaseText>
        </View>
      );
    }
    return avatarJsx;
  };

  const renderEditLink = () => {
    if (account && account.id === appAccountDetails.id) {
      return (
        <BaseATag
          appLink={ Routes.EDIT_PROFILE }
          textSize={ TextSize.H5 }
          style={ { marginLeft: Whitespace.SMALL } }
          color={ Color.APP_PURPLE }
        >
          Edit Profile
        </BaseATag>
      );
    }

    return null;
  };

  return (
    <View style={ [ styles.container, style ] }>
      <View style={ { alignItems: 'flex-start', flexDirection: 'row', width: '100%', marginTop: Whitespace.SMALL } }>
        <View style={ { display: 'flex', flexDirection: 'column', flexWrap: 'wrap', flex: 1 } }>
          <div className={ 'is-hidden-tablet' } style={ { marginBottom: Whitespace.SMALL } }>
            { renderProfileImage() }
          </div>
          <div>
            <BaseText
              textSize={ TextSize.H2 }
              bold={ true }
              color={ appAccountDetails.isJailed ? Color.DARK_RED : Color.APP_BLACK }
            >
              { appAccountDetails.userProfile.fullName }
            </BaseText>
            { renderEditLink() }
          </div>
          <BaseText
            style={ { marginTop: -Whitespace.TINY } }
            textSize={ TextSize.H4 }
            color={ Color.GRAY }
          >
            @{ appAccountDetails.userProfile.username }
          </BaseText>
          <BaseText>
            { appAccountDetails.userProfile.bio }
          </BaseText>
          <BaseText style={ { marginTop: Whitespace.LARGE, marginBottom: Whitespace.TINY } } bold={ true }>{ settings.stakeDisplayDenom } Earned Per Community</BaseText>
          <CommunityCoinList communityCoins={ appAccountDetails.earnedStake } />
          <BaseText style={ { marginTop: Whitespace.MEDIUM } } bold={ true }>Total { settings.stakeDisplayDenom } Earned</BaseText>
          <BaseText
            style={ { marginTop: Whitespace.TINY } }
            bold={ true }
            color={ Color.APP_PURPLE }
          >
            { appAccountDetails.earnedBalance.humanReadable }
          </BaseText>
        </View>
        <div className={ 'is-hidden-mobile' } style={ { paddingLeft: Whitespace.LARGE + Whitespace.MEDIUM } }>
          { renderProfileImage() }
        </div>

      </View>
      <View style={ jailedStyle }>
        <AppAccountTabsComponent appAccountDetails={ appAccountDetails } style={ { marginTop: Whitespace.LARGE } } />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
  jailedStyle: {
    opacity: 0.2,
    pointerEvents: 'none',
  },
});

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(AppAccountScreenComponent);
