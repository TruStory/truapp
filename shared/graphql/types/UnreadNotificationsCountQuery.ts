import { Query } from 'react-apollo';
import { NotificationsCount } from 'shared/types/notifications';

export interface UnreadNotificationsCountData {
  unreadNotificationsCount: NotificationsCount;
}

export default class UnreadNotificationsCountQuery extends Query<UnreadNotificationsCountData> { }
