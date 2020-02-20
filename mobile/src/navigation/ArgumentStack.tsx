import { allNavStackScreens } from 'mobile/src/navigation/AllNavStackScreens';
import { Routes } from 'mobile/src/navigation/Routes';
import ArgumentScreen from 'mobile/src/screens/ArgumentScreen';
import { createStackNavigator } from 'react-navigation';

const ArgumentStack = createStackNavigator(
  {
    [Routes.Argument]: { screen: ArgumentScreen },
    ...allNavStackScreens,
  },
  {
    initialRouteName: Routes.Argument,
    defaultNavigationOptions: {
      gestureResponseDistance: { horizontal: 250 },
    },
  },
  );

export default ArgumentStack;
