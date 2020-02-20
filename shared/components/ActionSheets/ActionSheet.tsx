import * as React from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { ZIndex } from 'shared/styles/views';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onShow?: () => void;
  swipeToClose?: boolean;
  children: JSX.Element[] | JSX.Element;
}

const ActionSheet = (props: Props) => {

  const { visible, children, onCancel, onShow, swipeToClose } = props;

  return (
    <Modal
      isVisible={ visible }
      onShow={ onShow }
      backdropColor={ 'black' }
      backdropOpacity={ 0.4 }
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationInTiming={ 500 }
      scrollHorizontal={ false }
      style={ styles.bottomModal }
      animationOutTiming={ 500 }
      onBackdropPress={ onCancel }
      onBackButtonPress={ onCancel }
      backdropTransitionInTiming={ 1000 }
      backdropTransitionOutTiming={ 1000 }
      swipeDirection={ swipeToClose ? 'down' : undefined }
      onSwipeComplete={ onCancel }
    >
      { children }
    </Modal>
  );
};

ActionSheet.defaultProps = {
  swipeToClose: true,
};

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
    zIndex: ZIndex.ACTION_SHEET,
  },
});

export default ActionSheet;
