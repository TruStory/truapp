import Menu from 'mobile/src/components/Menu/Menu';
import FeedStack from 'mobile/src/navigation/FeedStack';
import { Routes } from 'mobile/src/navigation/Routes';
import { createDrawerNavigator } from 'react-navigation';

const MainDrawerStack = createDrawerNavigator(
  {
    [Routes.FeedStack]: {
      screen: FeedStack,
      path: '',
    },
  },
  {
    contentComponent: Menu,
    drawerWidth: 300,
    drawerPosition: 'left',
  },
);

export default MainDrawerStack;
