import { Routes } from 'mobile/src/navigation/Routes';
import NavigationService from 'mobile/src/utils/NavigationService';
import { routeNotification } from 'mobile/src/utils/notifications';
import * as React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { AppState } from 'react-native';
import firebase from 'react-native-firebase';

import { connect } from 'react-redux';
import Chain from 'shared/blockchain';
import { DevicePlatformEnum, DevicePlatformType } from 'shared/blockchain/types';
import { truToast } from 'shared/components/Toast/TruToast';
import NOTIFICATIONS_QUERY from 'shared/graphql/queries/notifications.query';
import UNREAD_NOTIFICATIONS_COUNT_QUERY from 'shared/graphql/queries/unread-notifications-count.query';
import UNSEEN_NOTIFICATIONS_COUNT_QUERY from 'shared/graphql/queries/unseen-notifications-count.query';
import { storeDeviceToken } from 'shared/redux/actions/device.action';
import { MentionType, NotificationData, NotificationType } from 'shared/types/notifications';
import { Settings } from 'shared/types/settings';

interface Props extends WithApolloClient<any> {
  device: { token: string};
  settings: Settings;
  storeDeviceToken: (token: string, platform: DevicePlatformType) => void;
}

type firebaseListener = () => any;
class NotificationService extends React.Component<Props> {
  static refreshTokenListener : firebaseListener ;
  static foregroundNotificationListener : firebaseListener ;
  static backgroundNotificationListener : firebaseListener ;

  readonly addListeners = () => {
    NotificationService.refreshTokenListener = firebase.messaging().onTokenRefresh((token) => {
      this.handleRegisterToken(token);
    });
    // foreground
    NotificationService.foregroundNotificationListener = firebase.notifications().onNotification((notification) => {
      if (notification) {
        this.handleNotification(notification);
      }
    });

    // background
    NotificationService.backgroundNotificationListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      if (notificationOpen && notificationOpen.notification) {
        this.handleNotification(notificationOpen.notification);
      }
    });
  }

  readonly removeListeners = () => {
    try {
      NotificationService.refreshTokenListener();
      NotificationService.backgroundNotificationListener();
      NotificationService.foregroundNotificationListener();
    }
    catch (e) {
      console.log('error removing listeners');
    }
  }

  readonly handleNotification = (notification: any, initial: boolean = false) => {
    try {
      const data = JSON.parse(notification._data.trustory);
      const { route, params } = routeNotification(data, this.props.settings);

      const handleNotificationDisplay = () => {
        this.handleNotificationRead(data);
        NavigationService.navigate(route, params, `${Routes.Comment}-${data.meta.claimId}`);
      };

      if (AppState.currentState === 'active') {
        if (initial) {
          handleNotificationDisplay();
          return;
        }

        const r = NavigationService.getCurrentRoute();
        if (r.routeName === Routes.Comment &&
          (data.type === NotificationType.CommentAction ||
          data.type === NotificationType.ArgumentCommentAction ||
          data.meta.mentionType === MentionType.CommentMention ) &&
          r.params.claimId === data.meta.claimId
          ) {
          this.handleNotificationRead(data);
          return;
        }

        truToast(
          data.subtitle,
          `${notification.title} ${notification.body}`,
          handleNotificationDisplay,
        );
      } else {
        handleNotificationDisplay();
      }

    }catch (e) {
      console.log(e);
    }
  }
  readonly handleRegisterToken = (deviceToken: string) => {
    this.props.storeDeviceToken(deviceToken, DevicePlatformEnum.ANDROID);
  }

  handleNotificationRead = async (notification: NotificationData) => {
    await Chain.markNotificationsRead({
      notification_id: notification.id,
      read: true,
    });

    this.props.client.query({
      query: NOTIFICATIONS_QUERY,
      fetchPolicy: 'network-only',
    });
    this.props.client.query({
      query: UNREAD_NOTIFICATIONS_COUNT_QUERY,
      fetchPolicy: 'network-only',
    });
    this.props.client.query({
      query: UNSEEN_NOTIFICATIONS_COUNT_QUERY,
      fetchPolicy: 'network-only',
    });
  }
  requestPermissions = async () => {
    try {
      await firebase.messaging().requestPermission();
      const token = await firebase.messaging().getToken();
      this.handleRegisterToken(token);
      const channelId = 'all';
      let channel = new firebase.notifications.Android.Channel(channelId, 'All Notifications', firebase.notifications.Android.Importance.Max)
        .setDescription('TruStory Notifications')
        .enableVibration(true)
        .setVibrationPattern([0, 400]);
      await firebase.notifications().android.createChannel(channel);
    }catch (err) {
      console.log('error requesting permission', err);
    }
  }
  componentDidMount() {
    this.requestPermissions();
    this.addListeners();
    firebase.notifications().getInitialNotification().then((initialNotification)  => {
      if (initialNotification && initialNotification.notification) {
        this.handleNotification(initialNotification.notification, true);
      }
    });

  }

  componentWillUnmount() {
    this.removeListeners();
  }

  render() {
    return null;
  }

}

const mapStateToProps = (state: any) => {
  return {
    device: state.device,
    settings: state.settings.settings,
  };
};

const mapDispatchToProps = (dispatch: any, props: any) => ({
  storeDeviceToken: (token: string, platform: DevicePlatformType) => {
    return dispatch(storeDeviceToken(token, platform));
  },
});

export default withApollo(connect(mapStateToProps, mapDispatchToProps)(NotificationService));
