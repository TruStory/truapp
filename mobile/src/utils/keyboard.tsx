import { Header } from 'react-navigation';
import { isIphoneX } from 'shared/styles/utils';

export const calculateKeyboardOffset = () => {
  if (isIphoneX()) {
    return Header.HEIGHT + 24;
  }

  return Header.HEIGHT;
};

export const calculateNoHeaderKeyboardOffset = () => {
  if (isIphoneX()) {
    return -24;
  }

  return 0;
};
