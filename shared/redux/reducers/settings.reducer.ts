import { Action } from 'redux';
import Immutable, { ImmutableObject } from 'seamless-immutable';
import { ActionType } from 'shared/redux/actions';
import { StoreCurrentSettingsAction } from 'shared/redux/actions/settings.action';
import { Coins } from 'shared/types/currency';
import { Settings } from 'shared/types/settings';
interface SettingsData {
  settings: Settings;
}

type State = ImmutableObject<SettingsData>;

const initialState = Immutable({
  settings: {
    minClaimLength: 25,
    maxClaimLength: 140,
    claimAdmins: [],

    minSlashCount: 5,
    slashMagnitude: 3,
    slashMinStake: {
      denom: Coins.TRU,
      amount: '25000000000',
      humanReadable: '25',
    },
    slashAdmins: [],
    curatorShare: 0.1,
    maxDetailedReasonLength: 140,

    period: 7,
    argumentCreationStake: {
      denom: Coins.TRU,
      amount: '50000000000',
      humanReadable: '50',
    },
    argumentBodyMinLength: 25,
    argumentBodyMaxLength: 1500,
    argumentSummaryMinLength: 25,
    argumentSummaryMaxLength: 140,

    upvoteStake: {
      denom: Coins.TRU,
      amount: '10000000000',
      humanReadable: '10',
    },
    creatorShare: 0.9,
    interestRate: 2,
    stakingAdmins: [],
    unjailUpvotes: 3,
    maxArgumentsPerClaim: 5,
    argumentCreationReward: {
      denom: Coins.TRU,
      amount: '1000000000',
      humanReadable: '1',
    },
    upvoteCreatorReward: {
      denom: Coins.TRU,
      amount: '100000000',
      humanReadable: '.1',
    },
    upvoteStakerReward: {
      denom: Coins.TRU,
      amount: '100000000',
      humanReadable: '.1',
    },

    maxSlashCount: 3,
    jailDuration: 7,

    minCommentLength: 5,
    maxCommentLength: 1000,
    blockIntervalTime: 5000,
    stakeDisplayDenom: 'TRU',

  },
});

const settings = (state: State = initialState, incomingAction: Action) => {
  const action = incomingAction as StoreCurrentSettingsAction;
  switch (action.type) {
    case ActionType.STORE_CURRENT_SETTINGS:
      return {
        settings: action.settings,
      };
    default:
      return state;
  }
};

export default settings;
