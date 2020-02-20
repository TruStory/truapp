import { Account } from 'shared/blockchain/account';
import { ActionType } from 'shared/redux/actions';

export interface Rehydrate {
  type: ActionType.REHYDRATE;
  account?: Account;
}

export interface AuthSetCurrentAccount {
  type: ActionType.AUTH_SET_CURRENT_ACCOUNT;
  account: Account;
}

export interface Logout {
  type: ActionType.LOGOUT;
}

export function setCurrentAccount(account: Account): AuthSetCurrentAccount {
  return {
    type: ActionType.AUTH_SET_CURRENT_ACCOUNT,
    account: account,
  };
}

export function logout(): Logout {
  return {
    type: ActionType.LOGOUT,
  };
}

export type AuthAction = Logout | Rehydrate | AuthSetCurrentAccount;
