import React, { useEffect } from 'react';

const AuthNotWhitelisted: React.FunctionComponent = () => {

  useEffect(() => {
    window.opener.postMessage({
      type: 'AUTH_NOT_WHITELISTED',
      payload: { },
    }, window.location.origin);
  }, []);

  return (
    <p>Please join the waitlist...</p>
  );

};

export default AuthNotWhitelisted;
