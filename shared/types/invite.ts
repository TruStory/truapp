import { ID } from 'shared/types';
import { AppAccount, AppAccountProfileDetails } from 'shared/types/appAccount';
import { Time } from 'shared/types/date';

export interface Invite {
  id: ID;
  creator: AppAccount;
  friend: AppAccountProfileDetails;
  friendEmail: string;
  paid: boolean;
  createdAt: Time;
}
