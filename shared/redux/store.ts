import ApolloClient from 'apollo-boost/lib/index';
import { apolloReducer } from 'apollo-cache-redux';
import { createStore, ReducersMapObject } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import { isWeb } from 'shared/styles/utils';

// returns a store with persisted reducers
export const configureStore = (storage: any, reducers: ReducersMapObject): any => {

  const config = {
    key: 'root',
    storage,
    blacklist: ['apollo'],
  };

  const reducer =  persistCombineReducers(config, {
    apollo: apolloReducer,
    ...reducers,
  });

  return createStore(reducer);

};

export const configureClient = (apiUri: string) => {

  // todo: implement transformation of data coming in if needed

  return new ApolloClient({
    uri: apiUri,
    onError: (errors: any) => {
      console.log(errors);
    },
    request: async operation => {
      operation.setContext((record: any) => {
        let headers = {
          ...record.headers,
          'x-mobile-request' : isWeb() ? 'false' : 'true',
        };

        return {
          headers,
        };
      });
    },
  });

};
