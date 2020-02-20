import { allNavStackScreens } from 'mobile/src/navigation/AllNavStackScreens';
import { Routes } from 'mobile/src/navigation/Routes';
import ArgumentCommentScreen from 'mobile/src/screens/ArgumentCommentScreen';
import { createStackNavigator } from 'react-navigation';

const ArgumentCommentStack = createStackNavigator(
  {
    [Routes.ArgumentComment]: { screen: ArgumentCommentScreen },
    ...allNavStackScreens,
  },
  {
    initialRouteName: Routes.ArgumentComment,
    defaultNavigationOptions: {
      gestureResponseDistance: { horizontal: 250 },
    },
  },
  );

export default ArgumentCommentStack;
