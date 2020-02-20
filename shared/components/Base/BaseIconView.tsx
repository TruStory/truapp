import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { Color } from 'shared/styles/colors';
import { ViewProps } from 'shared/styles/props';
import { IconSize } from 'shared/styles/views';

interface Props extends ViewProps {
  style?: StyleProp<ViewStyle> & React.CSSProperties;
  color: Color;
  family: string;
  name: string;
  size: IconSize | number;
}

export enum IconFamily {
  MATERIAL= 'Material',
  FEATHER= 'Feather',
  LINE='Line',
}

const BaseIconView = (props: Props) => {
  const { style, family, color, name, size } = props;
  let iconJsx;

  if (family === IconFamily.FEATHER) {
    iconJsx = <Icon name={ name } style={ { fontSize: size, color } } />;
  } else if (family === IconFamily.MATERIAL) {
    iconJsx = <MaterialIcon name={ name } style={ { fontSize: size, color } } />;
  } else if ( family === IconFamily.LINE ) {
    iconJsx = <SimpleLineIcon name={ name } style={ { fontSize: size, color } } />;
  }

  return (
    <View style={ [ styles.container, { width: size, height: size }, style ] }>
      { iconJsx }
    </View>
  );
};

BaseIconView.defaultProps = {
  family: 'Feather',
  size: IconSize.SMALL,
  color: Color.APP_BLACK,
};

const styles = StyleSheet.create({
  container: { },
});

export default BaseIconView;
