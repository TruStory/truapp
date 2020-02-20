import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Fade from 'react-reveal/Fade';
import BaseText from 'shared/components/Base/BaseText';
import ClaimImage from 'shared/components/Claim/ClaimImage';
import ClaimIndicators from 'shared/components/Claim/ClaimIndicators';
import ClaimSource from 'shared/components/Claim/ClaimSource';
import ClaimText from 'shared/components/Claim/ClaimText';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Claim } from 'shared/types/claim';
import ClaimMenu from './ClaimMenu';

interface Props {
  claim: Claim;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const ClaimItem = (props: Props) => {
  const { claim, style } = props;

  return(
      <View style={ [ styles.container, style ] }>
        <Fade duration={ 500 }>
          <View style={ styles.claimContainer }>
            <View style={ styles.textContainer }>
              <BaseText
                color={ Color.APP_BLACK }
                bold={ true }
              >
                Claim
              </BaseText>
              <ClaimText style={ { flex: 1 } } claim={ claim } />
              <ClaimSource claim={ claim } style={ { marginTop: Whitespace.SMALL, marginBottom: Whitespace.TINY } } />
              <View style={ styles.claimTextAndMenuContainer }>
                <ClaimIndicators claim={ claim } style={ { marginBottom: Whitespace.MEDIUM, flex: 1 } } />
                <ClaimMenu claim={ claim } />
              </View>
            </View>
          </View>
          <ClaimImage claim={ claim } />
        </Fade>
      </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'column' },
  claimContainer: {
    flexDirection: 'row',
    paddingRight: Whitespace.CONTAINER,
    paddingLeft: Whitespace.CONTAINER,
  },
  claimTextAndMenuContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
});

export default ClaimItem;
