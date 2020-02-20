import { Routes } from 'mobile/src/navigation/Routes';
import AccountRecoveryScreen from 'mobile/src/screens/Auth/AccountRecoveryScreen';
import AccountRecoverySentScreen from 'mobile/src/screens/Auth/AccountRecoverySentScreen';
import LoginScreen from 'mobile/src/screens/Auth/LoginScreen';
import ProcessVerificationScreen from 'mobile/src/screens/Auth/ProcessVerificationScreen';
import RegisterScreen from 'mobile/src/screens/Auth/RegisterScreen';
import VerifyScreen from 'mobile/src/screens/Auth/VerifyScreen';
import { createStackNavigator } from 'react-navigation';

const AuthStack = createStackNavigator(
  {
    [Routes.Login]: { screen: LoginScreen },
    [Routes.Register]: { screen: RegisterScreen },
    [Routes.Verify]: { screen: VerifyScreen },
    [Routes.ProcessVerification]: { screen: ProcessVerificationScreen },
    [Routes.AccountRecovery]: { screen: AccountRecoveryScreen },
    [Routes.AccountRecoverySent] : { screen: AccountRecoverySentScreen },
  },
  {
    initialRouteName: Routes.Login,
    defaultNavigationOptions: {
      gestureResponseDistance: { horizontal: 250 },
    },
  },
  );

export default AuthStack;
