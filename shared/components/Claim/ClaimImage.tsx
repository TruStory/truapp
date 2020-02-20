import React from 'react';
import { Image, StyleProp, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import BaseText from 'shared/components/Base/BaseText';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { Claim } from 'shared/types/claim';
import { isLiveVideo, isVideo } from 'shared/utils/video';

export interface ClaimImageProps{
  claim: Claim;
  style?: StyleProp<any> & React.CSSProperties;
}

const ClaimImage = (props: ClaimImageProps) => {

  const { claim, style } = props;
  const [ loading, setLoading ] = React.useState(true);

  if (isVideo(claim)) {
    const getSourceLink = () => {
      if (isLiveVideo(claim)) {
        return { uri:  `${claim.video}?playsinline=1` };
      } else {
        return { html: `<video poster="${claim.image}" width="100%" height="100%" playsinline controls src="${ claim.video }" style="background-color: #000;"></video>` };
      }
    };

    const width = style.width ? style.width : '100%';
    const height = style.height ? style.height : 217;

    const renderVideoContent = () => {
      const videoJsx = (
        <WebView
          source={ getSourceLink() }
          style={ { width, height, opacity: loading ? 0 : 1 } }
          scalesPageToFit={ false }
          scrollEnabled={ false }
          allowsInlineMediaPlayback={ true }
          automaticallyAdjustContentInsets={ true }
          mediaPlaybackRequiresUserAction={ false }
          allowsLinkPreview={ true }
          onLoadEnd={ () => setLoading(false) }
        />
      );

      if (loading)
        return (
          <React.Fragment>
            <View style={ { display: loading ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', height, width } }>
              <BaseText color={ Color.WHITE }>Loading Video...</BaseText>
            </View>
            { videoJsx }
          </React.Fragment>
        );

      return videoJsx;
    };

    return (
      <View style={ { backgroundColor: Color.BLACK, height, width } }>
        { renderVideoContent() }
      </View>
    );
  }

  return (
    <Image source={ { uri: claim.image } } style={ [ styles.container, style ] } />
  );

};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 217,
    borderRadius: Whitespace.TINY,
  },
});

export default ClaimImage;
