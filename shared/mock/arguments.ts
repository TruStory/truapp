import { mockCreator1, mockCreator2, mockCreator3, mockCreator4, mockCreator5, mockCreator6 } from 'shared/mock/appAccount';
import { mockCoin2, mockCoin4 } from 'shared/mock/coins';
import { Argument } from 'shared/types/argument';

export const mockArgument1: Argument = {
  id: 123,
  claimId: 123,
  summary: 'This is a TLDR of my first argument on my first dummy claim',
// tslint:disable-next-line: max-line-length
  body: 'Welcome to my first argument guys! Welcome to my first argument guys! Welcome to my first argument guys! Welcome to my first argument guys! Welcome to my first argument guys! Welcome to my first argument guys! Welcome to my first argument guys! Welcome to my first argument guys!',
  vote: true,
  createdTime: 'Mon May 29 21:15:47 UTC 2019',
  creator: mockCreator1,
  upvotedStake: mockCoin4,
  upvotedCount: 4,
  isUnhelpful: true,
  appAccountStake: null,
  appAccountSlash: null,
  stakers: [mockCreator3, mockCreator4, mockCreator5, mockCreator6],
  downvotedCount: 0,
  edited: false,
  editedTime: 'Mon May 29 21:15:47 UTC 2019',
};

export const mockArgument12: Argument = {
  id: 12345,
  claimId: 123,
  summary: 'This is a TLDR of my second argument on my first dummy claim',
// tslint:disable-next-line: max-line-length
  body: 'Welcome to my first argument guys! **This one with markdown!** ',
  vote: true,
  createdTime: 'Mon May 29 23:15:47 UTC 2019',
  creator: mockCreator3,
  upvotedStake: mockCoin4,
  upvotedCount: 4,
  isUnhelpful: false,
  appAccountStake: null,
  appAccountSlash: null,
  stakers: [mockCreator3, mockCreator4, mockCreator5, mockCreator6],
  downvotedCount: 0,
  edited: false,
  editedTime: 'Mon May 29 21:15:47 UTC 2019',
};

export const mockArgument2: Argument = {
  id: 123456,
  claimId: 1234,
  summary: 'This is a TLDR of my first argument on my second dummy claim',
// tslint:disable-next-line: max-line-length
  body: 'Welcome to my first argument guys! Welcome to my first argument guys! Welcome to my first argument guys! Welcome to my first argument guys! Welcome to my first argument guys!',
  vote: false,
  createdTime: 'Mon May 28 18:15:47 UTC 2019',
  creator: mockCreator2,
  upvotedStake: mockCoin2,
  upvotedCount: 7,
  isUnhelpful: false,
  appAccountStake: null,
  appAccountSlash: null,
  stakers: [mockCreator3, mockCreator4, mockCreator6],
  downvotedCount: 0,
  edited: false,
  editedTime: 'Mon May 29 21:15:47 UTC 2019',
};

export const mockArgument22: Argument = {
  id: 12345678,
  claimId: 12345,
  summary: 'This is a TLDR of my second argument on my second dummy claim',
// tslint:disable-next-line: max-line-length
  body: 'Welcome to my second argument guys! Welcome to my second argument guys! Welcome to my second argument guys! Welcome to my first argument guys! Welcome to my first argument guys!',
  vote: false,
  createdTime: 'Mon May 28 21:15:47 UTC 2019',
  creator: mockCreator4,
  upvotedStake: mockCoin2,
  upvotedCount: 7,
  isUnhelpful: false,
  appAccountStake: null,
  appAccountSlash: null,
  stakers: [mockCreator3, mockCreator4, mockCreator6],
  downvotedCount: 0,
  edited: false,
  editedTime: 'Mon May 29 21:15:47 UTC 2019',
};

export const mockArguments1 = [mockArgument1, mockArgument12];
export const mockArguments2 = [mockArgument2, mockArgument22];
