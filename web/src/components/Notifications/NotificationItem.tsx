import * as React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Chain from 'shared/blockchain';
import AppAccountLink from 'shared/components/AppAccount/AppAccountLink';
import BaseActionable from 'shared/components/Base/BaseActionable';
import BaseIconImageView from 'shared/components/Base/BaseIconImageView';
import BaseIconView from 'shared/components/Base/BaseIconView';
import BaseText from 'shared/components/Base/BaseText';
import TimerComponent from 'shared/components/TimerComponent';
import BaseATag from 'shared/components/WebOnly/BaseATag';
import NOTIFICATIONS_QUERY from 'shared/graphql/queries/notifications.query';
import UNREAD_NOTIFICATIONS_COUNT_QUERY from 'shared/graphql/queries/unread-notifications-count.query';
import { TextSize } from 'shared/styles';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';
import { NotificationData } from 'shared/types/notifications';
import tippy from 'tippy.js';
import TrustoryMarkdown from 'web/src/components/Markdown/TrustoryMarkdown';

interface Props extends WithApolloClient<any> {
  notification: NotificationData;
  appLink: string;
  style?: StyleProp<ViewStyle> & React.CSSProperties;
}

const NotificationItem = (props: Props) => {
  const { notification, style, appLink, client } = props;
  const { body, image, title, createdTime } = notification;
  const [ hover, setHover ] = React.useState(false);

  const onMouseOver = () => setHover(true);
  const onMouseOut = () => {
    tippy.hideAll({ duration: 0 });
    setHover(false);
  };

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
    } catch (e) { }
  };

  const backgroundColor = hover ? Color.HIGHLIGHT_PURPLE : Color.WHITE;

  return (
    <BaseATag
      appLink={ appLink }
      underline={ false }
    >
      <BaseActionable
        style={ [ styles.container, style, { backgroundColor, width: '100%', alignItems: 'flex-start' } ] }
        onAction={ onPress }
        onMouseOver={ onMouseOver }
        onMouseOut={ onMouseOut }
      >
        <View style={ { flexDirection: 'row', alignItems: 'center' } }>
          { renderRead() }
          <BaseIconImageView source={ image } style={ styles.image } size={ IconSize.LARGE } />
          <BaseText bold={ true }>{ title }</BaseText>
          <BaseIconView
            family={ 'Material' }
            color={ Color.GRAY }
            size={ 5 }
            name={ 'fiber-manual-record' }
            style={ { marginLeft: Whitespace.TINY, marginRight: Whitespace.TINY } }
            />
          <TimerComponent
            showElapsedLabel={ true }
            color={ Color.GRAY }
            endTime={ createdTime }
            size={ TextSize.H6 }
            showFullTime={ true }
          />
        </View>
        <View style={ { marginLeft: 80, marginTop: Whitespace.TINY } }>
          { notification.senderProfile &&  <AppAccountLink appAccount={ notification.senderProfile } bold={ true }  textSize={ TextSize.H4 } style={ { marginRight: 3 } } /> }
          <TrustoryMarkdown>{ body }</TrustoryMarkdown>
        </View>
      </BaseActionable>
    </BaseATag>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingTop: Whitespace.MEDIUM,
    paddingBottom: Whitespace.MEDIUM,
  },
  image: { borderRadius: Whitespace.LARGE, marginRight: Whitespace.SMALL },
});

export default withApollo(NotificationItem);
