import { showMessage } from 'react-native-flash-message';

export const truToast = (message: string, description?: string, onPress?: () => void) => {
  showMessage({
    message,
    description,
    type: 'info' as 'info',
    onPress,
  });
};

export const truToastError = (message: string, description?: string, onPress?: () => void) => {
  showMessage({
    message,
    description,
    type: 'danger',
    onPress,
  });
};

export const truToastSuccess = (message: string, description?: string, onPress?: () => void) => {
  showMessage({
    message,
    description,
    type: 'success',
    onPress,
  });
};
