import React from 'react';
import Iframe from 'react-iframe';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Color } from 'shared/styles/colors';
import { BaseClaim, Claim } from 'shared/types/claim';
import { isLiveVideo } from 'shared/utils/video';
import { ViewWidths } from '../../styles';

interface Props {
  claim: Claim | BaseClaim;
  height?: number;
  width?: string;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const ClaimVideo = (props: Props) => {
  const { claim, style } = props;
  const [ , setTick ] = React.useState(0);
  const userDimensions = props.width !== undefined && props.height !== undefined;
  const width = window.innerWidth;
  const height = Math.min(window.innerWidth * (9 / 16), Math.max(window.innerHeight - 300, 300) );
  const marginDiff = window.innerWidth - ViewWidths.SITE;
  const margin = marginDiff > 0 ? marginDiff / 2 : 15;

  React.useEffect(() => {
    const forceRerender = () => setTick(Math.random());
    window.addEventListener('resize', forceRerender);
    return () => {
      window.removeEventListener('resize', forceRerender);
    };
  }, []);

  let frameJsx = (
      <video
        src={ claim.video }
        width={  userDimensions ? props.width :  `${ width }px` }
        height={  userDimensions ? props.height :  `${ height }px` }
        controls={ true }
        poster={ claim.image ? claim.image : undefined }
        style={ { backgroundColor: Color.APP_BLACK } }
      />
  );

  if (isLiveVideo(claim)) {
    frameJsx = (
      <Iframe
        url={ claim.video }
        width={  userDimensions ? props.width : `${ width }px` }
        height={  `${userDimensions ? props.height : height }px` }
        display='inline'
        position='relative'
        allowFullScreen={ true }
      />
    );
  }

  if (userDimensions) return frameJsx;

  return (
    <View style={ [ styles.container, style ] }>
      <div style={ { marginRight: -margin, marginLeft: -margin } }>
        { frameJsx }
      </div>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
});

export default ClaimVideo;
