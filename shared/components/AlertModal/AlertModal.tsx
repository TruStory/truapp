import * as React from 'react';
import { Keyboard, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AlertModalHandler } from 'shared/components/AlertModal/AlertModalHandler';
import BaseCard from 'shared/components/Base/BaseCard';
import BaseText from 'shared/components/Base/BaseText';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { isWeb } from 'shared/styles/utils';
import { Whitespace, ZIndex } from 'shared/styles/views';
import BaseButton from '../Base/BaseButton';

export interface AlertModalButton {
  text: string;
  color?: Color;
  textSize?: TextSize;
  onPress?: () => void;
  bold?: boolean;
}

interface State {
  title: string;
  message: string;
  buttons: AlertModalButton[];
  visible: boolean;
  children: React.ReactNode | React.ReactNode[] | null;
}

class AlertModalComponent extends React.Component<any, State> {
  state = {
    title: '',
    message: '',
    buttons: [],
    visible: false,
    children: null,
  };

  alert = (title: string, message: string, buttons: AlertModalButton[] = [{ text: 'OK' }]) => {
    if (!isWeb())
      Keyboard.dismiss();

    this.setState({
      title,
      message,
      buttons,
      visible: true,
      children: null,
    });
  }

  basic = (children: React.ReactNode | React.ReactNode[]) => {
    this.setState({
      children,
      visible: true,
    });
  }

  close = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible, title, message, buttons, children } = this.state;

    const renderButtons = () => buttons.map((button: AlertModalButton) => {
      const { text, color, textSize, onPress, bold } = button;

      const onPressAction = () => {
        onPress && onPress();
        this.close();
      };
      return (
        <BaseButton
          onAction={ onPressAction }
          color={ color }
          accentColor={ Color.TRANSPARENT }
          key={ text }
          title={ text }
          textSize={ textSize ? textSize : TextSize.H4 }
          bold={ bold }
        />
      );
    });

    if (!visible) return null;

    const renderContent = () => {
      if (children !== null)
        return children;

      return (
        <React.Fragment>
          <BaseText textSize={ TextSize.H3 } bold={ true }>{ title }</BaseText>
          <BaseText textSize={ TextSize.H4 } style={ { marginTop: Whitespace.SMALL } } >{ message }</BaseText>
          <View style={ { flexDirection: 'row', marginTop: Whitespace.MEDIUM, justifyContent: 'center' } }>
            { renderButtons() }
          </View>
        </React.Fragment>
      );
    };

    const close = () => { this.close(); };
    return (
      <TouchableOpacity onPress={ close } style={ styles.blanket } activeOpacity={ 1 } className={ 'modal-blanket fade-in' }>
        <TouchableOpacity activeOpacity={ 1 }>
          <BaseCard style={ { flexDirection: 'column' } }>
            { renderContent() }
          </BaseCard>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const AlertModal = () => {
  return (
    <AlertModalComponent
      ref={ (ref: any) => { AlertModalHandler.setModal(ref); } }
    />
  );
};

const styles = StyleSheet.create({
  blanket: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingRight: '5%',
    paddingLeft: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.MODAL_BLANKET,
    zIndex: ZIndex.ALERT_MODAL,
  },
  buttonContainer : {
    flexDirection: 'row',
    borderColor: Color.DISABLED_BUTTON,
    borderTopWidth: 1,
    marginHorizontal: -Whitespace.LARGE,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: Whitespace.LARGE,
  },
});

export default AlertModal;
