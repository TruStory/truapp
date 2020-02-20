import AddArgumentStack from 'mobile/src/navigation/AddArgumentStack';
import AddClaimStack from 'mobile/src/navigation/AddClaimStack';
import AddQuestionStack from 'mobile/src/navigation/AddQuestionStack';
import ArgumentCommentStack from 'mobile/src/navigation/ArgumentCommentStack';
import ArgumentStack from 'mobile/src/navigation/ArgumentStack';
import ClaimStack from 'mobile/src/navigation/ClaimStack';
import CommentStack from 'mobile/src/navigation/CommentStack';
import InviteStack from 'mobile/src/navigation/InviteStack';
import OnboardingStack from 'mobile/src/navigation/OnboardingStack';
import PreviewStack from 'mobile/src/navigation/PreviewStack';
import { Routes } from 'mobile/src/navigation/Routes';
import TabNavigator from 'mobile/src/navigation/TabNavigator';
import { createStackNavigator } from 'react-navigation';

const MainStack = createStackNavigator(
  {
    [Routes.Tabs]: {
      screen: TabNavigator,
      path: '',
    },
    [Routes.AddArgumentStack]: { screen: AddArgumentStack },
    [Routes.ArgumentStack]: { screen: ArgumentStack },
    [Routes.CommentStack]: { screen: CommentStack },
    [Routes.ArgumentCommentStack]: { screen: ArgumentCommentStack },
    [Routes.Preview]: { screen: PreviewStack },
    [Routes.AddClaim] : { screen: AddClaimStack },
    [Routes.AddQuestionStack]: { screen: AddQuestionStack },
    [Routes.ClaimStack]: { screen: ClaimStack },
    [Routes.OnboardingStack]: { screen: OnboardingStack },
    [Routes.InviteStack]: { screen: InviteStack },
  },
  {
    initialRouteName: Routes.Tabs,
    mode: 'modal',
    defaultNavigationOptions: {
      header: null,
    },
  },
  );

export default MainStack;
