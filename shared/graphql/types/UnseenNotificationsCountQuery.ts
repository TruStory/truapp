import { Query } from 'react-apollo';
import { NotificationsCount } from 'shared/types/notifications';

export interface UnseenNotificationsCountData {
  unseenNotificationsCount: NotificationsCount;
}

export default class UnseenNotificationsCountQuery extends Query<UnseenNotificationsCountData> { }
