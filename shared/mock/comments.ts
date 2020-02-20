import { mockCreator1, mockCreator2, mockCreator3 } from 'shared/mock/appAccount';
import { Comment } from 'shared/types/comments';

export const mockComment1: Comment = {
  id: 1234,
// tslint:disable-next-line: max-line-length
  body: 'hi, first comment hi, first comment hi, first comment hi, first comment hi, first comment hi, first comment hi, first comment hi, first comment hi, first comment hi, first comment hi, first comment hi, first comment hi, first comment hi, first comment hi, first comment ',
  claimId: 123,
  creator: mockCreator1,
  createdAt: 'Mon May 27 21:10:47 UTC 2019',
  argumentId: 0,
  elementId: 0,
};

export const mockComment2: Comment = {
  id: 12345,
// tslint:disable-next-line: max-line-length
  body: 'wearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotestwearegoingtotest',
  claimId: 123,
  creator: mockCreator2,
  createdAt: 'Mon May 27 21:15:47 UTC 2019',
  argumentId: 0,
  elementId: 0,
};

export const mockComment3: Comment = {
  id: 123456,
  body: 'hi, third comment',
  claimId: 123,
  creator: mockCreator3,
  createdAt: 'Mon May 27 21:20:47 UTC 2019',
  argumentId: 0,
  elementId: 0,
};

export const mockComments1 = [ mockComment1, mockComment2, mockComment3 ];
