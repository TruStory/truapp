import React from 'react';
import { StyleSheet, View } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import { ClaimTextProps } from 'shared/components/Claim/ClaimText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';

const FeedClaimText = (props: ClaimTextProps) => {

  const { claim, style, textSize } = props;

  return (
    <View style={ [ styles.container, style ] }>
      <BaseText
        color={ Color.APP_BLACK }
        style={ { fontWeight: '800' } }
        textSize={ textSize }
        bold={ true }
      >
        { claim.body }
      </BaseText>
    </View>
  );

};

FeedClaimText.defaultProps = {
  textSize: TextSize.H3,
};

const styles = StyleSheet.create({
  container: { },
});

export default FeedClaimText;
