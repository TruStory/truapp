import { ActionType } from 'shared/redux/actions';
import { Settings } from 'shared/types/settings';

export interface StoreCurrentSettingsAction {
  type: ActionType.STORE_CURRENT_SETTINGS;
  settings: Settings;
}

export function storeCurrentSettings(settings: Settings): StoreCurrentSettingsAction {
  return {
    type: ActionType.STORE_CURRENT_SETTINGS,
    settings: settings,
  };
}

export type SettingsAction = StoreCurrentSettingsAction;
