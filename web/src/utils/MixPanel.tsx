declare global {
  interface Window {
    mixpanel: any;
  }
}

class MixPanelClass {
  sharedInstanceWithToken(token: string): void {
    window.mixpanel.init(token);
  }
  createAlias(id: string): void {
    window.mixpanel.alias(id);
  }
  identify(id: string): void {
    window.mixpanel.identify(id);
  }
  set(property: object) {
    window.mixpanel.people.set(property);
  }
  setOnce(property: object) {
    window.mixpanel.people.set_once(property);
  }
  registerSuperProperties(property: object) {
    window.mixpanel.register(property);
  }
  reset() {
    window.mixpanel.reset();
  }
  trackWithProperties(event: string, property: object): void {
    window.mixpanel.track(event, property);
  }
  track(event: string) {
    window.mixpanel.track(event, { });
  }
}

// tslint:disable: max-classes-per-file
class MixpanelMock {
  sharedInstanceWithToken(token: string): void { }
  createAlias(id: string): void { }
  identify(id: string): void { }
  set(property: object) { }
  setOnce(property: object) { }
  registerSuperProperties(property: object) { }
  reset() { }
  trackWithProperties(event: string, property: object): void { }
  track(event: string) { }
}

const MixPanel = window.mixpanel ? new MixPanelClass() : new MixpanelMock();

export default MixPanel;
