import DefaultClient from 'apollo-boost';
import { Store } from 'redux';
import SETTINGS_QUERY from 'shared/graphql/queries/settings.query';
import { storeCurrentSettings } from 'shared/redux/actions/settings.action';
import { Settings } from 'shared/types/settings';

interface SettingsQueryData {
  settings: Settings;
}

export const fetchSettings = async (client: DefaultClient<any>, store: Store) => {
  try {
    const result = await client.query<SettingsQueryData>({
      query: SETTINGS_QUERY,
    });
    store.dispatch(storeCurrentSettings(result.data.settings));
  } catch (e) {
    console.log('Could not load application settings', e);
  }
};
