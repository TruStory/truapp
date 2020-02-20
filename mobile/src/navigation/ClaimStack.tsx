import { allNavStackScreens } from 'mobile/src/navigation/AllNavStackScreens';
import { Routes } from 'mobile/src/navigation/Routes';
import ClaimScreen from 'mobile/src/screens/ClaimScreen';
import { createStackNavigator } from 'react-navigation';

const ClaimStack = createStackNavigator(
  {
    [Routes.Claim]: {
      screen: ClaimScreen,
      path: 'claim/:claimId',
    },
    ...allNavStackScreens,
  },
  {
    initialRouteName: Routes.Claim,
    defaultNavigationOptions: {
      gestureResponseDistance: { horizontal: 250 },
    },
  },
);

export default ClaimStack;
