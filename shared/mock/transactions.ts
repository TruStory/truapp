import { mockCoin1 } from 'shared/mock/coins';
import { ReferenceType, Transaction, TransactionReference, TransactionType } from 'shared/types/transactions';

export const transactionReference: TransactionReference = {
  referenceId: 1,
  type: ReferenceType.Argument,
  title: 'Reward: Agreed with jonathan1432',
  body: 'Argument that I agreed with goes here',
};

export const transaction1: Transaction = {
  id: 123,
  amount: mockCoin1,
  reference: transactionReference,
  createdTime: 'Mon May 27 21:10:47 UTC 2019',
  transactionType: TransactionType.TransactionInterest,
};

export const transactionReference2: TransactionReference = {
  referenceId: 2,
  type: ReferenceType.Argument,
  body: 'Argument that I wrote with goes here',
  title: 'Penalty: Downvote received on an argument you wrote',
};

export const transaction2: Transaction = {
  id: 12345,
  amount: mockCoin1,
  reference: transactionReference2,
  createdTime: 'Mon May 27 18:10:47 UTC 2019',
  transactionType: TransactionType.TransactionSlashed,
};

export const mockTransactions = [ transaction1, transaction2 ];
