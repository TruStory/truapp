import { Routes } from 'mobile/src/navigation/Routes';
import AddClaimScreen1 from 'mobile/src/screens/AddClaim/AddClaimScreen1';
import AddClaimScreen2 from 'mobile/src/screens/AddClaim/AddClaimScreen2';
import AddClaimScreen3 from 'mobile/src/screens/AddClaim/AddClaimScreen3';
import AddClaimScreen4 from 'mobile/src/screens/AddClaim/AddClaimScreen4';
import { createStackNavigator } from 'react-navigation';

const AddClaimStack = createStackNavigator(
  {
    [Routes.AddClaimScreen1]: { screen: AddClaimScreen1 },
    [Routes.AddClaimScreen2]: { screen: AddClaimScreen2 },
    [Routes.AddClaimScreen3]: { screen: AddClaimScreen3 },
    [Routes.AddClaimScreen4]: { screen: AddClaimScreen4 },
  },
  {
    initialRouteName: Routes.AddClaimScreen1,
    defaultNavigationOptions: {
      gestureResponseDistance: { horizontal: 250 },
    },
  },
  );

export default AddClaimStack;
