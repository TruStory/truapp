import React, { useEffect } from 'react';

const AuthDenied: React.FunctionComponent = () => {

  useEffect(() => {
    window.opener.postMessage({
      type: 'AUTH_DENIED',
      payload: { },
    }, window.location.origin);
  }, []);

  return (
    <p>Log in failed...</p>
  );

};

export default AuthDenied;
