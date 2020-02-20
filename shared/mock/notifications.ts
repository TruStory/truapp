import { NotificationData } from 'shared/types/notifications';

export const notification1: NotificationData  = {
  id: 1,
  type: 0,
  image: 'https://randomuser.me/api/portraits/men/10.jpg',
  createdTime: new Date(new Date().getTime() - 1800000).toISOString(),
  read: true,
  typeId: 1,
  title: 'Peter Smith',
  body: 'Challenged your claim for 10 Tru',
  meta : { },
};

export const notification2: NotificationData = {
  id: 2,
  type: 0,
  image: 'https://randomuser.me/api/portraits/men/18.jpg',
  createdTime: new Date(new Date().getTime() - 1200000).toISOString(),
  read: false,
  typeId: 1,
  title: 'Jason Alberre',
  body: 'Backed your argument for 10 Tru',
  meta: { },
};

export const mockNotifications = [notification1, notification2];
