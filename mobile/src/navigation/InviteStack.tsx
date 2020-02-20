import { allNavStackScreens } from 'mobile/src/navigation/AllNavStackScreens';
import { Routes } from 'mobile/src/navigation/Routes';
import InviteDetailsScreen from 'mobile/src/screens/InviteDetailsScreen';
import InviteScreen from 'mobile/src/screens/InviteScreen';
import { createStackNavigator } from 'react-navigation';

const InviteStack = createStackNavigator(
  {
    [Routes.Invite]: {
      screen: InviteScreen,
    },
    [Routes.InviteDetails]: {
      screen: InviteDetailsScreen,
    },
    ...allNavStackScreens,
  },
  {
    initialRouteName: Routes.Invite,
    defaultNavigationOptions: {
      gestureResponseDistance: { horizontal: 250 },
    },
  },
);

export default InviteStack;
