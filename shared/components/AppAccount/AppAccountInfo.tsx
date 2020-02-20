import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import AppAccountAvatar from 'shared/components/AppAccount/AppAccountAvatar';
import AppAccountLink from 'shared/components/AppAccount/AppAccountLink';
import { AvatarSize } from 'shared/components/AppAccount/Avatar';
import { TextSize } from 'shared/styles';
import { AppAccount, Creator } from 'shared/types/appAccount';

interface Props {
  appAccount: AppAccount | Creator;
  title?: React.ReactNode;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
  avatarStyle?: StyleProp<ViewStyle> & React.CSSProperties;
  avatarSize?: AvatarSize;
  textSize?: TextSize;
  bold?: boolean;
}

const AppAccountInfo = (props: Props) => {
  const { appAccount, title, children, avatarSize, bold, textSize, avatarStyle } = props;

  const renderChildren = () => {
    return (
      <View style={ { flex: 1 } }>
        { title ? title : <AppAccountLink appAccount={ appAccount } /> }
        { children }
      </View>
    );
  };

  return (
    <AppAccountAvatar appAccount={ appAccount } avatarSize={ avatarSize } avatarStyle={ avatarStyle } clickable={ true }>
      { children ? renderChildren() : title ? title : <AppAccountLink appAccount={ appAccount } textSize={ textSize } bold={ bold } /> }
    </AppAccountAvatar>
  );
};

AppAccountInfo.defaultProps = {
  avatarSize: AvatarSize.MEDIUM,
};

export default AppAccountInfo;
