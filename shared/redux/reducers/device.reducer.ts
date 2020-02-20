import Immutable, { ImmutableObject } from 'seamless-immutable';
import { DevicePlatformType } from 'shared/blockchain/types';
import { ActionType } from 'shared/redux/actions';
import { DeviceAction } from 'shared/redux/actions/device.action';

interface DeviceInfo {
  token?: string;
  platform?: DevicePlatformType;
}

type State = ImmutableObject<DeviceInfo>;

const initialState = Immutable({
  token: undefined,
  platform: undefined,
});

const device = (state: State = initialState, action: DeviceAction) => {
  switch (action.type) {
    case ActionType.STORE_DEVICE_TOKEN:
      return {
        ...state,
        token: action.token,
        platform: action.platform,
      };
    default:
      return state;
  }
};

export default device;
