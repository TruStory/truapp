
import { allNavStackScreens } from 'mobile/src/navigation/AllNavStackScreens';
import { Routes } from 'mobile/src/navigation/Routes';
import EditAppAccountScreen from 'mobile/src/screens/EditAppAccountScreen';
import UserAppAccountScreen from 'mobile/src/screens/UserAppAccountScreen';
import { createStackNavigator } from 'react-navigation';

const AppAccountStack = createStackNavigator(
  {
    [Routes.UserAppAccount]: {
      screen: UserAppAccountScreen,
    },
    [Routes.Settings]: {
      screen: EditAppAccountScreen,
    },
    ...allNavStackScreens,
  },
  {
    initialRouteName: Routes.UserAppAccount,
    defaultNavigationOptions: {
      gestureResponseDistance: { horizontal: 250 },
    },
  },
);

export default AppAccountStack;
