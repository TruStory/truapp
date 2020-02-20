import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseText from 'shared/components/Base/BaseText';
import ClaimDetailIndicator, { ClaimDetailIcon } from 'shared/components/Claim/ClaimDetailIndicator';
import ClaimParticipants from 'shared/components/Claim/ClaimParticipants';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { isWeb } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { AppAccountClaim, Claim, FeedClaim } from 'shared/types/claim';
import { isLiveVideo } from 'shared/utils/video';

interface Props {
  claim: FeedClaim | AppAccountClaim | Claim;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const ClaimIndicators = (props: Props) => {
  const { claim, style } = props;

  if (isLiveVideo(claim))
    return null;

  return(
    <View style={ [ styles.container, style ] }>
      <ClaimDetailIndicator type={ ClaimDetailIcon.BACK_COINS } claim={ claim } style={ styles.indicator } />
      <ClaimDetailIndicator type={ ClaimDetailIcon.CHALLENGE_COINS } claim={ claim } style={ styles.indicator } />
      <ClaimDetailIndicator type={ ClaimDetailIcon.ARGUMENT_COUNT } claim={ claim } style={ styles.indicator } />
      <ClaimParticipants claim={ claim } />
      { claim.participantsCount > 0 ? <BaseText color={ Color.GRAY } textSize={ TextSize.H6 }>{ claim.participantsCount }</BaseText> : null }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  indicator: {
    paddingTop: Whitespace.TINY + 2,
    paddingBottom: Whitespace.TINY,
    marginRight: isWeb() ? Whitespace.LARGE : Whitespace.MEDIUM,
  },
});

export default ClaimIndicators;
