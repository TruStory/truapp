import React from 'react';
import { StyleProp, StyleSheet, View } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Argument } from 'shared/types/argument';

export interface ArgumentDetailProps {
  argument: Argument;
  opened?: boolean;
  style?: StyleProp<any> & React.CSSProperties;
}

const ArgumentDetails = (props: ArgumentDetailProps) => {
  const{ style } = props;
  return (
    <View style={ [  styles.container, style ] }>
      <BaseText color={ Color.GRAY }  textSize={ TextSize.H5 }>Read More</BaseText>
    </View>
  );

};

const styles = StyleSheet.create({
  container: { },
});

export default ArgumentDetails;
