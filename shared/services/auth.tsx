import Cookies from 'js-cookie';
import { Store } from 'redux';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import { Account } from 'shared/blockchain/account';
import { CHAIN_ID } from 'shared/blockchain/parameters';
import { logout, setCurrentAccount } from 'shared/redux/actions/auth.action';
import { isWeb } from 'shared/styles/utils';
import Analytics from 'shared/utils/analytics';

export const loginUser = async (store: Store, force?: boolean) => {
  if (Chain.account && !force) return;

  try {
    const result = await Chain.fetchCurrentUser();
    const { userId, address, userProfile, userMeta, invitesLeft, accountNumber, sequence } = result;
    const account = new Account({
      id: userId,
      address,
      userProfile,
      userMeta,
      invitesLeft,
      sequence: sequence,
      chainId: CHAIN_ID,
      accountNumber: accountNumber,
    });

    if (isWeb()) {
      const signUp = Cookies.get('sign-up') === 'true';
      Analytics.register(result.address, result.userProfile.fullName, result.userProfile.username, result.group, signUp);
      Cookies.remove('sign-up', { path: '/' });
    }
    // update mixpanel properties on mobile
    if (!isWeb() && force) {
      Analytics.register(result.address, result.userProfile.fullName, result.userProfile.username, result.group, false);
    }

    Chain.account = account;
    store.dispatch(setCurrentAccount(account));
  } catch (err) {
    if (isWeb()) {
      Analytics.registerAnonymous();
    }
    console.log('Authentication Error', err);
    store.dispatch(logout());
  }
};

export const checkUsername = (search: string, callback: any) => {
  fetch(`${isWeb() ? '' : AppConfig.chain_url }${AppConfig.api.endpoint}/users/validate/username?username=${search}`, { headers: { 'Content-Type' : 'application/json' } })
  .then((resp: any) => resp.json())
  .then((data) => {
    if (data.data) {
      return data.data;
    }
    return null;
  })
  .then(callback)
  .catch(() => callback);
};

export const checkEmail = (search: string, callback: any) => {
  fetch(`${isWeb() ? '' : AppConfig.chain_url }${AppConfig.api.endpoint}/users/validate/email?email=${search}`, { headers: { 'Content-Type' : 'application/json' } })
  .then((resp: any) => resp.json())
  .then((data) => {
    if (data.data) {
      return data.data;
    } else {
      return;
    }
  })
  .then(callback)
  .catch(() => callback);
};
