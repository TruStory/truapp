import { CSSProperties } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type BaseModalType = {
  basic: (children: any , style?: StyleProp<ViewStyle> & CSSProperties, closeOnBlanketClick?: boolean) => void;
  close: () => void;
};

export class BaseModalHandler {
  static modal: BaseModalType;

  static setModal(modal: BaseModalType) {
    this.modal = modal;
  }

  static basic(children: any, style?: StyleProp<ViewStyle> & CSSProperties, closeOnBlanketClick?: boolean) {
    this.modal.basic(children, style, closeOnBlanketClick);
  }

  static close() {
    this.modal.close();
  }
}
