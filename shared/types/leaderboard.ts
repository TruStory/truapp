import {  Creator } from 'shared/types/appAccount';
import { Coin } from 'shared/types/currency';

export enum LeaderboardDateFilters {
  LAST_WEEK = 0,
  LAST_MONTH = 1,
  LAST_YEAR = 2,
  ALL_TIME = 3,
}

export interface LeaderboardDateFilter {
  id: LeaderboardDateFilters;
  name: string;
}

export enum LeaderboardMetricFilters {
  TRU_EARNED=0,
  AGREES_RECEIVED=1,
  AGREES_GIVEN=2,
}

export interface LeaderboardMetricFilter {
  id: LeaderboardMetricFilters;
  name: string;
}

export interface TopUser {
  address: string;
  account: Creator;
  earned: Coin;
  agreesReceived: number;
  agreesGiven: number;
}
