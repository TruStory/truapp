import { ID } from 'shared/types';
import { Creator } from 'shared/types/appAccount';
import { Time } from 'shared/types/date';

export interface Comment {
  id: ID;
  claimId: ID;
  communityId: string;
  argumentId: ID;
  elementId: ID;
  body: string;
  creator: Creator;
  createdAt: Time;
}
