import { Coin } from 'shared/types/currency';
import { Time } from 'shared/types/date';

export enum ChartDateFilters {
  LAST_WEEK,
  LAST_MONTH,
  LAST_YEAR,
  ALL_TIME,
}

export interface ChartDateFilter {
  id: ChartDateFilters;
  name: string;
}

export interface EarningsDataPoint {
  date: Time;
  amount: number;
}

export interface EarningsData {
  netEarnings: Coin;
  dataPoints: EarningsDataPoint[];
}
