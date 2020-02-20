import AuthStack from 'mobile/src/navigation/AuthStack';
import MainStack from 'mobile/src/navigation/MainStack';
import { Routes } from 'mobile/src/navigation/Routes';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

const AuthSwitchNavigator = createSwitchNavigator(
  {
    [Routes.Main]: {
      screen: MainStack,
      path: '',
    },
    [Routes.Auth]: AuthStack,
  },
  {
    initialRouteName: Routes.Auth,
  },
);

export default createAppContainer(AuthSwitchNavigator);
