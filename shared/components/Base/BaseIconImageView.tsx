import * as React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import { ViewProps } from 'shared/styles/props';
import { IconSize } from 'shared/styles/views';

interface Props extends ViewProps {
  style?: StyleProp<ImageStyle> & React.CSSProperties;
  source: any;
  size: IconSize | number;
}

const BaseIconImageView = (props: Props) => {
  const { style, source, size } = props;

  return (
    <View style={ [ styles.container, { width: size, height: size }, style ] }>
      <Image source={ typeof source === 'string' ? { uri: source } : source } style={  [ { width: size, height: size }, style ] } />
    </View>
  );
};

BaseIconImageView.defaultProps = {
  size: IconSize.REGULAR,
};

const styles = StyleSheet.create({
  container: { },
});

export default BaseIconImageView;
