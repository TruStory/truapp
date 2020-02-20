import AnimatedFlatList from 'mobile/src/components/AnimatedFlatList';
import NotificationItem from 'mobile/src/components/Notifications/NotificationItem';
import { routeNotification } from 'mobile/src/utils/notifications';
import React from 'react';
import { ListRenderItemInfo, Platform } from 'react-native';
import { NavigationScreenProps, withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import BaseLine from 'shared/components/Base/BaseLine';
import { PaginatedListProps, ReactCollapsibleProps } from 'shared/styles/props';
import { Whitespace } from 'shared/styles/views';
import { NotificationData } from 'shared/types/notifications';
import { Settings } from 'shared/types/settings';

interface Props extends NavigationScreenProps, PaginatedListProps {
  notifications: NotificationData[];
  header?: JSX.Element;
  collapsible: ReactCollapsibleProps;
  settings: Settings;
  notificationsTabClickCount: number;
}

const NotificationsList = (props: Props) => {

  const { notifications, refetch, refreshing, header, onLoadMore, navigation, settings, collapsible, notificationsTabClickCount } = props;
  const keyExtractor = (item: NotificationData, index: number) => index.toString();
  const listRef = React.useRef<AnimatedFlatList>(null);

  React.useEffect(() => {
    if (listRef.current)
      listRef.current.scrollToIndex(0, true);
  }, [notificationsTabClickCount]);

  const renderNotification = (rowData: ListRenderItemInfo<NotificationData>) => {
    const { route, params } = routeNotification(rowData.item, settings);
    const onNotificationPress = () => navigation.navigate(route, params);

    return(
      <React.Fragment>
        <NotificationItem
          notification={ rowData.item }
          onNotificationPress={ onNotificationPress }
          style={ { marginTop: Platform.OS === 'android' && rowData.index === 0 ? Whitespace.LARGE : 0 } }
        />
        <BaseLine style={ { marginTop: Whitespace.MEDIUM, marginBottom: Whitespace.MEDIUM } } />
      </React.Fragment>
    );
  };

  return (
    <AnimatedFlatList
      ref={ listRef }
      onRefresh={ refetch }
      refreshing={ refreshing }
      keyExtractor={ keyExtractor }
      ListHeaderComponent={ header }
      data={ notifications }
      renderItem={ renderNotification }
      style={ { paddingHorizontal: Platform.OS === 'ios' ? Whitespace.CONTAINER : Whitespace.MEDIUM, paddingVertical: Whitespace.MEDIUM, paddingRight: Platform.OS === 'android' ? 0 : 'auto' } }
      onEndReached={ onLoadMore }
      collapsible={ collapsible }
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    settings: state.settings.settings,
  };
};

export default connect(mapStateToProps)(withNavigation(NotificationsList));
