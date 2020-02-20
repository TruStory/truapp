import { FeedFilter, FeedFilters } from 'shared/types/community';
import { best_black, best_purple, newest_black, newest_purple, trending_black, trending_purple } from '../images/Filters/FilterImages';

export const feedFilterNameMatchMap = new Map<FeedFilters, string>([
  [FeedFilters.TRENDING, 'Trending'],
  [FeedFilters.LATEST, 'Latest'],
  [FeedFilters.BEST, 'Best'],
]);

export const feedFilterMatchMap = new Map<string, FeedFilters>([
  ['trending', FeedFilters.TRENDING],
  ['latest', FeedFilters.LATEST],
  ['best', FeedFilters.BEST],
]);

export const feedFilterReverseMatchMap = new Map<FeedFilters, string>([
  [FeedFilters.TRENDING, 'trending'],
  [FeedFilters.LATEST, 'latest'],
  [FeedFilters.BEST, 'best'],
]);

export const feedFilterActiveImageMap = new Map<FeedFilters, any>([
  [FeedFilters.TRENDING, trending_purple],
  [FeedFilters.LATEST, newest_purple],
  [FeedFilters.BEST, best_purple],
]);

export const feedFilterInactiveImageMap = new Map<FeedFilters, any>([
  [FeedFilters.TRENDING, trending_black],
  [FeedFilters.LATEST, newest_black],
  [FeedFilters.BEST, best_black],
]);

export const feedFilters: FeedFilter[] = [
  { id: FeedFilters.TRENDING, name: feedFilterNameMatchMap.get(FeedFilters.TRENDING)! },
  { id: FeedFilters.LATEST, name: feedFilterNameMatchMap.get(FeedFilters.LATEST)! },
  { id: FeedFilters.BEST, name: feedFilterNameMatchMap.get(FeedFilters.BEST)! },
];
