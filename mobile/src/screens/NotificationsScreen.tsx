import { NetworkStatus } from 'apollo-boost';
import NotificationsList from 'mobile/src/components/Notifications/NotificationsList';
import React from 'react';
import { QueryResult, withApollo, WithApolloClient } from 'react-apollo';
import { SafeAreaView, View } from 'react-native';
import { NavigationEvents, NavigationScreenProp, NavigationScreenProps } from 'react-navigation';
import { withCollapsible } from 'react-navigation-collapsible';
import Chain from 'shared/blockchain';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseText from 'shared/components/Base/BaseText';
import ErrorComponent from 'shared/components/ErrorComponent';
import UnreadNotificationsIndicator, { NotificationIndicatorType } from 'shared/components/Notifications/UnreadNotificationsIndicator';
import { truToast } from 'shared/components/Toast/TruToast';
import NOTIFICATIONS_QUERY from 'shared/graphql/queries/notifications.query';
import UNREAD_NOTIFICATIONS_COUNT_QUERY from 'shared/graphql/queries/unread-notifications-count.query';
import UNSEEN_NOTIFICATIONS_COUNT_QUERY from 'shared/graphql/queries/unseen-notifications-count.query';
import NotificationsQuery, { NotificationsQueryData } from 'shared/graphql/types/NotificationsQuery';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { ReactCollapsibleProps } from 'shared/styles/props';
import { Whitespace } from 'shared/styles/views';

interface NavigationParams {
  refetch: () => void;
  notificationsTabClickCount: number;
  client: any;
}

interface Props extends NavigationScreenProps, WithApolloClient<any>{
  navigation: NavigationScreenProp<any, NavigationParams>;
  collapsible: ReactCollapsibleProps;
}

const NotificationsScreen = (props: Props) => {

  let refreshing = false;
  const { client, collapsible, navigation } = props;

  const notificationsTabClickCount = navigation.getParam('notificationsTabClickCount');

  const markAsSeen = async () => {
    await Chain.markNotificationsSeen({
      notification_id: -1,
      seen: true,
    });
    client.query({
      query: UNSEEN_NOTIFICATIONS_COUNT_QUERY,
      fetchPolicy: 'network-only',
    });
    client.query({
      query: UNREAD_NOTIFICATIONS_COUNT_QUERY,
      fetchPolicy: 'network-only',
    });
  };

  React.useEffect(() => {
    navigation.setParams({ client });
  }, []);

  const renderScreen = (result: QueryResult<NotificationsQueryData, any>) => {
    const { loading, error, data, refetch, fetchMore, networkStatus } = result;

    if (loading && (!data || !data.notifications)) return <BaseLoadingIndicator />;
    refreshing = networkStatus === NetworkStatus.refetch;

    if (error || !data) return <ErrorComponent onRefresh={ refetch } />;
    if (data.notifications.totalCount === 0) {
      return (
        <View style={ { paddingTop: 50, flex: 1, paddingLeft: Whitespace.SMALL, paddingRight: Whitespace.SMALL } }>
          <ErrorComponent header='No Notifications' text='You do not have any notifications yet!' onRefresh={ refetch } />
        </View>
      );
    } else if (navigation.isFocused()) {
      markAsSeen();
    }

    const onFetchMore = () => {
      if (networkStatus !== NetworkStatus.ready || data.notifications.pageInfo.hasNextPage === false) return;
      fetchMore({
        variables: { after: data.notifications.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.notifications) { return prev; }
          if (fetchMoreResult.notifications.pageInfo.endCursor === prev.notifications.pageInfo.endCursor) return prev;
          fetchMoreResult.notifications.edges = prev.notifications.edges.concat(fetchMoreResult.notifications.edges);
          return fetchMoreResult;
        },
      });
    };

    const onFocus = async () => {
      markAsSeen();
    };

    return (
      <React.Fragment>
        <NavigationEvents onWillFocus={ onFocus } />
        <NotificationsList
          notifications={ data.notifications.edges.map((edge) => edge.node) }
          refetch={ refetch }
          refreshing={ refreshing }
          onLoadMore={ onFetchMore }
          collapsible={ collapsible }
          notificationsTabClickCount={ notificationsTabClickCount }
        />
      </React.Fragment>
    );

  };

  const queryVariables = {
    first: 10,
  };

  return (
    <SafeAreaView style={ { flex: 1 } }>
      <NotificationsQuery query={ NOTIFICATIONS_QUERY } variables={ queryVariables } fetchPolicy={ 'network-only' }>
      { renderScreen }
      </NotificationsQuery>
    </SafeAreaView>
  );
};

NotificationsScreen.navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<any, any>}) => {
  const onMarkAllAction = async () => {
    try {
      await Chain.markNotificationsRead({
        notification_id: -1,
        read: true,
      });
      const client = navigation.getParam('client');
      client.query({
        query: NOTIFICATIONS_QUERY,
        fetchPolicy: 'network-only',
      });
      client.query({
        query: UNREAD_NOTIFICATIONS_COUNT_QUERY,
        fetchPolicy: 'network-only',
      });
    } catch (error) {
      truToast('Unable to mark all notifications as read!');
    } finally {
    }
  };
  return {
    title: '',
    headerRight: (
      <BaseActionable onAction={ onMarkAllAction } style={ { marginRight: Whitespace.SMALL, marginTop: Whitespace.CONTAINER } }>
        <BaseText textSize={ TextSize.H5 } color={ Color.APP_PURPLE }>Mark All Read</BaseText>
      </BaseActionable>
    ),
    headerLeft: (
      <View style={ { flexDirection: 'row' } }>
        <BaseText
          bold={ true }
          textSize={ TextSize.H1 }
          style={ { marginLeft: Whitespace.SMALL } }
        >
          Notifications
        </BaseText>
        <UnreadNotificationsIndicator
          type={ NotificationIndicatorType.TEXT }
          textSize={ TextSize.H1 }
          color={ Color.APP_BLACK }
          bold={ true }
        />
      </View>
    ),
  };
}
; export default withCollapsible(withApollo(NotificationsScreen), { iOSCollapsedColor:  Color.WHITE });
