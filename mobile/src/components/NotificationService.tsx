import { Routes } from 'mobile/src/navigation/Routes';
import NavigationService from 'mobile/src/utils/NavigationService';
import { routeNotification } from 'mobile/src/utils/notifications';
import * as React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { AppState, Platform, PushNotificationIOS } from 'react-native';
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

class NotificationService extends React.Component<Props> {

  readonly addListeners = () => {
    PushNotificationIOS.addEventListener('register', this.handleRegisterToken);
    PushNotificationIOS.addEventListener('registrationError', this.handleRegistrationError);
    PushNotificationIOS.addEventListener('notification', this.handleNotification);
  }

  readonly removeListeners = () => {
    PushNotificationIOS.removeEventListener('register', this.handleRegisterToken);
    PushNotificationIOS.removeEventListener('registrationError', this.handleRegistrationError);
  }

  readonly handleNotification = (notification: any, initial: boolean = false) => {
    try {
      const data = notification._data.trustory;
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
          notification._alert.subtitle,
          `${notification._alert.title} ${notification._alert.body}`,
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
    this.props.storeDeviceToken(deviceToken, DevicePlatformEnum.IOS);
  }

  readonly handleRegistrationError = (error: any) => {
    console.log('registration error', error);
  }
  readonly requestPermissions = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.requestPermissions({ alert: true, badge: true, sound: true  });
    }
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

  componentDidMount() {
    this.requestPermissions();
    this.addListeners();
    if (Platform.OS === 'ios') {
      // This is the case when the app is opened by a notification.
      PushNotificationIOS.getInitialNotification().then((notification) => { if (notification) {
        this.handleNotification(notification, true);
      }});
    }
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
