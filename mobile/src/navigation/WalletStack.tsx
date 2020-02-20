
import { Routes } from 'mobile/src/navigation/Routes';
import WalletScreen from 'mobile/src/screens/WalletScreen';
import { headerStyles } from 'mobile/src/styles';
import { createStackNavigator } from 'react-navigation';

const WalletStack = createStackNavigator(
  {
    [Routes.Wallet]: {
      screen: WalletScreen,
    },
  },
  {
    initialRouteName: Routes.Wallet,
    defaultNavigationOptions: {
      ...headerStyles,
      gestureResponseDistance: { horizontal: 250 },
    },
  },
);

export default WalletStack;
