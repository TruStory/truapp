import { ID } from 'shared/types';
import { Creator } from 'shared/types/appAccount';
import { Coin } from 'shared/types/currency';
import { Time } from 'shared/types/date';

export enum StakeType {
  Backing = 0,
  Challenge = 1,
  Upvote = 2,
}

export interface Stake {
  id: ID;
  stake: Coin;
  creator: Creator;
  createdTime: Time;
  endTime: Time;
}
