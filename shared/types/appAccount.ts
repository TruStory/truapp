import { Coin } from 'shared/types/currency';
import { UserJourney } from 'shared/types/journey';
import { Community } from './community';

export type Address = string;

export interface AppAccount {
  id: Address;
  userProfile: UserProfile;
  userJourney: UserJourney[];
  sequence: number;
  earnedBalance: Coin;
  availableBalance: Coin;
  isJailed: boolean;
}
export interface AppAccountProfileDetails extends AppAccount {
  earnedStake: CommunityCoin[];
  totalClaims: number;
  totalArguments: number;
  totalAgrees: number;
  totalAgreesReceived: number;
}

export interface CommunityCoin {
  coin: Coin;
  community: Community;
}

export interface CommunityCoinDetails {
  id: string;
  totalEarned: Coin;
  weeklyEarned: Coin;
  community: Community;
}

export interface UserProfile {
  avatarURL: string;
  fullName: string;
  username: string;
  bio: string;
}

export interface UserMeta {
  onboardFollowCommunities?: boolean;
  onboardCarousel?: boolean;
  onboardContextual?: boolean;
  journey?: string[];
}

export interface Creator {
  id: Address;
  userProfile: UserProfile;
}

export interface AppAccountBalanceDetails extends AppAccount {
  pendingBalance: Coin;
  pendingStake: CommunityCoin[];
}
