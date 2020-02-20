import { ChartDateFilter, ChartDateFilters } from 'shared/types/wallet';

export const chartDateFilterReverseMatchMap = new Map<ChartDateFilters, string>([
  [ChartDateFilters.LAST_WEEK, '1 Week'],
  [ChartDateFilters.LAST_MONTH, '1 Month'],
  [ChartDateFilters.LAST_YEAR, '1 Year'],
  [ChartDateFilters.ALL_TIME, 'All Time'],
]);

export const chartDateFilters: ChartDateFilter[] = [
  { id: ChartDateFilters.LAST_WEEK, name: chartDateFilterReverseMatchMap.get(ChartDateFilters.LAST_WEEK)! },
  { id: ChartDateFilters.LAST_MONTH, name: chartDateFilterReverseMatchMap.get(ChartDateFilters.LAST_MONTH)! },
  { id: ChartDateFilters.LAST_YEAR, name: chartDateFilterReverseMatchMap.get(ChartDateFilters.LAST_YEAR)! },
  { id: ChartDateFilters.ALL_TIME, name: chartDateFilterReverseMatchMap.get(ChartDateFilters.ALL_TIME)! },
];
