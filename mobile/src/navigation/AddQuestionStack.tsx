
import { Routes } from 'mobile/src/navigation/Routes';
import AddQuestionScreen from 'mobile/src/screens/AddQuestionScreen';
import { createStackNavigator } from 'react-navigation';

const AddQuestionStack = createStackNavigator(
  {
    [Routes.AddQuestion]: { screen: AddQuestionScreen },
  },
  {
    initialRouteName: Routes.AddQuestion,
    defaultNavigationOptions: {
      gestureResponseDistance: { horizontal: 250 },
    },
  },
  );

export default AddQuestionStack;
