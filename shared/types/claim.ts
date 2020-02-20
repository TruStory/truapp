import { ID } from 'shared/types';
import { Creator } from 'shared/types/appAccount';
import { Argument } from 'shared/types/argument';
import { Community } from 'shared/types/community';
import { Coin } from 'shared/types/currency';
import { Time } from 'shared/types/date';

export interface BaseClaim {
  id: ID;
  community: Community;
  body: string;
  creator: Creator;
  source?: string;
  image: string;
  video: string;
  totalBacked: Coin;
  totalChallenged: Coin;
  participantsCount: number;
  createdTime: Time;
  commentCount: number;
}

export interface FeedClaim extends BaseClaim {
  topArgument: Argument | null;
  argumentCount: number;
  participants: Creator[];
}

export interface AppAccountClaim extends BaseClaim {
  argumentCount: number;
  participants: Creator[];
}

export interface Claim extends FeedClaim {
  arguments: Argument[];
}

export interface AddClaimDraft {
  claim: string;
  source: string;
  communityId: string;
}

export interface StakeClaim {
  storyId: ID;
  // claimId: ID;
  argument: string;
  summary: string;
  vote: boolean;
}

export interface AppAccountClaimWithArguments extends AppAccountClaim {
  arguments: Argument[];
}
