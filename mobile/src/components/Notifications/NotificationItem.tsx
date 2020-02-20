import TrustoryMarkdown from 'mobile/src/components/Markdown/TrustoryMarkdown';
import * as React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Chain from 'shared/blockchain';
import AppAccountLink from 'shared/components/AppAccount/AppAccountLink';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseIconView from 'shared/components/Base/BaseIconView';
import TimerComponent from 'shared/components/TimerComponent';
import NOTIFICATIONS_QUERY from 'shared/graphql/queries/notifications.query';
import UNREAD_NOTIFICATIONS_COUNT_QUERY from 'shared/graphql/queries/unread-notifications-count.query';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { FontFamily } from 'shared/styles/fonts';
import { IconSize, Whitespace } from 'shared/styles/views';
import { NotificationData } from 'shared/types/notifications';

interface Props extends WithApolloClient<any> {
  notification: NotificationData;
  onNotificationPress: () => void;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const NotificationItem = (props: Props) => {
  const { notification, style, client, onNotificationPress } = props;
  const { body, image, createdTime } = notification;

  const renderRead = () => {
    if (!notification.read) {
      return (
        <BaseIconView
          family={ 'Material' }
          color={ Color.APP_PURPLE }
          size={ 10 }
          name={ 'fiber-manual-record' }
          style={ { marginLeft: 12.5, marginRight: 12.5 } }
        />
      );
    } else {
      return (
        <View style={ { width: 40 } } />
      );
    }
  };

  const onPress = async () => {
    try {
      if (notification.read !== true) {
        await Chain.markNotificationsRead({
          notification_id: notification.id,
          read: true,
        });
        client.query({
          query: NOTIFICATIONS_QUERY,
          fetchPolicy: 'network-only',
        });
        client.query({
          query: UNREAD_NOTIFICATIONS_COUNT_QUERY,
          fetchPolicy: 'network-only',
        });
      }

      onNotificationPress();
    } catch (e) { }
  };

  return (
    <BaseActionable
      onAction={ onPress }
      style={ [ styles.container, style, { flexDirection: 'row', alignItems: 'flex-start', flex: 1, width: '100%' } ] }
    >
      <BaseIconImageView source={ image } style={ styles.image } size={ IconSize.LARGE } />
      <View style={ { flexDirection: 'row', flex: 1 } }>
        <View style={ { flexDirection: 'column', flex: 1 } }>
          { notification.senderProfile &&  <AppAccountLink appAccount={ notification.senderProfile } bold={ true }  textSize={ TextSize.H4 } style={ { marginRight: 3 } } /> }
          <TrustoryMarkdown
            style={ { marginVertical: -Whitespace.SMALL + 4 } }
            fontFamily={ FontFamily.base }
          >
            { body }
          </TrustoryMarkdown>
          <TimerComponent
            showElapsedLabel={ true }
            color={ Color.GRAY }
            endTime={ createdTime }
            size={ TextSize.H6 }
            showFullTime={ true }
          />
        </View>
        { renderRead() }
      </View>
    </BaseActionable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  image: { borderRadius: Whitespace.MEDIUM, marginRight: Whitespace.SMALL },
});

export default withApollo(NotificationItem);
