import { ID } from 'shared/types';
import { Creator } from 'shared/types/appAccount';
import { Time } from 'shared/types/date';

export interface Question {
  id: ID;
  claimId: ID;
  body: string;
  creator: Creator;
  createdAt: Time;
}
