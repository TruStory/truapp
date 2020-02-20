import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Whitespace } from 'shared/styles/views';
import { ID } from 'shared/types';
import { Claim } from 'shared/types/claim';
import VideoCommentsComponent from '../Comments/VideoCommentsComponent';
import LiveClaimVideo from './LiveClaimVideo';

interface Props {
  claim: Claim;
  selectedCommentId?: ID;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const LiveVideoClaimItem = (props: Props) => {
  const { claim, style, selectedCommentId } = props;

  return(
      <View style={ [ styles.container, style ] }>
        <LiveClaimVideo
          claim={ claim }
          style={ { marginBottom: Whitespace.LARGE, marginTop: -Whitespace.LARGE  } }
        />
        <VideoCommentsComponent
          claimId={ claim.id }
          selectedCommentId={ selectedCommentId }
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', position: 'relative' },
});

export default LiveVideoClaimItem;
