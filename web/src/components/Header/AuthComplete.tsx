import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Routes } from '../../navigation/Routes';

interface Props extends RouteComponentProps { }

const AuthComplete = (props: Props) => {

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({
        type: 'AUTH_COMPLETE',
        payload: { },
      }, window.location.origin);
    }

    setTimeout(() => {
      const { history } = props;
      history.push(Routes.HOME);
    }, 1000);

  }, []);

  return (
    <p>Taking you back...</p>
  );

};

export default withRouter(AuthComplete);
