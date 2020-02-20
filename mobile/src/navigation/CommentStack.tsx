import { allNavStackScreens } from 'mobile/src/navigation/AllNavStackScreens';
import { Routes } from 'mobile/src/navigation/Routes';
import CommentScreen from 'mobile/src/screens/CommentScreen';
import { createStackNavigator } from 'react-navigation';

const CommentStack = createStackNavigator(
  {
    [Routes.Comment]: { screen: CommentScreen },
    ...allNavStackScreens,
  },
  {
    initialRouteName: Routes.Comment,
    defaultNavigationOptions: {
      gestureResponseDistance: { horizontal: 250 },
    },
  },
  );

export default CommentStack;
