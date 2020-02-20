import { emptyCoin, mockCoin1, mockCoin2, mockCoin3, mockCoin4, mockCoin5, mockCoin6, mockCoin7 } from 'shared/mock/coins';
import { mockCommunity1, mockCommunity2 } from 'shared/mock/communities';
import { AppAccount, AppAccountBalanceDetails, AppAccountProfileDetails, CommunityCoinDetails, Creator, UserProfile } from 'shared/types/appAccount';

export const mockUserProfile: UserProfile = {
  avatarURL: 'https://randomuser.me/api/portraits/men/36.jpg',
  username: 'loggedInUserAamir',
  fullName: 'Aamir Logged',
  bio: 'I am the prince',
};

export const mockUser: AppAccount = {
  id: 'cosmos123',
  sequence: 12345678,
  userProfile: {
    avatarURL: 'https://randomuser.me/api/portraits/women/44.jpg',
    username: 'randomGirl1',
    fullName: 'Random Girl',
    bio: 'I am random girl',
  },
  userJourney: [],
  earnedBalance: mockCoin2,
  availableBalance: mockCoin1,
  isJailed: false,
};

export const mockAppAccountCommunityCoinDetails: CommunityCoinDetails[] = [
    { id: 'cosmos123', totalEarned: mockCoin4, community: mockCommunity1, weeklyEarned: emptyCoin },
    { id: 'cosmos123', totalEarned: mockCoin5, community: mockCommunity2, weeklyEarned: mockCoin6 },
];

export const mockAppAccountDetails: AppAccountProfileDetails = {
  ...mockUser,
  earnedStake: [
    { coin: mockCoin3, community: mockCommunity1 },
    { coin: mockCoin4, community: mockCommunity2 },
  ],
  totalClaims: 14,
  totalAgrees: 24,
  totalArguments: 19,
};

export const mockAppAccountBalanceDetails: AppAccountBalanceDetails = {
  ...mockUser,
  pendingStake: [
    { coin: mockCoin5, community: mockCommunity1 },
    { coin: mockCoin6, community: mockCommunity2 },
  ],
  pendingBalance: mockCoin7,

};

export const mockCreator1: Creator = {
  id: 'cosmos123456',
  userProfile: {
    avatarURL: 'https://randomuser.me/api/portraits/men/23.jpg',
    username: 'creatorGuy1',
    fullName: 'Creator Guy',
    bio: 'I am random girl',
  },
};

export const mockCreator2: Creator = {
  id: 'cosmos1234567',
  userProfile: {
    avatarURL: 'https://randomuser.me/api/portraits/men/15.jpg',
    username: 'creatorGuy2',
    fullName: 'Creator Guy 2',
    bio: 'I am random girl',
  },
};

export const mockCreator3: Creator = {
  id: 'cosmos12345678',
  userProfile: {
    avatarURL: 'https://randomuser.me/api/portraits/men/20.jpg',
    username: 'creatorGuy3',
    fullName: 'Creator Guy 3',
    bio: 'I am random girl',
  },
};

export const mockCreator4: Creator = {
  id: 'cosmos12345690',
  userProfile: {
    avatarURL: 'https://randomuser.me/api/portraits/men/17.jpg',
    username: 'creatorGuy4',
    fullName: 'Creator Guy 4',
    bio: 'I am random girl',
  },
};

export const mockCreator5: Creator = {
  id: 'cosmos123456908',
  userProfile: {
    avatarURL: 'https://randomuser.me/api/portraits/men/23.jpg',
    username: 'creatorGuy1',
    fullName: 'Creator Guy',
    bio: 'I am random girl',
  },
};

export const mockCreator6: Creator = {
  id: 'cosmos123456123',
  userProfile: {
    avatarURL: 'https://randomuser.me/api/portraits/men/23.jpg',
    username: 'creatorGuy1',
    fullName: 'Creator Guy',
    bio: 'I am random girl',
  },
};
