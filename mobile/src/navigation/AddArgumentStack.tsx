import { Routes } from 'mobile/src/navigation/Routes';
import AddArgumentScreen1 from 'mobile/src/screens/AddArgument/AddArgumentScreen1';
import AddArgumentScreen2 from 'mobile/src/screens/AddArgument/AddArgumentScreen2';
import AddArgumentScreen3 from 'mobile/src/screens/AddArgument/AddArgumentScreen3';
import { createStackNavigator } from 'react-navigation';

const AddArgumentStack = createStackNavigator(
  {
    [Routes.AddArgumentScreen1]: { screen: AddArgumentScreen1 },
    [Routes.AddArgumentScreen2]: { screen: AddArgumentScreen2 },
    [Routes.AddArgumentScreen3]: { screen: AddArgumentScreen3 },
  },
  {
    initialRouteName: Routes.AddArgumentScreen1,
    defaultNavigationOptions: {
      gestureResponseDistance: { horizontal: 250, vertical: 150 },
    },
  },
  );

export default AddArgumentStack;
