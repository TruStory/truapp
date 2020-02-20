import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import AppAccountLink from 'shared/components/AppAccount/AppAccountLink';
import Avatar, { AvatarSize } from 'shared/components/AppAccount/Avatar';
import { Whitespace } from 'shared/styles/views';
import { Creator } from 'shared/types/appAccount';

interface Props {
  style?: StyleProp<ViewStyle> & React.CSSProperties;
  creators: Creator[];
  avatarCount: number;
  size: AvatarSize;
}

const AppAccountAvatarsPreview = (props: Props) => {
  const { creators, avatarCount, size, style } = props;

  let imagesJsx = [];
  let userExists: string[] = [];

  for ( let i = creators.length - 1; i > -1 ; i-- ) {
    if (creators[i] && userExists.indexOf(creators[i].id) === -1 && imagesJsx.length < avatarCount ) {
      imagesJsx.push(
        <View style={ styles.imageStyle } key={ i }>
          <AppAccountLink appAccount={ creators[i] }>
            <Avatar uri={ creators[i].userProfile.avatarURL } size={ size } />
          </AppAccountLink>
        </View>,
        );
      userExists.push(creators[i].id);
    }
  }

  return (<View style={ [ styles.container, style ] }>{ imagesJsx }</View>);
};

AppAccountAvatarsPreview.defaultProps = {
  size: 15,
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  imageStyle: { marginRight: -Whitespace.TINY - 2 },
});

export default AppAccountAvatarsPreview;
