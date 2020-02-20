export type LoadingBlanketType = {
  show: () => void;
  hide: () => void;
};

export class LoadingBlanketHandler {
  static blanket: LoadingBlanketType;

  static setLoadingBlanket(loadingBlanket: LoadingBlanketType) {
    this.blanket = loadingBlanket;
  }

  static show() {
    this.blanket.show();
  }

  static hide() {
    this.blanket.hide();
  }
}
