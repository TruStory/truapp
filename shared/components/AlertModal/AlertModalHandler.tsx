import { AlertModalButton } from 'shared/components/AlertModal/AlertModal';

export type AlertModalType = {
  alert: (title: string, message: string, buttons?: AlertModalButton[]) => void,
  basic: (children: any ) => void;
  close: () => void;
};

export class AlertModalHandler {
  static modal: AlertModalType;

  static setModal(modal: AlertModalType) {
    this.modal = modal;
  }

  static alert(title: string, message: string, buttons?: AlertModalButton[]) {
    this.modal.alert(title, message, buttons);
  }

  static basic(children: any) {
    this.modal.basic(children);
  }

  static close() {
    this.modal.close();
  }
}
