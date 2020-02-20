import { ID } from '.';
import { Coin } from './currency';
import { Time } from './date';

export interface Transaction {
  id: ID;
  amount: Coin;
  reference: TransactionReference;
  createdTime: Time;
  transactionType: TransactionType;
}

export interface TransactionReference {
  referenceId: ID;
  type: ReferenceType;
  title: string;
  body: string;
}

export enum ReferenceType {
  Argument,
  Claim,
  AppAccount,
}

export enum TransactionType {
  TransactionRegistration,
	TransactionBacking,
	TransactionBackingReturned,
	TransactionChallenge,
	TransactionChallengeReturned,
	TransactionUpvote,
	TransactionUpvoteReturned,
	TransactionInterest,
  TransactionRewardPayout,
  TransactionCreateClaim,
  TransactionUnhelpfulReward,
  TransactionSlashed,
  TransactionBounty,
}
