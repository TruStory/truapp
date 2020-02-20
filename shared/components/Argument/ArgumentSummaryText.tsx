import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { FontFamily } from 'shared/styles/fonts';
import { TextSize } from '../../styles';

interface Props {
  argumentId?: number;
  fontFamily?: string;
  textSize: TextSize;
  summary: string;
  style?: StyleProp<ViewStyle>;
}

const ArgumentSummaryText = (props: Props) => {
  const { summary, style, textSize, fontFamily } = props;

  return(
    <View style={ [ styles.container, style ] }>
      <BaseText
        fontFamily={ fontFamily ? fontFamily : FontFamily.tldr }
        textSize={ textSize }
      >
        { summary }
      </BaseText>
    </View>
  );
};

ArgumentSummaryText.defaultProps = {
  textSize: TextSize.H4,
};

const styles = StyleSheet.create({
  container: { },
});

export default ArgumentSummaryText;
