import { mockCreator1, mockCreator3 } from 'shared/mock/appAccount';
import { mockArgument1, mockArgument12, mockArgument2 } from 'shared/mock/arguments';
import { mockCommunity1, mockCommunity2, mockCommunity3 } from 'shared/mock/communities';
import { AppAccountClaim, AppAccountClaimWithArguments, Claim, FeedClaim } from 'shared/types/claim';
import { Coins } from 'shared/types/currency';

export const mockFeedClaim1: FeedClaim = {
  id: 123,
  community: mockCommunity1,
  body: 'Crypto Hedge fund managers are no better at predicting the market than experienced retail traders.',
  creator: mockCreator1,
  source: 'https://google.com/best-claim-ever',
  totalBacked: {
    amount: '120000000000',
    denom: Coins.TRU,
    humanReadable: '120',
  },
  totalChallenged: {
    amount: '200000000000',
    denom: Coins.TRU,
    humanReadable: '200',
  },
  createdTime: 'Mon May 27 21:10:47 UTC 2019',
  topArgument: mockArgument1,
  argumentCount: 8,
  participantsCount: 2,
  participants: [ mockCreator1, mockCreator3 ],
  image: 'http://www.fairiegardens.net/wp-content/uploads/2019/05/cryptocurrency-market-value-drops-below-300-billion-1024x512.jpeg',
  video: '',
  commentCount: 0,
};

export const mockAppAccountClaim1: AppAccountClaim = {
  id: 123,
  community: mockCommunity1,
  body: 'Crypto Hedge fund managers are no better at predicting the market than experienced retail traders.',
  creator: mockCreator1,
  source: 'https://google.com/best-claim-ever',
  totalBacked: {
    amount: '120000000000',
    denom: Coins.TRU,
    humanReadable: '120',
  },
  totalChallenged: {
    amount: '200000000000',
    denom: Coins.TRU,
    humanReadable: '200',
  },
  createdTime: 'Mon May 27 21:10:47 UTC 2019',
  argumentCount: 8,
  participantsCount: 2,
  participants: [ mockCreator1, mockCreator3 ],
  image: 'http://www.fairiegardens.net/wp-content/uploads/2019/05/cryptocurrency-market-value-drops-below-300-billion-1024x512.jpeg',
  video: '',
  commentCount: 0,
};

export const mockAppAccountClaim2: AppAccountClaim = {
  id: 12356435,
  community: mockCommunity3,
  body: 'I wrote this great claim.',
  creator: mockCreator1,
  source: 'https://google.com/best-claim-ever-part-2',
  totalBacked: {
    amount: '190000000000',
    denom: Coins.TRU,
    humanReadable: '190',
  },
  totalChallenged: {
    amount: '400000000000',
    denom: Coins.TRU,
    humanReadable: '400',
  },
  createdTime: 'Mon May 29 21:10:47 UTC 2019',
  argumentCount: 5,
  participantsCount: 2,
  participants: [ mockCreator1, mockCreator3 ],
  image: 'http://www.fairiegardens.net/wp-content/uploads/2019/05/cryptocurrency-market-value-drops-below-300-billion-1024x512.jpeg',
  video: '',
  commentCount: 0,
};

export const mockClaim1: Claim = {
  id: 1234,
  community: mockCommunity1,
  body: 'Crypto Hedge fund managers are no better at predicting the market than experienced retail traders apparently.',
  creator: mockCreator1,
  source: 'https://google.com/best-claim-ever',
  totalBacked: {
    amount: '120000000000',
    denom: Coins.TRU,
    humanReadable: '120',
  },
  totalChallenged: {
    amount: '200000000000',
    denom: Coins.TRU,
    humanReadable: '200',
  },
  createdTime: 'Mon May 27 21:10:47 UTC 2019',
  topArgument: mockArgument1,
  argumentCount: 8,
  participants: [ mockCreator1, mockCreator3 ],
  arguments: [ mockArgument1, mockArgument12 ],
  participantsCount: 2,
  image: 'http://www.fairiegardens.net/wp-content/uploads/2019/05/cryptocurrency-market-value-drops-below-300-billion-1024x512.jpeg',
  video: '',
  commentCount: 0,
};

export const mockFeedClaim2: FeedClaim = {
  id: 12345,
  community: mockCommunity2,
  body: 'TruStory should allow individuals to trade/invest in Tru tokens on trusted exchanges in the future.',
  creator: mockCreator1,
  source: 'https://google.com/best-claim-ever',
  totalBacked: {
    amount: '120000000000',
    denom: Coins.TRU,
    humanReadable: '120',
  },
  totalChallenged: {
    amount: '200000000000',
    denom: Coins.TRU,
    humanReadable: '200',
  },
  createdTime: 'Mon May 27 21:10:47 UTC 2019',
  topArgument: mockArgument2,
  argumentCount: 8,
  participantsCount: 0,
  participants: [],
  image: 'https://techcrunch.com/wp-content/uploads/2018/05/screenshot-2018-05-23-13-47-21.png',
  video: '',
  commentCount: 0,
};

export const mockAppAccountClaims: AppAccountClaim[] = [
  mockAppAccountClaim1,
  mockAppAccountClaim2,
];

export const mockAppClaimAndCreatedArguments: AppAccountClaimWithArguments = {
  ...mockFeedClaim1,
  arguments: [
    mockArgument1,
    mockArgument12,
  ],
};

export const mockFeedClaims = [ mockFeedClaim1, mockFeedClaim2 ];
