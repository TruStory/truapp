import { LeaderboardDateFilter, LeaderboardDateFilters, LeaderboardMetricFilter, LeaderboardMetricFilters } from 'shared/types/leaderboard';

export const leaderboardDateFilterReverseMatchMap = new Map<LeaderboardDateFilters, string>([
  [LeaderboardDateFilters.LAST_WEEK, 'Last 7 Days'],
  [LeaderboardDateFilters.LAST_MONTH, 'Last 30 Days'],
  [LeaderboardDateFilters.LAST_YEAR, 'Last Year'],
  [LeaderboardDateFilters.ALL_TIME, 'All Time'],
]);

export const leaderboardDateFilters: LeaderboardDateFilter[] = [
  { id: LeaderboardDateFilters.LAST_WEEK, name: leaderboardDateFilterReverseMatchMap.get(LeaderboardDateFilters.LAST_WEEK)! },
  { id: LeaderboardDateFilters.LAST_MONTH, name: leaderboardDateFilterReverseMatchMap.get(LeaderboardDateFilters.LAST_MONTH)! },
  { id: LeaderboardDateFilters.LAST_YEAR, name: leaderboardDateFilterReverseMatchMap.get(LeaderboardDateFilters.LAST_YEAR)! },
  { id: LeaderboardDateFilters.ALL_TIME, name: leaderboardDateFilterReverseMatchMap.get(LeaderboardDateFilters.ALL_TIME)! },
];

export const leaderboardMetricFilterReverseMatchMap = new Map<LeaderboardMetricFilters, string>([
  [LeaderboardMetricFilters.TRU_EARNED, 'TRU Earned'],
  [LeaderboardMetricFilters.AGREES_RECEIVED, 'Agrees Received'],
  [LeaderboardMetricFilters.AGREES_GIVEN, 'Agrees Given'],
]);

export const leaderboardMetricFilters: LeaderboardMetricFilter[] = [
  { id: LeaderboardMetricFilters.TRU_EARNED, name: leaderboardMetricFilterReverseMatchMap.get(LeaderboardMetricFilters.TRU_EARNED)! },
  { id: LeaderboardMetricFilters.AGREES_RECEIVED, name: leaderboardMetricFilterReverseMatchMap.get(LeaderboardMetricFilters.AGREES_RECEIVED)! },
  { id: LeaderboardMetricFilters.AGREES_GIVEN, name: leaderboardMetricFilterReverseMatchMap.get(LeaderboardMetricFilters.AGREES_GIVEN)! },
];
