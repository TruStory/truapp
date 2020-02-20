import React from 'react';
import { StyleProp, StyleSheet, View } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { FontFamily } from 'shared/styles/fonts';
import { BaseClaim } from 'shared/types/claim';

export interface ClaimTextProps {
  textSize: TextSize;
  claim: BaseClaim;
  style?: StyleProp<any> & React.CSSProperties;
}

const ClaimText = (props: ClaimTextProps) => {

  const { claim, style, textSize } = props;
  const { body } = claim;

  return (
    <View style={ [ styles.container, style ] }>
      <BaseText
        color={ Color.APP_BLACK }
        textSize={ textSize }
        fontFamily={ FontFamily.serif }
      >
        { body }
      </BaseText>
    </View>
  );

};

ClaimText.defaultProps = {
  textSize: TextSize.H2,
};

const styles = StyleSheet.create({
  container: { },
});

export default ClaimText;
