import React from 'react';
import { View } from 'react-native';
import ClaimIndicators from 'shared/components/Claim/ClaimIndicators';
import ClaimSource from 'shared/components/Claim/ClaimSource';
import FeedClaimImage from 'shared/components/Claim/FeedClaimImage';
import FeedClaimText from 'shared/components/Claim/FeedClaimText';
import { Whitespace } from 'shared/styles/views';
import { AppAccountClaim, FeedClaim } from 'shared/types/claim';
import { isVideo } from 'shared/utils/video';

interface Props {
  children?: React.ReactNode;
  claim: FeedClaim | AppAccountClaim;
  style?: React.CSSProperties;
}

const FeedClaimItem = (props: Props) => {
  const { claim, style, children } = props;

  return(
    <div style={ { ...styles.container, ...style } }>
      <div style={ styles.claimAndImageContainer }>
        <FeedClaimImage claim={ claim } style={ styles.image } />
        <div style={ styles.textContainer }>
          <View style={ { paddingLeft: Whitespace.CONTAINER, paddingRight: Whitespace.CONTAINER } }>
            <FeedClaimText claim={ claim } style={ { marginTop: isVideo(claim) ? 6 : -1 } } />
            <ClaimSource claim={ claim } style={ { marginTop: 4 } } />
            <ClaimIndicators claim={ claim } />
          </View>
          { children ? children : null }
        </div>
      </div>
    </div>
  );

};

const styles = {
  container: { flexDirection: 'column' as 'column' },
  claimAndImageContainer: { display: 'flex', flexWrap: 'wrap' as 'wrap' },
  headerContainer: { display: 'flex', alignItems: 'flex-start' },
  appAccountContainer: { display: 'flex', flex: 1, alignItems: 'center' },
  textContainer: {
    flexDirection: 'column' as 'column',
    flex: 1,
    paddingTop: 2,
  },
  image: {
    width: 127,
    height: 127,
  },
};

export default FeedClaimItem;
