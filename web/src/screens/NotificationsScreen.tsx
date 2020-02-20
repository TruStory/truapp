import { NetworkStatus } from 'apollo-boost';
import * as React from 'react';
import { QueryResult, withApollo, WithApolloClient } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router';
import Chain from 'shared/blockchain';
import BaseButton from 'shared/components/Base/BaseButton';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import { truToast } from 'shared/components/Toast/TruToast';
import NOTIFICATIONS_QUERY from 'shared/graphql/queries/notifications.query';
import UNREAD_NOTIFICATIONS_COUNT_QUERY from 'shared/graphql/queries/unread-notifications-count.query';
import NotificationsQuery, { NotificationsQueryData } from 'shared/graphql/types/NotificationsQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { Whitespace } from 'shared/styles/views';
import NotificationsList from '../components/Notifications/NotificationsList';
import { generateDocumentTitle } from '../utils';

interface Props extends RouteComponentProps { }

const NotificationsScreen = (props: WithApolloClient<Props>) => {

  const { client } = props;

  generateDocumentTitle('My Notifications');

  const onMarkAllAsSeen = async () => {
    await Chain.markNotificationsSeen({
      notification_id: -1,
      seen: true,
    });
  };

  onMarkAllAsSeen();

  const renderScreen = (result: QueryResult<NotificationsQueryData, any>) => {
    const { loading, data, refetch, error, fetchMore, networkStatus } = result;

    const onMarkAllAction = async () => {
      try {
        await Chain.markNotificationsRead({
          notification_id: -1,
          read: true,
        });
        client.query({
          query: UNREAD_NOTIFICATIONS_COUNT_QUERY,
          fetchPolicy: 'network-only',
        });
        refetch();
      } catch (error) {
        truToast('Unable to mark all notifications as read!');
      } finally {
      }
    };

    const headerJsx = (
      <div style={ { display: 'flex' } }>
        <BaseText textSize={ TextSize.H2 } bold={ true } style={ { marginBottom: Whitespace.LARGE, flex: 1 } }>My Notifications</BaseText>
        <BaseButton
          onAction={ onMarkAllAction }
          title={ 'Mark All As Read' }
          accentColor={ Color.APP_PURPLE }
          color={ Color.APP_PURPLE  }
          outline={ true }
        />
      </div>
    );

    if (loading && networkStatus === NetworkStatus.fetchMore && data && data.notifications) {
      return (
        <React.Fragment>
          { headerJsx }
          <NotificationsList
            notificationsData={ data.notifications.edges.map((edge) => edge.node) }
            onLoadMore={ () => { } }
            hasMore={ data.notifications.pageInfo.hasNextPage }
          />
          <BaseLoadingIndicator />
        </React.Fragment>
      );
    }

    if (loading) return <BaseLoadingIndicator />;
    if (error) return <ErrorComponent onRefresh={ refetch } />;
    if (!data || !data.notifications || data.notifications.totalCount === 0)
      return <ErrorComponent text={ 'You have no notifications.' } header={ 'No Notifications Found' }  onRefresh={ refetch } />;

    const notificationsData = data.notifications.edges.map((edge) => edge.node);

    const onFetchMore = () => {
      if (networkStatus !== NetworkStatus.ready || data.notifications.pageInfo.hasNextPage === false) return;
      fetchMore({
        variables: { after: data.notifications.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.notifications) { return prev; }
          if (fetchMoreResult.notifications.pageInfo.endCursor === prev.notifications.pageInfo.endCursor) return prev;
          fetchMoreResult.notifications.edges =
            prev.notifications.edges.concat(fetchMoreResult.notifications.edges);
          return fetchMoreResult;
        },
      });
    };

    return (
      <div className={ 'notifications' }>
        { headerJsx }
        <NotificationsList
          notificationsData={ notificationsData }
          onLoadMore={ onFetchMore }
          hasMore={ data.notifications.pageInfo.hasNextPage }
        />
      </div>

    );
  };

  return (
    <NotificationsQuery query={ NOTIFICATIONS_QUERY } variables={ { first: 10 } } fetchPolicy={ 'network-only' }>
      { renderScreen }
    </NotificationsQuery>
  );

};

export default withRouter(withApollo(NotificationsScreen));
