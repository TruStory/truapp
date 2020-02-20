import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Fade from 'react-reveal/Fade';
import BaseText from 'shared/components/Base/BaseText';
import ClaimIndicators from 'shared/components/Claim/ClaimIndicators';
import ClaimSource from 'shared/components/Claim/ClaimSource';
import ClaimText from 'shared/components/Claim/ClaimText';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Claim } from 'shared/types/claim';
import ClaimMenu from 'web/src/components/Claim/ClaimMenu';
import ClaimVideo from './ClaimVideo';

interface Props {
  claim: Claim;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const VideoClaimItem = (props: Props) => {
  const { claim, style } = props;

  return(
      <View style={ [ styles.container, style ] }>
        <Fade duration={ 500 }>
          <ClaimVideo
            claim={ claim }
            style={ { marginBottom: Whitespace.LARGE, marginTop: -Whitespace.LARGE  } }
          />
          <View style={ styles.claimContainer }>
            <View style={ styles.textContainer }>
              <View
                style={ { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: Whitespace.SMALL } }
              >
                <BaseText
                  color={ Color.APP_BLACK }
                  bold={ true }
                >
                  Claim
                </BaseText>
                <ClaimMenu claim={ claim } style={ { position: 'absolute', right: 0 } } />
              </View>
              <ClaimText style={ { flex: 1, textAlign: 'center' } } claim={ claim } />
              <ClaimSource
                claim={ claim }
                style={ { marginTop: Whitespace.SMALL, marginBottom: Whitespace.TINY, justifyContent: 'center', display: 'flex' } }
              />
              <ClaimIndicators claim={ claim } style={ { display: 'flex', justifyContent: 'center' } } />
            </View>
          </View>
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

export default VideoClaimItem;
