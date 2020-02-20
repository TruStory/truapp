import * as React from 'react';
import { Image, StyleProp, StyleSheet, View } from 'react-native';
import { Whitespace } from 'shared/styles/views';

export enum AvatarSize {
  XXSMALL=10,
  XSMALL=15,
  SMALL=20,
  MEDIUM=24,
  LARGE=30,
  XLARGE=35,
  XXLARGE=40,
}
interface Props {
  style?: StyleProp<any> & React.CSSProperties;
  size: AvatarSize;
  uri?: string;
}

const Avatar = (props: Props) => {
  const { uri, size, style } = props;
  const height = size;
  const width = height;
  const borderRadius = width / 2;

  return (
    <View style={ [ styles.container, style ] }>
      <Image
        source={ { uri } }
        style={ { height, width, borderRadius } }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: Whitespace.SMALL,
  },
});

export default Avatar;
