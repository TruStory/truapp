import { ActionType } from 'shared/redux/actions';

export interface StoreDeviceTokenAction {
  type : ActionType.STORE_DEVICE_TOKEN;
  token : string;
  platform : string;
}

export function storeDeviceToken(token: string, platform: string): StoreDeviceTokenAction {
  return {
    type: ActionType.STORE_DEVICE_TOKEN,
    token,
    platform,
  };
}

export type DeviceAction = StoreDeviceTokenAction;
