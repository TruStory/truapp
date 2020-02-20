import React from 'react';
import { Image, StyleProp, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { BaseClaim } from 'shared/types/claim';
import { isLiveVideo } from 'shared/utils/video';

export interface FeedClaimImageProps{
  claim: BaseClaim;
  style?: StyleProp<any> & React.CSSProperties;
}

const FeedClaimImage = (props: FeedClaimImageProps) => {

  const { claim, style } = props;

  if (isLiveVideo(claim)) {
    return (
      <TouchableOpacity activeOpacity={ 1 }>
        <WebView

          source={ { uri:  `${claim.video}?playsinline=1` } }
          style={ { width: style.width ? style.width : '100%', height: style.height ? style.height : 250 } }
          scalesPageToFit={ false }
          scrollEnabled={ false }
          allowsInlineMediaPlayback={ true }
          automaticallyAdjustContentInsets={ false }
          mediaPlaybackRequiresUserAction={ false }
          allowsLinkPreview={ true }
        />
      </TouchableOpacity>
    );
  }

  return (
    <Image source={ { uri: claim.image } } style={ [ styles.container, style ] } />
  );

};

const styles = StyleSheet.create({
  container: {  },
});

export default FeedClaimImage;
