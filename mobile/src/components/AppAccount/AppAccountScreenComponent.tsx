import AppAccountTabsComponent from 'mobile/src/components/AppAccount/AppAccountTabsComponent';
import { Routes } from 'mobile/src/navigation/Routes';
import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { Account } from 'shared/blockchain/account';
import AppAccountAvatar from 'shared/components/AppAccount/AppAccountAvatar';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { AppAccountProfileDetails } from 'shared/types/appAccount';
import { Settings } from 'shared/types/settings';

interface Props extends NavigationScreenProps {
  settings: Settings;
  account?: Account;
  appAccountDetails: AppAccountProfileDetails;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const AppAccountScreenComponent = (props: Props) => {
  const { appAccountDetails, settings, account, style, navigation } = props;

  if (!account)
    return null;

  return (
    <React.Fragment>
      <View style={  [{ paddingLeft: Whitespace.SMALL, paddingRight: Whitespace.SMALL }, style ] }>
        <View style={ { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' } }>
          <AppAccountAvatar
            appAccount={ appAccountDetails }
            avatarSize={ 72 }
            clickable={ false }
          />
          <View style={ { justifyContent: 'center', alignItems: 'center', marginTop: Whitespace.CONTAINER } }>
            <BaseText bold={ true } textSize={ TextSize.H3 }>{ appAccountDetails.earnedBalance.humanReadable }</BaseText>
            <BaseText textSize={ TextSize.H5 }>{ `${settings.stakeDisplayDenom} Earned` }</BaseText>
          </View>
          <View style={ { justifyContent: 'center', alignItems: 'center', marginTop: Whitespace.CONTAINER } }>
            <BaseText bold={ true } textSize={ TextSize.H3 }>{ appAccountDetails.totalAgreesReceived }</BaseText>
            <BaseText textSize={ TextSize.H5 }>{ `Agrees Received` }</BaseText>
          </View>
          { account.id === appAccountDetails.id && <BaseActionable onAction={ () => navigation.navigate(Routes.Settings) } style={ { marginTop: Whitespace.CONTAINER + 2 } }>
            <BaseIconView name={ 'settings' } size={ IconSize.XSMALL } />
            </BaseActionable> }
        </View>
        <BaseText
          textSize={ TextSize.H2 }
          bold={ true }
          style={ { marginTop: Whitespace.LARGE } }
        >
          { appAccountDetails.userProfile.fullName }
        </BaseText>
        <BaseText
          textSize={ TextSize.H5 }
          color={ Color.GRAY }
        >
          @{ appAccountDetails.userProfile.username }
        </BaseText>
        { appAccountDetails.userProfile.bio ? <BaseText style={ { marginTop: Whitespace.SMALL } }>{ appAccountDetails.userProfile.bio }</BaseText> : null }
      </View>
      <AppAccountTabsComponent appAccountDetails={ appAccountDetails } style={ { marginTop: Whitespace.SMALL } } />
    </React.Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  account: state.auth.account,
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(withNavigation(AppAccountScreenComponent));
