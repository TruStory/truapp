import { UserActionsType } from 'shared/redux/actions';
import { UserActions } from 'shared/redux/actions/user-actions.action';

export interface UserActionsSummary {
  onboarded: boolean;
}

interface UserActionsData {
  user_actions: UserActionsSummary;
}

const initialState: UserActionsData = {
  user_actions: {
    onboarded: false,
  },
};

type State = UserActionsData;

const user_actions = (state: State = initialState, action: UserActions) => {
  switch (action.type) {
    case UserActionsType.ONBOARDED:
      return { user_actions: { onboarded: true } };
    case UserActionsType.REMOVE_USER_ACTIONS:
      return { user_actions: { onboarded: false } };
    default:
      return state;
  }
};

export default user_actions;
