
import NotificationService from 'mobile/src/components/NotificationService';
import UniversalLinkingService from 'mobile/src/components/UniversalLinking';
import AuthSwitchNavigator from 'mobile/src/navigation/AuthSwitchNavigator';
import { Routes } from 'mobile/src/navigation/Routes';
import GroundingActions from 'mobile/src/utils/GroundingActions';
import NavigationService from 'mobile/src/utils/NavigationService';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { AsyncStorage } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { NavigationAction, NavigationState } from 'react-navigation';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import AppConfig from 'shared/app-config.json';
import AlertModal from 'shared/components/AlertModal/AlertModal';
import BaseLoadingIndicator from 'shared/components/Base/BaseLoadingIndicator';
import BaseModal from 'shared/components/BaseModal/BaseModal';
import LoadingBlanket from 'shared/components/LoadingBlanket/LoadingBlanket';
import argument_comment_drafts from 'shared/redux/reducers/argument-comment-draft.reducer';
import drafts from 'shared/redux/reducers/argument-draft.reducer';
import auth from 'shared/redux/reducers/auth.reducer';
import claim_drafts from 'shared/redux/reducers/claim-draft.reducer';
import comment_drafts from 'shared/redux/reducers/comment-draft.reducer';
import device from 'shared/redux/reducers/device.reducer';
import settings from 'shared/redux/reducers/settings.reducer';
import { configureClient, configureStore } from 'shared/redux/store';
import { fetchSettings } from 'shared/services/settings';
import Analytics, { AnalyticsEventsMobile } from 'shared/utils/analytics';

// Configure the store with the storage choices + reducers
export const store = configureStore(AsyncStorage, { auth, settings, drafts, device, comment_drafts, argument_comment_drafts, claim_drafts });
const persistedStore = persistStore(store);
const client = configureClient(`${AppConfig.chain_url}${AppConfig.api.endpoint}/graphql`);

console.disableYellowBox = true;
console.error = (error: any) => error.apply;

Analytics.init(AppConfig.mixpanel);
fetchSettings(client, store);

toast.configure();

// gets the current screen from navigation state
const  getActiveRouteName = (navigationState: NavigationState) : string | null => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route as NavigationState);
  }
  return route.routeName;
};

const navigationStateChange = (prevState: NavigationState, currentState: NavigationState, action: NavigationAction) => {
  const currentScreen = getActiveRouteName(currentState);
  const prevScreen = getActiveRouteName(prevState);
  if (prevScreen !== currentScreen && currentScreen === Routes.Feed) {
    Analytics.track(AnalyticsEventsMobile.FeedOpened);
  }
};
const App = () => {
// tslint:disable: jsx-space-before-trailing-slash
  return (
    <ApolloProvider client={ client }>
      <Provider store={ store }>
        <PersistGate
          persistor={ persistedStore }
          loading={ <BaseLoadingIndicator /> }
        >
          <AuthSwitchNavigator
            onNavigationStateChange={ navigationStateChange }
            ref={ (ref: any) => NavigationService.setTopLevelNavigator(ref) }
          />
          <LoadingBlanket />
          <GroundingActions />
          <AlertModal />
          <BaseModal />
          <FlashMessage position={ 'top' } />
          <NotificationService />
          <UniversalLinkingService />
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
