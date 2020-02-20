import { Query } from 'react-apollo';
import { TopUser } from 'shared/types/leaderboard';

export interface LeaderboardQueryData {
  leaderboard: TopUser[];
}

interface Variables {
  dateFilter: number;
  metricFilter: number;
}

export default class LeaderboardQuery extends Query<LeaderboardQueryData, Variables> { }
