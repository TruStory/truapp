import { Address } from 'shared/types/appAccount';
import { Coin } from 'shared/types/currency';

export interface Settings {
  // claim params
  minClaimLength: number;
  maxClaimLength: number;
  claimAdmins: Address[];

  // slashing params
  minSlashCount: number;
  slashMagnitude: number;
  slashMinStake: Coin;
  slashAdmins: Address[];
  curatorShare: number;
  maxDetailedReasonLength: number;

  // staking params
  period: number;
  argumentCreationStake: Coin;
  argumentBodyMinLength: number;
  argumentBodyMaxLength: number;
  argumentSummaryMinLength: number;
  argumentSummaryMaxLength: number;
  upvoteStake: Coin;
  creatorShare: number;
  interestRate: number;
  stakingAdmins: Address[];
  maxArgumentsPerClaim: number;
  argumentCreationReward: Coin;
  upvoteCreatorReward: Coin;
  upvoteStakerReward: Coin;

  // account params
  maxSlashCount: number;
  jailDuration: number;

  // general params
  minCommentLength: number;
  maxCommentLength: number;
  blockIntervalTime: number;
  stakeDisplayDenom: string;
}
