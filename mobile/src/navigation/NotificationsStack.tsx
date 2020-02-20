import { allNavStackScreens } from 'mobile/src/navigation/AllNavStackScreens';
import { Routes } from 'mobile/src/navigation/Routes';
import NotificationsScreen from 'mobile/src/screens/NotificationsScreen';
import { headerStyles } from 'mobile/src/styles';
import { createStackNavigator } from 'react-navigation';

const NotificationsStack = createStackNavigator(
  {
    [Routes.Notifications]: {
      screen: NotificationsScreen,
    },
    ...allNavStackScreens,
  },
  {
    initialRouteName: Routes.Notifications,
    defaultNavigationOptions: {
      ...headerStyles,
      gestureResponseDistance: { horizontal: 250 },
    },
  },
);

export default NotificationsStack;
