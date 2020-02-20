import { handleOpenURL } from 'mobile/src/utils/notifications';
import * as React from 'react';
import { WithApolloClient } from 'react-apollo';
import { Linking } from 'react-native';

interface Props extends WithApolloClient<any> { }

class UniversalLinkingService extends React.Component<Props> {

  readonly addListeners = () => {
    Linking.addEventListener('url', handleOpenURL);
  }

  readonly removeListeners = () => {
    Linking.removeEventListener('url', handleOpenURL);
  }

  componentDidMount() {
    this.addListeners();
    Linking.getInitialURL().then(url => {
      if (url) {
        handleOpenURL({ url });
      }
    });
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  render() {
    return null;
  }

}

export default UniversalLinkingService;
