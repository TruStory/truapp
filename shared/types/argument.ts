import { ID } from 'shared/types';
import { Creator } from 'shared/types/appAccount';
import { Coin } from 'shared/types/currency';
import { Time } from 'shared/types/date';
import { Slash } from 'shared/types/slash';
import { Stake } from 'shared/types/stake';

export interface Argument {
  id: ID;
  claimId: ID;
  communityId: string;
  vote: boolean;
  summary: string;
  body: string;
  createdTime: Time;
  editedTime: Time;
  edited: boolean;
  creator: Creator;
  upvotedStake: Coin;
  upvotedCount: number;
  downvotedCount: number;
  isUnhelpful: boolean;
  appAccountStake: Stake | null;
  appAccountSlash: Slash | null;
  stakers: Creator[]; // will only return 3 max per UI
}

export enum AppAccountArgumentsFilter {
  ALL,
  CREATED,
  AGREED,
}

export enum ArgumentSorts {
  TRENDING=0,
  LATEST=1,
  BEST=2,
}

export interface ArgumentSort {
  id: ArgumentSorts;
  name: string;
}
