import React, { useState } from 'react';
import { ImageBackground, View } from 'react-native';
import AppConfig from 'shared/app-config.json';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import { out_of_tru_web } from 'shared/images/Modals/ModalsImages';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';

interface Props {
  onClose: () => void;
}

const OutOfTruModal = (props: Props) => {
  const { onClose } = props;

  const [status, setStatus] = useState('');

  const onPress = async () => {
    try {
      await fetch(`${AppConfig.chain_url}${AppConfig.api.endpoint}/request_tru`, { method: 'POST' });
      setStatus('Request Sent');
    } catch (err) {
      setStatus('Oops. Request Failed.');
    }
  };

  return (
    <ImageBackground source={ out_of_tru_web } style={ styles.modal }>
      <View style={ { flexDirection: 'row', alignItems: 'center' } }>
        <View style={ { flexDirection: 'row', flex: 1, justifyContent: 'center' } } />
        <BaseActionable onAction={ onClose } style={ { alignItems: 'flex-end' } }>
            <BaseIconView family={ 'Feather' } name={ 'x' } size={ IconSize.LARGE } />
        </BaseActionable>
      </View>
      <View style={ styles.mainContainer }>
        <BaseText textSize={ TextSize.H1 } bold={ true } style={ { lineHeight: '40px' } }>TRU</BaseText>
        <BaseText textSize={ TextSize.H1 } bold={ true } style={ { marginBottom: Whitespace.SMALL, lineHeight: '40px' } }>
          All Spent!
        </BaseText>
        <BaseText textSize={ TextSize.H3 }>You've hit your minimum TRU balance.</BaseText>
        <BaseText textSize={ TextSize.H3 }>Click below to request more!</BaseText>
        <View style={ styles.buttonContainer  }>
          <BaseButton
            title='Request'
            width={ 110 }
            color={ Color.WHITE }
            accentColor={ Color.APP_PURPLE }
            outline={ false }
            onAction={ onPress }
            disabled={ status !== '' }
          />
          <BaseText color={ Color.APP_PURPLE } textSize={ TextSize.H5 }>{ status }</BaseText>
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
    height: 515,
    width: 400,
    margin: -Whitespace.LARGE,
    padding: Whitespace.LARGE + Whitespace.SMALL,
  },
  mainContainer: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
  },
  buttonContainer: {
    flexDirection: 'row' as 'row',
    marginTop: Whitespace.LARGE + Whitespace.SMALL,
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
  },
};

export default OutOfTruModal;
