import { Routes } from 'mobile/src/navigation/Routes';
import PreviewScreen from 'mobile/src/screens/PreviewScreen';
import { createStackNavigator } from 'react-navigation';

const PreviewStack = createStackNavigator(
  {
    [Routes.Preview]: { screen: PreviewScreen },
  },
  {
    initialRouteName: Routes.Preview,
  },
  );

export default PreviewStack;
