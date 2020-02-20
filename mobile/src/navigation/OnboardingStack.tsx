import { allNavStackScreens } from 'mobile/src/navigation/AllNavStackScreens';
import { Routes } from 'mobile/src/navigation/Routes';
import SelectCommunitiesScreen from 'mobile/src/screens/SelectCommunitiesScreen';
import { createStackNavigator } from 'react-navigation';

const OnboardingStack = createStackNavigator(
  {
    [Routes.SelectCommunities]: {
      screen: SelectCommunitiesScreen,
      path: '',
    },
    ...allNavStackScreens,
  },
  {
    initialRouteName: Routes.SelectCommunities,
  },
);

export default OnboardingStack;
