import copy from 'copy-to-clipboard';
import React from 'react';
import { View } from 'react-native';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { truToast } from 'shared/components/Toast/TruToast';
import { argument_sharer } from 'shared/images/Share/ShareImages';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { shareToFacebook, shareToLinkedin, shareToReddit, shareToTwitter } from 'web/src/services/social-sharer';

interface Props {
  url: string;
  body: string;
  onClose: () => void;
}

const ArgumentSharerModal = (props: Props) => {
  const { onClose, url, body } = props;

  const twitter = () => {
    shareToTwitter(body, url);
  };

  const facebook = () => {
    shareToFacebook(body, url);
  };

  const linkedin = () => {
    shareToLinkedin(body, url);
  };

  const reddit = () => {
    shareToReddit(body, url);
  };

  const clipboard = () => {
    copy(url);
    truToast('Link Copied to Clipboard');
  };

  return (
    <View>
      <View style={ { flexDirection: 'row', alignItems: 'center', flex: 1, marginBottom: Whitespace.LARGE, paddingRight: Whitespace.LARGE } }>
        <View style={ { flexDirection: 'row', flex: 1, justifyContent: 'center' } } />
        <BaseActionable onAction={ onClose } style={ { alignItems: 'flex-end' } }>
            <BaseIconView family={ 'Feather' } name={ 'x' } />
        </BaseActionable>
      </View>
      <img src={ argument_sharer } alt='Share your argument' style={ { width: '100%' } } />
      <div style={ styles.mainContainer }>
        <BaseText textSize={ TextSize.H1 } bold={ true } style={ styles.heading }>Share Your Argument!</BaseText>
        <BaseText textSize={ TextSize.H3 }>Share your Argument with your friends and gain TRU if they Agree!</BaseText>
        <div style={ styles.socialContainer }>
          <BaseActionable onAction={ facebook } style={ styles.socialButton }>
            <BaseIconView
                name={ 'social-facebook' }
                family={ 'Line' }
                color={ Color.APP_BLACK }
                size={ IconSize.REGULAR }
            />
          </BaseActionable>
          <BaseActionable onAction={ linkedin } style={ styles.socialButton }>
            <BaseIconView
                name={ 'social-linkedin' }
                family={ 'Line' }
                color={ Color.APP_BLACK }
                size={ IconSize.REGULAR }
            />
          </BaseActionable>
          <BaseActionable onAction={ twitter } style={ styles.socialButton }>
            <BaseIconView
                name={ 'social-twitter' }
                family={ 'Line' }
                color={ Color.APP_BLACK }
                size={ IconSize.REGULAR }
            />
          </BaseActionable>
          <BaseActionable onAction={ reddit } style={ styles.socialButton }>
            <BaseIconView
                name={ 'social-reddit' }
                family={ 'Line' }
                color={ Color.APP_BLACK }
                size={ IconSize.REGULAR }
            />
          </BaseActionable>
          <BaseActionable onAction={ clipboard } style={ styles.socialButton }>
            <BaseIconView
                name={ 'link' }
                family={ 'Line' }
                color={ Color.APP_BLACK }
                size={ IconSize.REGULAR }
            />
          </BaseActionable>
        </div>
      </div>
    </View>
  );
};

const styles = {
  mainContainer: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    width: '70%',
    padding: `0 ${Whitespace.XLARGE}px ${Whitespace.XLARGE}px`,
  },
  socialContainer: {
    display: 'flex' as 'flex',
    marginTop: Whitespace.XLARGE,
    justifyContent: 'space-between',
  },
  heading: {
    marginTop: 0,
    marginBottom: Whitespace.MEDIUM,
  },
  socialButton: {
    width: '50px',
  },
};

export default ArgumentSharerModal;
