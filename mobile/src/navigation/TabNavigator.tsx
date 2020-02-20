import AppAccountStack from 'mobile/src/navigation/AppAccountStack';
import MainDrawerStack from 'mobile/src/navigation/MainDrawerStack';
import NotificationsStack from 'mobile/src/navigation/NotificationsStack';
import { Routes } from 'mobile/src/navigation/Routes';
import WalletStack from 'mobile/src/navigation/WalletStack';
import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import BaseIconView from 'shared/components/Base/BaseIconView';
import UnseenNotificationsIndicator from 'shared/components/Notifications/UnseenNotificationsIndicator';
import { Color } from 'shared/styles/colors';
import { IconSize, Whitespace } from 'shared/styles/views';

const tabBarIcon = (name: string) => {
  return ({ focused }: { focused: boolean }) => {
    const color = focused ? Color.WHITE : Color.DARK_GRAY;
    const iconJsx = <BaseIconView name={ name } family={ 'Feather' } size={ IconSize.SMALL } color={ color } />;
    if (name === 'bell') {
      return (
        <React.Fragment>
          <UnseenNotificationsIndicator size={ 5 } style={ { marginTop: -Whitespace.CONTAINER + 2, marginBottom: Whitespace.TINY - 2 } } />
          { iconJsx }
        </React.Fragment>
      );
    }
    return iconJsx;
  };
};

let homeTabClickCount = 0;
let notificationsTabClickCount = 0;

const TabNavigator = createBottomTabNavigator(
  {
    [Routes.FeedTab]: {
      screen: MainDrawerStack,
      navigationOptions : {
        tabBarIcon: tabBarIcon('home'),
        tabBarOnPress: ({ navigation, defaultHandler }: any) => {
          if (navigation.state.routeName === 'FeedTab' && navigation.isFocused()) {
            homeTabClickCount++;
            navigation.navigate(Routes.Feed, { homeTabClickCount });
          }

          defaultHandler();
        },
      },
      path: '',
    },
    [Routes.WalletTab]: {
      screen: WalletStack,
      navigationOptions : {
        tabBarIcon: tabBarIcon('dollar-sign'),
      },
      path: 'wallet',
    },
    [Routes.NotificationsTab]: {
      screen: NotificationsStack,
      navigationOptions : {
        tabBarIcon: tabBarIcon('bell'),
        tabBarOnPress: ({ navigation, defaultHandler }: any) => {
          if (navigation.state.routeName === 'NotificationsTab' && navigation.isFocused()) {
            notificationsTabClickCount++;
            navigation.navigate(Routes.Notifications, { notificationsTabClickCount });
          }

          defaultHandler();
        },
      },
      path: 'notifications',
    },
    [Routes.AppAccountTab]: {
      screen: AppAccountStack,
      navigationOptions : {
        tabBarIcon: tabBarIcon('user'),
      },
      path: 'profile',
    },
  },
  {
    initialRouteName: Routes.FeedTab,
    tabBarOptions: {
      showLabel: false,
      style: {
        borderTopWidth: 0,
        backgroundColor: Color.APP_BLACK,
      },
    },
  },
);

export default TabNavigator;
