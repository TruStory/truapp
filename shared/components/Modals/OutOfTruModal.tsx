import React, { useState } from 'react';
import { Dimensions, ImageBackground, View } from 'react-native';
import AppConfig from 'shared/app-config.json';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { out_of_tru } from 'shared/images/Modals/ModalsImages';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';

interface Props {
  onClose: () => void;
}

const OutOfTruModal = (props: Props) => {
  const { onClose } = props;

  const [requestSent, setRequestSent] = useState(false);
  const [status, setStatus] = useState('Request More');

  const onPress = async () => {
    try {
      await fetch(`${AppConfig.chain_url}${AppConfig.api.endpoint}/request_tru`, { method: 'POST' });
      setRequestSent(true);
      setStatus('Request Sent');
    } catch (err) {
      setRequestSent(true);
      setStatus('Request Failed');
    }
  };

  return (
    <ImageBackground source={ out_of_tru } style={ styles.modal }>
      <View style={ { flexDirection: 'row', alignItems: 'center' } }>
        <View style={ { flexDirection: 'row', flex: 1, justifyContent: 'center' } } />
        <BaseActionable onAction={ onClose } style={ { alignItems: 'flex-end' } }>
            <BaseIconView family={ 'Feather' } name={ 'x' } size={ IconSize.LARGE } />
        </BaseActionable>
      </View>
      <View style={ styles.mainContainer }>
        <BaseText textSize={ TextSize.H2 } bold={ true } style={ { marginBottom: Whitespace.SMALL } }>
          TRU All Spent!
        </BaseText>
        <BaseText textSize={ TextSize.H3 }>Looks like you don't have enough TRU</BaseText>
        <BaseText textSize={ TextSize.H3 }>to complete this action. Hit the button</BaseText>
        <BaseText textSize={ TextSize.H3 }>below to request more.</BaseText>
        <View style={ styles.buttonContainer  }>
          <BaseButton
            title={ status }
            color={ Color.WHITE }
            accentColor={ Color.APP_PURPLE }
            outline={ false }
            onAction={ onPress }
            disabled={ requestSent }
          />
        </View>
      </View>
    </ImageBackground>
  );
};

OutOfTruModal.defaultProps = {
  onClose: () => { },
};

const styles = {
  modal: {
    display: 'flex' as 'flex',
    justifyContent: 'space-between' as 'space-between',
    height: 1.45 * Dimensions.get('screen').width,
    width: Dimensions.get('screen').width,
    padding: Whitespace.LARGE + Whitespace.SMALL,
  },
  mainContainer: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
  },
  buttonContainer: {
    flexDirection: 'row' as 'row',
    marginTop: Whitespace.LARGE + Whitespace.SMALL,
    marginBottom: Whitespace.LARGE,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
  },
};

export default OutOfTruModal;
