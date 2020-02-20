import * as React from 'react';
import { QueryResult, withApollo, WithApolloClient } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import LeaderboardDateFilterComponent from 'shared/components/Leaderboard/LeaderboardDateFilterComponent';
import LeaderboardMetricFilterComponent from 'shared/components/Leaderboard/LeaderboardMetricFilterComponent';
import LEADERBOARD_QUERY from 'shared/graphql/queries/leaderboard.query';
import LeaderboardQuery, { LeaderboardQueryData } from 'shared/graphql/types/LeaderboardQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import { LeaderboardDateFilters, LeaderboardMetricFilters } from 'shared/types/leaderboard';
import LeaderboardList from '../components/Leaderboard/LeaderboardList';
import { generateDocumentTitle } from '../utils';

interface Props extends RouteComponentProps { }

const LeaderboardScreen = (props: WithApolloClient<Props>) => {

  const [ dateFilter, setDateFilter ] = React.useState(LeaderboardDateFilters.LAST_WEEK);
  const [ metricFilter, setMetricFilter ] = React.useState(LeaderboardMetricFilters.TRU_EARNED);

  generateDocumentTitle('Leaderboard');

  const setDateFilterValue = (filter: LeaderboardDateFilters) => setDateFilter(filter);
  const setMetricFilterValue = (filter: LeaderboardMetricFilters) => setMetricFilter(filter);

  const renderLeaderboard = (result: QueryResult<LeaderboardQueryData, any>) => {
    const { loading, data, refetch, error } = result;

    const headerJsx = (
      <div style={ { display: 'flex', flexWrap: 'wrap', marginBottom: Whitespace.LARGE } }>
        <div style={ { display: 'flex' } } >
          <div>
            <BaseText textSize={ TextSize.H3 } style={ {  marginRight: Whitespace.MEDIUM } }>Top 50 Leaderboard for </BaseText>
          </div>
          <div style={ { marginRight: Whitespace.MEDIUM } }>
            <LeaderboardDateFilterComponent
              onChange={ setDateFilterValue }
              value={ dateFilter }
            />
          </div>
        </div>
        <div style={ { display: 'flex' } } >
          <BaseText textSize={ TextSize.H3 } style={ { marginRight: Whitespace.MEDIUM } }>by</BaseText>
          <LeaderboardMetricFilterComponent
            onChange={ setMetricFilterValue }
            value={ metricFilter }
            style={ { marginRight: Whitespace.MEDIUM } }
          />
        </div>
      </div>
    );

    if (loading) return <BaseLoadingIndicator />;
    if (error) return <ErrorComponent onRefresh={ refetch } />;
    if (!data || !data.leaderboard || data.leaderboard.length === 0)
      return <ErrorComponent text={ 'There is no data available at this moment' } header={ 'No Information Found' }  onRefresh={ refetch } />;

    return (
      <div className={ 'leaderboard' } >
        { headerJsx }
        <div style={ { ...styles.container } }>
          <LeaderboardList sortedBy={ metricFilter } topUsers={ data.leaderboard } onMetricFilterSelected={ setMetricFilterValue } />
        </div>
      </div>
    );
  };
  return (
    <LeaderboardQuery query={ LEADERBOARD_QUERY } variables= { { dateFilter: dateFilter, metricFilter: metricFilter } }>
      { renderLeaderboard }
    </LeaderboardQuery>
  );
};

const styles = {
  container: {
    border: `1px solid ${Color.LINE_GRAY}`,
    borderRadius: Whitespace.TINY,
    boxSizing: 'border-box' as 'border-box',
  },
};

export default withRouter(withApollo(LeaderboardScreen));
