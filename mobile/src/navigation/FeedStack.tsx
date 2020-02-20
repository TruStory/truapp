import { allNavStackScreens } from 'mobile/src/navigation/AllNavStackScreens';
import { Routes } from 'mobile/src/navigation/Routes';
import FeedScreen from 'mobile/src/screens/FeedScreen';
import HowItWorksScreen from 'mobile/src/screens/HowItWorksScreen';
import LeaderboardScreen from 'mobile/src/screens/LeaderboardScreen';
import SearchScreen from 'mobile/src/screens/SearchScreen';
import { createStackNavigator } from 'react-navigation';

const FeedStack = createStackNavigator(
  {
    [Routes.Feed]: {
      screen: FeedScreen,
      path: '',
    },
    [Routes.Search]: {
      screen: SearchScreen,
      path: 'search',
    },
    [Routes.Leaderboard]: {
      screen: LeaderboardScreen,
      path: 'leaderboard',
    },
    [Routes.HowItWorks] : {
      screen: HowItWorksScreen,
    },
    ...allNavStackScreens,
  },
  {
    initialRouteName: Routes.Feed,
    defaultNavigationOptions: {
      gestureResponseDistance: { horizontal: 250 },
    },
  },
);

// const getRoutingAction = FeedStack.router.getActionForPathAndParams;
// Object.assign(FeedStack.router, {
//   getActionForPathAndParams(path: string, params: NavigationParams) {
//     console.log(path, params);
//     return getRoutingAction;
//     // if(path === `claim/:claimId/argument/:argumentId`)
//   },
// });

export default FeedStack;
