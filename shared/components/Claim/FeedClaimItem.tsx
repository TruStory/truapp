import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import ClaimSource from 'shared/components/Claim/ClaimSource';
import FeedClaimImage from 'shared/components/Claim/FeedClaimImage';
import FeedClaimText from 'shared/components/Claim/FeedClaimText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { AppAccountClaim, FeedClaim } from 'shared/types/claim';
import ClaimIndicators from './ClaimIndicators';

interface Props {
  claim: FeedClaim | AppAccountClaim;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const FeedClaimItem = (props: Props) => {
  const { claim, style, children } = props;

  return(
    <View style={ [ styles.container, style ] }>
      <View style={ styles.claimAndImageContainer }>
        <View style={ { flexDirection: 'column', flex: 1, marginRight: Whitespace.SMALL } }>
          <BaseText textSize={ TextSize.H5 } color={ Color.APP_PURPLE } style={ { marginBottom: Whitespace.TINY } }>Claim</BaseText>
          <FeedClaimText claim={ claim } />
          <ClaimSource claim={ claim } style={ styles.sourceContainer } />
        </View>
        <FeedClaimImage claim={ claim } style={ styles.image } />
      </View>
      <ClaimIndicators claim={ claim } />
      { children ? children : null }
    </View>
  );

};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', flex: 1 },
  claimAndImageContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  textContainer: {
    flexDirection: 'column',
  },
  sourceContainer: {
    marginTop: Whitespace.TINY,
    marginBottom: Whitespace.TINY,
  },
  image: {
    width: 80,
    height: 80,
  },
});

export default FeedClaimItem;
