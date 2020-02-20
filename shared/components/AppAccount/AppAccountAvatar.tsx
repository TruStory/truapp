import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Avatar, { AvatarSize } from 'shared/components/AppAccount/Avatar';
import OpenProfile from 'shared/components/AppAccount/OpenProfile';
import { Creator } from 'shared/types/appAccount';

interface Props {
  appAccount: Creator;
  children?: React.ReactNode;
  avatarStyle?: StyleProp<ViewStyle> & React.CSSProperties;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
  avatarSize: AvatarSize | number;
  clickable?: boolean;
}

const AppAccountAvatar = (props: Props) => {
  const { appAccount, children, avatarSize, style, clickable, avatarStyle } = props;

  if (clickable)
    return (
      <OpenProfile style={ [ styles.container, style ] } appAccount={ appAccount }>
        <Avatar size={ avatarSize } uri={ appAccount.userProfile.avatarURL } style={ avatarStyle } />
        { children ? children :  null }
      </OpenProfile>
    );

  return (
    <View style={ [ styles.container, style ] }>
      <Avatar size={ avatarSize } uri={ appAccount.userProfile.avatarURL } style={ avatarStyle } />
      { children ? children : null }
    </View>
  );
};

AppAccountAvatar.defaultProps = {
  clickable: true,
  avatarSize: AvatarSize.MEDIUM,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: 'flex',
  },
});

export default AppAccountAvatar;
