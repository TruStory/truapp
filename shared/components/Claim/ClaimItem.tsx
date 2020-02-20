import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import ClaimImage from 'shared/components/Claim/ClaimImage';
import ClaimSource from 'shared/components/Claim/ClaimSource';
import ClaimText from 'shared/components/Claim/ClaimText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Claim } from 'shared/types/claim';
import { isVideo } from 'shared/utils/video';
import ClaimIndicators from './ClaimIndicators';

interface Props {
  claim: Claim;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const ClaimItem = (props: Props) => {
  const { claim, style } = props;

  return(
    <View style={ [ styles.container, style ] }>
      <ClaimImage claim={ claim } style={ styles.imageContainer } />
      <View style={ { paddingHorizontal: Whitespace.SMALL } }>
        <BaseText textSize={ TextSize.H5 } color={ Color.APP_PURPLE } style={ { marginBottom: Whitespace.TINY } }>Claim</BaseText>
        <ClaimText claim={ claim } style={ { marginTop: isVideo(claim) ? Whitespace.SMALL : 0 } }  textSize={ TextSize.T1 } />
        <ClaimSource claim={ claim } style={ styles.sourceContainer } />
        <ClaimIndicators claim={ claim } />
      </View>
    </View>
  );

};

const styles = StyleSheet.create({
  container: { },
  sourceContainer: {
    flexDirection: 'row',
    marginTop: Whitespace.TINY,
  },
  imageContainer: {
    marginTop: -Whitespace.MEDIUM,
    marginBottom: Whitespace.SMALL,
    borderRadius: 0,
  },
});

export default ClaimItem;
