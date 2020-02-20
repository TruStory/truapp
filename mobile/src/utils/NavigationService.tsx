import { NavigationActions, NavigationContainerComponent, NavigationParams, NavigationRoute, NavigationState } from 'react-navigation';

let _navigator: any;

function setTopLevelNavigator(navigatorRef: NavigationContainerComponent | null) {
  _navigator = navigatorRef;
}

function navigate(routeName: string, params: NavigationParams, key?: string) {
  if (_navigator !== null) {
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
        key,
      }),
    );
  }
}

function getCurrentRoute() {
  let route = _navigator.state.nav;
  while (route.routes) {
    route = route.routes[route.index];
  }
  return route;
}

function getActiveRouteName(navigationState: NavigationState | NavigationRoute): string | null {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

export default {
  navigate,
  setTopLevelNavigator,
  getActiveRouteName,
  getCurrentRoute,
};
