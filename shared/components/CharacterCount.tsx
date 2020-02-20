import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { TextAlign, TextSize } from 'shared/styles';
import ValidationUtil from 'shared/utils/validation';

interface Props {
  text: string;
  textSize: TextSize;
  align: TextAlign;
  minSize: number;
  maxSize: number;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
  includeAddressLength: boolean;
}

const CharacterCount = (props: Props) => {
  const { text, minSize, maxSize, textSize, align, style, includeAddressLength } = props;
  const { color, message } = ValidationUtil.validateCharacterCount(minSize, maxSize, text, includeAddressLength);

  return (
    <View style={ [ styles.container, style ] }>
      <BaseText color={ color } align={ align } textSize={ textSize }>{ message }</BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  },
});

CharacterCount.defaultProps = {
  align: TextAlign.CENTER,
  textSize: TextSize.H4,
  includeAddressLength: false,
};

export default CharacterCount;
