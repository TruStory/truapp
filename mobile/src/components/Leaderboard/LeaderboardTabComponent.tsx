import * as React from 'react';
import { QueryResult } from 'react-apollo';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import ErrorComponent from 'shared/components/ErrorComponent';
import LeaderboardList from 'shared/components/Leaderboard/LeaderboardList';
import LEADERBOARD_QUERY from 'shared/graphql/queries/leaderboard.query';
import LeaderboardQuery, { LeaderboardQueryData } from 'shared/graphql/types/LeaderboardQuery';
import { LeaderboardDateFilters, LeaderboardMetricFilters } from 'shared/types/leaderboard';

interface Props {
  tabLabel: string;
  metricFilter: LeaderboardMetricFilters;
  dateFilter: LeaderboardDateFilters;
}

const LeaderboardTabComponent = (props: Props) => {
  const { metricFilter, dateFilter } = props;

  const renderTab = (result: QueryResult<LeaderboardQueryData, any>) => {
    const { loading, error, data, refetch } = result;

    if (loading) return <BaseLoadingIndicator />;
    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    const { leaderboard } = data;

    return (
      <LeaderboardList
        users={ leaderboard }
        metric={ metricFilter }
      />
    );
  };

  return (
    <LeaderboardQuery query={ LEADERBOARD_QUERY } variables= { { dateFilter: dateFilter, metricFilter: metricFilter } }>
      { renderTab }
    </LeaderboardQuery>
  );

};

export default LeaderboardTabComponent;
