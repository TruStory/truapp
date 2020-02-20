import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import { persistStore } from 'redux-persist';
import storage from 'redux-persist/es/storage'; // default store is localStore on web
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
import settings from 'shared/redux/reducers/settings.reducer';
import user_actions from 'shared/redux/reducers/user-actions.reducer';
import { configureClient, configureStore } from 'shared/redux/store';
import { loginUser } from 'shared/services/auth';
import { fetchSettings } from 'shared/services/settings';
import 'web/src/styles/index.css';
import 'web/src/styles/sass/app.scss';
import 'web/src/styles/toastify.css';
import NavigationStack from './navigation/NavigationStack';

toast.configure();

export const store = configureStore(storage, { auth, settings, drafts, comment_drafts, argument_comment_drafts, user_actions, claim_drafts });
const client = configureClient(`${ AppConfig.api.endpoint }/graphql`);
const persistor = persistStore(store);

console.disableYellowBox = true;
console.error = (error: any) => error.apply;

loginUser(store);
fetchSettings(client, store);

const App = () => {
  return (
    <ApolloProvider client={ client }>
      <Provider store={ store }>
        <PersistGate persistor={ persistor } loading={ <BaseLoadingIndicator /> } >
          <NavigationStack>
            <AlertModal />
            <BaseModal />
          </NavigationStack>
          <LoadingBlanket />
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
