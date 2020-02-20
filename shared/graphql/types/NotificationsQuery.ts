import { Query } from 'react-apollo';
import { NotificationData } from 'shared/types/notifications';
import { Paginated } from '../../types/graphql';

export interface NotificationsQueryData {
  notifications: Paginated<NotificationData>;
}

interface Variables {
  first?: number;
  after?: string;
}

export default class NotificationsQuery extends Query<NotificationsQueryData, Variables> { }
