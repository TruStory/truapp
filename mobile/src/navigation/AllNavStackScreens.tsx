import { Routes } from 'mobile/src/navigation/Routes';
import AppAccountScreen from 'mobile/src/screens/AppAccountScreen';
import ArgumentScreen from 'mobile/src/screens/ArgumentScreen';
import HowItWorksScreen from 'mobile/src/screens/HowItWorksScreen';
import SelectCommunitiesScreen from 'mobile/src/screens/SelectCommunitiesScreen';

export const allNavStackScreens = {
  [Routes.Argument]: {
    screen: ArgumentScreen,
    path: 'argument/:argumentId',
  },
  [Routes.AppAccount] : {
    screen: AppAccountScreen,
    path: 'profile/:accountId',
  },
  [Routes.HowItWorks] : {
    screen: HowItWorksScreen,
  },
  [Routes.SelectCommunities] : {
    screen: SelectCommunitiesScreen,
  },
};
