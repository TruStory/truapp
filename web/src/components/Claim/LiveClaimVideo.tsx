import copy from 'copy-to-clipboard';
import React from 'react';
import Iframe from 'react-iframe';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import AppConfig from 'shared/app-config.json';
import BaseLine from 'shared/components/Base/BaseLine';
import BaseText from 'shared/components/Base/BaseText';
import ClaimText from 'shared/components/Claim/ClaimText';
import { truToast } from 'shared/components/Toast/TruToast';
import { Color } from 'shared/styles/colors';
import { isLargerThanTablet } from 'shared/styles/utils';
import { Whitespace } from 'shared/styles/views';
import { BaseClaim, Claim } from 'shared/types/claim';
import { isLiveVideo } from 'shared/utils/video';
import { Routes } from '../../navigation/Routes';
import { ViewWidths } from '../../styles';
import BaseButton from '../Base/BaseButton';
import QuestionsComponent from '../Questions/QuestionsComponent';
import ClaimSource from './ClaimSource';

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
  const width = isLargerThanTablet() ? window.innerWidth - 475 : window.innerWidth;
  const height = Math.min(width * (9 / 16), Math.max(window.innerHeight - 300, 300) );
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
      style={ { backgroundColor: Color.APP_BLACK } }
    />
  );

  if (isLiveVideo(claim)) {
    frameJsx = (
      <Iframe
        url={ claim.video }
        width={  userDimensions ? props.width : `${ width }px` }
        height={  `${userDimensions ? props.height : height }px` }
        display={ 'inline' }
        position={ 'relative' }
        allowFullScreen={ true }
      />
    );
  }

  if (userDimensions) return frameJsx;

  const onCopyLink = () => {
    copy(`${AppConfig.base_url}${Routes.CLAIM}${claim.id}`);
    truToast('Link Copied to Clipboard');
  };

  return (
    <View style={ [ styles.container, style ] }>
      <div style={ { marginRight: -margin, marginLeft: -margin, padding: isLargerThanTablet() ? Whitespace.LARGE : 0 } }>
        { frameJsx }
        <div
          style={ { width: userDimensions ? props.width :  `${ width }px`, paddingTop: Whitespace.SMALL } }
        >
          <View style={ styles.indentedContainer }>
            <View style={ styles.indentedContainer }>
              <BaseText color={ Color.APP_BLACK } bold={ true }>Claim</BaseText>
              <ClaimText style={ { flex: 1, textAlign: 'left' } } claim={ claim } />
              <View style={ { flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center', marginTop: Whitespace.SMALL } }>
                <ClaimSource claim={ claim } />
                <BaseButton
                  title={ 'Share Debate' }
                  onAction={ onCopyLink }
                  accentColor={ Color.APP_PURPLE }
                  color={ Color.APP_PURPLE }
                  outline={ true }
                  width={ 120 }
                />
              </View>
            </View>
            <BaseLine style={ { marginTop: Whitespace.LARGE } } />
            <QuestionsComponent
              claimId={ claim.id }
              style={ { marginTop: Whitespace.LARGE } }
            />
          </View>
        </div>
      </div>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
  indentedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingRight: Whitespace.CONTAINER,
    paddingLeft: Whitespace.CONTAINER,
  },

});

export default ClaimVideo;
