import { Action } from 'redux';
import Immutable, { ImmutableObject } from 'seamless-immutable';
import { Account } from 'shared/blockchain/account';
import { ActionType } from 'shared/redux/actions';
import { AuthAction } from 'shared/redux/actions/auth.action';

interface AuthData {
  loading: boolean;
  account: Account | undefined;
}

type State = ImmutableObject<AuthData>;

const initialState = Immutable({
  loading: true,
  account: undefined,
});

const auth = (state: State = initialState, incomingAction: Action) => {
  const action = incomingAction as AuthAction;
  switch (action.type) {
    case ActionType.REHYDRATE:
      return Immutable({ loading: false, account: action.account });
    case ActionType.AUTH_SET_CURRENT_ACCOUNT:
      return ({ loading: false, account: action.account });
    case ActionType.LOGOUT:
      return Immutable({ loading: false, account: undefined });
    default:
      return state;
  }
};

export default auth;
