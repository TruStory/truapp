import { store } from 'mobile/App';
import { Routes } from 'mobile/src/navigation/Routes';
import NavigationService from 'mobile/src/utils/NavigationService';
import * as React from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import AppConfig from 'shared/app-config.json';
import Chain from 'shared/blockchain';
import { DevicePlatformType } from 'shared/blockchain/types';
import { removeAllDrafts } from 'shared/redux/actions/argument-draft.action';
import { logout } from 'shared/redux/actions/auth.action';
import { removeAllClaimDrafts } from 'shared/redux/actions/claim-draft.action';
import { removeAllCommentDrafts } from 'shared/redux/actions/comment-draft.action';
import { configureClient } from 'shared/redux/store';
import { loginUser } from 'shared/services/auth';
import { fetchSettings } from 'shared/services/settings';

interface State {
  appState: string;
}

interface Props {
  device: { token: string, platform: DevicePlatformType};
  logout: () => void;
  removeAllClaimDrafts: () => void;
  removeAllCommentDrafts: () => void;
  removeAllDrafts: () => void;
}

class GroundingActions extends React.Component<Props, State> {
  client = configureClient(`${AppConfig.chain_url}${AppConfig.api.endpoint}/graphql`);

  constructor(props: Props) {
    super(props);

    this.state = {
      appState: AppState.currentState,
    };

  }

  handleAppChange = (newAppState: string) => {
    const { device, logout, removeAllClaimDrafts, removeAllCommentDrafts, removeAllDrafts } = this.props;

    const deregisterPushToken = async () => {
      try {
        if (device && device.token) {
          await Chain.unregisterDeviceToken(device.token, device.platform);
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (this.state.appState.match(/inactive|background/) && newAppState === 'active') {
      try {
        loginUser(store, true);
      } catch {
        console.log('here we are having issues');
        deregisterPushToken();
        removeAllClaimDrafts();
        removeAllCommentDrafts();
        removeAllDrafts();
        logout();
        NavigationService.navigate(Routes.Auth, { }, '');
      }

      fetchSettings(this.client, store);
    }
    this.setState({ appState: newAppState });
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppChange);
  }

  componentDidUnmount() {
    AppState.removeEventListener('change', this.handleAppChange);
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state: any) => {
  return {
    account: state.auth.account,
    settings: state.settings.settings,
    device: state.device,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  logout: () => dispatch(logout()),
  removeAllClaimDrafts: () => dispatch(removeAllClaimDrafts()),
  removeAllDrafts: () => dispatch(removeAllDrafts()),
  removeAllCommentDrafts: () => dispatch(removeAllCommentDrafts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroundingActions);

