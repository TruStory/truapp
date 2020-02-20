import * as React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import BaseText from 'shared/components/Base/BaseText';
import TruTip from 'shared/components/WebOnly/TruTip';
import { argument_mobile_purple, argument_purple } from 'shared/images/Argument/ArgumentImages';
import { coins_back, coins_challenge } from 'shared/images/Coins/CoinImages';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { AppAccountClaim, Claim, FeedClaim } from 'shared/types/claim';
import { Settings } from 'shared/types/settings';
import { isWeb } from '../../styles/utils';

export enum ClaimDetailIcon {
  BACK_COINS,
  CHALLENGE_COINS,
  ARGUMENT_COUNT,
}

interface Props {
  settings: Settings;
  type: ClaimDetailIcon;
  claim: Claim | FeedClaim | AppAccountClaim;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const ClaimDetailIndicator = (props: Props) => {
  const { settings, type, claim, style } = props;
  const { argumentCount, totalBacked, totalChallenged } = claim;
  let img, color, text, tip;

  if (type === ClaimDetailIcon.ARGUMENT_COUNT) {
    img = isWeb() ? argument_purple : argument_mobile_purple;
    color = Color.APP_PURPLE;
    text = argumentCount;
    tip = { title: 'Argument Count', subtitle: 'Number of Arguments in this debate' };
  } else if ( type === ClaimDetailIcon.BACK_COINS) {
    img = coins_back;
    color = Color.BACK;
    text = totalBacked.humanReadable;
    tip = { title: 'Backed Amount', subtitle: `Total ${ settings.stakeDisplayDenom } invested in Arguments that back this claim.` };
  } else {
    img = coins_challenge;
    color = Color.CHALLENGE;
    text = totalChallenged.humanReadable;
    tip = { title: 'Challenged Amount', subtitle: `Total ${ settings.stakeDisplayDenom } invested in Arguments that challenge this claim.` };
  }

  return (
    <TruTip tip={ tip } clickable={ false }>
      <View style={ [ styles.container, style ] }>
        <View style={ styles.iconContainer }>
          <Image source={ img } resizeMode={ 'contain' } style={ styles.icon } />
        </View>
        <BaseText textSize={ TextSize.H6 } color={ color }>{ text }</BaseText>
      </View>
    </TruTip>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Whitespace.TINY,
  },
  iconContainer: { marginRight: 4 },
  icon: { width: 16, height: 16 },
});

const mapStateToProps = (state: any) => ({
  settings: state.settings.settings,
});

export default connect(mapStateToProps)(ClaimDetailIndicator);
