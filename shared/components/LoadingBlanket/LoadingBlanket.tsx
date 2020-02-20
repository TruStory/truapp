import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import { LoadingBlanketHandler } from 'shared/components/LoadingBlanket/LoadingBlanketHandler';
import { Color } from 'shared/styles/colors';
import { ZIndex } from 'shared/styles/views';

interface State {
  visible: boolean;
}

class Blanket extends React.Component<any, State> {
  state = {
    visible: false,
  };

  show = () => {
    this.setState({ visible: true });
  }

  hide = () => {
    this.setState({ visible: false });
  }

  render() {
    const { visible } = this.state;
    if (visible) {
      return (
        <View style={ styles.blanket }>
          <BaseLoadingIndicator message='' />
        </View>
      );
    }
    return null;
  }
}

const LoadingBlanket = () => {
  return (
    <Blanket
      ref={ (ref: any) => { LoadingBlanketHandler.setLoadingBlanket(ref); } }
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
    backgroundColor: Color.MODAL_BLANKET,
    zIndex: ZIndex.BLANKET,
  },
});

export default LoadingBlanket;
