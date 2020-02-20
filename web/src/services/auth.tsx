import AppConfig from 'shared/app-config.json';
import { Language } from 'shared/language';

export const authenticateService = (authenticator: EventListener, referrer: string) => {
  var authenticatorWrapper = function(event: any) {
    if (event.origin !== window.location.origin) return;
    authenticator(event);
    event.source.close();
  };

  var popup = window.open(
    `${ AppConfig.base_url }/auth-twitter?referrer=${ referrer }`, Language.SIGN_IN_TWITTER, 'height=500,width=400');
  if (popup === null || typeof (popup) === 'undefined') {
    alert(Language.POPUP_BLOCKED);
  } else {
    popup.focus();
    window.addEventListener('message', authenticatorWrapper, false);
  }
};
