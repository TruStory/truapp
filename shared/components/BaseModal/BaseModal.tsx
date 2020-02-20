import * as React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import BaseCard, { CardHeight } from 'shared/components/Base/BaseCard';
import { BaseModalHandler } from 'shared/components/BaseModal/BaseModalHandler';
import { Color } from 'shared/styles/colors';
import { isWeb } from 'shared/styles/utils';
import { Whitespace, ZIndex } from 'shared/styles/views';

interface State {
  visible: boolean;
  children: React.ReactNode | React.ReactNode[] | null;
  style: StyleProp<ViewStyle> & React.CSSProperties;
  closeOnBlanketClick: boolean;
}

class BaseModalComponent extends React.Component<any, State> {
  state = {
    visible: false,
    children: null,
    style: { },
    closeOnBlanketClick: false,
  };

  basic = (children: React.ReactNode | React.ReactNode[], style: StyleProp<ViewStyle> & React.CSSProperties, closeOnBlanketClick?: boolean) => {
    this.setState({
      children,
      visible: true,
      style,
      closeOnBlanketClick: (closeOnBlanketClick === true ? true : false),
    });
  }

  close = () => {
    this.setState({
      visible: false,
      style: { },
      closeOnBlanketClick: false,
    });
  }

  onBlanketClick = () => {
    const { closeOnBlanketClick } = this.state;
    if (closeOnBlanketClick) {
      this.close();
    }
  }

  stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  render() {
    const { visible, children, style } = this.state;
    if (!visible) return null;

    return (
      <View
        style={ styles.blanket }
        className={ 'modal-blanket fade-in' }
        onClick={ this.onBlanketClick }
      >
        <BaseCard
          style={ { flexDirection: 'column', position: 'absolute', top: 100, margin: isWeb() ? '0px auto' : 0, marginBottom: Whitespace.LARGE * 2, ...style } } height={ CardHeight.FITCONTENT }
        >
          <div onClick={ this.stopPropagation }>
            { children }
          </div>
        </BaseCard>
      </View>
    );
  }
}

const BaseModal = () => {
  return (
    <BaseModalComponent
      ref={ (ref: any) => { BaseModalHandler.setModal(ref); } }
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
    zIndex: ZIndex.BASE_MODAL,
    overflow: 'scroll',
    display: 'flex',
    // overscrollBehavior: 'contain',
  },
});

export default BaseModal;
