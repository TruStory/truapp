import { UserActionsType } from 'shared/redux/actions';

export interface UserOnboarded {
  type: UserActionsType.ONBOARDED;
}

export interface RemoveUserActions {
  type: UserActionsType.REMOVE_USER_ACTIONS;
}

export function userOnboarded(): UserOnboarded {
  return {
    type: UserActionsType.ONBOARDED,
  };
}

export function removeUserActions(): RemoveUserActions {
  return {
    type: UserActionsType.REMOVE_USER_ACTIONS,
  };
}

export type UserActions = UserOnboarded | RemoveUserActions;
