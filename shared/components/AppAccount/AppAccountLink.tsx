import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { AppAccount, Creator } from 'shared/types/appAccount';
import BaseActionable from '../Base/BaseActionable';

export interface AppAccountLinkProps {
  appAccount: AppAccount | Creator;
  color?: Color;
  textSize?: TextSize;
  children?: any;
  bold?: boolean;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

interface MobileAppAccountLinkProps extends AppAccountLinkProps, NavigationScreenProps { }

const AppAccountLink = (props: MobileAppAccountLinkProps) => {

  const { children, appAccount, color, textSize, bold, navigation, style } = props;

  const navigateToProfile = () => navigation.navigate({
    routeName: 'AppAccount',
    params: { accountId: appAccount.id },
    key: `AppAccount-${appAccount.id}`,
  });

  const renderChildren = () => {
    if (children) {
      return children;
    } else {
      return (
        <BaseText textSize={ textSize } bold={ bold } color={ color }>
          { appAccount.userProfile.username }
        </BaseText>
      );
    }
  };

  return (
    <BaseActionable onAction={ navigateToProfile } style={ style }>
      { renderChildren() }
    </BaseActionable>
  );
};

AppAccountLink.defaultProps = {
  color: Color.APP_BLACK,
  textSize: TextSize.H5,
  bold: true,
};

export default withNavigation(AppAccountLink);
